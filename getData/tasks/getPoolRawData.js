import { parse } from "json2csv";
import fs from "fs";
import * as FUNCTIONS from "../utils/functions.js";
import { CREATION_BLOCKS, POOLS } from "../utils/constants.js";
import { POOL_ABI } from "../abis/pool.js";

async function getAllMintsBurnsCollects(provider, contract) {
    //const creationBlock = (await FUNCTIONS.getContractCreationBlock(provider, contract)) + 50;
    //const creationBlock = 20947458;
    const maxBlockRange = 5000; // Set block range limit to 5K to avoid exceeding log size
    const currentBlock = await provider.getBlockNumber();
    //const oneYearOldBlock = currentBlock - 2628000;
    const creationBlock = CREATION_BLOCKS.USDC_WETH_500;

    let loopBlock = creationBlock;
    const totalBlocks = currentBlock - creationBlock;
    console.log(`Processing contract ${contract.target} from block ${creationBlock} to ${currentBlock} (${totalBlocks} blocks)`);
    
    const mints = [];
    const burns = [];
    const collects = [];
    const swaps = [];

    while (loopBlock < currentBlock) {
        const endBlock = Math.min(loopBlock + maxBlockRange, currentBlock);
        const remainingBlocks = currentBlock - endBlock;
        console.log("current progress:",((totalBlocks-remainingBlocks)/totalBlocks)*100)

        try {
            const filter = {
                address: contract.target,
                fromBlock: loopBlock,
                toBlock: endBlock
            };

            const logs = await provider.getLogs(filter);
            logs.forEach(log => {
                const blockNumber = log.blockNumber;
                const logData = contract.interface.parseLog(log);

                if (logData.name === "Mint") {
                    //console.log({logData:logData.args})
                    mints.push({
                        blockNumber:blockNumber,
                        sender: logData.args.sender,
                        owner: logData.args.owner,
                        tickLower: logData.args.tickLower,
                        tickUpper: logData.args.tickUpper,
                        amount: logData.args.amount,// liquidity 
                        amount0: logData.args.amount0,
                        amount1: logData.args.amount1
                    });
                }

                if (logData.name === "Burn") {
                    burns.push({
                        blockNumber:blockNumber,
                        owner: logData.args.owner,
                        tickLower: logData.args.tickLower,
                        tickUpper: logData.args.tickUpper,
                        amount: logData.args.amount,// liquidity 
                        amount0: logData.args.amount0,
                        amount1: logData.args.amount1
                    });
                }

                if (logData.name === "Collect") {
                    collects.push({
                        blockNumber:blockNumber,
                        owner: logData.args.owner,
                        recipient: logData.args.recipient,
                        tickLower: logData.args.tickLower,
                        tickUpper: logData.args.tickUpper,
                        amount0: logData.args.amount0,
                        amount1: logData.args.amount1
                    });
                }

                if (logData.name === "Swap") {
                    swaps.push({
                        blockNumber:blockNumber,
                        sender: logData.args.sender,
                        recipient: logData.args.recipient,
                        amount0: logData.args.amount0,
                        amount1: logData.args.amount1,
                        sqrtPriceX96: logData.args.sqrtPriceX96,
                        liquidity: logData.args.liquidity,
                        tick: logData.args.tick
                    });
                }
            });

            // Progress tracking
            console.log(`Processed blocks from ${loopBlock} to ${endBlock}. Remaining: ${remainingBlocks}`);
        } catch (error) {
            console.error(`Error fetching logs for block range ${loopBlock} to ${endBlock}`, error);
        }

        loopBlock = endBlock + 1; // Move to the next block range
    }

    // Log final counts
    console.log(`Total mints: ${mints.length}, burns: ${burns.length}, collects: ${collects.length}, swaps: ${swaps.length}`);

    // // Write data to CSV files
    // const mintData = parse(mints);
    // const burnData = parse(burns);
    // const collectData = parse(collects);
    // const swapData = parse(swaps);

    const mintFileName = process.cwd() + `/data/rawData/${contract.target}_mints.csv`;
    const burnFileName = process.cwd() + `/data/rawData/${contract.target}_burns.csv`;
    const collectFileName = process.cwd() + `/data/rawData/${contract.target}_collects.csv`;
    const swapFileName = process.cwd() + `/data/rawData/${contract.target}_swaps.csv`;



    writeDataInChunks(mints, mintFileName);
    writeDataInChunks(burns, burnFileName);
    writeDataInChunks(collects, collectFileName);
    writeDataInChunks(swaps, swapFileName);    

    console.log(`CSV files written successfully for contract ${contract.target}`);
}

function writeDataInChunks(data, fileName, chunkSize = 10000) {
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const csvData = parse(chunk);
        const writeMode = i === 0 ? 'w' : 'a'; // Write new file on first chunk, append on subsequent chunks
        fs.writeFileSync(fileName, csvData, { flag: writeMode });
    }
}


export async function main() {
    const provider = FUNCTIONS.getEthersProvider();

    const contracts = [
        // FUNCTIONS.getContract(POOLS.WBTC_USDC_3000, POOL_ABI, provider),
        // FUNCTIONS.getContract(POOLS.WBTC_USDT_3000, POOL_ABI, provider),
        FUNCTIONS.getContract(POOLS.USDC_WETH_500, POOL_ABI, provider),
        //FUNCTIONS.getContract(POOLS.WETH_USDT_3000, POOL_ABI, provider),
        //FUNCTIONS.getContract(POOLS.USDC_USDT_100, POOL_ABI, provider),
    ];

    const initializedContracts = await Promise.all(contracts);

    const promises = initializedContracts.map(contract => getAllMintsBurnsCollects(provider, contract));

    await Promise.all(promises);
}

main();
