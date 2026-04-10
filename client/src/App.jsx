import { useState } from 'react'
import './App.css'

export default function App() {
  const [testCode, setTestCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function analyze() {
    if (!testCode.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCode })
      })
      if (!res.ok) throw new Error('server error')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError('Connection failed — is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="pane pane-left">
        <div className="pane-header">
          <span className="pane-label">test input</span>
          <span className="counter">{testCode.length} chars</span>
        </div>
        <div className="pane-body">
          <textarea
            value={testCode}
            onChange={e => setTestCode(e.target.value)}
            placeholder={"// paste your test file here\n\ndescribe('auth', () => {\n  it('logs in with valid credentials', () => {\n    ...\n  });\n});"}
          />
          <button className="analyze-btn" onClick={analyze} disabled={loading || !testCode.trim()}>
            {loading ? 'analyzing...' : 'analyze coverage'}
          </button>
        </div>
      </div>

      <div className="pane">
        <div className="pane-header">
          <span className="pane-label">coverage report</span>
          <span className="counter">
            {result?.features?.length ? `${result.features.length} feature${result.features.length !== 1 ? 's' : ''}` : ''}
          </span>
        </div>
        <div className="results-body">
          {!result && !loading && !error && (
            <div className="empty-state">
              <span className="empty-label">paste a test file and hit analyze<br />untested scenarios will appear here</span>
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner" />
              running analysis
            </div>
          )}

          {error && <div className="error-block">{error}</div>}

          {result && (
            <>
              {result.summary && (
                <div className="summary-block">
                  <p className="summary-text">{result.summary}</p>
                </div>
              )}

              {result.features?.map((f, i) => (
                <div className="feature-card" key={i}>
                  <div className="feature-header">
                    <span className="feature-name">{f.name}</span>
                  </div>
                  <div className="feature-body">
                    {f.testedScenarios?.length > 0 && (
                      <div>
                        <p className="section-label">covered</p>
                        <div className="tested-list">
                          {f.testedScenarios.map((s, j) => (
                            <div className="tested-item" key={j}>
                              <div className="dot-green" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {f.untestedScenarios?.length > 0 && (
                      <div>
                        <p className="section-label">missing ({f.untestedScenarios.length})</p>
                        <div className="untested-list">
                          {f.untestedScenarios.map((u, j) => {
                            const sev = (u.severity || 'low').toLowerCase()
                            return (
                              <div className="untested-item" key={j}>
                                <div className="untested-row">
                                  <span className="untested-scenario">{u.scenario}</span>
                                  <span className={`badge badge-${sev}`}>{sev}</span>
                                </div>
                                {u.reason && <span className="untested-reason">{u.reason}</span>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}