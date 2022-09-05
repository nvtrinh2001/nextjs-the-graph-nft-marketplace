import { Modal, Input, useNotification } from "web3uikit";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplaceAbi.json";
import { ethers } from "ethers";

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  onClose,
}) {
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);

  const dispatch = useNotification();
  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      title: "Listing updated",
      message: "Listing updated - please refresh (and move blocks)",
      position: "topR",
    });
    onClose && onClose();
    setPriceToUpdateListingWith("0");
  };

  const { runContractFunction: updatingListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress,
      tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onOk={() => {
        updatingListing({
          onError: (error) => console.log(error),
          onSuccess: handleUpdateListingSuccess,
        });
      }}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
    >
      <Input
        label="Update listing price in L1 Currency (ETH)"
        name="New Listing Price"
        type="number"
        onChange={(e) => {
          setPriceToUpdateListingWith(e.target.value);
        }}
      />
    </Modal>
  );
}
