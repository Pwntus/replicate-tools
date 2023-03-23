export {}

declare global {
  type Model = {
    id: string
    model: object | null
    version: string | null
    input: object
    output: object
  }

  type Step = Model[]

  type Pipeline = {
    title: string
    steps: Step[]
  }
}
