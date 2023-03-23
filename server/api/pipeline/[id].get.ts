import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = decodeURIComponent(event.context.params?.id || '')
    // const userId = event.node.req.headers['user-id'] || ''

    const res = await prisma.pipeline.findFirst({
      where: { id }
    })

    return res
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
