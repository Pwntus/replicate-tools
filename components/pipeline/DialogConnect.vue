<template lang="pug">
v-dialog(
  v-model="dialog_proxy"
  :content-class="contentClass"
  transition="slide-y-reverse-transition"
  fullscreen
)
  v-card
    v-toolbar(
      color="primary"
      flat tile dark
    )
      v-btn(
        @click="dialog_proxy = false"
        icon
      )
        v-icon(icon="mdi-close")
      v-toolbar-title Connect <b>{{ name }}</b> to step \#{{ step_index }}
    v-card-text
      .pipeline-dialog-connect-models
        pipeline-dialog-connect-model(
          v-for="(step_model, step_model_index) in step"
          @select="(e) => bubbleEntry(step_model_index, e)"
          :key="`pipeline-dialog-connect-model-${step_model_index}`"
          :model="step_model"
        )
</template>

<script lang="ts">
export default {
  props: ['modelValue', 'payload'],
  data: () => ({
    steps: null,
    step_index: null as any,
    step_model_index: null,
    name: null
  }),
  computed: {
    dialog_proxy: {
      get() {
        return this.modelValue
      },
      set(v: any) {
        this.$emit('update:modelValue', v)
      }
    },
    contentClass() {
      const classes = []
      if (this.$vuetify.display.mobile) classes.push('mobile')
      return classes.join(' ')
    },
    step() {
      if (!this.steps) return

      const step = this.steps[this.step_index - 1]
      return step
    }
  },
  watch: {
    modelValue(v) {
      if (v) {
        this.steps = this.payload.steps
        this.step_index = this.payload.step_index
        this.step_model_index = this.payload.step_model_index
        this.name = this.payload.name
      } else {
        this.steps = null
        this.step_index = null
        this.step_model_index = null
        this.name = null
      }
    }
  },
  methods: {
    bubbleEntry(source_step_model_index: number, e: string) {
      this.$emit(
        'select',
        this.step_index,
        this.step_model_index,
        this.name,
        source_step_model_index,
        e
      )
      this.dialog_proxy = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.v-dialog
  .v-card
    .v-toolbar
      :deep(.v-toolbar__content)
        padding 0

        .v-toolbar-title
          font-family "Space Grotesk", "basier_square", -apple-system, system-ui, BlinkMacSystemFont, "Helvetiva Neue", "Helvetica", Arial, sans-serif !important

    .v-card-text
      padding 48px

      .pipeline-dialog-connect-models
        display grid
        grid-gap 48px
        grid-template-columns 1fr 1fr 1fr

        .pipeline-dialog-connect-model
          width 100%
          min-width 0
</style>
