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
import { ApolloError } from "apollo-server-express";

@Resolver((of) => Estate)
export class EstateResolver {
  @Inject
  estateService: EstateService;

  @Query((returns) => Estate, { nullable: true })
  @RequireAuthentication()
  async estate(@Arg("id") id: string): Promise<Estate> {
    return await this.estateService.getEstateById(id);
  }


  @Query((returns) => [Estate])
  @RequireAuthentication()
  async estates(@Arg("skip") skip: number, @Arg("take") take: number) {
    try {
      return await this.estateService.getEstates(skip, take)
    } catch (e) {
      throw new ApolloError(e, "500")
    }
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

  @Mutation(() => Estate)
  @RequireAuthentication()
  async deleteEstate(@Arg("id") id: string): Promise<Estate> {
    const estate = await this.estateService.getEstateById(id)

    try {
      await this.estateService.deleteEstate(estate);
      return Estate.merge(estate, { id })
    } catch (e) {
      throw new ApolloError(e, "500")
    }
  }


  @Mutation(() => Estate)
  @RequireAuthentication()
  async createEstate(@Arg("estateInput") estateInput: EstateInput): Promise<Estate> {
    return await this.estateService.createEstate(estateInput);
  }
}

resolverManager.registerResolver(EstateResolver);
