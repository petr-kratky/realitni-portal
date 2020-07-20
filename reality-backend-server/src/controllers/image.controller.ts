import {
  FileParam,
  Errors,
  FilesParam,
  GET,
  Path,
  PathParam,
  POST,
} from "typescript-rest";
import { AutoWired, Inject, Singleton } from "typescript-ioc";
import { MediaApi } from "../services";
import { LoggerApi } from "../logger";

@AutoWired
@Singleton
@Path(":id/images")
export class ImageController {
  @Inject
  service: MediaApi;
  @Inject
  _baseLogger: LoggerApi;

  get logger() {
    return this._baseLogger.child("ImageController");
  }

  @Path("/uploadone")
  @POST
  async uploadImage(
    @PathParam("id") id: number,
    @FileParam("image") image: Express.Multer.File
  ): Promise<string> {
    if (!/png|jpg|jpeg/.test(image.mimetype)) {
      throw new Errors.BadRequestError(
        "Unsupported image type - Allowed extensions are .png, .jpg, .jpeg"
      );
    }

    if (image.size > 2e6) {
      throw new Errors.BadRequestError(
        "File too large - Maximum allowed file size is 2MB"
      );
    }

    try {
      return await this.service.uploadImage(id, image);
    } catch (err) {
      this.logger.error(err);
      throw new Errors.InternalServerError(err);
    }
  }

  @Path("/upload")
  @POST
  async uploadImages(
    @PathParam("id") id: number,
    @FilesParam("images") images: Express.Multer.File[]
  ): Promise<boolean> {
    console.log("id", id);
    console.log("images", images);

    images.forEach(async (image) => {
      if (!/png|jpg|jpeg/.test(image.mimetype)) {
        throw new Errors.BadRequestError(
          "Unsupported image type - Allowed extensions are .png, .jpg, .jpeg"
        );
      }

      if (image.size > 2e6) {
        throw new Errors.BadRequestError(
          "File too large - Maximum allowed file size is 2MB"
        );
      }

      try {
        const uploadImageResult = await this.service.uploadImage(id, image);
        console.log('uploadImageResult >>>', uploadImageResult)
      } catch (err) {
        this.logger.error(err);
        return false
        // throw new Errors.InternalServerError(err);
      }
    });
    return true;
  }

  @Path("/uploadpdf")
  @POST
  async uploadPdf(
    @PathParam("id") id: number,
    @FilesParam("pdf") pdf: Express.Multer.File[]
  ): Promise<boolean> {
    pdf.forEach(async (file) => {
      if (!/pdf/.test(file.mimetype)) {
        throw new Errors.BadRequestError(
          "Unsupported file type - Allowed extensions are .pdf"
        );
      }

      if (file.size > 2e6) {
        throw new Errors.BadRequestError(
          "File too large - Maximum allowed file size is 2MB"
        );
      }

      try {
        const uploadFileResult = await this.service.uploadFile(id, file);
      } catch (err) {
        this.logger.error(err);
        return false
        // throw new Errors.InternalServerError(err);
      }
    });
    return true;
  }

  @Path("/list")
  @GET
  async listImages(@PathParam("id") id: number): Promise<string[]> {
    return this.service.listImages(id);
  }

  @Path("/listPdf")
  @GET
  async listPdf(@PathParam("id") id: number): Promise<any> {
    return this.service.listPdf(id);
  }

  @Path("/delete")
  @GET
  async deleteImages(@PathParam("id") id: number): Promise<boolean> {
    return this.service.deleteAllImages(id);
  }
}
