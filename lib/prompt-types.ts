export type PromptCategory = {
  id: string
  label: string
  emoji: string
}

export type PromptTag = string

export type Prompt = {
  id: string
  title: string
  category: string
  categoryLabel: string
  tags: string[]
  description: string
  promptText: string
  likes: number
  views: number
  copies: number
  image: string
  color: string
}
