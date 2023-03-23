import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const userId = event.node.req.headers['user-id']
    const body = await readBody(event)

    const pipeline = {
      ...body,
      steps: JSON.stringify(body.steps),
      userId
    }
    const res = await prisma.pipeline.create({
      data: pipeline
    })

    return res
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
