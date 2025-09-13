import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector, useAppLoading, useRequestLoading, useLanguage, useRequestHistory, useSavedRequests } from './store/hooks'
import { appSlice } from './store/slices/appSlice'
import { requestSlice } from './store/slices/requestSlice'
import './App.css'

function App() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const appLoading = useAppLoading()
  const requestLoading = useRequestLoading()
  const currentRequest = useAppSelector(state => state.requests.currentRequest)
  const response = useAppSelector(state => state.requests.response)
  const error = useAppSelector(state => state.requests.error)
  const theme = useAppSelector(state => state.app.theme)
  const language = useLanguage()
  const history = useRequestHistory()
  const savedRequests = useSavedRequests()
  
  // Local state for UI
  const [activeTab, setActiveTab] = useState<'params' | 'auth' | 'headers' | 'body'>('headers')
  const [responseTab, setResponseTab] = useState<'body' | 'headers' | 'cookies'>('body')
  const [sidebarTab, setSidebarTab] = useState<'collections' | 'history' | 'saved'>('history')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Initialize the app when component mounts
    dispatch(appSlice.actions.initializeApp())
  }, [dispatch])

  const handleSendRequest = () => {
    if (!currentRequest.url) {
      dispatch(requestSlice.actions.showNotification({
        type: 'error',
        message: t('notifications.urlRequired')
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
      <div className="postman-loading">
        <div className="loading-spinner"></div>
        <p>{t('app.loading')}</p>
      </div>
    )
  }

  return (
    <div className={`postman-app ${theme}`}>
      {/* Top Header */}
      <header className="postman-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="app-title">{t('app.title')}</h1>
        </div>
        <div className="header-controls">
          <select 
            value={language} 
            onChange={(e) => dispatch(appSlice.actions.setLanguage(e.target.value as 'en' | 'es'))}
            className="language-select"
          >
            <option value="en">{t('language.english')}</option>
            <option value="es">{t('language.spanish')}</option>
          </select>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="postman-main">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="postman-sidebar">
            <div className="sidebar-tabs">
              <button 
                className={sidebarTab === 'collections' ? 'active' : ''}
                onClick={() => setSidebarTab('collections')}
              >
                📁 {t('tabs.collections')}
              </button>
              <button 
                className={sidebarTab === 'history' ? 'active' : ''}
                onClick={() => setSidebarTab('history')}
              >
                🕒 {t('tabs.history')}
              </button>
              <button 
                className={sidebarTab === 'saved' ? 'active' : ''}
                onClick={() => setSidebarTab('saved')}
              >
                ⭐ {t('tabs.saved')}
              </button>
            </div>
            
            <div className="sidebar-content">
              {sidebarTab === 'history' && (
                <div className="history-list">
                  <h3>{t('history.title')}</h3>
                  {history.length === 0 ? (
                    <p className="empty-state">{t('history.empty')}</p>
                  ) : (
                    <div className="history-items">
                      {history.slice(0, 10).map((item) => (
                        <div key={item.id} className="history-item"
                             onClick={() => dispatch(requestSlice.actions.loadHistoryItemToCurrent(item.id))}>
                          <div className="method-badge">{item.method}</div>
                          <div className="url-text">{item.url}</div>
                          <div className="status-badge">{item.status}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {sidebarTab === 'saved' && (
                <div className="saved-list">
                  <h3>{t('saved.title')}</h3>
                  {savedRequests.length === 0 ? (
                    <p className="empty-state">{t('saved.empty')}</p>
                  ) : (
                    <div className="saved-items">
                      {savedRequests.map((request) => (
                        <div key={request.id} className="saved-item"
                             onClick={() => dispatch(requestSlice.actions.loadSavedRequestToCurrent(request.id))}>
                          <div className="method-badge">{request.method}</div>
                          <div className="request-info">
                            <div className="request-name">{request.name}</div>
                            <div className="request-url">{request.url}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {sidebarTab === 'collections' && (
                <div className="collections-list">
                  <h3>{t('tabs.collections')}</h3>
                  <p className="empty-state">Collections coming soon...</p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Content Area */}
        <div className="postman-content">
          {/* Request Builder */}
          <div className="request-builder">
            {/* URL Bar */}
            <div className="url-bar">
              <select 
                value={currentRequest.method} 
                onChange={(e) => dispatch(requestSlice.actions.setMethod(e.target.value as any))}
                className={`method-select ${currentRequest.method.toLowerCase()}`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              
              <input
                type="url"
                placeholder={t('request.url')}
                value={currentRequest.url}
                onChange={(e) => dispatch(requestSlice.actions.setUrl(e.target.value))}
                className="url-input"
              />
              
              <button 
                onClick={handleSendRequest}
                disabled={requestLoading}
                className="send-button"
              >
                {requestLoading ? t('request.sending') : t('request.send')}
              </button>
              
              <button 
                onClick={() => {
                  const name = prompt('Enter request name:')
                  if (name) {
                    dispatch(requestSlice.actions.saveRequest({
                      name,
                      url: currentRequest.url,
                      method: currentRequest.method,
                      headers: currentRequest.headers,
                      body: currentRequest.body
                    }))
                  }
                }}
                className="save-button"
              >
                💾
              </button>
            </div>

            {/* Request Configuration Tabs */}
            <div className="request-tabs">
              <button 
                className={activeTab === 'params' ? 'active' : ''}
                onClick={() => setActiveTab('params')}
              >
                Params
              </button>
              <button 
                className={activeTab === 'auth' ? 'active' : ''}
                onClick={() => setActiveTab('auth')}
              >
                Authorization
              </button>
              <button 
                className={activeTab === 'headers' ? 'active' : ''}
                onClick={() => setActiveTab('headers')}
              >
                {t('request.headers')}
              </button>
              <button 
                className={activeTab === 'body' ? 'active' : ''}
                onClick={() => setActiveTab('body')}
              >
                {t('request.body')}
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'headers' && (
                <div className="headers-tab">
                  <textarea
                    placeholder={t('request.placeholders.headers')}
                    value={JSON.stringify(currentRequest.headers, null, 2)}
                    onChange={(e) => {
                      try {
                        const headers = JSON.parse(e.target.value)
                        dispatch(requestSlice.actions.setHeaders(headers))
                      } catch (err) {
                        // Invalid JSON, ignore for now
                      }
                    }}
                    className="tab-textarea"
                  />
                </div>
              )}

              {activeTab === 'body' && (
                <div className="body-tab">
                  <textarea
                    placeholder={t('request.placeholders.body')}
                    value={currentRequest.body}
                    onChange={(e) => dispatch(requestSlice.actions.setBody(e.target.value))}
                    className="tab-textarea"
                  />
                </div>
              )}

              {activeTab === 'params' && (
                <div className="params-tab">
                  <p>Query parameters coming soon...</p>
                </div>
              )}

              {activeTab === 'auth' && (
                <div className="auth-tab">
                  <p>Authorization configuration coming soon...</p>
                </div>
              )}
            </div>
          </div>

          {/* Response Section */}
          <div className="response-viewer">
            <div className="response-header">
              <h3>{t('response.title')}</h3>
              {response && (
                <div className="response-meta">
                  <span className={`status-badge status-${Math.floor(response.status / 100)}`}>
                    {response.status}
                  </span>
                  <span className="response-time">~ 100ms</span>
                  <span className="response-size">~ 1KB</span>
                </div>
              )}
            </div>

            {error && (
              <div className="error-display">
                <div className="error-icon">❌</div>
                <div className="error-content">
                  <p><strong>{t('response.error')}:</strong> {error.message}</p>
                  <p><strong>{t('response.status')}:</strong> {error.status}</p>
                </div>
              </div>
            )}

            {response && (
              <>
                <div className="response-tabs">
                  <button 
                    className={responseTab === 'body' ? 'active' : ''}
                    onClick={() => setResponseTab('body')}
                  >
                    {t('response.data')}
                  </button>
                  <button 
                    className={responseTab === 'headers' ? 'active' : ''}
                    onClick={() => setResponseTab('headers')}
                  >
                    {t('request.headers')}
                  </button>
                  <button 
                    className={responseTab === 'cookies' ? 'active' : ''}
                    onClick={() => setResponseTab('cookies')}
                  >
                    Cookies
        </button>
                </div>

                <div className="response-content">
                  {responseTab === 'body' && (
                    <pre className="response-body">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  )}
                  
                  {responseTab === 'headers' && (
                    <div className="response-headers">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="header-row">
                          <span className="header-key">{key}:</span>
                          <span className="header-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {responseTab === 'cookies' && (
                    <div className="response-cookies">
                      <p>No cookies in this response</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {!response && !error && (
              <div className="empty-response">
                <div className="empty-icon">📝</div>
                <p>{t('response.noResponse')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
