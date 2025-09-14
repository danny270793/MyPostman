import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, useAppLoading } from './store/hooks'
import { appSlice } from './store/slices/appSlice'
import { Header, Sidebar, RequestBuilder, ResponseViewer, LoadingScreen } from './components'
import { useUIState, useRequest } from './hooks'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const appLoading = useAppLoading()
  const theme = useAppSelector(state => state.app.theme)
  
  // Custom hooks for UI state management
  const {
    activeTab,
    setActiveTab,
    responseTab,
    setResponseTab,
    sidebarTab,
    setSidebarTab,
    sidebarOpen,
    closeSidebar,
    toggleSidebar
  } = useUIState()

  const { 
    loadHistoryItem, 
    loadSavedRequest,
    saveRequest: saveRequestAction
  } = useRequest()

  useEffect(() => {
    // Initialize the app when component mounts
    dispatch(appSlice.actions.initializeApp())
  }, [dispatch])

  const toggleTheme = () => {
    dispatch(appSlice.actions.toggleTheme())
  }

  const handleSaveRequest = () => {
    const name = prompt('Enter request name:')
    if (name) {
      saveRequestAction(name)
    }
  }

  if (appLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/20 via-transparent to-postman-orange/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 108, 55, 0.1) 0%, transparent 25%), 
                           radial-gradient(circle at 75% 75%, rgba(255, 108, 55, 0.1) 0%, transparent 25%)`
        }}></div>
      </div>

      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        theme={theme}
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
      />

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Main Layout */}
      <div className="flex flex-1 h-[calc(100vh-3rem)] overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
          onClose={closeSidebar}
          onLoadHistoryItem={loadHistoryItem}
          onLoadSavedRequest={loadSavedRequest}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Request Builder */}
          <RequestBuilder
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSaveRequest={handleSaveRequest}
          />

          {/* Response Viewer */}
          <ResponseViewer
            activeTab={responseTab}
            onTabChange={setResponseTab}
          />
        </div>
      </div>
    </div>
  )
}

export default App