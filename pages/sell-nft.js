import styles from "../styles/Home.module.css";
import { Form, useNotification, Button } from "web3uikit";
import { ethers } from "ethers";
import nftAbi from "../constants/BasicNftAbi.json";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplaceAbi.json";
import { useEffect, useState } from "react";

export default function Home() {
  const { chainId, account, isWeb3Enabled } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0];
  const dispatch = useNotification();
  const [proceeds, setProceeds] = useState("0");

  const { runContractFunction } = useWeb3Contract();

  async function approveAndList(data) {
    console.log("Approving...");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error),
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
    });
  }

  async function handleApproveSuccess(nftAddress, tokenId, price) {
    console.log("Listing...");
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress,
        tokenId,
        price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onError: (error) => console.log(error),
      onSuccess: () => handleListSuccess(),
    });
  }

  async function handleListSuccess() {
    dispatch({
      type: "success",
      title: "NFT Listed!",
      position: "topR",
    });
  }

  async function withdrawEth() {
    console.log("Withdrawing...");

    const withdrawOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "withdrawProceeds",
      params: {},
    };

    await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error),
      onSuccess: () => handleWithdrawSuccess(),
    });
  }

  async function handleWithdrawSuccess() {
    dispatch({
      type: "success",
      title: "Withdrawed Success!",
      position: "topR",
    });
  }

  async function resetUI() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: {
          seller: account,
        },
      },
      onError: (error) => console.log(error),
    });

    if (returnedProceeds) setProceeds(returnedProceeds.toString());
  }

  useEffect(() => {
    if (isWeb3Enabled) resetUI();
  }, [isWeb3Enabled, proceeds, chainId, account]);

  return (
    <div className={styles.container}>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (ETH)",
            type: "number",
            value: "",
            key: "price",
          },
        ]}
        title="Sell your NFT!"
        id="main-form"
      ></Form>

      {proceeds != "0" ? (
        <div>
          <p>Withdraw {ethers.utils.formatUnits(proceeds, "ether")} ETH</p>
          <Button onClick={withdrawEth} text="withdraw" type="button" />
        </div>
      ) : (
        <div>No proceeds detected!</div>
      )}
    </div>
  );
}
