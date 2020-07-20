const fs = require("fs");
// import { getLogger } from '@2b/logger';
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { UploadResult, File } from "./file.model";
const path = require("path");
const isomorphicFetch = require("isomorphic-fetch");
const FormData = require("form-data");

export interface Context {
  [key: string]: any;
}
// const logger = getLogger('UPLOAD-RESOLVER');

const cleanup = (filename: string, pathName: string) => {
  if (fs.existsSync(pathName)) {
    fs.unlink(pathName, (err: any) => {
      if (err) {
        // // logger.error(`${filename} could not be deleted.`);
        // logger.error(err);
      } else {
        console.log("info > ", `Temporary ${filename} deleted.`);
      }
    });
  }
};
@Resolver()
class FileResolver {
  @Mutation(() => UploadResult)
  async fileUpload(
    @Ctx() ctx: Context,
    @Arg("id") id: number,
    @Arg("fileInput", () => GraphQLUpload) fileInput: [FileUpload]
  ): Promise<UploadResult> {
    console.log(fileInput);
    let readableStreams = [];
    // Check if multiple and normalize input streams
    if (Array.isArray(fileInput)) {
      readableStreams = await Promise.all(fileInput as any);
    } else {
      readableStreams[0] = await fileInput;
    }
    // Create writableStream for each file readable stream
    const pipedStreams = readableStreams.map((readStreamInstance) => {
      // https://github.com/apollographql/apollo-server/pull/2054
      const { filename, createReadStream, mimetype} = readStreamInstance;
      console.log('mimetype >>>', mimetype)
      const pathName = `${path.resolve(__dirname, `./${filename}`)}`;
      const writableStream = fs.createWriteStream(pathName, {
        autoDestroy: true,
      });
      // pipe readable stream into writable stream and register hooks
      return new Promise<any>((resolve, reject) => {
        console.log("info > ", `Upload ${filename} started.`);
        createReadStream()
          .on("close", () => {
            console.log(
              "info > ",
              `Upload ${filename} stopped. Read stream closed.`
            );
          })
          .on("error", () => {
            console.log(
              "warn > ",
              `Upload ${filename} stopped. Read stream error.`
            );
            writableStream.end();
            cleanup(filename, pathName);
          })
          .pipe(writableStream)
          .on("error", (error: any) => {
            // logger.error(`Upload ${filename} failed. Write stream error.`);
            // logger.error(error);
            cleanup(filename, pathName);
            reject({error: true, stream: null, cleanFce: () => cleanup(filename, pathName), mimetype: mimetype});
          })
          .on("close", () => {
            console.log(
              "info > ",
              `Upload ${filename} stopped. Write stream closed.`
            );
          })
          .on("finish", async () => {
            console.log("info > ", `Upload ${filename} finished.`);
            resolve({error: false, stream: fs.createReadStream(pathName), cleanFce: () => cleanup(filename, pathName), mimetype: mimetype});
          });
      });
    });
    // write into writable streams in parallel
    const results = await Promise.all(pipedStreams);

    const formDataImages = new FormData();
    const formDataPdf = new FormData();
    results.forEach(element => {
      const {cleanFce, stream, mimetype, error} = element
      if(!error){
        (/png|jpg|jpeg/.test(mimetype)) ?
         formDataImages.append("images", stream) :
         formDataPdf.append("pdf", stream) // mimetype === 'application/pdf'
        cleanFce()
      }
    });

    let formHeadersImages = formDataImages.getHeaders();
    let formHeadersPdf = formDataPdf.getHeaders();

    try {
      await isomorphicFetch(
        `${process.env.MEDIA_SERVER_HOST}/${id}/images/upload`,
        {
          method: "POST",
          headers: {
            ...formHeadersImages,
          },
          body: formDataImages,
        }
      );

      await isomorphicFetch(
        `${process.env.MEDIA_SERVER_HOST}/${id}/images/uploadpdf`,
        {
          method: "POST",
          headers: {
            ...formHeadersPdf,
          },
          body: formDataPdf,
        }
      );
    } catch (err) {
      console.error("errr", err);
      return {
        uploaded: false,
      };
    }

    return {
      uploaded: true,
    };
  }
}

export { FileResolver };
