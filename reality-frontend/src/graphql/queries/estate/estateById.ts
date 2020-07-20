import gql from 'graphql-tag'

export type EstateData = {
  estate: {
    id: number
    advertFunction: number
    advertType: number
    advertSubtype: number
    advertPrice: number
    advertPriceUnit: number
    advertPriceCurrency: number
    fullAddress: string
    s3Images: string[]
    s3Files: any
  }
}

export type EstateVars = {
  id: number
}

const estateById = gql`
query estate($id: Float!) {
  estate(id: $id ) {
    id
    advertFunction
    advertType
    advertSubtype
    advertPrice
    advertPriceUnit
    advertPriceCurrency
    sellPrice
    fullAddress
    s3Images
    s3Files{
      url
      key
    }
  }
}
`

export default estateById
