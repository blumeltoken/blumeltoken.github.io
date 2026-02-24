import React, { useEffect } from 'react';
import { useReadContract, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

export default function FunctionInfo({ fObj, userAddress, refreshTrigger }) {
  if (!fObj.info) return null;
  const { divisor, cooldown } = fObj.info;

  // 1. Fetch Faucet Balance (Manual only)
  const { data: bal, refetch: refetchBal } = useBalance({
    address: fObj.target,
    token: fObj.tokenAddress,
    query: { 
      enabled: !!fObj.target && fObj.target.startsWith('0x'),
      staleTime: Infinity, // Prevent auto-background refresh
      retry: 1 
    }
  });

  // 2. Fetch Last Claim (Manual only)
  const { data: lastClaimTime, refetch: refetchLast } = useReadContract({
    address: fObj.target,
    abi: [{ name: 'last', type: 'function', stateMutability: 'view', inputs: [{type: 'address'}], outputs: [{type: 'uint256'}] }],
    functionName: 'last',
    args: [userAddress],
    query: { 
      enabled: cooldown > 0 && !!userAddress && fObj.target.startsWith('0x'),
      staleTime: Infinity,
      retry: 1
    }
  });

  // Listen for the parent's refresh signal
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetchBal();
      if (cooldown > 0) refetchLast();
    }
  }, [refreshTrigger]);

  const getStatus = () => {
    if (!cooldown || cooldown === 0 || !lastClaimTime || lastClaimTime === 0n) return 'READY';
    const remaining = Number(lastClaimTime) + cooldown - Math.floor(Date.now() / 1000);
    if (remaining <= 0) return 'READY';
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    return `WAIT: ${h}h ${m}m`;
  };

  return (
    <div style={{ fontSize: '9px', color: '#0f0', marginTop: '4px', opacity: 0.8 }}>
      DRIP_EST: {bal ? formatUnits(bal.value / divisor, bal.decimals) : '...'} {bal?.symbol || ''} | STATUS: {getStatus()}
    </div>
  );
}
