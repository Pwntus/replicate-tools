import { PrismaClient } from '@prisma/client'
import { default as _ } from 'lodash'
import { processWebhook, predict } from 'replicate-api'

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : useRuntimeConfig().ngrokHost

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const replicate_api_token = getQuery(event).t || ('' as any)
    const id = getQuery(event).i || ('' as any)
    const step_index = parseInt(getQuery(event).s as string)
    const step_model_index = parseInt(getQuery(event).m as string)

    const body = await readBody(event)

    console.log(
      `Params: replicate_api_token = ***, id = ${id}, step_index = ${step_index}, step_model_index = ${step_model_index}, body = ${JSON.stringify(
        body
      )}`
    )

    // @ts-ignore
    const webhook_prediction = processWebhook({ body })

    // update prediction data object

    webhook_prediction.createdAt = new Date(webhook_prediction.createdAt || 0)
    webhook_prediction.startedAt = new Date(webhook_prediction.startedAt || 0)
    webhook_prediction.completedAt = new Date(
      webhook_prediction.completedAt || 0
    )
    const data = { ...webhook_prediction, logs: null } // remove logs (can be very long)

    const prediction = await prisma.prediction.findFirst({
      where: { id }
    })
    if (!prediction) throw new Error('Prediction not found')
    const prediction_data = JSON.parse(prediction.data)
    const prediction_input = JSON.parse(prediction.input)

    prediction_data[step_index][step_model_index] = data

    await prisma.prediction.update({
      data: { data: JSON.stringify(prediction_data) },
      where: { id }
    })

    // figure out step position (based on prediction.data)

    const n_steps = Object.keys(prediction_data).length
    const is_last_step = step_index + 1 >= n_steps

    // figure out if every model in current step has gotten webhook data
    // (filter step models by null and check if list is empty)
    const is_last_step_model =
      Object.values(prediction_data[step_index]).filter((v) => !v).length <= 0

    // not last model in step, continue
    if (!is_last_step_model) {
      console.log('Model done but not pipeline!')
      return {}
    }

    // last model in step and last step, finish pipeline
    if (is_last_step) {
      console.log('Pipeline is DONE!')
      return {}
    }

    // last model in step, but not last step.

    // fetch pipeline
    const pipeline = await prisma.pipeline.findFirst({
      where: { id: prediction.pipelineId }
    })
    if (!pipeline) throw new Error('Pipeline not found')
    const pipeline_steps = JSON.parse(pipeline.steps)

    // Launch new step
    const new_step_index = step_index + 1
    const step = _.get(pipeline_steps, `[${new_step_index}]`, [])
    const d = await Promise.all(
      step.map((step_model: any, step_model_index: any) => {
        try {
          const step_prediction_input = _.get(
            prediction_input,
            `${new_step_index}.${step_model_index}`,
            {}
          )
          const merged_input = { ...step_model.input, ...step_prediction_input }
          console.log(
            'Merged input (pipeline + prediction)',
            JSON.stringify(merged_input, null, 2)
          )

          // Check connection in merged input and convert to actual value (output from previous step)
          for (const [key, value] of Object.entries(merged_input)) {
            if (_.isObject(value)) {
              const source_step_model_index = _.get(
                value,
                'source_step_model_index',
                null
              )
              const path = _.get(value, 'path', null)
              if (source_step_model_index === null || path === null) {
                console.log(
                  'Failed to translate conncetion into real value: ',
                  key
                )
                merged_input[key] = null
                continue
              }
              const delimiter = !path || path === '' ? '' : '.'
              const real_value = _.get(
                prediction_data,
                `['${step_index}']['${source_step_model_index}'].output${delimiter}${path}`,
                null
              )
              merged_input[key] = real_value
            }
          }
          console.log(
            'Merged input after transforming connections',
            JSON.stringify(merged_input, null, 2)
          )

          return predict({
            token: replicate_api_token,
            version: step_model.version,
            input: merged_input,
            webhook: `${WEBHOOK_HOST}/api/w?t=${replicate_api_token}&i=${prediction.id}&s=${new_step_index}&m=${step_model_index}`,
            webhookEvents: ['completed']
          })
        } catch (e) {
          console.log(e)
          return null
        }
      })
    )

    return {}
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
