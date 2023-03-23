import { defineStore } from 'pinia'
import { useAppStore } from '~/stores/app'

export const usePredictionStore = defineStore('prediction-store', () => {
  const appStore = useAppStore()

  const createPrediction = async (body: any) => {
    const response: any = await fetch('/api/prediction', {
      method: 'post',
      headers: {
        'user-id': appStore.token || ''
      },
      body: JSON.stringify(body)
    })
    const json = await response.json()
    return json
  }

  const readPrediction = async (id: string) => {
    const response: any = await fetch(
      `/api/prediction/${encodeURIComponent(id)}`,
      {
        method: 'get',
        headers: {
          'user-id': appStore.token || ''
        }
      }
    )
    const json = await response.json()
    json.input = JSON.parse(json.input)
    json.data = JSON.parse(json.data)
    return json
  }

  const listPrediction = async (queryStringParams: any = '') => {
    const response: any = await fetch(
      `/api/prediction?${new URLSearchParams(queryStringParams)}`,
      {
        headers: {
          'user-id': appStore.token || ''
        }
      }
    )
    const json = await response.json()
    const parsed = json.map((item: any) => {
      item.input = JSON.parse(item.input)
      item.data = JSON.parse(item.data)
      return item
    })
    return parsed
  }

  return { createPrediction, readPrediction, listPrediction }
})
