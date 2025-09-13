import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector, useAppLoading, useRequestLoading, useLanguage } from './store/hooks'
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
      <div className="loading">
        <p>{t('app.loading')}</p>
      </div>
    )
  }

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>{t('app.title')}</h1>
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
            {t('theme.switchTo', { mode: theme === 'light' ? t('theme.dark') : t('theme.light') })}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="request-section">
          <h2>{t('request.title')}</h2>
          
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
            </div>

            <div className="headers-section">
              <h3>{t('request.headers')}</h3>
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
                className="headers-textarea"
              />
            </div>

            {(currentRequest.method === 'POST' || currentRequest.method === 'PUT' || currentRequest.method === 'PATCH') && (
              <div className="body-section">
                <h3>{t('request.body')}</h3>
                <textarea
                  placeholder={t('request.placeholders.body')}
                  value={currentRequest.body}
                  onChange={(e) => dispatch(requestSlice.actions.setBody(e.target.value))}
                  className="body-textarea"
                />
              </div>
            )}
          </div>
        </div>

        <div className="response-section">
          <h2>{t('response.title')}</h2>
          
          {error && (
            <div className="error">
              <p><strong>{t('response.error')}:</strong> {error.message}</p>
              <p><strong>{t('response.status')}:</strong> {error.status}</p>
            </div>
          )}

          {response && (
            <div className="response">
              <div className="response-meta">
                <p><strong>{t('response.status')}:</strong> {response.status}</p>
                <p><strong>{t('response.url')}:</strong> {response.url}</p>
                <p><strong>{t('response.method')}:</strong> {response.method}</p>
              </div>
              
              <div className="response-data">
                <h3>{t('response.data')}:</h3>
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>{t('app.footer')}</p>
      </footer>
    </div>
  )
}

export default App
