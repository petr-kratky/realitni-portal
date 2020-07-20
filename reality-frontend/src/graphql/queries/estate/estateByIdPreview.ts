import gql from 'graphql-tag'

export type EstateData = {
  estate: {
    id: number
  }
}

export type EstateVars = {
  id: number
}

const estateByIdPreview = gql`
  query estate($id: Int!) {
    estate(where: { id: $id }) {
      id
    }
  }
`

export default estateByIdPreview
