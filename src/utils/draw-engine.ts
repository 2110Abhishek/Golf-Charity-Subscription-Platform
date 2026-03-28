/**
 * Draw Engine Utility
 * Handles core logic for prize pools and matching
 */

export interface PrizePool {
    match5: number
    match4: number
    match3: number
}

export function calculatePrizePool(totalSubscribers: number, subscriberFee: number = 19): PrizePool {
    const totalPool = totalSubscribers * subscriberFee * 0.40 // 40% of subs go to prize pool
    
    return {
        match5: totalPool * 0.40, // 40% of prize pool
        match4: totalPool * 0.35, // 35% of prize pool
        match3: totalPool * 0.25  // 25% of prize pool
    }
}

export function countMatches(userScores: number[], winningNumbers: number[]): number {
    const winningSet = new Set(winningNumbers)
    let matches = 0
    
    userScores.forEach(score => {
        if (winningSet.has(score)) {
            matches++
        }
    })
    
    return matches
}

export function generateWinningNumbers(mode: 'random' | 'weighted' = 'random', hotNumbers: number[] = []): number[] {
    const numbers: number[] = []
    
    // For weighted mode, we mix in some "hot" numbers (most frequent player scores)
    if (mode === 'weighted' && hotNumbers.length > 0) {
        // Pick 2 numbers from the "hot" list
        const luckyHot = [...hotNumbers].sort(() => 0.5 - Math.random()).slice(0, 2)
        luckyHot.forEach(n => numbers.push(n))
    }

    while (numbers.length < 5) {
        const n = Math.floor(Math.random() * 45) + 1
        if (!numbers.includes(n)) {
            numbers.push(n)
        }
    }
    return numbers.sort((a, b) => a - b)
}

export function getHotNumbers(allScores: number[]): number[] {
    const counts: Record<number, number> = {}
    allScores.forEach(s => {
        counts[s] = (counts[s] || 0) + 1
    })
    
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(entry => parseInt(entry[0]))
}
