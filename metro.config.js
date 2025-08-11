const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Allow connections to local development server
config.resolver.platforms = ['ios', 'android', 'native', 'web']
config.server = {
  ...config.server,
  port: 8081,
}

module.exports = withNativeWind(config, { input: './app/global.css' })
