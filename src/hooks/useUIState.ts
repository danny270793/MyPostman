import { useState } from 'react'

export type ActiveTab = 'params' | 'auth' | 'headers' | 'body'
export type ResponseTab = 'body' | 'headers' | 'cookies'
export type SidebarTab = 'collections' | 'history' | 'saved'

/**
 * Custom hook for managing UI state
 */
export const useUIState = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('headers')
  const [responseTab, setResponseTab] = useState<ResponseTab>('body')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('history')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return {
    // Request tabs
    activeTab,
    setActiveTab,
    
    // Response tabs
    responseTab,
    setResponseTab,
    
    // Sidebar state
    sidebarTab,
    setSidebarTab,
    sidebarOpen,
    setSidebarOpen,
    
    // Helper functions
    closeSidebar: () => setSidebarOpen(false),
    toggleSidebar: () => setSidebarOpen(prev => !prev),
    
    // Reset to defaults
    resetTabs: () => {
      setActiveTab('headers')
      setResponseTab('body')
      setSidebarTab('history')
    }
  }
}
