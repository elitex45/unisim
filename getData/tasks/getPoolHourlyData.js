import { parse } from "json2csv";
import fs from "fs";
import * as FUNCTIONS from "../utils/functions.js";
import { POOLS } from "../utils/constants.js";
import { POOL_ABI } from "../abis/pool.js";

async function getHourlyTickDataToCSV(provider, contract) {
    const creationBlock = (await FUNCTIONS.getContractCreationBlock(provider, contract)) + 50;
    const noOfBlocksEveryHour = 300;
    const currentBlock = await provider.getBlockNumber();
    // const currentBlock = (creationBlock * 2) * 100 / 199.95;

    var data = [
        {
            "pool": contract.target,
            "fee": (await contract.fee()).toString(),
        },
        {}
    ];
    var callsToMake = Math.round((currentBlock - creationBlock) / noOfBlocksEveryHour);
    console.log({ callsToMake });
    var startTime = new Date().getSeconds();
    var loopBlock = creationBlock;
    while (loopBlock < currentBlock) {
        var tick = await FUNCTIONS.getPoolTickAt(loopBlock, contract);
        var timeStamp = await FUNCTIONS.getTimestampForBlock(provider, loopBlock);
        data.push({
            pool: null,
            fee: null,
            tick,
            timeStamp,
            blockNumber: loopBlock
        });
        loopBlock += noOfBlocksEveryHour;
        console.log(callsToMake--, "more calls!");
    }
    var endTime = new Date().getSeconds();
    console.log("time taken", endTime - startTime, "seconds");
    var csvData = parse(data);
    var fileName = `${contract.target}_poolHourlyTick.csv`;
    var path = process.cwd() + "/data/" + fileName;

    fs.writeFileSync(path, csvData);

    console.log("CSV file written successfully");
}

async function main() {
    var provider = FUNCTIONS.getEthersProvider();

    const contracts = [
        FUNCTIONS.getContract(POOLS.WETH_USDC_500, POOL_ABI, provider),
        //FUNCTIONS.getContract(POOLS.WBTC_USDC_3000, POOL_ABI, provider),
        //FUNCTIONS.getContract(POOLS.WBTC_USDT_3000, POOL_ABI, provider),
        //FUNCTIONS.getContract(POOLS.WETH_USDT_3000, POOL_ABI, provider)
    ];

    const initializedContracts = await Promise.all(contracts);

    const promises = initializedContracts.map(contract => getHourlyTickDataToCSV(provider, contract));

    await Promise.all(promises);
}

main();

