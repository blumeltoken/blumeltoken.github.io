export const BLOCK_EXPLORERS = {
  1: "https://etherscan.io",
  42161: "https://arbiscan.io",
  11155111: "https://sepolia.etherscan.io",
  421614: "https://sepolia.arbiscan.io",
};

export const CONTRACT_MAPPINGS = {
  token: { 1: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694", 42161: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694", 11155111: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B", 421614: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B" },
  drip: { 1: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 42161: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 11155111: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B", 421614: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B" },
  claim: {
    name: "CLAIM_GAS_AND_GREET",
    functions: [
      { 
        name: "claim (preset=1)", 
        abi: { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3", 421614: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3" },
	defaultInputs: { 0: "1" },
      },
      { 
        name: "claim (preset=80)", 
        abi: { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3", 421614: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3" },
	defaultInputs: { 0: "80" },
      },
      { 
        name: "multiClaim (120)", 
        abi: { name: "multiClaim", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x436822c83C2F2D61807B82E7b1aA644d9cDdd328", 42161: "0x7d36Ae0Fc020E0EC7EEf18168F64c4604307e11C", 11155111: "0x73346ad6F4993E85dc4bDD03F6EF4ccbA6a7A894", 421614: "0x73346ad6F4993E85dc4bDD03F6EF4ccbA6a7A894" },
      },
      { 
        name: "gruessGernot (legacy)", 
        abi: { name: "gruessGernot", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 42161: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 11155111: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B", 421614: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B" },
        info: { type: 'legacy' },
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
        targets: { 1: "0xbB962E4a464Df1B15da8506A11517f37B983f356", 42161: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB", 11155111: "0xC8fF8767Ee69EB1acFb956024a2E5af17f7Ba627", 421614: "0xC8fF8767Ee69EB1acFb956024a2E5af17f7Ba627" },
	info: { type: 'faucet', divisor: 256n, cooldown: 0 },
      },
      { 
        name: "faucet2", 
        abi: { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44", 421614: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44" },
	info: { type: 'faucet', divisor: 128n, cooldown: 86400 },
      },
      { 
        name: "faucet3", 
        abi: { name: "gruessAuchBasti", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xf6948FfdbF793b614becCe1EaaB929ea52EdD4B7", 42161: "0xff46eEd503b3DD4BD784ef167D6CB4823aec962D", 11155111: "0xF1BefaaEbE343c2751AD6b911C570e9404F5Bd15", 421614: "0xF1BefaaEbE343c2751AD6b911C570e9404F5Bd15" },
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
        targets: { 1: "0xbB962E4a464Df1B15da8506A11517f37B983f356", 42161: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB", 11155111: "0xC8fF8767Ee69EB1acFb956024a2E5af17f7Ba627", 421614: "0xC8fF8767Ee69EB1acFb956024a2E5af17f7Ba627" },
      },
      {
        name: "equalizer",
	abi: { name: "equalizer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "investors", type: "address[]" }, { name: "others", type: "address[]" }] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44", 421614: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44" },
      },
      {
        name: "roundup",
	abi: { name: "roundup", type: "function", stateMutability: "nonpayable", inputs: [{ name: "blumelDigitOutcome", type: "uint256" }, { name: "holders", type: "address[]" }] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44", 421614: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44" },
      },
      {
        name: "gruss_maschine",
	abi: { name: "https_blumeltoken_github_io", type: "function", stateMutability: "nonpayable", inputs: [{ name: "investors", type: "address[]" }, { name: "others", type: "address[]" }] },
        targets: { 1: "0xf6948FfdbF793b614becCe1EaaB929ea52EdD4B7", 42161: "0xff46eEd503b3DD4BD784ef167D6CB4823aec962D", 11155111: "0xF1BefaaEbE343c2751AD6b911C570e9404F5Bd15", 421614: "0xF1BefaaEbE343c2751AD6b911C570e9404F5Bd15" },
      },
    ]
  }
};