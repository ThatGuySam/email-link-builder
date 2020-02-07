const mix = require('laravel-mix')
const webpack = require('webpack')
require('now-env')

/*
  |--------------------------------------------------------------------------
  | Mix Asset Management
  |--------------------------------------------------------------------------
  |
  | Mix provides a clean, fluent API for defining some Webpack build steps
  | for your Laravel application. By default, we are compiling the Sass
  | file for the application as well as bundling up all the JS files.
  |
  */

const config = (webpackInstance) => {
  config.plugins.push(new webpackInstance.DefinePlugin({
    // Shared with front-end
    'process.env.APP_NAME': JSON.stringify(process.env.APP_NAME),
  }))

  config.devtool = 'source-map'

  return config
}

mix.setPublicPath('public')

mix.webpackConfig({
   devtool: 'source-map',
   plugins: [
     new webpack.DefinePlugin({
       // Shared with front-end
       'process.env.APP_NAME': JSON.stringify(process.env.APP_NAME),
      //  'process.env.JOTFORM_KEY': JSON.stringify(process.env.JOTFORM_KEY)
     })
   ]
}).sourceMaps()


mix.browserSync({ // eslint-disable-line no-sync
  proxy: false,
  single: true,
  server: {
    baseDir: '.'
  }
})

mix.js('resources/assets/js/app.js', 'public/js')
  .sass('resources/assets/sass/app.scss', 'public/css')
