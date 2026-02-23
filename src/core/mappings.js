export const CONTRACT_MAPPINGS = {
  claim: {
    name: "CLAIM_GAS_AND_GREET",
    functions: [
      { 
        name: "claim", 
        abi: { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
	defaultInputs: { 0: "80" },
      },
      { 
        name: "multiClaim", 
        abi: { name: "multiClaim", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x436822c83C2F2D61807B82E7b1aA644d9cDdd328", 42161: "0x7d36Ae0Fc020E0EC7EEf18168F64c4604307e11C", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
      },
      { 
        name: "gruessGernot", 
        abi: { name: "gruessGernot", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 42161: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
      },
      { 
        name: "accumulate", 
        abi: { name: "accumulate", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
	defaultInputs: { 0: "50" },
      },
    ]
  },
  faucet: {
    name: "FAUCET_REQUEST",
    functions: [
      { 
        name: "faucet1", 
        abi: { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xbB962E4a464Df1B15da8506A11517f37B983f356", 42161: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
      },
      { 
        name: "faucet2", 
        abi: { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
      }
    ]
  },
  community: {
    name: "BUILD_COMMUNITY",
    functions: [
      {
        name: "spreadJoy",
	abi: { name: "spreadJoy", type: "function", stateMutability: "nonpayable", inputs: [{ name: "investors", type: "address[]" }, { name: "others", type: "address[]" }] },
        targets: { 1: "0xbB962E4a464Df1B15da8506A11517f37B983f356", 42161: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
      },
      {
        name: "equalizer",
	abi: { name: "equalizer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "investors", type: "address[]" }, { name: "others", type: "address[]" }] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
      },
      {
        name: "roundup",
	abi: { name: "roundup", type: "function", stateMutability: "nonpayable", inputs: [{ name: "blumelDigitOutcome", type: "uint256" }, { name: "holders", type: "address[]" }] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0xEtherSepolia", 421614: "0xArbSepolia" },
      },
    ]
  }
};
