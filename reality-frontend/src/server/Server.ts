import express, { Express } from 'express'
import next from 'next'
import helmet from 'helmet'
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

  const backendProxy: RequestHandler = createProxyMiddleware('/api', {
    target: apiServerUrl,
    pathRewrite: { '^/api': '' },
    onError: (_err, _req, res) => {
      res.writeHead(502, 'Cannot open connection to API server')
      res.end()
    }
  })

  server.use(helmet())
  server.use(backendProxy)

  server.get('*', (req, res) => nextMiddleware(req, res))

  server.listen(port, host)

  return { protocol, host, port }
}

startServer()
  .then(({ protocol, host, port }) => console.log(`Next.js is ready on ${protocol}://${host}:${port}`))
  .catch(err => console.error(`Server failed to start:\n${err}`))
