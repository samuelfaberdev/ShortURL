import { gql } from "@apollo/client";

export const mySelf = gql`
  query MySelf {
    mySelf {
      id
      roles
      urls {
        alias
        url
        createdAt
        clics
      }
    }
  }
`;
