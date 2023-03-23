<template lang="pug">
v-app(:class="{ mobile: $vuetify.display.mobile }")
  v-fade-transition(
    v-if="!ready"
    leave-absolute
  )
    .slate
      template(v-if="error")
        .font-weight-bold We're sorry but the application failed to start.
        .mt-2.mb-4 Reload the web page and try again.
        pre Error: {{ error }}

  template(v-else)
    ui-app-bar
    v-main
      v-container(fluid)
        slot
    ui-footer
</template>

<script lang="ts">
import { useAppStore } from '~/stores/app'
import { useModelStore } from '~/stores/model'

export default {
  setup() {
    const title = 'Replicate Tools'
    const description = 'Value added tools made for Replicate.'
    const image = '/img/cover.jpg'
    useServerSeoMeta({
      title,
      ogTitle: title,
      description,
      ogDescription: description,
      ogType: 'website',
      ogSiteName: title,
      ogImage: image,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: image,
      twitterCreator: 'pontusaurdal'
    })
    const appStore = useAppStore()
    const modelStore = useModelStore()

    return { appStore, modelStore }
  },
  data: () => ({
    ready: false,
    error: null
  }),
  async mounted() {
    try {
      await this.appStore.initGuestToken()
      this.ready = true

      // deferred
      this.modelStore.listModel()
    } catch (e: any) {
      this.error = e.message
    }
  }
}
</script>

<style lang="stylus" scoped>
.v-application
  .slate
    display flex
    flex-direction column
    justify-content center
    align-items center
    position absolute
    top 0
    bottom 0
    left 0
    right 0

    pre
      padding 10px 15px
      max-width 420px
      background #000
      color #FFF
      word-break break-word
      white-space pre-wrap
      border-radius 5px

  .v-main
    padding 0 !important

    :deep(.v-container)
      padding 24px 48px

      .v-tabs
        margin-bottom 48px
        position relative

        &::before
          content ''
          height 1px
          background rgba(0, 0, 0, .1)
          position absolute
          bottom 0
          left 0
          right 0

      .text-h4, .text-h5
        margin-bottom 24px
        font-family "Space Grotesk", -apple-system, system-ui, BlinkMacSystemFont, "Helvetiva Neue", "Helvetica", Arial, sans-serif !important

  &.mobile
    .v-main
      :deep(.v-container)
        padding 12px 24px

        .v-tabs
          margin-bottom 24px

        .text-h4, .text-h5
          margin-bottom 12px
</style>
