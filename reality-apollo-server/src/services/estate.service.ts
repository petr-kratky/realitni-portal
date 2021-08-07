import { ApolloError } from "apollo-server-express";
import { getConnection } from "typeorm";
import { Singleton } from "typescript-ioc";

import { Estate, EstateInput } from "../models";

@Singleton
export class EstateService {
  public async createEstate(estateInput: EstateInput): Promise<Estate> {
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
    const estate = await Estate.getRepository().findOne(id);
    return estate;
  }

  public async deleteEstateById(id: string): Promise<boolean> {
    try {
      const connection = getConnection();
      const estateRepository = connection.getRepository(Estate);
      const estate = await estateRepository.findOne(id);
      await fetch(`${process.env.MEDIA_SERVER_HOST}/${id}/images/delete`)
      await estateRepository.remove(estate);
      return true
    } catch (err) {
      console.log(`!! NEW ESTATE!! CREATE FAIL\n\n ${err}\n\n`);
      return false;
    }
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
