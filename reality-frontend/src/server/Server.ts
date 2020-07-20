import express, { Express } from 'express';
import path from 'path'
import next from 'next';
import dotenv from 'dotenv'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware'


async function startServer(): Promise<{ protocol: string; port: number; host: string }> {
  const graphqlUrl: string = process.env.GRAPHQL_SERVER || 'http://localhost:4000/graphql'
  const refreshUrl: string = process.env.GRAPHQL_REFRESH || 'http://localhost:4000'
  const postgisUrl: string = process.env.POSTGIS_SERVER || 'http://localhost:3004'
  const protocol: string = process.env.PROTOCOL || 'http'
  const host: string = process.env.HOST || 'localhost'
  // @ts-ignore
  const port: number = +process.env.PORT || 3000
  const dev: boolean = process.env.NODE_ENV !== 'production'

  const server: Express = express();
  const app = next({ dev: dev });
  await app.prepare();

  const nextMiddleware = app.getRequestHandler();

  const refreshProxy: RequestHandler = createProxyMiddleware('/api/refresh_token', {
    target: refreshUrl,
    onError: err => console.error(err),
    pathRewrite: {'^/api/refresh_token': '/refresh_token'}
  })

  const graphqlProxy: RequestHandler = createProxyMiddleware('/api/graphql', {
    target: graphqlUrl,
    onError: err => console.error(err),
    pathRewrite: {'/api/graphql': 'graphql'}
  })

  const postgisProxy: RequestHandler = createProxyMiddleware('/api/postgis', {
    target: postgisUrl,
    pathRewrite: { '^/api/postgis': '' },
    onError: err => console.error(err)
  })

  server.use(helmet())
  server.use(cookieParser())
  server.use(graphqlProxy)
  server.use(postgisProxy)
  server.use(refreshProxy)

  server.get('/health', (req, res) => res.send('UP!'));
  server.get('*', (req, res) => nextMiddleware(req, res));

  server.listen(port, host)

  return { protocol, host, port }
}


function loadEnv(): void {
  const envPath =
    process.env.NODE_ENV === "production"
      ? ".env.server.prod"
      : ".env.server.dev"
  dotenv.config({ path: path.join('./env', envPath) })
}


loadEnv()

startServer()
  .then(({ protocol, host, port }) => console.log(`Next.js is ready on ${protocol}://${host}:${port}`))
  .catch((err) => console.error(`Server failed to start:\n${err}`))
