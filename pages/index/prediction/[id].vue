<template lang="pug">
.pipeline-prediction-read(
  v-if="prediction"
  :class="{ mobile: $vuetify.display.mobile }"
)
  .text-h4 Prediction
  
  .pipeline-step(
    v-for="[step_index, step] of Object.entries(prediction.data)"
    :key="`pipeline-step-${step_index}`"
  )
    .pipeline-step-controls
      .text-h5 Step \#{{ parseInt(step_index) + 1 }}
    .pipeline-step-models
      .pipeline-step-model(
        v-for="[step_model_index, model] of Object.entries(step)"
        :key="`pipeline-step-model-${step_model_index}`"
      )
        .pipeline-model-input-wrapper(v-if="model")
          .pipeline-model-input(
            v-for="[input_name, input_value] of Object.entries(model.input || {})"
            :key="`pipeline-model-input-${input_name}`"
          )
            | {{ input_name }}
            .pipeline-model-input-value {{ input_value }}
        .pipeline-model-output-wrapper
          .text-h5 Output
          pre {{ model.output }}
</template>

<script>
import { usePredictionStore } from '~/stores/prediction'

export default {
  setup() {
    const route = useRoute()
    const predictionStore = usePredictionStore()

    return { route, predictionStore }
  },
  data: () => ({
    loading: false,
    interval: null,
    prediction: null
  }),
  watch: {
    'route.params.id': {
      immediate: true,
      handler() {
        this.readPrediction()
      }
    }
  },
  methods: {
    async readPrediction() {
      const id = this.route.params.id
      this.loading = true
      try {
        this.prediction = await this.predictionStore.readPrediction(id)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.readPrediction()
    }, 5000)
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval)
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-prediction-read
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
        margin 0
        padding-right 24px
        background #fff
        position relative

    .pipeline-step-models
      padding-top 48px
      display grid
      grid-gap 48px
      grid-template-columns 1fr 1fr 1fr

      .pipeline-step-model
        width 100%
        min-width 0

        .pipeline-model-input-wrapper
          margin-bottom 24px

          .pipeline-model-input
            margin-bottom 12px

            .pipeline-model-input-value
              margin-top 12px
              padding 6px 12px
              background rgba(0, 0, 0, .05)
              font-size 14px
              border-radius 4px
              overflow auto

        .pipeline-model-output-wrapper
          margin-bottom 30px
          padding 16px
          background rgba(0, 0, 0, .05)
          font-size 14px
          border-radius 4px
          overflow auto

          .text-h5
            margin-bottom 0

  &.mobile

    .pipeline-step
      padding-top 24px

      .pipeline-step-models
        padding-top 24px
        grid-gap 24px
        grid-template-columns 1fr

        .pipeline-step-model
          .pipeline-model-input-wrapper
            margin-bottom 12px

            .pipeline-model-input
              margin-bottom 6px

              .pipeline-model-input-value
                margin-top 6px
</style>
