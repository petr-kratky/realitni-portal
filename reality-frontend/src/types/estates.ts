export type DecodedEstate = {
  id: number
  advertFunction: string
  advertType: string
  advertSubtype: string
  advertPrice: number
  advertPriceUnit: string
  advertPriceCurrency: string
  sellPrice: number
  fullAddress: string
  s3Images: string[]
  s3Files: any
}
