// Reference: https://alchemy.com/blog/how-to-polyfill-node-core-modules-in-webpack-5
// This allows the speakeasy library to be used in with react scripts 5

// npm install speakeasy qrcode
// npm install --save-dev react-app-rewired   
// npm install --save-dev crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process

const webpack = require('webpack'); 
module.exports = function override(config) { 
		const fallback = config.resolve.fallback || {}; 
		Object.assign(fallback, { 
    	"crypto": require.resolve("crypto-browserify"), 
      "stream": require.resolve("stream-browserify"), 
      "assert": require.resolve("assert"), 
      "http": require.resolve("stream-http"), 
      "https": require.resolve("https-browserify"), 
      "os": require.resolve("os-browserify"), 
      "url": require.resolve("url") 
      }) 
   config.resolve.fallback = fallback; 
   config.plugins = (config.plugins || []).concat([ 
   	new webpack.ProvidePlugin({ 
    	process: 'process/browser', 
      Buffer: ['buffer', 'Buffer'] 
    }) 
   ]) 
   return config; }