1. Instead of reading data from Moralis server, we will read the TheGraph

TheGraph is a decentralized layer to store data. It reads data from the blockchain, indexes data and then release APIs for developers to call

2. We will

- Index using TheGraph
- Read data by calling APIs to TheGraph

# The Graph

- Build and publish APIs called subgraphs
- A Subgraph defines how to efficiently index data in a deterministic way
- UI -> Subgraph (indexing layer) -> contracts
- In traditional tech stack: databases, servers, APIs,... are returned through HTTP requests
- In Web3: it's not possible, and data in blockchain is really hard to retrieve and update => need a way to index data

## Create a subgraph

- Create new folder named `graph-nft-marketplace`
- Run

`graph codegen` to put stuff we denfine in `.graphql` file in generate folder
