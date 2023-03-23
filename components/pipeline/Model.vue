<template lang="pug">
.pipeline-model
  v-img.mb-8(
    v-if="cover_image"
    :src="cover_image"
    height="140"
    cover
  )
  v-combobox(
    v-model="model_proxy"
    :items="store.models"
    :item-title="formatModelTitle"
    :disabled="immutable"
    label="Model"
    prepend-inner-icon="mdi-cube-outline"
    variant="outlined"
  )
    template(#item="{ item, props }")
      v-list-item(
        v-bind="props"
        :title="formatModelTitle(item.value)"
        :subtitle="item.value.description"
      )
        template(#prepend)
          v-avatar(
            :image="formatModelCover(item.value)"
            :icon="formatModelCover(item.value) ? null : 'mdi-cube-outline'"
          )

  template(v-if="schema")
    v-select(
      v-model="version_proxy"
      :items="resolved_model.versions"
      :disabled="immutable"
      item-title="id"
      item-value="id"
      label="Version"
      prepend-inner-icon="mdi-cube-outline"
      variant="outlined"
    )
      template(#item="{ item, props }")
        v-list-item(
          v-bind="props"
          :title="item.title"
          :subtitle="item.raw.createdAt"
        )
    pipeline-model-input(
      v-model="input_proxy"
      @connect="(e) => $emit('connect', e)"
      @disconnect="(e) => $emit('disconnect', e)"
      :schema="schema"
      :allow-connecting="allowConnecting"
      :immutable="immutable"
    )
    .pipeline-model-output-wrapper
      .text-h5 Output
      pipeline-model-output(
        :output="output"
        :is-child="false"
        :hide-controls="true"
      )

  v-btn(
    v-if="!immutable"
    @click="$emit('remove')"
    color="#000"
    size="x-large"
    variant="text"
    block
  )
    v-icon(
      icon="mdi-delete-outline"
      left
    )
    | Remove model
</template>

<script lang="ts">
import { get } from 'lodash'
import { useModelStore } from '~/stores/model'

export default {
  setup() {
    const store = useModelStore()
    return { store }
  },
  props: ['modelValue', 'allowConnecting', 'immutable'],
  data: () => ({
    loading: false
  }),
  computed: {
    resolved_model() {
      const index = this.store.models.findIndex(
        (item) => `${item.username}/${item.name}` === this.modelValue.model
      )
      return index > -1 ? this.store.models[index] : null
    },
    cover_image() {
      return get(this.resolved_model, 'cover_image.url', null)
    },
    schema() {
      const versions = get(this.resolved_model, 'versions', [])
      const index = versions.findIndex(
        (item: any) => item.id === this.modelValue.version
      )
      return index > -1 ? versions[index] : null
    },
    output() {
      return get(this.schema, 'schema.components.schemas.Output', null)
    },
    model_proxy: {
      get() {
        return this.modelValue.model || 'Select model'
      },
      set(value: any) {
        const username = get(value, 'username', null)
        const name = get(value, 'name', null)
        const model = username && name ? `${username}/${name}` : null
        this.$emit('update:modelValue', { ...this.modelValue, model })
      }
    },
    version_proxy: {
      get() {
        return this.modelValue.version || 'Select version'
      },
      set(version: string) {
        this.$emit('update:modelValue', { ...this.modelValue, version })
      }
    },
    input_proxy: {
      get() {
        return this.modelValue.input
      },
      set(input: any) {
        this.$emit('update:modelValue', { ...this.modelValue, input })
      }
    }
  },
  watch: {
    ['modelValue.model']: {
      immediate: true,
      async handler(model) {
        if (!model) return

        this.loading = true
        try {
          await this.store.readModel(model)
          this.version_proxy = this.resolved_model.version

          // Set output
          this.$nextTick(() => {
            const output = get(
              this.schema,
              'schema.components.schemas.Output',
              []
            )
            this.$emit('update:modelValue', { ...this.modelValue, output })
          })
        } catch (e) {
          console.log(e)
        } finally {
          this.loading = false
        }
      }
    },
    ['modelValue.version']: {
      handler() {
        // Reset input
        const input = {}

        // Set output
        const output = get(this.schema, 'schema.components.schemas.Output', [])
        this.$emit('update:modelValue', { ...this.modelValue, input, output })
      }
    }
  },
  methods: {
    formatModelCover(item: any) {
      return get(item, 'cover_image.url', null)
    },
    formatModelTitle(item: any) {
      return get(item, 'username', '') + '/' + get(item, 'name', '')
    },
    formatModelVersionTitle(item: any) {
      return get(item, 'id', null)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-model
  .v-img
    border-radius 4px

  .pipeline-model-output-wrapper
    margin-bottom 30px
    padding 16px
    background rgba(0, 0, 0, .05)
    border-radius 4px

    .text-h5
      margin-bottom 0
</style>
