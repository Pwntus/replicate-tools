<template lang="pug">
.pipeline-read(
  v-if="pipeline"
  :class="{ mobile: $vuetify.display.mobile }"
)
  .text-h4 Pipeline: {{ pipeline.title }}

  pipeline-steps(
    v-model="pipeline.steps"
    :immutable="true"
  )

  v-text-field.pt-12(
    v-model="replicate_api_token"
    label="Replicate API token"
    variant="outlined"
  )

  .sheet-button.dark(
    @click="createPrediction"
    :disabled="loading"
  )
    .text-center(v-if="loading")
      v-progress-circular(indeterminate)
    .text-center(v-else) Submit
</template>

<script lang="ts">
import { usePipelineStore } from '~/stores/pipeline'
import { usePredictionStore } from '~/stores/prediction'

export default {
  setup() {
    const route = useRoute()
    const pipelineStore = usePipelineStore()
    const predictionStore = usePredictionStore()

    return { route, pipelineStore, predictionStore }
  },
  data: () => ({
    loading: false,
    replicate_api_token: null,
    pipeline: null as any | null
  }),
  computed: {
    input() {
      if (!this.pipeline) return {}

      const data: any = {}
      for (const [i, step] of this.pipeline.steps.entries()) {
        data[i] = {}
        for (const [j, model] of step.entries()) data[i][j] = model.input
      }
      return data
    }
  },
  watch: {
    'route.params.id': {
      immediate: true,
      handler() {
        this.readPipeline()
      }
    }
  },
  methods: {
    async readPipeline() {
      const id = this.route.params.id
      this.loading = true
      try {
        this.pipeline = await this.pipelineStore.readPipeline(id as string)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async createPrediction() {
      if (!this.replicate_api_token || this.replicate_api_token === '') return

      this.loading = true
      try {
        const prediction = await this.predictionStore.createPrediction({
          replicate_api_token: this.replicate_api_token,
          id: this.pipeline?.id || null,
          input: this.input
        })
        this.$router.push(`/prediction/${prediction.id}`)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-read
  .sheet-button
    padding 48px
    aspect-ratio unset

  &.mobile
    .sheet-button
      padding 24px
      aspect-ratio unset
</style>
