<template lang="pug">
.pipeline-model-input
  .pipeline-model-input-entry(
    v-for="(entry, index) in entries"
    :key="`pipeline-model-input-entry-${index}`"
  )
    //- Connected entry
    template(v-if="typeof value_proxy[entry.name] === 'object'")
      v-text-field.mb-4(
        :value="`Path: ${value_proxy[entry.name].path}`"
        :placeholder="entry.description"
        :label="entry.title"
        :messages="`Connected to previous step's model nr. ${value_proxy[entry.name].source_step_model_index}`"
        variant="outlined"
        disabled
      )
      //- Disconnect button
      v-btn(
        @click="$emit('disconnect', entry.name)"
        color="#000"
        variant="text"
      )
        v-icon(icon="mdi-power-plug-off-outline")
    //- Not connected entry
    template(v-else)
      //- String
      v-text-field(
        v-if="entry.type === 'string'"
        v-model="value_proxy[entry.name]"
        :placeholder="entry.description"
        :label="entry.title"
        variant="outlined"
      )
      //- Number (dec)
      v-text-field(
        v-else-if="entry.type === 'number'"
        v-model.number="value_proxy[entry.name]"
        :placeholder="entry.description"
        :label="entry.title"
        :max="entry.maximum || Infinity"
        :min="entry.minimum || -Infinity"
        type="number"
        step="0.01"
        variant="outlined"
      )
      //- Integer (no-dec)
      v-text-field(
        v-else-if="entry.type === 'integer'"
        v-model.number="value_proxy[entry.name]"
        :placeholder="entry.description"
        :label="entry.title"
        :max="entry.maximum || Infinity"
        :min="entry.minimum || -Infinity"
        type="number"
        variant="outlined"
      )
      //- Select
      v-select(
        v-else-if="entry.type === 'select'"
        v-model="value_proxy[entry.name]"
        :items="entry.enum"
        :label="entry.title"
        variant="outlined"
      )
      //- Boolean
      v-switch.mt-0.mb-4(
        v-else-if="entry.type === 'boolean'"
        v-model="value_proxy[entry.name]"
        :label="entry.title"
        :messages="entry.description"
        color="secondary"
        inset
      )
      //- Unknown
      pre(v-else) {{ entry }}
      //- Connect button
      v-btn(
        v-if="allowConnecting"
        @click="$emit('connect', entry.name)"
        color="#000"
        variant="text"
      )
        v-icon(icon="mdi-power-plug-outline")
</template>

<script lang="ts">
import { get } from 'lodash'

type Entry = {
  name: string
  required: string
  title: string
  type: string
  default?: any
  allOf?: boolean
  'x-order': number
}

export default {
  props: ['modelValue', 'schema', 'allowConnecting', 'immutable'],
  computed: {
    entries() {
      const required = get(
        this.schema,
        'schema.components.schemas.Input.required',
        []
      )
      const properties = get(
        this.schema,
        'schema.components.schemas.Input.properties',
        []
      ) as { [key: string]: Entry }

      const input = []
      for (const [name, value] of Object.entries(properties)) {
        let entry = { ...value, name }
        entry.required = required.includes(name)
        entry.title = `${entry.required ? '* ' : ''}${
          entry.title || entry.name
        } (${entry.type})`

        if (value.allOf) {
          const ref = get(value, 'allOf[0].$ref', '').split('/').pop()
          if (ref) {
            const refval = get(
              this.schema,
              `schema.components.schemas['${ref}']`,
              null
            )
            entry = { ...entry, ...refval, type: 'select' }
          }
          delete entry.allOf
        }

        input.push(entry)
      }
      const sorted = input.sort((a, b) => a['x-order'] - b['x-order'])

      return sorted
    },
    value_proxy: {
      get() {
        return this.modelValue
      },
      set(value: any) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    schema: {
      immediate: true,
      handler() {
        // Set default values
        const defaults: any = {}
        for (const entry of this.entries)
          if (entry.default) {
            // If isImmutable (read pipeline) don't overwrite with model defaults
            // If not isImmutable (create pipeline) do overwrite with model defaults
            const default_value = this.immutable
              ? get(this.value_proxy, entry.name, entry.default)
              : entry.default
            defaults[entry.name] = default_value
          }

        this.value_proxy = { ...this.value_proxy, ...defaults }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-model-input
  .pipeline-model-input-entry
    display grid
    grid-template-columns auto min-content

    .v-btn
      height 56px
      margin-left 24px
</style>
