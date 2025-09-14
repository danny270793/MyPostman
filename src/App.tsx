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
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        theme={theme}
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
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
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
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