import express, { Express } from 'express'
import path from 'path'
import next from 'next'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware'

async function startServer(): Promise<{ protocol: string; port: number; host: string }> {
  const apiServerUrl: string = process.env.API_SERVER || 'http://localhost:4000'
  const postgisUrl: string = process.env.POSTGIS_SERVER || 'http://localhost:3004'
  const protocol: string = process.env.PROTOCOL || 'http'
  const host: string = process.env.HOST || 'localhost'
  // @ts-ignore
  const port: number = +process.env.PORT || 3000
  const dev: boolean = process.env.NODE_ENV == 'development'

  const server: Express = express()
  const app = next({ dev: dev })
  await app.prepare()

  const nextMiddleware = app.getRequestHandler()

  const refreshProxy: RequestHandler = createProxyMiddleware('/api/refresh_token', {
    target: apiServerUrl,
    pathRewrite: { '^/api/refresh_token': '/refresh_token' },
    onError: err => console.error(err)
  })

  const graphqlProxy: RequestHandler = createProxyMiddleware('/api/graphql', {
    target: apiServerUrl,
    pathRewrite: { '/api/graphql': 'graphql' },
    onError: err => console.error(err)
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

  server.get('/health', (req, res) => res.send('UP!'))
  server.get('*', (req, res) => nextMiddleware(req, res))

  server.listen(port, host)

  return { protocol, host, port }
}

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join('./env', `.env.server.${process.env.NODE_ENV}`) })
}

startServer()
  .then(({ protocol, host, port }) => console.log(`Next.js is ready on ${protocol}://${host}:${port}`))
  .catch(err => console.error(`Server failed to start:\n${err}`))
