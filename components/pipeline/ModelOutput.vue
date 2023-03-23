<template lang="pug">
.pipeline-model-output
  //- Array
  template(v-if="output.type === 'array'")
    .pipeline-model-output-entry
      v-icon(
        v-if="isChild"
        icon="mdi-arrow-right-bottom"
        color="#000"
        start
      )
      | List ({{ output.type }})
      v-spacer
      v-text-field(
        v-if="!hideControls"
        v-model.number="n"
        min="0"
        type="number"
        variant="outlined"
        density="compact"
        hide-details
      )
    pipeline-model-output.pl-4(
      @select="bubbleEntry"
      :output="output.items"
      :hide-controls="hideControls"
      :is-child="true"
    )
  //- Object
  template(v-else-if="output.type === 'object'")
    .pipeline-model-output-entry
      v-icon(
        v-if="isChild"
        icon="mdi-arrow-right-bottom"
        color="#000"
        start
      )
      | Map ({{ output.type }})
    pipeline-model-output.pl-4(
      v-for="([ key, value ], index) in Object.entries(output.properties)"
      @select="bubbleEntry"
      :key="`pipeline-model-output-entry-${index}`"
      :output="{ title: key, ...value }"
      :hide-controls="hideControls"
      :is-child="true"
    )
  //- String or unknown
  template(v-else)
    .pipeline-model-output-entry
      v-icon(
        v-if="isChild"
        color="#000"
        left
      ) mdi-arrow-right-bottom
      | {{ output.title }} {{ output.format }} ({{ output.type }})
      v-spacer
      v-btn(
        v-if="!hideControls"
        @click="selectEntry"
        color="#000"
        variant="text"
      ) Select
</template>

<script lang="ts">
export default {
  props: ['output', 'hideControls', 'isChild'],
  data: () => ({
    n: 0
  }),
  methods: {
    selectEntry() {
      const path = this.isChild ? '' : this.output.title || null
      this.$emit('select', path)
    },
    bubbleEntry(path: string) {
      let prefix = ''
      if (this.output.type === 'array') prefix = `[${this.n}]`
      if (
        this.output.type !== 'array' &&
        this.output.type !== 'object' &&
        this.output.title
      )
        prefix = `${this.output.title}`

      path = path || ''
      const delimiter = prefix !== '' && path !== '' ? '.' : ''

      this.$emit('select', `${prefix}${delimiter}${path}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pipeline-model-output
  padding-top 8px
  color #000
  font-size 16px

  .pipeline-model-output-entry
    height 36px
    display flex
    align-items center

    .v-icon
      margin-bottom 4px

    .v-text-field
      max-width 65px
      text-align center

      :deep(input)
        min-height 30px
        height 30px
</style>
