import { ApolloError } from "apollo-server-express"
import { Inject } from "typescript-ioc"
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, ResolverInterface, Root } from "type-graphql"

import { Estate, EstateCreateInput, EstatePrimaryType, EstateSecondaryType, EstateUpdateInput, Image, File } from "../models"
import { RequireAuthentication } from "../decorators/auth-gql"
import { resolverManager } from "./_resolver-manager"
import { EstateService, MediaService } from "../services"
import { MyContext } from "../typings"

@Resolver(of => Estate)
export class EstateResolver implements ResolverInterface<Estate> {
  @Inject
  estateService: EstateService
  @Inject
  mediaService: MediaService

  @FieldResolver(returns => [Image])
  async images(@Root() estate: Estate): Promise<Image[]> {
    try {
      return await this.mediaService.listImages(estate.id)
    } catch (e) {
      throw new ApolloError(e.message, "500", e)
    }
  }

  @FieldResolver(returns => [File])
  async files(@Root() estate: Estate): Promise<File[]> {
    try {
      return await this.mediaService.listFiles(estate.id)
    } catch (e) {
      throw new ApolloError(e.message, "500", e)
    }
  }

  @Query(returns => Estate, { nullable: true })
  @RequireAuthentication()
  async estate(@Arg("id") id: string): Promise<Estate> {
    return await this.estateService.getEstateById(id)
  }

  @Query(returns => [Estate])
  @RequireAuthentication()
  async estates(@Arg("skip") skip: number, @Arg("take") take: number) {
    try {
      return await this.estateService.getEstates(skip, take)
    } catch (e) {
      throw new ApolloError(e.message, "500", e)
    }
  }

  @Query(returns => [EstatePrimaryType])
  @RequireAuthentication()
  async estatePrimaryTypes(): Promise<EstatePrimaryType[]> {
    try {
      return await EstatePrimaryType.find()
    } catch (e) {
      throw new ApolloError(e.message, "500", e)
    }
  }

  @Mutation(returns => ID)
  @RequireAuthentication()
  async deleteEstate(@Arg("id") id: string): Promise<string> {
    const estate = await this.estateService.getEstateById(id)
    try {
      await estate.remove()
      return id
    } catch (e) {
      console.error(e)
      throw new ApolloError("ESTATE_DELETE_FAILED", "500")
    }
  }

  @Mutation(returns => Estate)
  @RequireAuthentication()
  async createEstate(
    @Ctx() { payload }: MyContext,
    @Arg("estateInput") estateInput: EstateCreateInput
  ): Promise<Estate> {
    return await this.estateService.createEstate(payload.id, estateInput)
  }

  @Mutation(returns => Estate)
  @RequireAuthentication()
  async updateEstate(@Arg("id") id: string, @Arg("estateInput") estateInput: EstateUpdateInput): Promise<Estate> {
    const existingEstate = await this.estateService.getEstateById(id)

    const inputEstate = Estate.create({
      ...estateInput,
      primary_type: EstatePrimaryType.create({ id: estateInput.primary_type_id }),
      secondary_type: EstateSecondaryType.create({ id: estateInput.secondary_type_id })
    })

    try {
      const updatedEstate = await Estate.merge(existingEstate, inputEstate).save()
      await updatedEstate.reload()
      return updatedEstate
    } catch (e) {
      console.error(e)
      throw new ApolloError("ESTATE_UPDATE_FAILED", "500")
    }
  }
}

resolverManager.registerResolver(EstateResolver)
