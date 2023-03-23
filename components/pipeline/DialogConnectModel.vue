<template lang="pug">
.pipeline-dialog-connect-model
  v-img(
    v-if="cover_image"
    :src="cover_image"
    height="140"
    cover
  )
  template(v-if="resolved_model")
    .text-h5
      span {{ resolved_model.username }}
      span.delimeter /
      | {{ resolved_model.name }}
    .text-body-1 {{ resolved_model.description }}
  .pipeline-model-output-wrapper
    .text-h5 Output
    pipeline-model-output(
      @select="(e) => $emit('select', e)"
      :output="model.output"
    )
</template>

<script lang="ts">
import { default as _ } from 'lodash'
import { useModelStore } from '~/stores/model'

export default {
  setup() {
    const store = useModelStore()
    return { store }
  },
  props: ['model'],
  computed: {
    resolved_model() {
      const index = this.store.models.findIndex(
        (item) => `${item.username}/${item.name}` === this.model.model
      )
      return index > -1 ? this.store.models[index] : null
    },
    cover_image() {
      return _.get(this.resolved_model, 'cover_image.url', null)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-dialog-connect-model
  .v-img
    border-radius 4px

  .text-h5
    padding-top 8px
    color #000
    font-family "Space Grotesk", "basier_square", -apple-system, system-ui, BlinkMacSystemFont, "Helvetiva Neue", "Helvetica", Arial, sans-serif !important

    span
      color rgba(0, 0, 0, 0.45)

      &.delimeter
        padding 0 4px

  .text-body-1
    color #000

  .pipeline-model-output-wrapper
    margin-top 16px
    padding 16px 16px
    background rgba(0, 0, 0, .05)
    border-radius 4px

    .text-h5
      padding 0
</style>
