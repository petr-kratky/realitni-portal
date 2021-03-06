import { ApolloServer } from 'apollo-server-express'
import { Server } from 'typescript-rest';
import { Config, Container, Inject } from 'typescript-ioc';
import { AddressInfo } from 'net';
import { Express } from 'express'
import 'reflect-metadata';

import { ConnectionOptions, createConnection } from 'typeorm'
import express = require('express')
import http = require('http')
import cookieParser = require('cookie-parser')
import cors = require('cors')

import { buildGraphqlSchema } from './schema';
import { LoggerApi } from './logger';
import { ServiceConfig } from './config'

export class ApiServer {
  @Inject
  private logger: LoggerApi;
  @Inject
  private config: ServiceConfig

  private graphQLServerPromise: Promise<Express>;
  private server: http.Server;

  // @ts-ignore
  private async getGraphQLServer(): Promise<Express> {
    if (this.graphQLServerPromise) {
      return this.graphQLServerPromise;
    }
    return this.graphQLServerPromise = new Promise(async (resolve, reject) => {
      const graphqlServer = new ApolloServer({
        schema: (await buildGraphqlSchema()),
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
          origin: `${this.config.server.protocol}://${this.config.server.host}:${this.config.server.port}`,
          credentials: true
        })
      );
      expressServer.use(cookieParser());
      // this.logger.apply(expressServer);
      expressServer.use(apiRouter);
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

    this.server = await expressGraphQLServer.listen({ host: this.config.server.host, port: this.config.server.port });

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
