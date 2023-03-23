<template lang="pug">
.footer(:class="{ xs }")
  nuxt-link.text-subtitle-1(to="/" exact) Replicate.tools
  v-spacer
  nuxt-link(to="/about") About
  .text-subtitle-1.dot ·
  a(href="https://twitter.com/PontusAurdal") Twitter
  .text-subtitle-1.dot ·
  a(href="https://discord.gg/replicate") Discord
  .text-subtitle-1.dot ·
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
.footer
  margin-top 5rem
  padding 48px
  display flex

  .text-subtitle-1
    padding 0

  .dot
    color rgba(0, 0, 0, 0.45)

  a
    height 100%
    padding 0 0.75rem
    color rgba(0, 0, 0, 0.45)
    display flex
    flex-wrap wrap
    align-content center

    &:hover, &.router-link-active
      color #000000

    &.router-link-active
      text-decoration underline

  &.xs
    margin-top 2.5rem
    padding 24px
</style>
