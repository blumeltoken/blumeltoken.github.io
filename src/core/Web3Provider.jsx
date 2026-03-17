import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, arbitrum, sepolia, arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const infuraId = import.meta.env.VITE_INFURA_ID;

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(infuraId ? `https://mainnet.infura.io/v3/${infuraId}` : 'https://cloudflare-eth.com'), 
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [sepolia.id]: http(infuraId ? `https://sepolia.infura.io/v3/${infuraId}` : 'https://rpc.sepolia.org'),
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
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
