import { GenerateRequest, GenerateResponse, JiraConfig, JiraStory, JiraStoryDetails } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api'

export async function generateTests(request: GenerateRequest): Promise<GenerateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-tests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || 'Failed to generate tests')
    }

    const data: GenerateResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error generating tests:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function fetchJiraStories(config: JiraConfig): Promise<JiraStory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/jira/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch JIRA stories')
    }

    const data = await response.json()
    return data.stories
  } catch (error) {
    console.error('Error fetching JIRA stories:', error)
    throw error
  }
}

export async function fetchJiraStoryDetails(config: JiraConfig, issueKey: string): Promise<JiraStoryDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/jira/story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...config, issueKey }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch story details')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching story details:', error)
    throw error
  }
}