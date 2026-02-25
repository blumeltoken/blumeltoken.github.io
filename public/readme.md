```
 <-.(`-')                     <-. (`-')   (`-')  _
  __( OO)    <-.        .->      \(OO )_  ( OO).-/  <-.
 '-'---.\  ,--. )  ,--.(,--.  ,--./  ,-.)(,------.,--. )
 | .-. (/  |  (`-')|  | |(`-')|   `.\'   | |  .---'|  (`-')
 | '-' `.) |  |OO )|  | |(OO )|  |\'.\'|  |(|  '--. |  |OO )
 | /`'.  |(|  '__ ||  | | |  \|  |   |  | |  .--'(|  '__ |
 | '--'  / |     |'\  '-'(_ .'|  |   |  | |  `---.|     |'
 `------'  `-----'  `-----'   `--'   `--' `------'`-----'

             ***    A W A K E N I N G     ***

 visit https://blumeltoken.github.io for the latest updates
 join https://discord.gg/C4UJjv58ya to become more active
```

# Disclaimer

!!! ATTENTION !!!

!!! WEB3 FUNCTIONALITY IS STILL IN DEVELOPMENT !!!

!!! DO YOUR OWN RESEARCH !!!

# Blümel Token Revival

In late 2021, the meme token BLÜMEL was launched by Tagespresse. One of its objectives was to "maximize social injustice," while another was to limit airdrop claims to one per address. This project originated from the idea of finding a gas-efficient workaround for the second objective. As a spare-time endeavor, development took a considerable amount of time before a public version was ready.

The simple observation guiding this project is that the `gruessGernot` function operates on `msg.sender`. This allows for a workaround using disposable smart contracts. Early experiments revealed that MEV bots actively monitor even such minuscule behavior to take advantage of it. It remains to be seen whether this project will further maximize social injustice, or if a community-based project can overtake a socially unjust institution to build something for the greater good. Whatever the turnout, we will likely see sooner or later.

## Preliminary Notes

The project consists of a basic web3 interface for smart contracts that have been optimized over a prolonged period. To take the best advantage of these contracts, gas optimization is recommended. Interestingly, MEV bots are of great help here; the token price on Uniswap usually reflects the minimal gas costs for claiming the airdrop quite well. This means that buying on the open market is often cheaper and also helps diminish the airdrop pool.

Minimizing gas costs usually involves looking up the gas price over the past 12-24 hours, setting a custom gas *price*, and waiting for the transaction to be processed.

It should be noted that, at the time of writing, the custom contract actions involve a community fee. The main reason for this is to counteract MEV bots, as they will immediately copy any profitable contract functions. The resulting assets are intended for further development, marketing, and community work.

## Blockchains

The original contract was deployed on Ethereum and Arbitrum. To date, not much action has taken place on Arbitrum, and the user focus has primarily been on Ethereum. As part of this project, comparable contracts were deployed to the Ethereum Sepolia and Arbitrum Sepolia testnets to allow for cost-free testing. To get testnet funds, search for "Ethereum Sepolia Faucet" or "Arbitrum Sepolia Faucet" and make a claim on one of the resulting pages.

## Preset Actions

### Claim Gas and Greet

-   **claim**: Executes `gruessGernot` a specified number of times (e.g., 1 or 80) via disposable contracts, sending the corresponding BLÜMEL amount to the user. At the time of writing, 80 appears to be the maximum viable number regarding block size limits.
-   **multiclaim**: An older version of `claim` that now exceeds the block size limit on Ethereum but may still be operational on Arbitrum and test networks.
-   **gruessGernot**: The original claim function on the original contract, usable only once per address.

### Faucet Request

As part of the project and its community functions, several faucets were created. You will only receive Blümel Tokens here. The amounts are smaller than what you can receive from the claim functions, but this option will remain available even after the original airdrop pool is depleted. `Faucet1` allows unlimited claims, `Faucet2` allows one claim every 24 hours, and `Faucet3` allows one claim every 7 days.

### Build Community

The community functions feed the faucets and resulted from two ideas: spreading a single airdrop to different holders to reactivate their interest, and providing a countermeasure for address balances with many decimal places.

-   **spreadjoy, equalizer, grussmaschine**: These functions are essentially the same, with minor differences in their programming for gas optimization. They distribute BLÜMEL to up to 99 addresses. The function rounds up the balances of investors to eliminate fractional amounts, while other recipients receive simple drops.
-   **roundup**: Allows a selected list of holders to have their balances rounded up to an even token amount. For instance, with a value of 1, the function will round up to the nearest whole token. With a value of 10, it will round up to the nearest ten, and so on.

## Technical Details & How It Works

The core of this project is a workaround for the "one claim per address" limitation of the original BLÜMEL token contract. The contract's `gruessGernot` function, which handles the airdrop, authenticates claims by checking `msg.sender`. This means that to claim multiple times, you must call the function from a new, unique address each time.

### The Disposable Contract Strategy

Instead of creating and funding numerous private key wallets, this project leverages a more gas-efficient method: disposable smart contracts. The process is as follows:

1.  **Deploy:** A new, lightweight, and temporary "forwarder" smart contract is deployed to the blockchain.
2.  **Execute:** This newly created forwarder contract immediately calls the `gruessGernot` function on the official BLÜMEL token contract. Since the forwarder has a new address, the claim is considered valid.
3.  **Self-Destruct:** After the transaction is complete, the forwarder contract automatically self-destructs, recovering a portion of the gas fee spent on its deployment.

This strategy allows for repeated claims without needing to manage multiple wallets, and the self-destruct mechanism makes it more economical than simply using new wallets for each claim.

### Application Architecture

This web interface is a React application built with Vite. It uses `wagmi` and `viem` for all blockchain interactions, providing a simple front-end to the underlying smart contracts that execute the disposable contract strategy. The different "Preset Actions" correspond to different optimized contract variations for claiming, faucet interactions, and community-building functions.
