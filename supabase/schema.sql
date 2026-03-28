-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  role text check (role in ('admin', 'subscriber', 'visitor')) default 'visitor',
  stripe_customer_id text,
  subscription_id text,
  subscription_status text,
  selected_charity_id uuid references public.charities(id),
  charity_percentage integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Admins can update any profile." on public.profiles for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Create charities table
create table public.charities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  website_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for charities
alter table public.charities enable row level security;
create policy "Charities are viewable by everyone." on public.charities for select using (true);

-- Create scores table (Rolling 5 scores logic handled in app logic, but schema supports it)
create table public.scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer check (score >= 1 and score <= 45) not null,
  date_played date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for scores
alter table public.scores enable row level security;
create policy "Users can view their own scores." on public.scores for select using (auth.uid() = user_id);
create policy "Users can insert their own scores." on public.scores for insert with check (auth.uid() = user_id);
create policy "Users can delete their own scores." on public.scores for delete using (auth.uid() = user_id);

-- Create draws table
create table public.draws (
  id uuid default uuid_generate_v4() primary key,
  draw_month date not null, -- First day of the month for the draw
  status text check (status in ('pending', 'drawn', 'published')) default 'pending',
  winning_numbers integer[] check (cardinality(winning_numbers) = 5),
  total_pool numeric(10, 2) default 0.00,
  jackpot_rollover numeric(10, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create draw entries
create table public.draw_entries (
  id uuid default uuid_generate_v4() primary key,
  draw_id uuid references public.draws(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scores integer[] check (cardinality(scores) = 5),
  match_count integer check (match_count >= 0 and match_count <= 5),
  prize_amount numeric(10, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create winner verifications
create table public.winner_verifications (
  id uuid default uuid_generate_v4() primary key,
  draw_entry_id uuid references public.draw_entries(id) on delete cascade not null,
  proof_url text,
  status text check (status in ('pending', 'approved', 'rejected', 'paid')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Triggers for automatic profile creation on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
