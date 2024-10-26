import fs from 'fs';
import * as csv from 'csv-parse/sync';
import path from 'path';

function readCsvFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return csv.parse(fileContent, { columns: true, skip_empty_lines: true });
}

function organizeUniswapData() {
    const dataDir = process.cwd() + '/data/rawData/'
    const files = {
        burns: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640_burns.csv',
        mints: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640_mints.csv',
        collects: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640_collects.csv',
        swaps: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640_swaps.csv'
    };

    let allEvents = [];

    for (const [eventType, fileName] of Object.entries(files)) {
        const filePath = path.join(dataDir, fileName);
        const data = readCsvFile(filePath);
        
        data.forEach(row => {
            allEvents.push({
                ...row,
                eventType,
                blockNumber: parseInt(row.blockNumber)
            });
        });
    }

    // Sort all events by block number
    allEvents.sort((a, b) => a.blockNumber - b.blockNumber);

    return allEvents;
}

// Execute the function and log the result
const organizedData = organizeUniswapData();
console.log('Total events:', organizedData.length);
console.log('First 5 events:', organizedData.slice(0, 5));

fs.writeFileSync('data/orderedData/organized_uniswap_data.json', JSON.stringify(organizedData, null, 2));