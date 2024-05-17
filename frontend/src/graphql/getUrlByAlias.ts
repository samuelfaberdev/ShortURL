import { gql } from "@apollo/client";

export const getUrlByAlias = gql`
  query GetUrlByAlias($alias: ID!) {
    getUrlByAlias(alias: $alias) {
      alias
      url
    }
  }
`;
