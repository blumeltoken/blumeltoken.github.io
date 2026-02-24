import React from 'react';
import { useReadContract, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

export default function FunctionInfo({ fObj, userAddress }) {
  if (!fObj.info) return null;

  const { type, divisor, cooldown } = fObj.info;

  if (type === 'faucet') {
    const { data: bal } = useBalance({
      address: fObj.target,
      token: fObj.tokenAddress,
      query: { enabled: !!fObj.tokenAddress }
    });

    const { data: lastClaim } = useReadContract({
      address: fObj.target,
      abi: [{ name: 'lastClaim', type: 'function', stateMutability: 'view', inputs: [{type: 'address'}], outputs: [{type: 'uint256'}] }],
      functionName: 'lastClaim',
      args: [userAddress],
      query: { enabled: cooldown > 0 && !!userAddress }
    });

    const dripAmount = bal ? formatUnits(bal.value / divisor, bal.decimals) : '...';
    
    let status = 'READY';
    if (lastClaim && cooldown > 0) {
      const remaining = Number(lastClaim) + cooldown - Math.floor(Date.now() / 1000);
      if (remaining > 0) {
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        status = `WAIT: ${h}h ${m}m`;
      }
    }

    return (
      <div style={{ fontSize: '9px', color: '#0f0', marginTop: '4px', opacity: 0.8 }}>
        DRIP_EST: {dripAmount} {bal?.symbol} | STATUS: {status}
      </div>
    );
  }

  return null;
}
