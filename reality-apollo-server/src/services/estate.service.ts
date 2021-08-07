import { EstateApi } from "./estate.api";
import { Estate } from "../models";
import { getConnection } from "typeorm";

export class EstateService implements EstateApi {
  public async createEstate(surceId: any, localityLatitude: any, localityLongitude: any): Promise<Number> {
    const connection = getConnection();
    const estateNew = new Estate();
    let newSavedEstate = undefined;
    estateNew.latitude = localityLatitude
    estateNew.longitude = localityLongitude
    const estateRepository = connection.getRepository(Estate);
    try {
      newSavedEstate = await estateRepository.save(estateNew);
    } catch (err) {
      console.log(`!! NEW ESTATE!! CREATE FAIL\n\n ${err}\n\n`);
      return -1;
    }
    return newSavedEstate.id;
  }

  public async getEstateById(id: number): Promise<Estate> {
    const connection = getConnection();
    const estate = await connection.getRepository(Estate).findOne(id);
    return estate;
  }

  public async deleteEstateById(id: number): Promise<boolean> {
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
