const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");

let chainId = process.env.chainId || 31337;
let moralisChainId = chainId == 31337 ? "1337" : chainId.toString();
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_DAPP_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.moralisMasterKey;

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(`Working with contract address: ${contractAddress}`);

  let itemListedOptions = {
    // Moralis understands a local chain is 1337
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemListed(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    address: contractAddress,
    tableName: "ItemListed",
  };

  let itemBoughtOptions = {
    // Moralis understands a local chain is 1337
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemBought(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    address: contractAddress,
    tableName: "ItemBought",
  };

  let itemCancelledOptions = {
    // Moralis understands a local chain is 1337
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemCancelled(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCancelled",
      type: "event",
    },
    address: contractAddress,
    tableName: "ItemCancelled",
  };

  const itemListedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    {
      useMasterKey: true,
    }
  );

  const itemBoughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtOptions,
    {
      useMasterKey: true,
    }
  );

  const itemCancelledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCancelledOptions,
    {
      useMasterKey: true,
    }
  );

  if (
    itemListedResponse.success &&
    itemBoughtResponse.success &&
    itemCancelledResponse.success
  ) {
    console.log("Success! Database updated with watching events.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
