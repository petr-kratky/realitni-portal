const path = require('path')
const Dotenv = require('dotenv-webpack')
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config')

const envPath = process.env.NODE_ENV === 'production' ? '.env.client.prod' : '.env.client.dev'

module.exports = withCustomBabelConfigFile({
  babelConfigFile: path.resolve('babel.config.js'),
  webpack: config => {
    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,
      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, 'env', envPath),
        systemvars: true
      })
    ]

    return config
  }
  // experimental: {
  //   redirects() {
  //     return [
  //       {
  //         source: '/',
  //         permanent: true,
  //         destination: '/en',
  //       },
  //     ]
  //   },
  // },
})
