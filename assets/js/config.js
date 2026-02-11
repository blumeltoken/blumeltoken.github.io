export const CONFIG = {
    42161: {
        name: "ARBITRUM_ONE",
        BLUMELITY: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55",
        FAUCET: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB",
        CLAIM: "0x7d36Ae0Fc020E0EC7EEf18168F64c4604307e11C",
        V2_ROUTER: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
        V4_ROUTER: "0xa51afafe0263b40edaef0df8781ea9aa03e381a3",
        WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        TOKEN: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694"
    },
    1: {
        name: "ETHEREUM_MAINNET",
        BLUMELITY: "0x0000000000000000000000000000000000000000", 
        FAUCET: "0x0000000000000000000000000000000000000000",
        CLAIM: "0x436822c83C2F2D61807B82E7b1aA644d9cDdd328",
        V2_ROUTER: "0x3d7667ce10CCA2e0AB41b56121211bD42a27a667",
        V4_ROUTER: "0x0000000000000000000000000000000000000000",
        WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        TOKEN: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694"
    }
};

export const ABIS = {
    BLUMELITY: [
        "function claim(uint256 count) public",
        "function sellV2(uint256 count, uint256 minOut, address router, address WETH) public",
        "function sellV4(uint256 count, uint256 minOut, address universalRouter, address weth, uint24 fee, int24 tickSpacing) public",
        "function withdraw() public"
    ],
    FAUCET: [
        "function faucet() public", 
        "function spreadJoy(address[] investors, address[] others) public"
    ],
    CLAIM: [
        "function multiClaim() public", 
        "function claim(uint256 count) public"
    ],
    TOKEN: [
        "function balanceOf(address) view returns (uint256)"
    ]
};
