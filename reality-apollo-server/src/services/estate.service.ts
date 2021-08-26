import { ApolloError } from "apollo-server-express";
import { Singleton } from "typescript-ioc";

import { Account, Estate, EstateCreateInput, EstatePrimaryType, EstateSecondaryType } from "../models";

@Singleton
export class EstateService {
  public async createEstate(createdBy: string, estateInput: EstateCreateInput): Promise<Estate> {
    const { latitude, longitude } = estateInput

    const isLocationValid = EstateService.validateCoordinates(latitude, longitude)
    if (!isLocationValid) throw new ApolloError('ESTATE_INVALID_LOCATION_RANGE')

    const estatePrimaryType = typeof estateInput.primary_type_id !== 'undefined'
      ? EstatePrimaryType.create({ id: estateInput.primary_type_id })
      : null

    const estateSecondaryType = typeof estateInput.secondary_type_id !== 'undefined'
      ? EstateSecondaryType.create({ id: estateInput.secondary_type_id })
      : null

    const newEstate = Estate.create({
      ...estateInput,
      created_by: Account.create({ id: createdBy }),
      primary_type: estatePrimaryType,
      secondary_type: estateSecondaryType
    })

    try {
      const createdEstate = await newEstate.save()
      await createdEstate.reload()
      return createdEstate
    } catch (err) {
      console.error(err)
      throw new ApolloError('ESTATE_CREATION_FAILED', "500", { err })
    }
  }


  public async getEstateById(id: string): Promise<Estate> {
    const estate = await Estate.findOne(id);
    if (!estate) throw new ApolloError("ESTATE_NOT_FOUND", "404");
    return estate;
  }


  public async getEstates(skip: number, take: number): Promise<Estate[]> {
    const estates = await Estate.find({ skip, take: take > 100 ? 100 : take })
    return estates
  }


  private static validateCoordinates(lat: number, lng: number): boolean {
    if ((lat < -90 || lat > 90) || (lng < -180 || lng > 180)) {
      return false
    } else {
      return true
    }
  }
}
