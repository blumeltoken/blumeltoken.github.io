import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, arbitrum, sepolia, arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const loggingTransport = (transport) => {
  return (config) => {
    const baseTransport = transport(config);
    return {
      ...baseTransport,
      request: async (args) => {
        if (window.term) {
          window.term.writeln(`\x1b[34m[RPC_REQ]\x1b[0m ${args.method}`);
        }
        return await baseTransport.request(args);
      }
    };
  };
};


export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: loggingTransport(http('https://mainnet.infura.io/v3/VITE_INFURA_ID')), 
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [sepolia.id]: loggingTransport(http()),
    [arbitrumSepolia.id]: loggingTransport(http()),
  },
});

export function Web3Wrapper({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
