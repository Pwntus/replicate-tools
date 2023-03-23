import { createVuetify, ThemeDefinition } from 'vuetify'

const lightTheme: ThemeDefinition = {
  colors: {
    background: '#ffffff',
    surface: '#fff',
    primary: '#000000',
    secondary: '#0071e3',
    error: '#FF5252',
    info: '#2196F3',
    success: '#008000',
    warning: '#ffc300',
    black: '#1d1d1f',
    white: '#d6d6d6'
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    theme: {
      defaultTheme: 'lightTheme',
      themes: {
        lightTheme
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
