import React from 'react';
import { useBalance, useReadContract, useChainId } from 'wagmi';
import { formatUnits, getAddress } from 'viem';
import BoxWrapper from './BoxWrapper';
import { CONTRACT_MAPPINGS } from '../../../core/mappings';

export default function FineTuning({ nonce, setNonce, priority, setPriority, gas, setGas, feeData, refresh, btnStyle, inputStyle }) {
  const chainId = useChainId();
  const dripAddress = CONTRACT_MAPPINGS.drip[chainId];
  const tokenAddress = CONTRACT_MAPPINGS.token[chainId];

  // 1. Drip Supply Metrics using your mappings
  const { data: dripBal } = useBalance({ 
    address: dripAddress,
    token: tokenAddress,
    query: { enabled: !!dripAddress && !!tokenAddress, retry: 1, refetchInterval: 60000, retryDelay: 30000, }
  });
  
  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: [{ name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] }],
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddress, retry: 1, refetchInterval: 60000, retryDelay: 30000, }
  });

  // 2. Input Handler: Replaces commas with dots to prevent parsing crashes
  const handleInput = (val, setter) => {
    setter(val.replace(',', '.'));
  };

  const remainingPercent = (dripBal && totalSupply) 
    ? ((Number(dripBal.value) / Number(totalSupply)) * 100).toFixed(2) 
    : '0.00';

  return (
    <BoxWrapper title="Fine Tuning">
      <div style={oneLineStyle}>
        <div style={itemStyle}>
          <span>NONCE:</span>
          <input 
            style={smallInput} 
            value={nonce} 
            onChange={e => handleInput(e.target.value, setNonce)} 
            placeholder={nonce === '' ? "Auto" : ""} 
          />
        </div>
        <div style={itemStyle}>
          <span>GAS:</span>
          <input 
            style={midInput} 
            value={gas} 
            onChange={e => handleInput(e.target.value, setGas)} 
            placeholder={gas === '' ? "Auto" : ""} 
          />
        </div>
        <div style={itemStyle}>
          <span>PRIORITY:</span>
          <input 
            style={midInput} 
            value={priority} 
            onChange={e => handleInput(e.target.value, setPriority)} 
            placeholder={feeData ? formatUnits(feeData.maxPriorityFeePerGas || 0n, 9) : '0'} 
          />
        </div>
      </div>

      <div style={infoLine}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>DRIP_SUPPLY: {dripBal ? formatUnits(dripBal.value, dripBal.decimals) : '0'} ({remainingPercent}%)</span>
        </div>
        <div style={{ marginTop: '4px' }}>
          UNIV4_1%_PRICE: 0.00041 ETH {/* Placeholder for slot0 logic */}
        </div>
      </div>
    </BoxWrapper>
  );
}

const oneLineStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '8px', gap: '5px' };
const itemStyle = { display: 'flex', alignItems: 'center', gap: '4px' };
const smallInput = { background: 'transparent', border: 'none', borderBottom: '1px solid var(--input-border-color)', color: 'var(--input-text-color)', width: '35px', fontSize: '10px', outline: 'none' };
const midInput = { ...smallInput, width: '55px' };
const infoLine = { marginTop: '8px', fontSize: '9px', color: 'var(--info-text-color)', borderTop: '1px solid var(--info-border-color)', paddingTop: '8px' };
