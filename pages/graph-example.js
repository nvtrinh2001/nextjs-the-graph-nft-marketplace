import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEM = gql`
  {
    activeItems(first: 5) {
      id
      buyer
      seller
      nftAddress
    }
  }
`;

export default function GraphExample() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEM);
  console.log(data);
  return <div>This page shows an example of The Graph</div>;
}
