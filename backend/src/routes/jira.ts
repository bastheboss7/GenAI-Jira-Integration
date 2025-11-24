import express from 'express'
import fetch from 'node-fetch'
import { z } from 'zod'

export const jiraRouter = express.Router()

// Validation schemas
const jiraConfigSchema = z.object({
    jiraUrl: z.string().url(),
    email: z.string().email(),
    apiToken: z.string().min(1)
})

const fetchStoriesSchema = jiraConfigSchema

const fetchStoryDetailsSchema = jiraConfigSchema.extend({
    issueKey: z.string().min(1)
})

// Helper to create Basic Auth header
const getAuthHeader = (email: string, token: string) => {
    return `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`
}

// POST /api/jira/stories - Fetch stories assigned to user
jiraRouter.post('/stories', async (req, res) => {
    try {
        const {
            jiraUrl: bodyJiraUrl,
            email: bodyEmail,
            apiToken: bodyApiToken
        } = req.body

        const jiraUrl = bodyJiraUrl || process.env.jira_url
        const email = bodyEmail || process.env.email
        const apiToken = bodyApiToken || process.env.jira_TOKEN

        if (!jiraUrl || !email || !apiToken) {
            return res.status(400).json({ error: 'Missing JIRA configuration (jiraUrl, email, apiToken)' })
        }

        const config = fetchStoriesSchema.parse({ jiraUrl, email, apiToken })

        // Ensure URL doesn't end with slash
        const baseUrl = config.jiraUrl.replace(/\/$/, '')

        // JQL to find stories assigned to current user
        const jql = 'issuetype = Story AND assignee = currentUser() ORDER BY created DESC'
        const searchUrl = `${baseUrl}/rest/api/3/search/jql`

        const response = await fetch(searchUrl, {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(config.email, config.apiToken),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jql: jql,
                fields: ['summary', 'key', 'created'],
                maxResults: 50
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`JIRA API Error: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const data = await response.json() as any

        const stories = (data.issues || []).map((issue: any) => ({
            id: issue.key,
            key: issue.key,
            summary: issue.fields.summary,
            created: issue.fields.created
        }))

        res.json({ stories })
    } catch (error) {
        console.error('Error fetching JIRA stories:', error)
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch stories from JIRA'
        })
    }
})

// POST /api/jira/story - Fetch details for a specific story
jiraRouter.post('/story', async (req, res) => {
    try {
        const {
            jiraUrl: bodyJiraUrl,
            email: bodyEmail,
            apiToken: bodyApiToken,
            issueKey
        } = req.body

        const jiraUrl = bodyJiraUrl || process.env.jira_url
        const email = bodyEmail || process.env.email
        const apiToken = bodyApiToken || process.env.jira_TOKEN

        if (!jiraUrl || !email || !apiToken) {
            return res.status(400).json({ error: 'Missing JIRA configuration (jiraUrl, email, apiToken)' })
        }

        const config = fetchStoryDetailsSchema.parse({ jiraUrl, email, apiToken, issueKey })

        const baseUrl = config.jiraUrl.replace(/\/$/, '')
        const issueUrl = `${baseUrl}/rest/api/3/issue/${config.issueKey}`

        const response = await fetch(issueUrl, {
            method: 'GET',
            headers: {
                'Authorization': getAuthHeader(config.email, config.apiToken),
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`JIRA API Error: ${response.status}`)
        }

        const data = await response.json() as any
        const fields = data.fields

        // Extract description
        // JIRA ADF (Atlassian Document Format) is complex. 
        // For simplicity in this demo, we'll try to extract text or fallback to a string representation.
        // In a real app, you'd want a proper ADF to Markdown converter.
        let description = ''
        if (fields.description) {
            if (typeof fields.description === 'string') {
                description = fields.description
            } else if (fields.description.content) {
                // Very basic text extraction from ADF
                description = extractTextFromADF(fields.description)
            }
        }

        // Attempt to find Acceptance Criteria
        // This is tricky as it's often a custom field. 
        // We'll look for fields named "Acceptance Criteria" or similar if possible, 
        // but without knowing the custom field ID, we might just have to rely on the description 
        // or return the raw description and let the user edit it.
        // For this demo, we will return the description as the main source.

        res.json({
            title: fields.summary,
            description: description,
            acceptanceCriteria: '' // User will likely need to extract this or we parse it if it's in the description
        })

    } catch (error) {
        console.error('Error fetching JIRA story details:', error)
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to fetch story details'
        })
    }
})

// Simple helper to extract text from JIRA ADF
function extractTextFromADF(node: any): string {
    if (!node) return ''
    if (node.type === 'text') return node.text
    if (node.content && Array.isArray(node.content)) {
        return node.content.map(extractTextFromADF).join('\n')
    }
    return ''
}
