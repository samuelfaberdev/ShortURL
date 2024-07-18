import { gql } from "@apollo/client";

export const createAlias = gql`
  mutation CreateAlias($data: UrlCreateInput!) {
    createRandomAliasUrl(data: $data) {
      alias
      url
    }
  }
`;
