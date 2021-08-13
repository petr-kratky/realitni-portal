import { ApolloError } from "apollo-server-express";
import { Singleton } from "typescript-ioc";

import { Account, Estate, EstateCreateInput, EstatePrimaryType, EstateSecondaryType } from "../models";

@Singleton
export class EstateService {
  public async createEstate(createdBy: string, estateInput: EstateCreateInput): Promise<Estate> {
    const { latitude, longitude } = estateInput

    const isLocationValid = EstateService.validateCoordinates(latitude, longitude)
    if (!isLocationValid) throw new ApolloError('ESTATE_INVALID_LOCATION_RANGE')

    const newEstate = Estate.create({
      ...estateInput,
      created_by: Account.create({ id: createdBy }),
      primary_type: EstatePrimaryType.create({ id: estateInput.primary_type_id }),
      secondary_type: EstateSecondaryType.create({ id: estateInput.secondary_type_id })
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

  // public async saveEstate(estateInput: EstateInput): Promise<RespUpdate> {
  //   estateInput.id = +estateInput.id
  //   const connection = getConnection();
  //   const estateNew = new Estate();
  //   Object.assign(estateNew, estateInput);
  //   let newSavedEstate = undefined;
  //   const estateRepository = connection.getRepository(Estate);
  //   try {
  //     await estateRepository.save(estateNew);
  //     return {
  //       status: true,
  //       error: ''
  //     };
  //   } catch (err) {
  //     console.log(`!! ${estateInput.id} !! SAVE FAIL\n\n ${err}`);
  //     return {
  //       status: false,
  //       error: err
  //     };
  //   }

  // }
}
