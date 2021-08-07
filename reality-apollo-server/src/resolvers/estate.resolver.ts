import { Inject } from "typescript-ioc";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
const isomorphicFetch = require("isomorphic-fetch");

import { resolverManager } from "./_resolver-manager";
import { EstateService } from "../services";
import { Estate, EstateInput } from "../models";
import { RequireAuthentication } from "../decorators/RequireAuthentication";

@Resolver((of) => Estate)
export class EstateResolver {
  @Inject
  estateService: EstateService;

  @Query((returns) => Estate, { nullable: true })
  @RequireAuthentication()
  async estate(@Arg("id") id: string): Promise<Estate | undefined> {
    console.log("estate resolver", this.estateService.getEstateById(id));

    return this.estateService.getEstateById(id);
  }


  // @FieldResolver()
  // async s3Images(@Root() estate: Estate): Promise<string[] | undefined> {
  //   // console.log('cesta >>> ',`${process.env.MEDIA_SERVER_HOST}/${estate.id}/images/list`)
  //   try {
  //     const res = await isomorphicFetch(
  //       `${process.env.MEDIA_SERVER_HOST}/${estate.id}/images/list`
  //     );
  //     const data = await res.json();
  //     console.log("data", data);
  //     return data;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // @FieldResolver()
  // async s3Files(@Root() estate: Estate): Promise<any> {
  //   try {
  //     const res = await isomorphicFetch(
  //       `${process.env.MEDIA_SERVER_HOST}/${estate.id}/images/listpdf`
  //     );
  //     const data = await res.json();
  //     console.log("data", data);
  //     return data;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  @Mutation(() => Boolean)
  @RequireAuthentication()
  async deleteEstate(@Arg("id") id: string): Promise<Boolean> {
    return this.estateService.deleteEstateById(id);
  }

  // @Mutation(() => RespUpdate)
  // async update(@Arg("estate") estate: EstateInput): Promise<RespUpdate> {
  //   return await this.estateService.saveEstate(estate)
  // }

  @Mutation(() => Estate)
  @RequireAuthentication()
  async createEstate(@Arg("estateInput") estateInput: EstateInput): Promise<Estate> {
    return this.estateService.createEstate(estateInput);
  }
}

resolverManager.registerResolver(EstateResolver);
