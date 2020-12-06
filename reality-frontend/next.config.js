const path = require('path')
const Dotenv = require('dotenv-webpack')
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config')

module.exports = withCustomBabelConfigFile({
  babelConfigFile: path.resolve('babel.config.js'),
  webpack: config => {
    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,
      // Read the .env file
      process.env.NODE_ENV !== 'production'
        ? new Dotenv({
            path: path.join(__dirname, 'env', `.env.client.${process.env.NODE_ENV}`),
            systemvars: true
          })
        : null
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
