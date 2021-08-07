import { ApolloError } from "apollo-server-express";
import { getConnection } from "typeorm";
import { Singleton } from "typescript-ioc";

import { Estate, EstateCreateInput, EstateUpdateInput } from "../models";

@Singleton
export class EstateService {
  public async createEstate(estateInput: EstateCreateInput): Promise<Estate> {
    const { latitude, longitude } = estateInput

    const isLocationValid = EstateService.validateCoordinates(latitude, longitude)
    if (!isLocationValid) throw new ApolloError('ESTATE_INVALID_LOCATION_RANGE')

    try {
      const newEstate = await Estate.merge(new Estate(), estateInput).save()
      return newEstate
    } catch (e) {
      console.error(e)
      throw new ApolloError('ESTATE_CREATION_FAILED')
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
