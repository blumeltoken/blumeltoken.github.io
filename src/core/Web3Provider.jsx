import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, arbitrum, sepolia, arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const loggingTransport = () => {
  const base = http();
  return (config) => {
    const transport = base(config);
    return {
      ...transport,
      request: async (args) => {
        if (window.term) {
          window.term.writeln(`\x1b[34m[RPC_REQ]\x1b[0m ${args.method}`);
        }
        return await transport.request(args);
      }
    };
  };
};

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http('https://cloudflare-eth.com'), 
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
//    [mainnet.id]: loggingTransport(),
//    [arbitrum.id]: loggingTransport(),
    [sepolia.id]: loggingTransport(),
    [arbitrumSepolia.id]: loggingTransport(),
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
