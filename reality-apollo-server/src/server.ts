import { Server } from 'typescript-rest';
import { Config, Container, Inject } from 'typescript-ioc';
import { join } from "path";
import { existsSync } from 'fs';
import { AddressInfo } from 'net';
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import 'reflect-metadata';

import { buildGraphqlSchema } from './schema';
import { LoggerApi } from './logger';
import { ServiceConfig } from './config'
import { ConnectionOptions, createConnection } from 'typeorm'
import { RefreshTokenReguestHandler } from './auth'
import express = require('express')
import http = require('http')
import cookieParser = require('cookie-parser')
import cors = require('cors')
import { graphqlUploadExpress } from 'graphql-upload';

const npmPackage = require(join(process.cwd(), 'package.json'));

const config = npmPackage.config || { port: 4000 };

export class ApiServer {
  @Inject
  logger: LoggerApi;
  @Inject
  config: ServiceConfig

  private graphQLServerPromise: Promise<Express>;
  private server: http.Server;
  public PORT: number = +process.env.PORT || config.port;
  public HOST: string = process.env.HOST || config.host;
  public PROTOCOL: string = process.env.PROTOCOL || config.protocol;
  // @ts-ignore
  private async getGraphQLServer(): Promise<Express> {
    if (this.graphQLServerPromise) {
      return this.graphQLServerPromise;
    }
    return this.graphQLServerPromise = new Promise(async (resolve, reject) => {
      const graphqlServer = new ApolloServer({
        schema: (await buildGraphqlSchema() as any),
        context: ({ req, res }) => ({ req, res }),
        uploads: false
      });
      const apiRouter: express.Router = express.Router();
      Server.loadControllers(
        apiRouter,
        [
          'controllers/*',
        ],
        __dirname,
      );
      const expressServer = express()
      expressServer.use(
        cors({
          origin: `${this.PROTOCOL}://${this.HOST}:${this.PORT}`,
          credentials: true
        })
      );
      expressServer.use(cookieParser());
      this.logger.apply(expressServer);
      expressServer.use(apiRouter);
      expressServer.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
      expressServer.post("/refresh_token", RefreshTokenReguestHandler);
      graphqlServer.applyMiddleware({ app: expressServer })
      // const swaggerPath = join(process.cwd(), 'dist/swagger.json');
      // if (existsSync(swaggerPath)) {
      //   Server.swagger(
      //     apiRouter,
      //     {
      //       filePath: swaggerPath,
      //       schemes: this.swaggerProtocols,
      //       host: this.swaggerHost,
      //       endpoint: '/api-docs'
      //     },
      //   );
      // }

      resolve(expressServer);
    });
  }

  private async connectDatabase(options: ConnectionOptions): Promise<void> {
    this.logger.info('Connecting database...')

    try {
      await createConnection(options)
      this.logger.info('Database connection successful!')

    } catch (e) {
      this.logger.error('Database connection failed! Terminating...\n' + e)
      process.exit(1)
    }
  }

  // public async getApp(): Promise<express.Application> {
  //   const graphQLServer = await this.getGraphQLServer();
  //
  //   return graphQLServer.();
  // }

  get swaggerProtocols(): string[] {
    return parseCSVString(process.env.PROTOCOLS, '');
  }

  get swaggerHost(): string {
    return process.env.INGRESS_HOST || '';
  }

  public bind(source: Function): Config {
    return Container.bind(source);
  }

  public get<T>(source: Function): T {
    return Container.get(source);
  }

  public async start(): Promise<ApiServer> {
    const expressGraphQLServer = await this.getGraphQLServer();

    this.server = await expressGraphQLServer.listen({host: this.HOST, port: this.PORT });

    await this.connectDatabase(this.config.database)

    const serverUrl = addressInfoToString(this.server.address());

    console.log(`Listening on ${serverUrl}`);

    return this;
  }

  /**
   * Stop the server (if running).
   * @returns {Promise<boolean>}
   */
  public async stop(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.server) {
        this.server.close(() => {
          return resolve(true);
        });
      } else {
        return resolve(true);
      }
    });
  }
}

function addressInfoToString(addressInfo: AddressInfo | string): string {
  if (typeof addressInfo === 'string') {
    return addressInfo;
  }

  const address = addressInfo.address === '::' ? 'localhost' : addressInfo.address;

  return `http://${address}:${addressInfo.port}`;
}

function parseCSVString(value: string, defaultValue?: string): string[] {
  if (value) {
    return (value.split(',') || []).map(v => v.trim());
  }

  return defaultValue ? [defaultValue] : [];
}
