import vuetify from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    replicateApiToken: process.env.REPLICATE_API_TOKEN || '',
    ngrokHost: process.env.NGROK_HOST || ''
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@fontsource/space-grotesk',
    '~/assets/style/global.styl'
  ],
  modules: ['@pinia/nuxt'],
  build: {
    transpile: ['vuetify']
  },
  sourcemap: {
    server: false,
    client: false
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins?.push(vuetify())
    }
  }
})
