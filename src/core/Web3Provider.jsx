import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, arbitrum, sepolia, arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_ID}`), 
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_ID}`),
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
