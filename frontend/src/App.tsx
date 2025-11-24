
import { useState } from 'react'
import { generateTests, fetchJiraStories, fetchJiraStoryDetails } from './api'
import { GenerateRequest, GenerateResponse, TestCase, JiraConfig, JiraStory } from './types'

function App() {
  const [formData, setFormData] = useState<GenerateRequest>({
    storyTitle: '',
    acceptanceCriteria: '',
    description: '',
    additionalInfo: ''
  })
  const [results, setResults] = useState<GenerateResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedTestCases, setExpandedTestCases] = useState<Set<string>>(new Set())

  // JIRA State
  const [showJiraModal, setShowJiraModal] = useState(false)
  const [jiraConfig, setJiraConfig] = useState<JiraConfig>({
    jiraUrl: '',
    email: '',
    apiToken: ''
  })
  const [isJiraConnected, setIsJiraConnected] = useState(false)
  const [jiraStories, setJiraStories] = useState<JiraStory[]>([])
  const [selectedStoryId, setSelectedStoryId] = useState('')
  const [isFetchingStories, setIsFetchingStories] = useState(false)
  const [isFetchingDetails, setIsFetchingDetails] = useState(false)

  const toggleTestCaseExpansion = (testCaseId: string) => {
    const newExpanded = new Set(expandedTestCases)
    if (newExpanded.has(testCaseId)) {
      newExpanded.delete(testCaseId)
    } else {
      newExpanded.add(testCaseId)
    }
    setExpandedTestCases(newExpanded)
  }

  const handleInputChange = (field: keyof GenerateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleJiraConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFetchingStories(true)
    setError(null)
    try {
      const stories = await fetchJiraStories(jiraConfig)
      setJiraStories(stories)
      setIsJiraConnected(true)
      setShowJiraModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to JIRA')
    } finally {
      setIsFetchingStories(false)
    }
  }

  const handleFetchStoryDetails = async () => {
    if (!selectedStoryId) return

    setIsFetchingDetails(true)
    setError(null)
    try {
      const details = await fetchJiraStoryDetails(jiraConfig, selectedStoryId)
      setFormData(prev => ({
        ...prev,
        storyTitle: details.title,
        description: details.description,
        acceptanceCriteria: details.acceptanceCriteria || prev.acceptanceCriteria // Keep existing if empty
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch story details')
    } finally {
      setIsFetchingDetails(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hasAcceptanceCriteria = formData.acceptanceCriteria.trim().length > 0;
    const acceptanceInDescription = formData.description && formData.description.toLowerCase().includes('acceptance criteria');
    if (!formData.storyTitle.trim() || (!hasAcceptanceCriteria && !acceptanceInDescription)) {
      setError('Story Title and Acceptance Criteria are required (unless Acceptance Criteria is present in the Description)');
      return;
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await generateTests(formData)
      setResults(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tests')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
    background-color: #f8fafc; 
    color: #1e293b; 
    line-height: 1.6; 
    -webkit-font-smoothing: antialiased;
  }

  .container { 
    max-width: 95%; 
    width: 100%; 
    margin: 0 auto; 
    padding: 40px 20px; 
    min-height: 100vh; 
  }

  @media(min-width: 768px) { .container { max-width: 90%; padding: 60px 30px; } }
  @media(min-width: 1024px) { .container { max-width: 850px; padding: 80px 40px; } }
  
  .header { text-align: center; margin-bottom: 60px; }
  .title { 
    font-size: 3rem; 
    font-weight: 800; 
    background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px; 
    letter-spacing: -0.02em;
  }
  .subtitle { color: #64748b; font-size: 1.2rem; font-weight: 400; }
  
  .form-container { 
    background: white; 
    border-radius: 16px; 
    padding: 40px; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05); 
    margin-bottom: 40px; 
    border: 1px solid #e2e8f0;
  }
  
  .form-group { margin-bottom: 24px; }
  .form-label { 
    display: block; 
    font-weight: 600; 
    margin-bottom: 8px; 
    color: #334155; 
    font-size: 0.95rem;
  }
  
  .form-input, .form-textarea, .form-select { 
    width: 100%; 
    padding: 14px 16px; 
    border: 1px solid #cbd5e1; 
    border-radius: 8px; 
    font-size: 15px; 
    transition: all 0.2s ease; 
    background: #f8fafc;
    font-family: inherit;
  }
  
  .form-input:focus, .form-textarea:focus, .form-select:focus { 
    outline: none; 
    border-color: #3b82f6; 
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
  }
  
  .form-textarea { resize: vertical; min-height: 120px; }
  
  .btn { 
    border: none; 
    padding: 14px 28px; 
    border-radius: 8px; 
    font-size: 15px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s ease; 
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .btn:active { transform: translateY(1px); }
  
  .btn-primary { 
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
    color: white; 
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  }
  .btn-primary:hover:not(:disabled) { 
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
    box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
  
  .btn-success { 
    background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
    color: white; 
    box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);
  }
  .btn-success:hover:not(:disabled) { 
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    box-shadow: 0 6px 8px -1px rgba(5, 150, 105, 0.3);
    transform: translateY(-1px);
  }
  
  .btn:disabled { 
    background: #e2e8f0; 
    color: #94a3b8;
    cursor: not-allowed; 
    box-shadow: none;
    transform: none;
  }
  
  /* JIRA Section */
  .jira-section { 
    background: white; 
    padding: 30px; 
    border-radius: 16px; 
    margin-bottom: 40px; 
    border: 1px solid #e2e8f0; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
  }
  .jira-section:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
  
  .jira-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .jira-title { 
    font-size: 1.25rem; 
    font-weight: 700; 
    color: #1e293b; 
    display: flex; 
    align-items: center; 
    gap: 12px; 
  }
  
  .jira-status { 
    font-size: 0.85rem; 
    padding: 6px 12px; 
    border-radius: 20px; 
    background: #f1f5f9; 
    color: #64748b; 
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .jira-status::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #cbd5e1;
  }
  .jira-status.connected { 
    background: #dcfce7; 
    color: #166534; 
  }
  .jira-status.connected::before { background-color: #22c55e; }
  
  .input-group-row { display: flex; gap: 12px; }
  .flex-grow { flex-grow: 1; }

  /* Modal */
  .modal-overlay { 
    position: fixed; 
    top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.4); 
    backdrop-filter: blur(4px);
    display: flex; 
    justify-content: center; 
    align-items: center; 
    z-index: 1000; 
    animation: fadeIn 0.2s ease-out;
  }
  
  .modal { 
    background: white; 
    padding: 40px; 
    border-radius: 20px; 
    width: 90%; 
    max-width: 480px; 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); 
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .modal-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
  .close-btn { 
    background: #f1f5f9; 
    border: none; 
    width: 32px; 
    height: 32px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    cursor: pointer; 
    color: #64748b; 
    transition: all 0.2s;
  }
  .close-btn:hover { background: #e2e8f0; color: #1e293b; }
  
  .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
  
  .error-banner { 
    background: #fef2f2; 
    color: #991b1b; 
    padding: 16px; 
    border-radius: 8px; 
    margin-bottom: 24px; 
    border: 1px solid #fecaca;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .loading { text-align: center; padding: 60px; color: #64748b; font-size: 1.1rem; }

  /* Results Table Styles */
  .results-container { 
    background: white; 
    border-radius: 16px; 
    padding: 40px; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
    border: 1px solid #e2e8f0;
  }
  .results-header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
  .results-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
  .results-meta { color: #64748b; font-size: 0.9rem; }
  
  .table-container { overflow-x: auto; }
  .results-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; }
  .results-table th { 
    background: #f8fafc; 
    font-weight: 600; 
    color: #475569; 
    padding: 16px; 
    text-align: left; 
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .results-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; color: #334155; }
  .results-table tr:last-child td { border-bottom: none; }
  .results-table tr:hover td { background: #f8fafc; }
  
  .category-positive { color: #059669; font-weight: 600; background: #ecfdf5; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; }
  .category-negative { color: #dc2626; font-weight: 600; background: #fef2f2; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; }
  .category-edge { color: #d97706; font-weight: 600; background: #fffbeb; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; }
  .category-authorization { color: #7c3aed; font-weight: 600; background: #f5f3ff; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; }
  .category-non-functional { color: #475569; font-weight: 600; background: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; }
  
  .test-case-id { 
    cursor: pointer; 
    color: #2563eb; 
    font-weight: 600; 
    padding: 8px 12px; 
    border-radius: 6px; 
    transition: all 0.2s; 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    background: #eff6ff;
  }
  .test-case-id:hover { background: #dbeafe; }
  .test-case-id.expanded { background: #2563eb; color: white; }
  
  .expand-icon { font-size: 10px; transition: transform 0.2s; }
  .expand-icon.expanded { transform: rotate(90deg); }
  
  .expanded-details { 
    margin-top: 10px; 
    background: #f8fafc; 
    border-radius: 12px; 
    padding: 24px; 
    border: 1px solid #e2e8f0;
  }
  
  .step-item { 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 8px; 
    padding: 16px; 
    margin-bottom: 12px; 
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
  }
  .step-header { display: grid; grid-template-columns: 60px 1fr 1fr 1fr; gap: 20px; align-items: start; }
  .step-id { 
    font-weight: 700; 
    color: #64748b; 
    background: #f1f5f9; 
    padding: 4px 8px; 
    border-radius: 6px; 
    text-align: center; 
    font-size: 0.8rem; 
  }
  .step-description { color: #334155; line-height: 1.5; }
  .step-test-data { color: #64748b; font-family: monospace; font-size: 0.9rem; background: #f8fafc; padding: 4px 8px; border-radius: 4px; }
  .step-expected { color: #059669; font-weight: 500; font-size: 0.95rem; }
  
  .step-labels { 
    display: grid; 
    grid-template-columns: 60px 1fr 1fr 1fr; 
    gap: 20px; 
    margin-bottom: 12px; 
    font-weight: 600; 
    color: #94a3b8; 
    font-size: 0.75rem; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    padding: 0 16px;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`}</style>

      <div className="container">
        <div className="header">
          <h1 className="title">User Story to Tests</h1>
          <p className="subtitle">Generate comprehensive test cases from your user stories</p>
        </div>

        {/* JIRA Integration Section */}
        <div className="jira-section">
          <div className="jira-header">
            <div className="jira-title">
              <span style={{ fontSize: '24px' }}>🔷</span> JIRA Integration
            </div>
            <div>
              <span className={`jira - status ${isJiraConnected ? 'connected' : ''} `}>
                {isJiraConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>

          {!isJiraConnected ? (
            <button
              className="btn btn-primary"
              onClick={() => setShowJiraModal(true)}
            >
              Connect JIRA
            </button>
          ) : (
            <div className="input-group-row">
              <select
                className="form-select flex-grow"
                value={selectedStoryId}
                onChange={(e) => setSelectedStoryId(e.target.value)}
              >
                <option value="">Select a User Story...</option>
                {jiraStories.map(story => (
                  <option key={story.id} value={story.key}>
                    {story.key}: {story.summary}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-success"
                onClick={handleFetchStoryDetails}
                disabled={!selectedStoryId || isFetchingDetails}
              >
                {isFetchingDetails ? 'Linking...' : 'Link Story'}
              </button>
              <button
                className="btn"
                style={{ background: '#95a5a6', color: 'white' }}
                onClick={() => {
                  setIsJiraConnected(false)
                  setJiraStories([])
                  setSelectedStoryId('')
                }}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="storyTitle" className="form-label">
              Story Title *
            </label>
            <input
              type="text"
              id="storyTitle"
              className="form-input"
              value={formData.storyTitle}
              onChange={(e) => handleInputChange('storyTitle', e.target.value)}
              placeholder="Enter the user story title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional description (optional)..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="acceptanceCriteria" className="form-label">
              Acceptance Criteria{!(formData.acceptanceCriteria.trim() || (formData.description && formData.description.toLowerCase().includes('acceptance criteria'))) ? ' *' : ''}
            </label>
            <textarea
              id="acceptanceCriteria"
              className="form-textarea"
              value={formData.acceptanceCriteria}
              onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
              placeholder="Enter the acceptance criteria..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo" className="form-label">
              Additional Info
            </label>
            <textarea
              id="additionalInfo"
              className="form-textarea"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any additional information (optional)..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Test Cases'}
          </button>
        </form>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading">
            Generating test cases...
          </div>
        )}

        {results && (
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title">Generated Test Cases</h2>
              <div className="results-meta">
                {results.cases.length} test case(s) generated
                {results.model && ` • Model: ${results.model} `}
                {results.promptTokens > 0 && ` • Tokens: ${results.promptTokens + results.completionTokens} `}
              </div>
            </div>

            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Test Case ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Expected Result</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cases.map((testCase: TestCase) => (
                    <>
                      <tr key={testCase.id}>
                        <td>
                          <div
                            className={`test -case -id ${expandedTestCases.has(testCase.id) ? 'expanded' : ''} `}
                            onClick={() => toggleTestCaseExpansion(testCase.id)}
                          >
                            <span className={`expand - icon ${expandedTestCases.has(testCase.id) ? 'expanded' : ''} `}>
                              ▶
                            </span>
                            {testCase.id}
                          </div>
                        </td>
                        <td>{testCase.title}</td>
                        <td>
                          <span className={`category - ${testCase.category.toLowerCase()} `}>
                            {testCase.category}
                          </span>
                        </td>
                        <td>{testCase.expectedResult}</td>
                      </tr>
                      {expandedTestCases.has(testCase.id) && (
                        <tr key={`${testCase.id} -details`}>
                          <td colSpan={4}>
                            <div className="expanded-details">
                              <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Test Steps for {testCase.id}</h4>
                              <div className="step-labels">
                                <div>Step ID</div>
                                <div>Step Description</div>
                                <div>Test Data</div>
                                <div>Expected Result</div>
                              </div>
                              {testCase.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                  <div className="step-header">
                                    <div className="step-id">S{String(index + 1).padStart(2, '0')}</div>
                                    <div className="step-description">{step}</div>
                                    <div className="step-test-data">{testCase.testData || 'N/A'}</div>
                                    <div className="step-expected">
                                      {index === testCase.steps.length - 1 ? testCase.expectedResult : 'Step completed successfully'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* JIRA Connect Modal */}
        {showJiraModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">Connect to JIRA</h3>
                <button className="close-btn" onClick={() => setShowJiraModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleJiraConnect}>
                <div className="form-group">
                  <label className="form-label">JIRA URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://your-domain.atlassian.net"
                    value={jiraConfig.jiraUrl}
                    onChange={e => setJiraConfig({ ...jiraConfig, jiraUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={jiraConfig.email}
                    onChange={e => setJiraConfig({ ...jiraConfig, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">API Token</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your JIRA API Token"
                    value={jiraConfig.apiToken}
                    onChange={e => setJiraConfig({ ...jiraConfig, apiToken: e.target.value })}
                    required
                  />
                  <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    Create one at <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer">id.atlassian.com</a>
                  </small>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => setShowJiraModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isFetchingStories}>
                    {isFetchingStories ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default App
