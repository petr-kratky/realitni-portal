import { Estate } from '../models'

export abstract class EstateApi {
  abstract async getEstateById(id: number): Promise<Estate>
  abstract async deleteEstateById(id: number): Promise<boolean>
  // abstract async saveEstate(estateInput: EstateInput): Promise<RespUpdate>
  abstract async createEstate(sourceId: Number, localityLatitude: Number, localityLongitude: Number): Promise<Number>
}
