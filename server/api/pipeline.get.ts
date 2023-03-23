import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const userId = event.node.req.headers['user-id'] || ''
    const res = await prisma.pipeline.findMany({
      where: { userId: userId as string }
    })

    return res
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
