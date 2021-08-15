import express, { Express } from 'express'
import next from 'next'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware'

async function startServer(): Promise<{ protocol: string; port: number; host: string }> {
  const dev: boolean = process.env.NODE_ENV == 'development'

  const server: Express = express()

  const nextApp = next({ dev: dev })
  await nextApp.prepare()

  const nextMiddleware = nextApp.getRequestHandler()

  // Env vars can only be loaded after app.prepare() to allow NextJS to first load the values from .env.*
  const apiServerUrl: string = process.env.API_SERVER || ''
  const postgisUrl: string = process.env.POSTGIS_SERVER || ''
  const protocol: string = process.env.PROTOCOL || 'http'
  const host: string = process.env.HOST || 'localhost'
  // @ts-ignore
  const port: number = +process.env.PORT || 3000

  // const validateJwt: OnProxyReqCallback = (proxyReq, req, res) => {
  //   const authHeader = req.headers.authorization;
  //   if ((!authHeader)) {
  //     console.log('AUTH_HEADER_MISSING')
  //     req.destroy(new Error('AUTH_HEADER_MISSING'))
  //   } else {
  //     try {
  //       const token = authHeader.split(" ")[1];
  //       verify(token, process.env.ACCESS_TOKEN_SECRET!);
  //     } catch (err) {
  //       console.log(err);
  //       req.destroy(new Error("AUTH_TOKEN_INVALID"))
  //     }
  //   }
  // }

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
  server.use(graphqlProxy, postgisProxy, refreshProxy)

  server.get('*', (req, res) => nextMiddleware(req, res))

  server.listen(port, host)

  return { protocol, host, port }
}

startServer()
  .then(({ protocol, host, port }) => console.log(`Next.js is ready on ${protocol}://${host}:${port}`))
  .catch(err => console.error(`Server failed to start:\n${err}`))
