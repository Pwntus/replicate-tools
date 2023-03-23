<template lang="pug">
.pipeline-prediction-list(:class="{ mobile: $vuetify.display.mobile }")
  nuxt-page(v-if="route.params.id")
  template(v-else)

    .text-h4 Predictions
    v-table
      thead
        tr
          th.text-left ID
          th.text-left Steps
          th.text-left Status
          th.text-left Run time
          th.text-right Created
      tbody
        tr(
          v-for="(item, index) in list"
          :key="`item-${index}`"
        )
          td
            nuxt-link(:to="`/prediction/${item.id}`") {{ item.id }}
          td {{ Object.keys(item.data).length }}
          td {{ formatStatus(item.data) }}
          td {{ formatRuntime(item) }}
          td.text-right {{ formatDate(item.created_at) }}
</template>

<script lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { usePredictionStore } from '~/stores/prediction'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export default {
  setup() {
    const route = useRoute()
    const store = usePredictionStore()
    return { route, store }
  },
  data: () => ({
    loading: false,
    list: []
  }),
  methods: {
    formatStatus(data: any) {
      let n_models_left = 0
      for (const step_index of Object.keys(data))
        n_models_left += Object.values(data[step_index]).filter(
          (v) => !v
        ).length
      return n_models_left > 0 ? `${n_models_left} models left` : 'Succeeded'
    },
    formatRuntime(prediction: any) {
      if (this.formatStatus(prediction.data) !== 'Succeeded') return ''

      const step_index = Object.keys(prediction.data).pop() || 0
      const completed_ats = Object.values(prediction.data[step_index]).map(
        (model: any) => new Date(model.completedAt).getTime()
      )
      const latest_complete = Math.max(...completed_ats)
      const duration =
        latest_complete - new Date(prediction.createdAt).getTime()
      return (duration / 1000).toFixed(2) + ' seconds'
    },
    formatDate(d: string) {
      try {
        return dayjs(d).fromNow() // .format('D MMM YYYY HH:ss')
      } catch (e) {
        return '?'
      }
    },
    async listPrediction() {
      if (this.loading) return

      this.loading = true
      try {
        const data: never[] = await this.store.listPrediction()
        this.list.push(...data)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.listPrediction()
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-prediction-list
  .v-data-table
    margin-top 48px

  &.mobile
    .v-data-table
      margin-top 24px
</style>
