import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useAppStore = defineStore('app-store', () => {
  const token = ref<string | null>(null)

  const initGuestToken = async () => {
    if (!localStorage) return

    let guest_token = localStorage.getItem('GUEST_TOKEN')
    if (!guest_token || guest_token === '') {
      guest_token = uuidv4()
      localStorage.setItem('GUEST_TOKEN', guest_token)
    }
    token.value = guest_token
  }

  return { token, initGuestToken }
})
