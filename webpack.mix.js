let mix = require('laravel-mix');
const path = require('path');

mix.setPublicPath('public');
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

 mix.js('resources/assets/js/app.js', 'public/js')
    //.js('resources/assets/js/modules/updateLoteZona.js', 'public/js/modules/lotes')
    .js('resources/assets/js/activitiesApp.js', 'public/js/modules/activities/assets')
    .sass('resources/assets/sass/app.scss', 'public/css')
    /*.browserSync({
        proxy: 'http://localhost:8001', // Asegúrate de que esta URL sea la de tu Laravel en local
        files: [
            //'app/** /*.php',
            'resources/views/** /*.blade.php',
            'resources/assets/js/** /*.js',
        'resources/assets/sass/** /*.scss',
            'public/js/** /*.js',
            'public/css/** /*.css'
        ]
    })*/
;
mix.webpackConfig({
    output: {
        publicPath: 'http://localhost:8084/'
    },
    devServer:{
        contentBase: 'public',
        publicPath: '/',
        host: 'localhost',
        port: 8084,
        https: false,
        hotOnly: true,
        hot: true,
        inline: true,
        open: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/assets/js')
        }
    },
    devtool: 'source-map'
});

mix.sourceMaps();
if (mix.inProduction()) {
    mix.version();
}