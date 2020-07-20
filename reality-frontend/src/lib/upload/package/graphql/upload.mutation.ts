import gql from 'graphql-tag';

export const fileUpload = gql`
mutation fileUpload(
    $fileInput: [Upload!]!
    $id: Float!
  ) {
    fileUpload(
      id: $id
      fileInput: $fileInput
    ) {
      uploaded
    }
  }
`
