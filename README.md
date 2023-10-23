# nochain-protocol 
# Network & Token Abstraction CrossChain payment solution. Built solo by a 13-year old.

To replicate: 

git clone 

cd web 

yarn dev


Web3 is plagued with scaling solutions. Each one is competing the become the cheapest, fastest,  most secure, and best overall. Although this does do a good job of scaling Ethereum, it does have a negative ramification in the sense that it dilutes & disperses liquidity between chains. Instead of having one big, universal mega-chain users have to spread their balances between the hundreds of L2s. 

The problem arises when users wish to interact with one another.  They must to bridge to each other's preferred chain and on top of that swap to each other's preferred token. 

NoChain Protocol offers a new way of looking at token balances. Instead of looking at balances chain by chain and token by token, the user's total balance is the sum of their crosschain token holdings. Using the UI, they can transfer any amount up to this value. They specify the destination chain, token, amount, and receiver address. NoChain then calculates the optimal payment path to complete the transaction, prompting the user to approves access to these token balances in a gasless manner with meta transactions.

Once these steps are complete, the NoChain relayer executes the bridging & swapping logic for the user, completing the payment. 

This way, users don't have to tediously use third party bridges & exchanges to complete what should be a simple payment. 

------------------------------------------------------------------------

This project is mostly a proof-of-concept demonstrating what this would look like if it were to be built for production. 

Because of this, I deployed my own testnet tokens & DEX.

This project used nextjs and ethers for the frontend. 

Because Open Zeppelin & Biconomy do not support Mantle, Scroll, & Polygon ZkEVM, I had to create my testnet stablecoins with meta transactions built in and my own relayer logic. I found this in a very helpful github repo. 

Created my own token bridge contract with wormhole. 

Created a 1:1 stabelcoin swapper contract for swapping between tokens, mimicing a dex.

CrossChain transfers facilitated by my bridge which is sends crosschain messages through wormhole. 

The website is completely cloneable, even the gasless payment relayer. Please do not abuse it though, I need the ETH for development 

Wormhole does not support Mantle, Scroll, & Polygon ZkEVM so on those chains the logic is single-chain only. 

-------------------------------------------------------------------

Logic flow: 

Calculate CrossChain balances by fetching the sum of the stablecoins owned on all chains. 

User chooses payment data (receiver, amount, token, destination network) 

Amount must be <= total crosschain balance 

Approve token transfers with meta txs 

Execute payment (Bridging & Swapping logic + actual token transfer to receiver)

Await for all payment execution transaction confirmations. As this is crosschain, it may take more than one.

-------------------------------------------------------------- 

- Directly qualifies for the Mantle UX prize because I have definitely built a 
"intuitive and seamless User Experience" which raises the bar for blockchain UX. This is most definitely a major blockchain innovation.

- Directly qualifies for the Polygon ZkEVM  Public Meta Tx prize because meta transactions are implemented and it is a free to use public good. 

-  Uses wormhole & only wormhole for crosschain interactions. 




Natively Supported Meta Transactions ERC20s created with help from this repo:
https://github.com/ProjectOpenSea/meta-transactions
