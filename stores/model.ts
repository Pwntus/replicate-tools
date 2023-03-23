import { defineStore } from 'pinia'

export const useModelStore = defineStore('model-store', () => {
  const models = ref<any[]>([])

  const readModel = async (id: string) => {
    const response: any = await fetch(`/api/model/${encodeURIComponent(id)}`)
    const json = await response.json()

    const index = models.value.findIndex(
      (item) =>
        `${item.username}/${item.name}` === `${json?.owner}/${json?.name}`
    )
    if (index > -1) models.value[index] = { ...models.value[index], ...json }
  }

  const listModel = async () => {
    const response = (await fetch('/api/model')) as any
    const json = await response.json()
    models.value = json
  }

  return { models, readModel, listModel }
})
