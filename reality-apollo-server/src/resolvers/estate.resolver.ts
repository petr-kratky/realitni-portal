import { Inject } from "typescript-ioc";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
const isomorphicFetch = require("isomorphic-fetch");
import { ApolloError } from "apollo-server-express";

import { resolverManager } from "./_resolver-manager";
import { EstateService } from "../services";
import { Estate, EstateCreateInput, EstateUpdateInput } from "../models";
import { RequireAuthentication } from "../decorators/RequireAuthentication";

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

  @Mutation((returns) => Estate)
  @RequireAuthentication()
  async deleteEstate(@Arg("id") id: string): Promise<Estate> {
    const estate = await this.estateService.getEstateById(id)
    try {
      await estate.remove()
      return Estate.merge(estate, { id })
    } catch (e) {
      console.error(e)
      throw new ApolloError("ESTATE_DELETE_FAILED", "500")
    }
  }

  @Mutation((returns) => Estate)
  @RequireAuthentication()
  async createEstate(@Arg("estateInput") estateInput: EstateCreateInput): Promise<Estate> {
    return await this.estateService.createEstate(estateInput);
  }

  @Mutation((returns) => Estate)
  @RequireAuthentication()
  async updateEstate(@Arg("id") id: string, @Arg("estateInput") estateInput: EstateUpdateInput): Promise<Estate> {
    const estate = await this.estateService.getEstateById(id)
    try {
      return await Estate.merge(estate, estateInput).save()
    } catch (e) {
      console.error(e)
      throw new ApolloError("ESTATE_UPDATE_FAILED", "500")
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
}

resolverManager.registerResolver(EstateResolver);
