const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\b8ea5ccc-0d18-4d94-8847-f3e02d2fd435\\.system_generated\\logs\\transcript.jsonl');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let count = 0;
rl.on('line', (line) => {
  if (count < 20) {
    const obj = JSON.parse(line);
    console.log(`Step: ${obj.step_index} | Source: ${obj.source} | Type: ${obj.type}`);
    if (obj.source === 'MODEL' && obj.content) {
        console.log(`  Content preview: ${obj.content.substring(0, 100)}...`);
    }
    count++;
  } else {
    rl.close();
  }
});
