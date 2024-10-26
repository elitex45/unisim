import 'dotenv/config';
const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const API_KEY = process.env.API_KEY;
export const ETH_RPC = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
export const ETH_QUERY_URL = `https://gateway-arbitrum.network.thegraph.com/api/${API_KEY}/subgraphs/id/9fWsevEC9Yz4WdW9QyUvu2JXsxyXAxc1X4HaEkmyyc75`;

/**
 * Top Pools
 * poolName       - TVL  - 7D Volume
 * WBTC-WETH 3000 - 210M - 16M
 * USDC-WETH 500  - 153M - 623M
 * DAI-USDC 100   - 73M  - 27M
 * WBTC-WETH 500  - 72M  - 216M
 * USDC-WETH 3000 - 70M  - 79M
 * WETH-USDT 3000 - 70M  - 120M
 * USDC-USDT 100  - 21M  - 186M
 * WETH-USDT 100  - 10M  - 712M
 * USDC-WETH 100  - 5.5M - 312M
 */

export const POOLS = {
    WBTC_WETH_3000:"0xCBCdF9626bC03E24f779434178A73a0B4bad62eD",
    USDC_WETH_500: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
    DAI_USDC_100: "0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168",
    WBTC_WETH_500:"0x4585FE77225b41b697C938B018E2Ac67Ac5a20c0",
    USDC_WETH_3000:"0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8",
    WETH_USDT_3000:"0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36",
    USDC_USDT_100:"0x3416cF6C708Da44DB2624D63ea0AAef7113527C6",
    WETH_USDT_100:"0xc7bBeC68d12a0d1830360F8Ec58fA599bA1b0e9b",
    USDC_WETH_100:"0xE0554a476A092703abdB3Ef35c80e0D76d32939F",
    //WBTC_USDC_3000: "0x99ac8cA7087fA4A2A1FB6357269965A2014ABc35",
    //WBTC_USDT_3000: "0x9Db9e0e53058C89e5B94e29621a205198648425B",
};
//12376387  WBTC-WETH
export const CREATION_BLOCKS = {
    WBTC_WETH_3000:12369821,
    USDC_WETH_500: 12376729,
    DAI_USDC_100:13605124,
    WBTC_WETH_500:12376387,
    USDC_WETH_3000:12370624,
    WETH_USDT_3000: 12375326,
    USDC_USDT_100:13609065,
    WETH_USDT_100:16266586,
    USDC_WETH_100:13616454,
    // WBTC_USDC_3000: 12376048,
    // WBTC_USDT_3000: 12376091,
};