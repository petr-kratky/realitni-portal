import { Inject } from "typescript-ioc"
import { POST, Path, PathParam, FilesParam, GET, Return, Errors, DELETE } from "typescript-rest"

import { MediaService } from "../services/media.service"
import { Image, File } from "../models"

@Path("/media")
export class MediaController {
  @Inject
  mediaService: MediaService

  @POST
  @Path("/images/estates/:estateId")
  async uploadImages(
    @PathParam("estateId") estateId: string,
    @FilesParam("images") images: Express.Multer.File[]
  ): Promise<string[]> {
    const resizeAndUploadImage = async (image: Express.Multer.File): Promise<string> => {
      try {
        const originalImage = { imageBuffer: image.buffer, imageSize: "original" }
        const originalImageHash = this.mediaService.getFileHashMD5(originalImage.imageBuffer)
        const resizedImages = await Promise.all(
          [2000, 1000, 500].map(async maxDimension => {
            return {
              imageBuffer: await this.mediaService.resizeImage(originalImage.imageBuffer, maxDimension),
              imageSize: maxDimension
            }
          })
        )
        await Promise.all(
          [...resizedImages, originalImage].map(
            async ({ imageBuffer, imageSize }) =>
              await this.mediaService.uploadImage({
                estateId,
                imageBuffer,
                originalImageHash,
                imageSize: imageSize.toString(),
                contentEncoding: image.encoding,
                contentType: image.mimetype
              })
          )
        )
        return originalImageHash
      } catch (err) {
        console.error(err)
        throw new Errors.InternalServerError(err)
      }
    }

    images.forEach(image => {
      if (!/png|jpg|jpeg/.test(image.mimetype)) {
        throw new Errors.BadRequestError("Unsupported image type. Allowed extensions are .png, .jpg, .jpeg")
      }
      if (image.size > 4e6) {
        throw new Errors.BadRequestError("File exceeds maximum allowed size")
      }
    })

    return await Promise.all(images.map(resizeAndUploadImage))
  }

  @GET
  @Path("/images/estates/:estateId")
  async listImages(@PathParam("estateId") estateId: string): Promise<Image[]> {
    try {
      return await this.mediaService.listImages(estateId)
    } catch (err) {
      console.log(err)
      throw new Errors.InternalServerError(err)
    }
  }

  @GET
  @Path("/images/estates/:estateId/:imageId/:imageSize")
  async getImage(
    @PathParam("estateId") estateId: string,
    @PathParam("imageId") imageId: string,
    @PathParam("imageSize") imageSize: string
  ): Promise<Return.DownloadBinaryData> {
    try {
      const image = await this.mediaService.getImage(estateId, imageId, imageSize)
      return new Return.DownloadBinaryData(image.Body as Buffer, image.ContentType)
    } catch (err) {
      console.log(err)
      throw new Errors.InternalServerError(err)
    }
  }

  @POST
  @Path("/files/estates/:estateId")
  async uploadFiles(
    @PathParam("estateId") estateId: string,
    @FilesParam("files") files: Express.Multer.File[]
  ): Promise<string[]> {
    const uploadFile = async (file: Express.Multer.File) => {
      try {
        return await this.mediaService.uploadFile(file, estateId)
      } catch (err) {
        console.log(err)
        throw new Errors.InternalServerError()
      }
    }

    files.forEach(file => {
      if (file.size > 10e6) {
        throw new Errors.BadRequestError("File exceeds maximum allowed size")
      }
    })

    return Promise.all(files.map(uploadFile))
  }

  @GET
  @Path("/files/estates/:estateId")
  async listFiles(@PathParam("estateId") estateId: string): Promise<File[]> {
    try {
      return await this.mediaService.listFiles(estateId)
    } catch (err) {
      console.log(err)
      throw new Errors.InternalServerError(err)
    }
  }

  @GET
  @Path("/files/estates/:estateId/:fileName")
  async getFile(
    @PathParam("estateId") estateId: string,
    @PathParam("fileName") fileName: string
  ): Promise<Return.DownloadBinaryData> {
    try {
      const file = await this.mediaService.getFile(estateId, fileName)
      return new Return.DownloadBinaryData(file.Body as Buffer, file.ContentType)
    } catch (err) {
      console.log(err)
      throw new Errors.InternalServerError(err)
    }
  }
}
