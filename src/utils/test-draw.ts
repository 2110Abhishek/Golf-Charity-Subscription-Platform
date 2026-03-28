import { countMatches, generateWinningNumbers } from './draw-engine';

function testDrawEngine() {
    console.log('--- Testing Draw Engine Logic ---');
    
    const winningNumbers = [5, 12, 22, 34, 42];
    console.log('Winning Numbers:', winningNumbers);
    
    const testCases = [
        { scores: [5, 12, 22, 34, 42], expected: 5 },
        { scores: [5, 12, 22, 34, 1], expected: 4 },
        { scores: [5, 12, 22, 1, 2], expected: 3 },
        { scores: [5, 12, 1, 2, 3], expected: 2 },
        { scores: [1, 2, 3, 4, 5], expected: 1 },
        { scores: [10, 11, 20, 21, 30], expected: 0 },
    ];
    
    testCases.forEach((tc, i) => {
        const result = countMatches(tc.scores, winningNumbers);
        const pass = result === tc.expected;
        console.log(`Test ${i + 1}: [${tc.scores}] -> Matches: ${result} (${pass ? 'PASS' : 'FAIL'})`);
    });
    
    console.log('Generating random numbers:', generateWinningNumbers());
}

testDrawEngine();
