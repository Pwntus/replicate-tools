<template lang="pug">
.pipeline-list(:class="{ mobile: $vuetify.display.mobile }")
  nuxt-page(v-if="route.params.id")
  template(v-else)

    .text-h4 Pipelines
    v-table
      thead
        tr
          th.text-left Title
          th.text-left Steps
          th.text-right
          th.text-right Created
      tbody
        tr(
          v-for="(item, index) in list"
          :key="`item-${index}`"
        )
          td
            nuxt-link(:to="`/pipeline/${item.id}`") {{ item.title }}
          td {{ item.steps.length }}
          td.text-right
            v-btn(
              @click="deletePipeline(item.id)"
              color="#000"
              variant="text"
            )
              | Delete
              v-icon(
                icon="mdi-delete-outline"
                end
              )
          td.text-right {{ formatDate(item.created_at) }}
</template>

<script lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { usePipelineStore } from '~/stores/pipeline'

dayjs.extend(relativeTime)

export default {
  setup() {
    const route = useRoute()
    const store = usePipelineStore()
    return { route, store }
  },
  data: () => ({
    loading: false,
    list: []
  }),
  methods: {
    formatDate(d: string) {
      try {
        return dayjs(d).fromNow() // .format('D MMM YYYY HH:ss')
      } catch (e) {
        return '?'
      }
    },
    async listPipeline() {
      if (this.loading) return

      this.loading = true
      try {
        const data: never[] = await this.store.listPipeline()
        this.list.push(...data)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    deletePipeline(id: string) {
      const index = this.list.findIndex((pipeline: any) => pipeline.id === id)
      if (index > -1) this.list.splice(index, 1)

      this.store.deletePipeline(id)
    }
  },
  mounted() {
    this.listPipeline()
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-list
  .v-table
    margin-top 48px

  &.mobile
    .v-table
      margin-top 24px
</style>
