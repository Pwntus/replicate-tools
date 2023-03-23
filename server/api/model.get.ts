import scrapeIt from 'scrape-it'

export default defineEventHandler(async (event) => {
  try {
    const result = (await scrapeIt('https://replicate.com/explore', {
      models: '#models'
    })) as any
    const data = JSON.parse(result.data.models)

    return data
  } catch (e: any) {
    console.error(e)
    return { error: e.message }
  }
})
