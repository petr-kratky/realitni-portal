const path = require('path')
const dotenv = require('dotenv')
const config = require('./config')

if (process.env.NODE_ENV !== 'production') {
  console.log('DEV MODE IDENTIFIED! Loading environment variables via dotenv.')
  dotenv.config()
}

const fastify = require('fastify')()

// postgres connection
fastify.register(require('fastify-postgres'), {
  connectionString: process.env.DB_CONNECTION_STRING
})

// compression - add x-protobuf
fastify.register(require('fastify-compress'), {
  customTypes: /^text\/|\+json$|\+text$|\+xml|x-protobuf$/
})

// cache
fastify.register(require('fastify-caching'), {
  privacy: 'private',
  expiresIn: process.env.CACHE_EXPIRY || 3600
})

// CORS
fastify.register(require('fastify-cors'))

// swagger
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  swagger: config.swagger
})

// static documentation path
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'documentation')
})

// routes
fastify.register(require('fastify-autoload'), {
  dir: path.join(__dirname, 'routes')
})

// Launch server
fastify.listen(process.env.PORT || 3000, process.env.HOST || 'localhost', function (err, address) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.info(`Server listening on ${address}`)
})
