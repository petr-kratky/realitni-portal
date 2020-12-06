const path = require('path')
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config')

module.exports = withCustomBabelConfigFile({
  babelConfigFile: path.resolve('babel.config.js'),
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: 'AIzaSyBqYOqXDwG5_i6bFv0I2agVONDfl0KJ8uw',
    NEXT_PUBLIC_GOOGLE_GEOCODE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
    NEXT_PUBLIC_MAPBOX_TOKEN:
      'pk.eyJ1IjoicGtyYXRreSIsImEiOiJjazJkcHNpaDcwMThpM21vNGZqNTZsZDQxIn0.QC03U0mLmV9AyM1tuyI-gg'
  }
})
