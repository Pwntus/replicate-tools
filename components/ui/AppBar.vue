<template lang="pug">
v-app-bar(
  :class="{ xs }"
  color="transparent"
  flat tile
)
  .replicate-tv
    iframe(src="https://replicate.tv/")
  v-app-bar-title
    nuxt-link.logo(to="/")
      ui-logo.mr-4
      span(v-if="!xs") Replicate.tools (unofficial)
  v-spacer
  nuxt-link(to="/") Pipelines
  a(href="https://github.com/Pwntus/replicate-tools") Github
</template>

<script lang="ts">
import { useDisplay } from 'vuetify'

export default {
  setup() {
    const { xs } = useDisplay()
    return { xs }
  }
}
</script>

<style lang="stylus" scoped>
.v-app-bar
  padding 48px
  position relative !important
  overflow hidden

  :deep(.v-toolbar__content)
    padding 0
    height 64px !important
    color #fff
    position static

    .replicate-tv
      background-color #000
      position absolute
      left 0
      right 0
      top 0
      bottom -500px
      z-index -1

      &::before
        content ''
        background-color rgba(0, 0, 0, .25)
        -webkit-backdrop-filter saturate(200%) blur(15px)
        backdrop-filter saturate(200%) blur(15px)
        -webkit-mask linear-gradient(180deg, transparent -45%, #fff 20%)
        mask linear-gradient(180deg, transparent -45%, #fff 20%)
        position absolute
        bottom 0
        left 0
        right 0
        top 0

      iframe
        width 100%
        height 100%
        border 0

    .v-toolbar-title
      margin-left 0

      .logo
        color #fff

    a:not(.logo)
      height 100%
      padding 0 0.75rem
      color rgba(255, 255, 255, 0.75)
      display flex
      flex-wrap wrap
      align-content center

      &:hover, &.router-link-active
        color #ffffff

      &.router-link-active
        text-decoration underline

  &.xs
    padding 24px
</style>
