import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { ethers } from "ethers";
import fetch from "node-fetch";
import * as CONSTANTS from "./constants.js";

export const getGraphClient = () => {
    const client = new Client({
        url: CONSTANTS.ETH_QUERY_URL,
        exchanges: [cacheExchange, fetchExchange],
        fetch: fetch,
    });
    return client;
}

export const getEthersProvider = () => {
    const provider = new ethers.JsonRpcProvider(CONSTANTS.ETH_RPC);
    return provider;
}

export const getContract = (address, abi, provider) => {
    const contract = new ethers.Contract(address, abi, provider);
    return contract;
}

export const getBlockNumberFromTimeStamp = async (timestamp) => {
    const response = await fetch(
        `https://coins.llama.fi/block/ethereum/${timestamp}`
    );
    const data = await response.json();
    return data.height;
}

export const getPoolTickAt = async (blockNumber, contract) => {
    try {
        const result = await contract.slot0({
            blockTag: blockNumber,
        });
        return result.tick;
    } catch (error) {
        console.error("Error calling function:", error);
    }
}

export const getCreationBlock = async (provider, contract_address, start_block, end_block) => {
    if (start_block === end_block) return start_block;

    const mid_block = Math.floor((start_block + end_block) / 2);
    const code = await provider.getCode(contract_address, mid_block);

    if (code.length > 2) {
        return await getCreationBlock(provider, contract_address, start_block, mid_block);
    } else {
        return await getCreationBlock(provider, contract_address, mid_block + 1, end_block);
    }
}

export const getTimestampForBlock = async (provider, blockNumber) => {
    try {
        const block = await provider.getBlock(blockNumber);
        const timestamp = block.timestamp;
        return timestamp;
    } catch (error) {
        console.error("Error fetching block information:", error);
    }
}

export const getContractCreationBlock = async (provider, contract) => {
    const currentBlock = await provider.getBlockNumber();
    const creationBlock = await getCreationBlock(provider, contract.target, 0, currentBlock);
    console.log({creationBlock})
    return creationBlock;
}

