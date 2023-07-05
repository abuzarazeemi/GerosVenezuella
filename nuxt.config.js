import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  // target: 'static', // default is 'server'
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'es',
    },
    title: 'Giros Venezuela',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fd9e30' },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/prototypes', '~/plugins/inject', '~/plugins/currencyformat.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module

    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  moment: {
    defaultLocale: 'es',
    locales: ['es'],
    timezone: {
      matchZones: /America\/(Bogota)/,
      startYear: 2000,
      endYear: 2030,
    },
  },
  /*
   ** Nuxt.js modules
   */
  modules: ['nuxt-clipboard2'],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#FB8C00',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.node = { fs: "empty"} 
    },
  },
  server: {
    port: process.env.PORT || 8080,
  },
}
