import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, useAppLoading, useRequestLoading } from './store/hooks'
import { appSlice } from './store/slices/appSlice'
import { requestSlice } from './store/slices/requestSlice'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const appLoading = useAppLoading()
  const requestLoading = useRequestLoading()
  const currentRequest = useAppSelector(state => state.requests.currentRequest)
  const response = useAppSelector(state => state.requests.response)
  const error = useAppSelector(state => state.requests.error)
  const theme = useAppSelector(state => state.app.theme)

  useEffect(() => {
    // Initialize the app when component mounts
    dispatch(appSlice.actions.initializeApp())
  }, [dispatch])

  const handleSendRequest = () => {
    if (!currentRequest.url) {
      dispatch(requestSlice.actions.showNotification({
        type: 'error',
        message: 'Please enter a URL'
      }))
      return
    }

    dispatch(requestSlice.actions.sendRequest({
      url: currentRequest.url,
      method: currentRequest.method,
      headers: currentRequest.headers,
      body: currentRequest.body ? JSON.parse(currentRequest.body) : undefined
    }))
  }

  const toggleTheme = () => {
    dispatch(appSlice.actions.toggleTheme())
  }

  if (appLoading) {
    return (
      <div className="loading">
        <p>Initializing MyPostman...</p>
      </div>
    )
  }

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>MyPostman</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      <main className="app-main">
        <div className="request-section">
          <h2>Make a Request</h2>
          
          <div className="request-form">
            <div className="method-url-row">
              <select 
                value={currentRequest.method} 
                onChange={(e) => dispatch(requestSlice.actions.setMethod(e.target.value as any))}
                className="method-select"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              
              <input
                type="url"
                placeholder="Enter request URL"
                value={currentRequest.url}
                onChange={(e) => dispatch(requestSlice.actions.setUrl(e.target.value))}
                className="url-input"
              />
              
              <button 
                onClick={handleSendRequest}
                disabled={requestLoading}
                className="send-button"
              >
                {requestLoading ? 'Sending...' : 'Send'}
              </button>
            </div>

            <div className="headers-section">
              <h3>Headers</h3>
              <textarea
                placeholder='{"Content-Type": "application/json"}'
                value={JSON.stringify(currentRequest.headers, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value)
                    dispatch(requestSlice.actions.setHeaders(headers))
                  } catch (err) {
                    // Invalid JSON, ignore for now
                  }
                }}
                className="headers-textarea"
              />
            </div>

            {(currentRequest.method === 'POST' || currentRequest.method === 'PUT' || currentRequest.method === 'PATCH') && (
              <div className="body-section">
                <h3>Request Body</h3>
                <textarea
                  placeholder='{"key": "value"}'
                  value={currentRequest.body}
                  onChange={(e) => dispatch(requestSlice.actions.setBody(e.target.value))}
                  className="body-textarea"
                />
              </div>
            )}
          </div>
        </div>

        <div className="response-section">
          <h2>Response</h2>
          
          {error && (
            <div className="error">
              <p><strong>Error:</strong> {error.message}</p>
              <p><strong>Status:</strong> {error.status}</p>
            </div>
          )}

          {response && (
            <div className="response">
              <div className="response-meta">
                <p><strong>Status:</strong> {response.status}</p>
                <p><strong>URL:</strong> {response.url}</p>
                <p><strong>Method:</strong> {response.method}</p>
              </div>
              
              <div className="response-data">
                <h3>Response Data:</h3>
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Redux + Saga powered API client</p>
      </footer>
    </div>
  )
}

export default App
