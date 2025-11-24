export interface GenerateRequest {
  storyTitle: string
  acceptanceCriteria: string
  description?: string
  additionalInfo?: string
}

export interface TestCase {
  id: string
  title: string
  category: 'Positive' | 'Negative' | 'Edge' | 'Authorization' | 'Non-Functional'
  steps: string[]
  expectedResult: string
  testData?: string
}

export interface GenerateResponse {
  cases: TestCase[]
  model?: string
  promptTokens: number
  completionTokens: number
}

export interface JiraConfig {
  jiraUrl: string
  email: string
  apiToken: string
}

export interface JiraStory {
  id: string
  key: string
  summary: string
  created?: string
}

export interface JiraStoryDetails {
  title: string
  description: string
  acceptanceCriteria: string
}