import { getModel, listVersions } from 'replicate-api'

export default defineEventHandler(async (event) => {
  try {
    const model = decodeURIComponent(event.context.params?.model || '')

    const [data, versions] = await Promise.all([
      getModel({
        token: useRuntimeConfig().replicateApiToken,
        model
      }),
      listVersions({
        token: useRuntimeConfig().replicateApiToken,
        model
      })
    ])

    return { ...data, ...versions }
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
