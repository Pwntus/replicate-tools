import { PrismaClient } from '@prisma/client'
import { default as _ } from 'lodash'
import { predict } from 'replicate-api'

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : useRuntimeConfig().ngrokHost

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const userId = event.node.req.headers['user-id']
    const { replicate_api_token, id, input } = await readBody(event)

    // get pipeline
    const pipeline = await prisma.pipeline.findFirst({
      where: { id }
    })
    if (!pipeline) throw new Error('Pipeline not found')
    const steps = JSON.parse(pipeline.steps)

    // create data object
    const data = {} as any
    for (const [i, step] of steps.entries()) {
      data[i] = {}
      for (const [j, model] of step.entries()) data[i][j] = null
    }

    // create prediction
    const prediction = {
      pipelineId: id,
      input: JSON.stringify(input),
      data: JSON.stringify(data),
      userId
    }
    const { id: prediction_id } = await prisma.prediction.create({
      // @ts-ignore
      data: prediction
    })

    // launch step #1
    const step_index = 0
    const step = _.get(steps, `[${step_index}]`, [])
    const d = await Promise.all(
      step.map((step_model: any, step_model_index: any) => {
        const prediction_input = _.get(
          input,
          `${step_index}.${step_model_index}`,
          {}
        )
        const merged_input = { ...step_model.input, ...prediction_input }

        return predict({
          token: replicate_api_token,
          version: step_model.version,
          input: merged_input,
          webhook: `${WEBHOOK_HOST}/api/w?t=${replicate_api_token}&i=${prediction_id}&s=${step_index}&m=${step_model_index}`,
          webhookEvents: ['completed']
        })
      })
    )

    console.log('Init step #1', JSON.stringify(d, null, 2))

    return { ...prediction, id: prediction_id }
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
