import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplaceAbi.json";
import nftAbi from "../constants/BasicNftAbi.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const separatorLength = separator.length;
  const charsToShow = strLen - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
}) {
  const { isWeb3Enabled, account } = useMoralis();

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);
  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress,
      tokenId,
    },
  });

  async function updateUI() {
    // get the tokenURI
    // use the image tag from the tokenURI, get the image
    const tokenURI = await getTokenURI();
    console.log(`Token URI: ${tokenURI}`);

    if (tokenURI) {
      // Not everyone has IPFS installed => use IPFS Gateway
      // IPFS Gateway: A server that will return IPFS files from a normal URL
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageUriUrl = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageUriUrl);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      // other ways:
      // Render the image on our server, and just call our server
      // For testnets and mainnets, use moralis server hooks
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) updateUI();
  }, [isWeb3Enabled]);

  const isOwnedByUser = seller === account || seller === undefined;
  const formatedSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);

  const handleCardClick = () => {
    // isOwnedByUser ? show modal : show buy item
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuyItemSuccess(),
        });
  };

  const handleBuyItemSuccess = () => {
    dispatch({
      type: "success",
      title: "Item Bought",
      position: "topR",
    });
  };

  return (
    <>
      <>
        {imageURI ? (
          <div>
            <UpdateListingModal
              nftAddress={nftAddress}
              marketplaceAddress={marketplaceAddress}
              tokenId={tokenId}
              isVisible={showModal}
              onClose={hideModal}
            />
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div className="tokenId">#{tokenId}</div>
                  <div className="italic text-sm">
                    Owned by {formatedSellerAddress}
                  </div>
                  <Image
                    loader={() => imageURI}
                    src={imageURI}
                    height="200"
                    width="200"
                  />
                  <div className="font-bold">
                    {ethers.utils.formatUnits(price, "ether")} ETH
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </>
    </>
  );
}
