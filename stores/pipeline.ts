import { defineStore } from 'pinia'
import { useAppStore } from '~/stores/app'

export const usePipelineStore = defineStore('pipeline-store', () => {
  const appStore = useAppStore()

  const createPipeline = async (body: any) => {
    const response: any = await fetch('/api/pipeline', {
      method: 'post',
      headers: {
        'user-id': appStore.token || ''
      },
      body: JSON.stringify(body)
    })
    const json = await response.json()
    return json
  }

  const readPipeline = async (id: string) => {
    const response: any = await fetch(
      `/api/pipeline/${encodeURIComponent(id)}`,
      {
        method: 'get',
        headers: {
          'user-id': appStore.token || ''
        }
      }
    )
    const json = await response.json()
    json.steps = JSON.parse(json.steps)
    return json
  }

  const deletePipeline = async (id: string) => {
    const response: any = await fetch(
      `/api/pipeline/${encodeURIComponent(id)}`,
      {
        method: 'delete',
        headers: {
          'user-id': appStore.token || ''
        }
      }
    )
    const json = await response.json()
    return json
  }

  const listPipeline = async (queryStringParams: any = '') => {
    const response: any = await fetch(
      `/api/pipeline?${new URLSearchParams(queryStringParams)}`,
      {
        headers: {
          'user-id': appStore.token || ''
        }
      }
    )
    const json = await response.json()
    const parsed = json.map((item: any) => {
      item.steps = JSON.parse(item.steps)
      return item
    })
    return parsed
  }

  return { createPipeline, readPipeline, deletePipeline, listPipeline }
})
