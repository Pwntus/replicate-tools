<template lang="pug">
.pipeline-create(:class="{ mobile: $vuetify.display.mobile }")
  .text-h4 Create a pipeline

  v-text-field.pt-12(
    v-model="pipeline.title"
    label="Pipeline title"
    variant="outlined"
  )

  pipeline-steps(
    v-model="pipeline.steps"
    :immutable="false"
  )
  
  .sheet-button.dark(
    @click="doCreatePipeline"
    :disabled="loading"
  )
    .text-center(v-if="loading")
      v-progress-circular(indeterminate)
    .text-center(v-else) Create pipeline
</template>

<script lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { usePipelineStore } from '~/stores/pipeline'

export default {
  setup() {
    const store = usePipelineStore()
    return { store }
  },
  data: () => ({
    loading: false,
    pipeline: {
      title: 'Test',
      steps: [
        [
          {
            id: uuidv4(),
            model: null,
            version: null,
            input: {},
            output: {}
          }
        ]
      ]
    }
  }),
  methods: {
    async doCreatePipeline() {
      if (!this.pipeline.title) return

      this.loading = true
      try {
        const pipeline = await this.store.createPipeline(this.pipeline)
        this.$router.push(`/pipeline/${pipeline.id}`)
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
.index
  .sheet-button
    margin-top 48px
    padding 48px
    aspect-ratio unset

  &.mobile
    .sheet-button
      margin-top 24px
      padding 24px
</style>
