import { gql } from "@apollo/client";

export const signup = gql`
  mutation SignUp($data: UserCreateInput!) {
  signUp(data: $data) {
    id
    email
  }
}
`;