import { Inject } from "typescript-ioc";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { ProjectModel, Estate, Source, EstateInput, RespUpdate } from "../models";
import { resolverManager } from "./_resolver-manager";
import { EstateApi } from "../services";
import { getConnection, Connection } from "typeorm";
const isomorphicFetch = require("isomorphic-fetch");

@Resolver((of) => Estate)
export class EstateResolver {
  @Inject
  estateService: EstateApi;

  @Query((returns) => Estate, { nullable: true })
  async estate(@Arg("id") id: number): Promise<Estate | undefined> {
    console.log("estate resolver", this.estateService.getEstateById(id));

    return this.estateService.getEstateById(id);
  }

  @FieldResolver()
  async source(@Root() estate: Estate): Promise<Source | undefined> {
    const conn: Connection = getConnection();
    return conn.getRepository(Source).findOne(estate.source);
  }

  @FieldResolver()
  async s3Images(@Root() estate: Estate): Promise<string[] | undefined> {
    // console.log('cesta >>> ',`${process.env.MEDIA_SERVER_HOST}/${estate.id}/images/list`)
    try {
      const res = await isomorphicFetch(
        `${process.env.MEDIA_SERVER_HOST}/${estate.id}/images/list`
      );
      const data = await res.json();
      console.log("data", data);
      return data;
    } catch (err) {
      console.error(err);
    }
  }
  
  @FieldResolver()
  async s3Files(@Root() estate: Estate): Promise<any> {
    try {
      const res = await isomorphicFetch(
        `${process.env.MEDIA_SERVER_HOST}/${estate.id}/images/listpdf`
      );
      const data = await res.json();
      console.log("data", data);
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  @FieldResolver()
  async fullAddress(@Root() estate: Estate): Promise<string | undefined> {
    return `${estate.localityStreet ?? ""}${
      estate.localityCp ? " " + estate.localityCo + ", " : ", "
    }${estate.localityCity ?? ""}`;
  }

  @Mutation(() => Boolean)
  async delete(@Arg("id") id: number): Promise<Boolean> {
    return this.estateService.deleteEstateById(id);
  }

  @Mutation(() => RespUpdate)
  async update(@Arg("estate") estate: EstateInput): Promise<RespUpdate> {
    return await this.estateService.saveEstate(estate)
  }

  @Mutation(() => Number)
  async create(@Arg("sourceId") sourceId: Number,
  @Arg("localityLatitude") localityLatitude: Number,
  @Arg("localityLongitude") localityLongitude: Number): Promise<Number> {
    return this.estateService.createEstate(sourceId as any, localityLatitude as any, localityLongitude as any);
  }
}

resolverManager.registerResolver(EstateResolver);
