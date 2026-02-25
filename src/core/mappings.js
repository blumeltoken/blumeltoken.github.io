export const BLOCK_EXPLORERS = {
  1: "https://etherscan.io",
  42161: "https://arbiscan.io",
  11155111: "https://sepolia.etherscan.io",
  421614: "https://sepolia.arbiscan.io",
};

export const CONTRACT_MAPPINGS = {
  token: { 1: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694", 42161: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694", 11155111: "0xc29E54D83f1943D2Bb01636b79701Cf0f24E4B28", 421614: "0xb880b579c4AE5BeefEf1Cfd0A2b4d8Bc56DD423E" },
  drip: { 1: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 42161: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 11155111: "0xc29E54D83f1943D2Bb01636b79701Cf0f24E4B28", 421614: "0xb880b579c4AE5BeefEf1Cfd0A2b4d8Bc56DD423E" },
  claim: {
    name: "CLAIM_GAS_AND_GREET",
    functions: [
      { 
        name: "claim (preset=1)", 
        abi: { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0x4E71B570911Fbf1B5eE5167e88F8b776da66a239", 421614: "0x9eA44f5E77F2529D372Dbe066e9A29b9758Ea6C0" },
	defaultInputs: { 0: "1" },
      },
      { 
        name: "claim (preset=80)", 
        abi: { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0x4E71B570911Fbf1B5eE5167e88F8b776da66a239", 421614: "0x9eA44f5E77F2529D372Dbe066e9A29b9758Ea6C0" },
	defaultInputs: { 0: "80" },
      },
      { 
        name: "multiClaim (120)", 
        abi: { name: "multiClaim", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x436822c83C2F2D61807B82E7b1aA644d9cDdd328", 42161: "0x7d36Ae0Fc020E0EC7EEf18168F64c4604307e11C", 11155111: "0xCb0365587ae4cF593F4BcC9a587DD09b91ACd7C2", 421614: "0xa30eeBC2d5d0b654438a0c6b8C8EC5FcAAe68790" },
      },
      { 
        name: "gruessGernot (legacy)", 
        abi: { name: "gruessGernot", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 42161: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 11155111: "0xc29E54D83f1943D2Bb01636b79701Cf0f24E4B28", 421614: "0xb880b579c4AE5BeefEf1Cfd0A2b4d8Bc56DD423E" },
      },/*
      { 
        name: "accumulate", 
        abi: { name: "accumulate", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0x4E71B570911Fbf1B5eE5167e88F8b776da66a239", 421614: "0x9eA44f5E77F2529D372Dbe066e9A29b9758Ea6C0" },
	defaultInputs: { 0: "50" },
      },*/
    ]
  },
  faucet: {
    name: "FAUCET_REQUEST",
    functions: [
      { 
        name: "faucet1", 
        abi: { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xbB962E4a464Df1B15da8506A11517f37B983f356", 42161: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB", 11155111: "0x1bdA2Bd0aB8568224A82Cccd1125dde8CCEBbBFF", 421614: "0x7911D4e5CA83EC2b74a629980Ee126D095AFA78C" },
	info: { type: 'faucet', divisor: 256n, cooldown: 0 },
      },
      { 
        name: "faucet2", 
        abi: { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0x0C9A02B7D59ef9c2984Ee9117249ba96F7359466", 421614: "0xC6f042d2bCe07C1669611dcF65a245E60C7b3358" },
	info: { type: 'faucet', divisor: 128n, cooldown: 86400 },
      },
      { 
        name: "faucet3", 
        abi: { name: "gruessAuchBasti", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xf6948FfdbF793b614becCe1EaaB929ea52EdD4B7", 42161: "0xff46eEd503b3DD4BD784ef167D6CB4823aec962D", 11155111: "0x7649d237C3631855E767244CaF441B51f8BB6e65", 421614: "0xe3F751424754A347Af816E7868CCB21425e0009B" },
	info: { type: 'faucet', divisor: 64n, cooldown: 604800 },
      },
    ]
  },
  community: {
    name: "BUILD_COMMUNITY",
    functions: [
      {
        name: "spreadJoy",
	abi: { name: "spreadJoy", type: "function", stateMutability: "nonpayable", inputs: [{ name: "investors", type: "address[]" }, { name: "others", type: "address[]" }] },
        targets: { 1: "0xbB962E4a464Df1B15da8506A11517f37B983f356", 42161: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB", 11155111: "0x1bdA2Bd0aB8568224A82Cccd1125dde8CCEBbBFF", 421614: "0x7911D4e5CA83EC2b74a629980Ee126D095AFA78C" },
      },
      {
        name: "equalizer",
	abi: { name: "equalizer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "investors", type: "address[]" }, { name: "others", type: "address[]" }] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0x0C9A02B7D59ef9c2984Ee9117249ba96F7359466", 421614: "0xC6f042d2bCe07C1669611dcF65a245E60C7b3358" },
      },
      {
        name: "roundup",
	abi: { name: "roundup", type: "function", stateMutability: "nonpayable", inputs: [{ name: "blumelDigitOutcome", type: "uint256" }, { name: "holders", type: "address[]" }] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0x0C9A02B7D59ef9c2984Ee9117249ba96F7359466", 421614: "0xC6f042d2bCe07C1669611dcF65a245E60C7b3358" },
      },
      {
        name: "gruss_maschine",
	abi: { name: "https_blumeltoken_github_io", type: "function", stateMutability: "nonpayable", inputs: [{ name: "investors", type: "address[]" }, { name: "others", type: "address[]" }] },
        targets: { 1: "0xf6948FfdbF793b614becCe1EaaB929ea52EdD4B7", 42161: "0xff46eEd503b3DD4BD784ef167D6CB4823aec962D", 11155111: "0x7649d237C3631855E767244CaF441B51f8BB6e65", 421614: "0xe3F751424754A347Af816E7868CCB21425e0009B" },
      },
    ]
  }
};