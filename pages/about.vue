<template lang="pug">
.about
  .text-h4 Why does this service exist?
  .text-subheader Posted March 9, 2023 by <a href="https://replicate.com/pwntus">@pwntus</a>
  p Replicate runs machine learning models in the cloud. They have a library of open-source models that you can run with a few lines of code. If you're building your own machine learning models, Replicate makes it easy to deploy them at scale. <a href="https://replicate.com/home">Learn more</a>.
  p Replicate.tools (this service) is not associated with Replicate.com. This is just a value added tool build on top of Replicate.
  p There currently are no way of easily 'piping' together the output of one model to the input of another model without writing computer code. This service lets you visually create a pipeline with multiple steps that can be connected with each other.
  img(src="/img/pipeline.jpg")
  p Each step can have multiple models and will wait for each model to complete before moving to the next step. Models in a step are invoked at the same time in parallel.
  p This is an experiment! Use at your own discretion.
</template>

<script setup lang="ts"></script>

<style lang="stylus" scoped>
.about
  padding 48px 0 0
  max-width 48rem

  .text-subheader
    color rgba(0, 0, 0, 0.45)

  img
    margin 48px auto
    max-width 100%
    display block

  p
    padding-top 24px
    margin 0

  a, a:visited, a:active
    text-decoration underline
    text-decoration-color rgba(0, 0, 0, 0.45)
    text-decoration-thickness 0.6px
    text-underline-offset 0.15em
    -webkit-text-decoration-color rgba(0, 0, 0, 0.45)

    &:hover
      text-decoration-color black
      text-decoration-thickness 2px
      -webkit-text-decoration-color black
</style>
