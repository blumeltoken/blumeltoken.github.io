import { KOMPLIZEN } from './komplizen';

export const BLOCK_EXPLORERS = {
  1: "https://etherscan.io",
  42161: "https://arbiscan.io",
  11155111: "https://sepolia.etherscan.io",
  421614: "https://sepolia.arbiscan.io",
};

// Helper function to pick random unique items from an array
const pickRandom = (arr, count) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const CONTRACT_MAPPINGS = {
  token: { 1: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694", 42161: "0xE921401D18Ed1EA4d64169D1576c32F9a7439694", 11155111: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B", 421614: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B" },
  drip: { 1: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 42161: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 11155111: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B", 421614: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B" },
  pamphlet: { 1: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 42161: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 11155111: "0xbcc1d323229c026d7689d0013a7080e3c68eb750", 421614: "0xbcc1d323229c026d7689d0013a7080e3c68eb750" },
  claim: {
    name: "CLAIM_GAS_AND_GREET",
    functions: [
      { 
        name: "blumenErnten (preset=1)", 
        abi: { name: "blumenErnten", type: "function", stateMutability: "nonpayable", inputs: [{ name: "anzahl", type: "uint256" }] },
        targets: { 1: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 42161: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 11155111: "0xbcc1d323229c026d7689d0013a7080e3c68eb750", 421614: "0xbcc1d323229c026d7689d0013a7080e3c68eb750" },
        defaultInputs: { 0: "1" },
        info: { type: 'expected_output', calc: (i, z) => BigInt(i[0] || 0) * 100n, noFormat: true },
      },
      { 
        name: "blumenErnten (preset=80)", 
        abi: { name: "blumenErnten", type: "function", stateMutability: "nonpayable", inputs: [{ name: "anzahl", type: "uint256" }] },
        targets: { 1: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 42161: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 11155111: "0xbcc1d323229c026d7689d0013a7080e3c68eb750", 421614: "0xbcc1d323229c026d7689d0013a7080e3c68eb750" },
        defaultInputs: { 0: "80" },
        info: { type: 'expected_output', calc: (i, z) => BigInt(i[0] || 0) * 100n, noFormat: true },
      },
      { 
        name: "claim (preset=1)", 
        abi: { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3", 421614: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3" },
        defaultInputs: { 0: "1" },
        info: { type: 'expected_output', calc: (i) => BigInt(i[0] || 0) * 100n, noFormat: true }
      },
      { 
        name: "claim (preset=80)", 
        abi: { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [{ name: "count", type: "uint256" }] },
        targets: { 1: "0xD7AD5D93F39d820325E39df50B6f6C3A9871691f", 42161: "0x8Fa8082B32c2Fa1bebdfE5e7B2Ad4cAB7B29AB55", 11155111: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3", 421614: "0x4C7768792DBD015adf117e5E47c10C723edc8dB3" },
        defaultInputs: { 0: "80" },
        info: { type: 'expected_output', calc: (i) => BigInt(i[0] || 0) * 100n, noFormat: true }
      },
      {
        name: "halloBluemel (preset=50)",
        abi: { name: "halloBluemel", type: "function", stateMutability: "nonpayable", inputs: [{ name: "komplizen", type: "address[]" }, { name: "anzahl", type: "uint256" }] },
        targets: { 1: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 42161: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 11155111: "0xbcc1d323229c026d7689d0013a7080e3c68eb750", 421614: "0xbcc1d323229c026d7689d0013a7080e3c68eb750" },
        defaultInputs: { 1: "50" },
        info: {
          type: 'expected_output',
          noFormat: true,
          calc: (i, z) => {
            if (!i || !i[0] || !i[1] || !z) return 0n;
            const anzahl = BigInt(i[1]);
            const x = BigInt(z[6]);
            if (!x || x === 0n) return 100n * anzahl;
            const bonus = anzahl / x;
            const f = bonus;
            const w = f / 2n;
            const v = w / 2n;
            const lg = z[5];
            if (i[0].length >= (Number(lg) + 5) * 4) return 100n * (anzahl + f + w + v);
            if (i[0].length >= (Number(lg) + 5) * 2) return 100n * (anzahl + w + v);
            if (i[0].length >= (Number(lg) + 5)) return 100n * (anzahl + v);
            return 100n * anzahl;
          },
          presets: {
            volk: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? Number(z[5]) + 5 : 5) }),
            waehler: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? 2 * (Number(z[5]) + 5) : 10) }),
            familie: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? 4 * (Number(z[5]) + 5) : 20) }),
          }
        }
      },
      { 
        name: "multiClaim (120)", 
        abi: { name: "multiClaim", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x436822c83C2F2D61807B82E7b1aA644d9cDdd328", 42161: "0x7d36Ae0Fc020E0EC7EEf18168F64c4604307e11C", 11155111: "0x73346ad6F4993E85dc4bDD03F6EF4ccbA6a7A894", 421614: "0x73346ad6F4993E85dc4bDD03F6EF4ccbA6a7A894" },
        info: { type: 'expected_output', calc: () => 12000n, noFormat: true }
      },
      { 
        name: "gruessGernot (legacy)", 
        abi: { name: "gruessGernot", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 42161: "0xEE0880D40034e0E9781DC8FadD075484532F7f12", 11155111: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B", 421614: "0xe16f903e365479D1dD2B729D2de046Fe39863A4B" },
        info: { type: 'legacy', calc: () => 100n, noFormat: true }
      },
    ]
  },
  faucet: {
    name: "FAUCET_REQUEST",
    functions: [
      { 
        name: "bluemchenPfluecken", 
        abi: { name: "bluemchenPfluecken", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 42161: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 11155111: "0xbcc1d323229c026d7689d0013a7080e3c68eb750", 421614: "0xbcc1d323229c026d7689d0013a7080e3c68eb750" },
        info: { type: 'faucet', cooldown: 90000, read: 'zeitstempel', divisor: 65536n },
      },
      { 
        name: "faucet1", 
        abi: { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xbB962E4a464Df1B15da8506A11517f37B983f356", 42161: "0x96c5ef6F82Dc0281E09f2A5fE023f2F29CC9e8cB", 11155111: "0xC8fF8767Ee69EB1acFb956024a2E5af17f7Ba627", 421614: "0xC8fF8767Ee69EB1acFb956024a2E5af17f7Ba627" },
        info: { type: 'faucet', divisor: 256n, cooldown: 0, read: 'last' },
      },
      { 
        name: "faucet2", 
        abi: { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0x62dE2De605fdBF7227C0bE2DB12D6cA4a3F4E30F", 42161: "0xA3356fa4250F5fff80784C4877fb50fa3d5f5E65", 11155111: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44", 421614: "0x91Eeb158Fd295b752A6a0403826A5EA22F0d2D44" },
        info: { type: 'faucet', divisor: 128n, cooldown: 86400, read: 'last' },
      },
      { 
        name: "faucet3", 
        abi: { name: "gruessAuchBasti", type: "function", stateMutability: "nonpayable", inputs: [] },
        targets: { 1: "0xf6948FfdbF793b614becCe1EaaB929ea52EdD4B7", 42161: "0xff46eEd503b3DD4BD784ef167D6CB4823aec962D", 11155111: "0xF1BefaaEbE343c2751AD6b911C570e9404F5Bd15", 421614: "0xF1BefaaEbE343c2751AD6b911C570e9404F5Bd15" },
        info: { type: 'faucet', divisor: 64n, cooldown: 604800, read: 'last' },
      },
    ]
  },
  community: {
    name: "BUILD_COMMUNITY",
    functions: [
      {
        name: "halloBluemel",
        abi: { name: "halloBluemel", type: "function", stateMutability: "nonpayable", inputs: [{ name: "komplizen", type: "address[]" }, { name: "anzahl", type: "uint256" }] },
        targets: { 1: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 42161: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 11155111: "0xbcc1d323229c026d7689d0013a7080e3c68eb750", 421614: "0xbcc1d323229c026d7689d0013a7080e3c68eb750" },
        info: {
          type: 'expected_output',
          noFormat: true,
          calc: (i, z) => {
            if (!i || !i[0] || !i[1] || !z) return 0n;
            const anzahl = BigInt(i[1]);
            const x = BigInt(z[6]);
            if (!x || x === 0n) return 100n * anzahl;
            const bonus = anzahl / x;
            const f = bonus;
            const w = f / 2n;
            const v = w / 2n;
            const lg = z[5];
            if (i[0].length >= (Number(lg) + 5) * 4) return 100n * (anzahl + f + w + v);
            if (i[0].length >= (Number(lg) + 5) * 2) return 100n * (anzahl + w + v);
            if (i[0].length >= (Number(lg) + 5)) return 100n * (anzahl + v);
            return 100n * anzahl;
          },
          presets: {
            volk: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? Number(z[5]) + 5 : 5) }),
            waehler: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? 2 * (Number(z[5]) + 5) : 10) }),
            familie: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? 4 * (Number(z[5]) + 5) : 20) }),
          }
        }
      },
      {
        name: "halloWelt",
        abi: { name: "halloWelt", type: "function", stateMutability: "nonpayable", inputs: [{ name: "komplizen", type: "address[]" }] },
        targets: { 1: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 42161: "0xf7326d07c698a50d5351f024bc1499eb335ce167", 11155111: "0xbcc1d323229c026d7689d0013a7080e3c68eb750", 421614: "0xbcc1d323229c026d7689d0013a7080e3c68eb750" },
        info: {
          presets: {
            volk: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? Number(z[4]) + 5 : 5) }),
            waehler: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? 2 * (Number(z[4]) + 5) : 10) }),
            familie: (z) => ({ 0: pickRandom(KOMPLIZEN, z ? 4 * (Number(z[4]) + 5) : 20) }),
          }
        }
      },
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