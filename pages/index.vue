<template lang="pug">
.index
  v-tabs(background-color="transparent")
    v-tab(to="/")
      v-icon(icon="mdi-plus" start)
      | Create
    v-tab(to="/pipeline")
      v-icon(icon="mdi-pipe" start)
      | Pipelines
    v-tab(to="/prediction")
      v-icon(icon="mdi-rocket-launch-outline" start)
      | Predictions
  nuxt-page
</template>

<script setup lang="ts"></script>

<style lang="stylus" scoped></style>
