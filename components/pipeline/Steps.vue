<template lang="pug">
.pipeline-steps(:class="{ mobile: $vuetify.display.mobile }")

  pipeline-dialog-connect(
    v-model="dialog"
    @select="selectConnection"
    :payload="dialog_payload"
  )

  .pipeline-step(
    v-for="(step, step_index) in steps"
    :key="`pipeline-step-${step_index}`"
  )
    .pipeline-step-controls
      .text-h5 Step \#{{ step_index + 1 }}
      v-spacer
      v-btn(
        v-if="!this.immutable"
        @click="removeStep(step_index)"
        color="#000"
        size="x-large"
        variant="text"
      )
        v-icon(
          icon="mdi-delete-outline"
          start
        )
        | Remove step
    .pipeline-step-models
      pipeline-model(
        v-for="(step_model, step_model_index) in step"
        v-model="steps[step_index][step_model_index]"
        @connect="(e) => connectInput(step_index, step_model_index, e)"
        @disconnect="(e) => disconnectInput(step_index, step_model_index, e)"
        @remove="removeModel(step_index, step_model_index)"
        :key="`pipeline-step-model-${step_model.id}`"
        :allow-connecting="step_index > 0"
        :immutable="immutable"
      )
      .sheet-button.pipeline-add-model(
        v-if="!this.immutable"
        @click="addModel(step_index)"
      )
        v-icon(
          icon="mdi-plus"
          size="x-large"
        )
        .text-center Add model to step \#{{ step_index + 1 }}
  .pipeline-step(v-if="!this.immutable")
    .sheet-button.pipeline-add-step(@click="addStep")
      v-icon(
        icon="mdi-format-vertical-align-bottom"
        size="x-large"
      )
      .text-center Add step
</template>

<script lang="ts">
import { default as _ } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { useModelStore } from '~/stores/model'

export default {
  setup() {
    const store = useModelStore()
    return { store }
  },
  props: ['modelValue', 'immutable'],
  data: () => ({
    dialog: false,
    dialog_payload: null as any
  }),
  computed: {
    steps: {
      get() {
        return this.modelValue
      },
      set(v: any) {
        this.$emit('input', v)
      }
    }
  },
  methods: {
    addStep() {
      this.steps.push([])
      this.addModel(this.steps.length - 1)
    },
    removeStep(step_index: number) {
      this.steps.splice(step_index, 1)

      // Remove next step connections (all)
      const step = _.get(this.steps, step_index, null)
      if (!step) return

      for (const [step_model_index, model] of step.entries())
        for (const [key, value] of Object.entries(model.input))
          if (typeof value === 'object')
            delete this.steps[step_index][step_model_index].input[key]
    },
    addModel(step_index: number) {
      this.steps[step_index].push({
        id: uuidv4(),
        model: null,
        version: null,
        input: {},
        output: {}
      })
    },
    removeModel(step_index: number, prev_step_model_index: number) {
      this.steps[step_index].splice(prev_step_model_index, 1)

      // Remove next step connections (with this model)
      const step = _.get(this.steps, step_index + 1, null) as Step
      if (!step) return

      for (const [step_model_index, model] of step.entries())
        for (const [key, value] of Object.entries(model.input))
          if (typeof value === 'object') {
            if (value.source_step_model_index === prev_step_model_index)
              delete this.steps[step_index + 1][step_model_index].input[key]
            if (value.source_step_model_index > prev_step_model_index)
              this.steps[step_index + 1][step_model_index].input[
                key
              ].source_step_model_index = value.source_step_model_index - 1
          }
    },
    connectInput(step_index: number, step_model_index: number, e: string) {
      this.dialog_payload = {
        steps: this.steps,
        step_index,
        step_model_index,
        name: e
      }
      this.dialog = true
    },
    selectConnection(
      step_index: number,
      step_model_index: number,
      name: string,
      source_step_model_index: number,
      path: string
    ) {
      this.steps[step_index][step_model_index].input[name] = {
        source_step_model_index,
        path
      }
    },
    disconnectInput(step_index: number, step_model_index: number, e: string) {
      delete this.steps[step_index][step_model_index].input[e]
    }
  },
  async mounted() {
    // Find set of models to load from steps
    const set = new Set()
    for (const step of this.modelValue)
      for (const model of step) set.add(model.model)

    try {
      if (this.modelValue.length <= 0) await this.store.listModel()
      await Promise.all(
        [...set]
          .filter((v) => v)
          .map((model) => this.store.readModel(model as string))
      )
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-steps
  .pipeline-step
    padding-top 48px

    .pipeline-step-controls
      position relative
      display flex
      align-items center

      &::before
        content ''
        height 1px
        background rgba(0, 0, 0, .1)
        position absolute
        top 50%
        left 0
        right 0

      .text-h5
        margin 0 !important
        padding-right 24px
        background #fff
        position relative

      .v-btn
        background-color #fff

    .pipeline-step-models
      padding-top 48px
      display grid
      grid-gap 48px
      grid-template-columns 1fr 1fr 1fr

      .pipeline-model
        width 100%
        min-width 0

    .pipeline-add-step
      padding 48px
      aspect-ratio unset

  &.mobile
    .pipeline-step
      padding-top 24px

      .pipeline-step-models
        padding-top 24px
        grid-gap 24px
        grid-template-columns 1fr

      .pipeline-add-step
        padding 24px
</style>
