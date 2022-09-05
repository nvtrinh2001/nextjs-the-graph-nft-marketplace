# The Graph NFT Marketplace

This is a Frontend application for the `NFT Marketplace` project using [Nextjs](https://nextjs.org/) and [The Graph](https://thegraph.com).

# Key Features

Instead of reading data from Moralis server, we will read it from The Graph.

The Graph is a decentralized layer to store data. It reads data from the blockchain, indexes data and then release APIs for developers to call.

We will:

- Index data using The Graph
- Read data by calling APIs to The Graph

# About The Graph

- Build and publish APIs called subgraphs
- A Subgraph defines how to efficiently index data in a deterministic way

- UI -> Subgraph (indexing layer) -> contracts

- In traditional tech stack: databases, servers, APIs,... are returned through HTTP requests
- In Web3: it's not possible, and really hard to read and retrieve data from a blockchain. So we need a way to index data

# Setup the project

## 1. Clone [`hardhat-nft-marketplace`](https://github.com/nvtrinh2001/hardhat-nft-marketplace) respository

```
git clone git@github.com:nvtrinh2001/hardhat-nft-marketplace.git
cd hardhat-nft-marketplace
yarn
```

## 2. Deploy to Rinkeby Testnet

`yarn hardhat deploy --network rinkeby`

## 3. Clone [`setup-subgraph-nft-marketplace`](https://github.com/nvtrinh2001/setup-subgraph-nft-marketplace)

```
git clone git@github.com:nvtrinh2001/setup-subgraph-nft-marketplace.git
cd setup-subgraph-nft-marketplace
yarn
```

Do as the instruction in the setup repository

## 4. Clone this repository

```
git clone git@github.com:nvtrinh2001/nextjs-the-graph-nft-marketplace.git
cd nextjs-the-graph-nft-marketplace
yarn
```

## 5. Run the application

Make sure you have:

- an entry for `NftMarketplace` on the Rinkeby network in `networkMapping.json` file
- `NEXT_PUBLIC_SUBGRAPH_URI` in your `.env` file

Then run:

`yarn dev`
