import { gql } from "@apollo/client";

export const deleteUrl = gql`
  mutation DeleteUrl($alias: ID!) {
    deleteUrl(alias: $alias) {
      alias
      url
    }
  }
`;
