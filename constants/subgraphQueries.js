import { gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      price
      id
      buyer
      seller
      nftAddress
      tokenId
    }
  }
`;

export default GET_ACTIVE_ITEMS;
