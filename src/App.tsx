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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-600 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-postman-orange rounded-full animate-spin absolute top-0 left-0" style={{borderTopColor: 'transparent', borderRightColor: 'transparent'}}></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('app.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('app.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      {/* Top Header */}
      <header className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button 
            className="hidden lg:block p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white truncate">
            {t('app.title')}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={language} 
            onChange={(e) => dispatch(appSlice.actions.setLanguage(e.target.value as 'en' | 'es'))}
            className="px-2 py-1.5 lg:px-3 lg:py-1.5 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-postman-orange focus:border-transparent transition-colors duration-200"
          >
            <option value="en">{t('language.english')}</option>
            <option value="es">{t('language.spanish')}</option>
          </select>
          <button 
            onClick={toggleTheme} 
            className="p-1.5 lg:p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200 focus:ring-2 focus:ring-postman-orange"
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`
            ${sidebarOpen ? 'w-full lg:w-72' : 'w-0'} 
            bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden
            fixed lg:relative z-30 lg:z-0 h-full lg:h-auto
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex border-b border-gray-700 bg-gray-800">
              <button 
                className={`flex-1 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-colors duration-200 border-b-2 ${
                  sidebarTab === 'collections' 
                    ? 'text-white border-postman-orange bg-gray-700' 
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setSidebarTab('collections')}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
                  </svg>
                  <span>{t('tabs.collections')}</span>
                </span>
              </button>
              <button 
                className={`flex-1 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-colors duration-200 border-b-2 ${
                  sidebarTab === 'history' 
                    ? 'text-white border-postman-orange bg-gray-700' 
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setSidebarTab('history')}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('tabs.history')}</span>
                </span>
              </button>
              <button 
                className={`flex-1 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-colors duration-200 border-b-2 ${
                  sidebarTab === 'saved' 
                    ? 'text-white border-postman-orange bg-gray-700' 
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setSidebarTab('saved')}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>{t('tabs.saved')}</span>
                </span>
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {sidebarTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-white text-sm font-semibold">{t('history.title')}</h3>
                  {history.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl text-gray-500 mb-2">🕒</div>
                      <p className="text-gray-400 text-sm">{t('history.empty')}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.slice(0, 10).map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-600"
                          onClick={() => dispatch(requestSlice.actions.loadHistoryItemToCurrent(item.id))}
                        >
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                            item.method === 'GET' ? 'bg-green-100 text-green-800' :
                            item.method === 'POST' ? 'bg-orange-100 text-orange-800' :
                            item.method === 'PUT' ? 'bg-blue-100 text-blue-800' :
                            item.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.method}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 truncate">{item.url}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.status >= 200 && item.status < 300 ? 'bg-green-100 text-green-800' :
                            item.status >= 300 && item.status < 400 ? 'bg-blue-100 text-blue-800' :
                            item.status >= 400 && item.status < 500 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {sidebarTab === 'saved' && (
                <div className="space-y-4">
                  <h3 className="text-white text-sm font-semibold">{t('saved.title')}</h3>
                  {savedRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl text-gray-500 mb-2">⭐</div>
                      <p className="text-gray-400 text-sm">{t('saved.empty')}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedRequests.map((request) => (
                        <div 
                          key={request.id} 
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-600"
                          onClick={() => dispatch(requestSlice.actions.loadSavedRequestToCurrent(request.id))}
                        >
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                            request.method === 'GET' ? 'bg-green-100 text-green-800' :
                            request.method === 'POST' ? 'bg-orange-100 text-orange-800' :
                            request.method === 'PUT' ? 'bg-blue-100 text-blue-800' :
                            request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.method}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{request.name}</p>
                            <p className="text-xs text-gray-400 truncate">{request.url}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {sidebarTab === 'collections' && (
                <div className="space-y-4">
                  <h3 className="text-white text-sm font-semibold">{t('tabs.collections')}</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl text-gray-500 mb-2">📁</div>
                    <p className="text-gray-400 text-sm">Collections coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
          {/* Request Builder */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* URL Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 lg:items-center">
                <select 
                  value={currentRequest.method} 
                  onChange={(e) => dispatch(requestSlice.actions.setMethod(e.target.value as any))}
                  className={`px-4 py-2 border rounded-md text-white font-semibold text-sm min-w-[80px] focus:ring-2 focus:ring-offset-2 focus:ring-postman-orange focus:border-transparent ${
                    currentRequest.method === 'GET' ? 'bg-green-600 border-green-600' :
                    currentRequest.method === 'POST' ? 'bg-postman-orange border-postman-orange' :
                    currentRequest.method === 'PUT' ? 'bg-blue-600 border-blue-600' :
                    currentRequest.method === 'DELETE' ? 'bg-red-600 border-red-600' :
                    'bg-yellow-600 border-yellow-600'
                  }`}
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
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-postman-orange focus:border-transparent text-sm"
                />
                
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                    <button 
                      onClick={handleSendRequest}
                      disabled={requestLoading}
                      className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                        requestLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-postman-orange hover:bg-postman-orange-hover shadow-lg hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-postman-orange'
                      }`}
                    >
                      {requestLoading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <span>{requestLoading ? t('request.sending') : t('request.send')}</span>
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
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:ring-2 focus:ring-postman-orange sm:w-auto"
                    >
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </button>
                  </div>
              </div>
            </div>

            {/* Request Configuration Tabs */}
            <div className="flex flex-wrap sm:flex-nowrap border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'params' 
                    ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('params')}
              >
                Params
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'auth' 
                    ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('auth')}
              >
                Authorization
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'headers' 
                    ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('headers')}
              >
                {t('request.headers')}
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'body' 
                    ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('body')}
              >
                {t('request.body')}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 bg-white dark:bg-gray-900">
              {activeTab === 'headers' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Request Headers (JSON format)
                  </label>
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
                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-y focus:ring-2 focus:ring-postman-orange focus:border-transparent"
                    rows={6}
                  />
                </div>
              )}

              {activeTab === 'body' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Request Body
                  </label>
                  <textarea
                    placeholder={t('request.placeholders.body')}
                    value={currentRequest.body}
                    onChange={(e) => dispatch(requestSlice.actions.setBody(e.target.value))}
                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-y focus:ring-2 focus:ring-postman-orange focus:border-transparent"
                    rows={6}
                  />
                </div>
              )}

              {activeTab === 'params' && (
                <div className="text-center py-8">
                  <div className="text-4xl text-gray-400 mb-2">🔗</div>
                  <p className="text-gray-500 dark:text-gray-400">Query parameters coming soon...</p>
                </div>
              )}

              {activeTab === 'auth' && (
                <div className="text-center py-8">
                  <div className="text-4xl text-gray-400 mb-2">🔐</div>
                  <p className="text-gray-500 dark:text-gray-400">Authorization configuration coming soon...</p>
                </div>
              )}
            </div>
          </div>

          {/* Response Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('response.title')}</h3>
              {response && (
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-800' :
                    response.status >= 300 && response.status < 400 ? 'bg-blue-100 text-blue-800' :
                    response.status >= 400 && response.status < 500 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {response.status}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ~ 100ms
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ~ 1KB
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {t('response.error')}
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p><strong>Message:</strong> {error.message}</p>
                      <p><strong>Status:</strong> {error.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {response && (
              <>
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <button 
                    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                      responseTab === 'body' 
                        ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setResponseTab('body')}
                  >
                    {t('response.data')}
                  </button>
                  <button 
                    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                      responseTab === 'headers' 
                        ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setResponseTab('headers')}
                  >
                    {t('request.headers')}
                  </button>
                  <button 
                    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                      responseTab === 'cookies' 
                        ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setResponseTab('cookies')}
                  >
                    Cookies
                  </button>
      </div>

                <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-900">
                  {responseTab === 'body' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Body</label>
                        <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          Copy
        </button>
                      </div>
                      <pre className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-gray-100 overflow-x-auto whitespace-pre-wrap break-words">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {responseTab === 'headers' && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Headers</label>
                      <div className="space-y-2">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <div key={key} className="flex p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[120px] break-all">{key}:</span>
                            <span className="text-gray-600 dark:text-gray-400 ml-3 break-all flex-1">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {responseTab === 'cookies' && (
                    <div className="text-center py-8">
                      <div className="text-4xl text-gray-400 mb-2">🍪</div>
                      <p className="text-gray-500 dark:text-gray-400">No cookies in this response</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {!response && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="text-6xl text-gray-400 dark:text-gray-500 mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('response.noResponse')}</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Send a request to see the response here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
