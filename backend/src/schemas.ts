import { z } from 'zod'

export const GenerateRequestSchema = z.object({
  storyTitle: z.string().min(1, 'Story title is required'),
  acceptanceCriteria: z.string().optional(),
  description: z.string().optional(),
  additionalInfo: z.string().optional()
}).refine(
  (data) => {
    // Accept if acceptanceCriteria is non-empty, or if description contains 'acceptance criteria'
    const hasAcceptanceCriteria = data.acceptanceCriteria && data.acceptanceCriteria.trim().length > 0;
    const acceptanceInDescription = data.description && data.description.toLowerCase().includes('acceptance criteria');
    return hasAcceptanceCriteria || acceptanceInDescription;
  },
  {
    message: 'Acceptance criteria is required (unless present in description)',
    path: ['acceptanceCriteria']
  }
)

export const TestCaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(z.string()),
  testData: z.string().optional(),
  expectedResult: z.string(),
  category: z.string()
})

export const GenerateResponseSchema = z.object({
  cases: z.array(TestCaseSchema),
  model: z.string().optional(),
  promptTokens: z.number(),
  completionTokens: z.number()
})

// Type exports
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>
export type TestCase = z.infer<typeof TestCaseSchema>
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>