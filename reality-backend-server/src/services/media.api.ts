export abstract class MediaApi {
  abstract async listImages(id: number): Promise<string[]>
  abstract async listPdf(id: number): Promise<string[]>
  abstract async uploadImage(id: number, image: Express.Multer.File): Promise<string>
  abstract async uploadFile(id: number, pdf: Express.Multer.File): Promise<string>
  abstract async deleteAllImages(id: number): Promise<boolean>

}
