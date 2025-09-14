import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import type { ActiveTab } from '../hooks/useUIState'
import { useRequest } from '../hooks/useRequest'
import { getMethodColors } from '../utils/colors'
import { type Authorization } from '../store/slices/requestSlice'

interface HeaderKeyValue {
  id: string
  key: string
  value: string
  enabled: boolean
}

interface ParamKeyValue {
  id: string
  key: string
  value: string
  enabled: boolean
}

interface RequestBuilderProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  onSaveRequest: () => void
}

export const RequestBuilder: React.FC<RequestBuilderProps> = ({
  activeTab,
  onTabChange,
  onSaveRequest
}) => {
  const {
    currentRequest,
    isLoading,
    canSendRequest,
    sendRequest,
    updateMethod,
    updateUrl,
    updateHeaders,
    updateParams,
    updateAuthorization,
    updateBody
  } = useRequest()

  const handleHeadersChange = (headers: Record<string, string>) => {
    updateHeaders(headers)
  }

  const handleParamsChange = (params: Record<string, string>) => {
    updateParams(params)
  }

  const handleAuthorizationChange = (authorization: Authorization) => {
    updateAuthorization(authorization)
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 lg:border-b-0 lg:border-r lg:max-h-full lg:overflow-y-auto">
      {/* URL Bar */}
      <URLBar 
        method={currentRequest.method}
        url={currentRequest.url}
        isLoading={isLoading}
        canSendRequest={canSendRequest}
        onMethodChange={updateMethod}
        onUrlChange={updateUrl}
        onSendRequest={sendRequest}
        onSaveRequest={onSaveRequest}
      />

      {/* Request Configuration Tabs */}
      <RequestTabs 
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Tab Content */}
      <TabContent 
        activeTab={activeTab}
        headers={currentRequest.headers}
        params={currentRequest.params}
        authorization={currentRequest.authorization}
        body={currentRequest.body}
        onHeadersChange={handleHeadersChange}
        onParamsChange={handleParamsChange}
        onAuthorizationChange={handleAuthorizationChange}
        onBodyChange={updateBody}
      />
    </div>
  )
}

// Sub-components
const URLBar: React.FC<{
  method: string
  url: string
  isLoading: boolean
  canSendRequest: boolean
  onMethodChange: (method: string) => void
  onUrlChange: (url: string) => void
  onSendRequest: () => void
  onSaveRequest: () => void
}> = ({
  method,
  url,
  isLoading,
  canSendRequest,
  onMethodChange,
  onUrlChange,
  onSendRequest,
  onSaveRequest
}) => {
  const { t } = useTranslation()

  return (
    <div className="relative p-4 lg:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/2 via-transparent to-postman-orange/2"></div>
      
      <div className="relative z-10">
        {/* Mobile stacked layout / Desktop horizontal layout */}
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Enhanced Method Selector */}
          <div className="relative">
            <select 
              value={method} 
              onChange={(e) => onMethodChange(e.target.value)}
              className={`
                appearance-none w-full lg:w-auto px-4 py-3 lg:py-2.5 
                rounded-xl lg:rounded-lg border-2 text-white font-bold text-sm 
                min-w-[90px] lg:min-w-[80px] shadow-lg hover:shadow-xl
                transition-all duration-300 transform hover:scale-105
                focus:ring-4 focus:ring-postman-orange/20 focus:border-postman-orange 
                cursor-pointer backdrop-blur-sm
                ${getMethodColors(method as any)}
              `}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Enhanced URL Input */}
          <div className="relative flex-1">
            <input
              type="url"
              placeholder={t('request.url')}
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              className="
                w-full px-4 py-3 lg:py-2.5 rounded-xl lg:rounded-lg
                border-2 border-gray-300/50 dark:border-gray-600/50
                bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                text-gray-900 dark:text-gray-100 
                placeholder-gray-500 dark:placeholder-gray-400
                shadow-lg hover:shadow-xl
                transition-all duration-300
                focus:ring-4 focus:ring-postman-orange/20 
                focus:border-postman-orange focus:bg-white dark:focus:bg-gray-800
                text-sm font-medium
              "
            />
            {/* URL validation indicator */}
            {url && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                {url.startsWith('http') ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                )}
              </div>
            )}
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto lg:flex-shrink-0">
            <SendButton 
              isLoading={isLoading}
              canSend={canSendRequest}
              onSend={onSendRequest}
              label={isLoading ? t('request.sending') : t('request.send')}
            />
            
            <SaveButton onClick={onSaveRequest} />
          </div>
        </div>

        {/* Request Stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-postman-orange rounded-full"></div>
              <span>Ready to send</span>
            </span>
            {url && (
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>{new URL(url, 'http://localhost').hostname}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Cmd</kbd>
            <span className="text-xs text-gray-400">+</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Enter</kbd>
          </div>
        </div>
      </div>
    </div>
  )
}

const SendButton: React.FC<{
  isLoading: boolean
  canSend: boolean
  onSend: () => void
  label: string
}> = ({ isLoading, canSend, onSend, label }) => {
  return (
    <button 
      onClick={onSend}
      disabled={!canSend}
      className={`
        group relative flex-1 sm:flex-none px-8 py-3 lg:py-2.5
        rounded-xl lg:rounded-lg font-bold text-sm
        transition-all duration-300 transform
        flex items-center justify-center space-x-2
        overflow-hidden
        ${!canSend 
          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200 dark:text-gray-400' 
          : `bg-gradient-to-r from-postman-orange to-postman-orange-light 
             text-white shadow-lg hover:shadow-2xl hover:shadow-postman-orange/30
             hover:scale-105 focus:ring-4 focus:ring-postman-orange/30
             hover:from-postman-orange-dark hover:to-postman-orange`
        }
      `}
    >
      {/* Background animation */}
      {canSend && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      )}
      
      <div className="relative z-10 flex items-center space-x-2">
        {isLoading && <LoadingSpinner />}
        <span>{label}</span>
        {!isLoading && canSend && (
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </div>
    </button>
  )
}

const SaveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        group relative p-3 lg:p-2.5 min-w-[48px] lg:min-w-[40px]
        rounded-xl lg:rounded-lg border-2 border-gray-300/50 dark:border-gray-600/50
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        text-gray-600 dark:text-gray-400 
        hover:text-postman-orange dark:hover:text-postman-orange
        hover:border-postman-orange/50 hover:bg-white dark:hover:bg-gray-800
        shadow-lg hover:shadow-xl hover:shadow-postman-orange/10
        transition-all duration-300 transform hover:scale-105
        focus:ring-4 focus:ring-postman-orange/20
      `}
    >
      <div className="relative z-10">
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Save Request
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </button>
  )
}

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const RequestTabs: React.FC<{
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation()

  const tabs = [
    { 
      id: 'params' as ActiveTab, 
      label: 'Params',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      badge: '🔗'
    },
    { 
      id: 'auth' as ActiveTab, 
      label: 'Authorization',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      badge: '🔐'
    },
    { 
      id: 'headers' as ActiveTab, 
      label: t('request.headers'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: '📋'
    },
    { 
      id: 'body' as ActiveTab, 
      label: t('request.body'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      badge: '📝'
    },
  ]

  return (
    <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-b border-gray-200/50 dark:border-gray-700/50">
      {/* Mobile scroll hint */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent pointer-events-none lg:hidden"></div>
      
      <div className="flex overflow-x-auto scrollbar-none">
        {tabs.map((tab, index) => (
          <button 
            key={tab.id}
            className={`
              group relative flex items-center space-x-2 px-4 lg:px-6 py-4
              text-sm font-semibold transition-all duration-300 
              border-b-3 whitespace-nowrap min-w-0 flex-shrink-0
              hover:bg-gradient-to-b hover:from-white/50 hover:to-transparent
              dark:hover:from-gray-800/50 dark:hover:to-transparent dark:bg-gray-800/80
              ${activeTab === tab.id 
                ? `text-postman-orange border-postman-orange 
                   bg-gradient-to-b from-white to-gray-50/50 
                   dark:from-gray-800 dark:to-gray-700/50
                   shadow-lg` 
                : `text-gray-700 dark:text-gray-300 border-transparent 
                   hover:text-gray-900 dark:hover:text-white
                   hover:border-gray-400 dark:hover:border-gray-500
                   hover:bg-gray-50/30 dark:hover:bg-gray-700/20`
              }
            `}
            onClick={() => onTabChange(tab.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Active tab glow effect */}
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/5 to-transparent rounded-t-lg"></div>
            )}
            
            <div className="relative z-10 flex items-center space-x-2">
              <div className={`transition-all duration-300 ${
                activeTab === tab.id ? 'text-postman-orange scale-110' : 'group-hover:scale-105'
              }`}>
                {tab.icon}
              </div>
              
              <span className="font-bold tracking-wide">{tab.label}</span>
            </div>

            {/* Active tab indicator line */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-postman-orange to-postman-orange-light"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

const TabContent: React.FC<{
  activeTab: ActiveTab
  headers: Record<string, string>
  params: Record<string, string>
  authorization: Authorization
  body: string
  onHeadersChange: (headers: Record<string, string>) => void
  onParamsChange: (params: Record<string, string>) => void
  onAuthorizationChange: (authorization: Authorization) => void
  onBodyChange: (value: string) => void
}> = ({ activeTab, headers, params, authorization, body, onHeadersChange, onParamsChange, onAuthorizationChange, onBodyChange }) => {
  const { t } = useTranslation()

  return (
    <div className="p-4 bg-white dark:bg-gray-900 max-h-[50vh] lg:max-h-none overflow-y-auto">
      {activeTab === 'headers' && (
        <HeadersKeyValue 
          headers={headers}
          onChange={onHeadersChange}
        />
      )}

      {activeTab === 'body' && (
        <BodyTab 
          value={body}
          onChange={onBodyChange}
          label={t('request.placeholders.body')}
          headers={headers}
        />
      )}

      {activeTab === 'params' && (
        <ParamsKeyValue 
          params={params}
          onChange={onParamsChange}
        />
      )}
      {activeTab === 'auth' && (
        <AuthorizationComponent 
          authorization={authorization}
          onChange={onAuthorizationChange}
        />
      )}
    </div>
  )
}

const HeadersKeyValue: React.FC<{
  headers: Record<string, string>
  onChange: (headers: Record<string, string>) => void
}> = ({ headers, onChange }) => {
  // Ref to track if we're updating internally or from external props
  const isInternalUpdate = useRef(false)
  
  // Convert headers object to array of HeaderKeyValue
  const [headersList, setHeadersList] = useState<HeaderKeyValue[]>(() => {
    const entries = Object.entries(headers || {}).map(([key, value], index) => ({
      id: `header-${index}`,
      key,
      value,
      enabled: true
    }))
    return entries.length > 0 ? entries : [{ id: 'header-0', key: '', value: '', enabled: true }]
  })

  // Update headersList when headers prop changes (only from external sources)
  useEffect(() => {
    // Skip update if it's from our own internal update
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }
    
    const entries = Object.entries(headers || {}).map(([key, value], index) => ({
      id: `header-${index}`,
      key,
      value,
      enabled: true
    }))
    
    // Only update if we have valid headers from external source (like loading a saved request)
    // or if it's completely different from current state
    if (entries.length > 0) {
      const currentValidHeaders = headersList.filter(h => h.enabled && h.key.trim() && h.value.trim())
      const isDifferent = entries.length !== currentValidHeaders.length || 
                         entries.some((entry, index) => 
                           !currentValidHeaders[index] || 
                           currentValidHeaders[index].key !== entry.key ||
                           currentValidHeaders[index].value !== entry.value
                         )
      
      if (isDifferent) {
        setHeadersList(entries)
      }
    }
  }, [headers, headersList])

  // Convert headersList back to headers object and call onChange
  const updateHeaders = (newHeadersList: HeaderKeyValue[]) => {
    setHeadersList(newHeadersList)
    
    const headersObject: Record<string, string> = {}
    newHeadersList.forEach(header => {
      if (header.enabled && header.key.trim() && header.value.trim()) {
        headersObject[header.key.trim()] = header.value.trim()
      }
    })
    
    // Mark this as an internal update to prevent useEffect from overriding
    isInternalUpdate.current = true
    onChange(headersObject)
  }

  const addHeader = () => {
    const newHeader: HeaderKeyValue = {
      id: `header-${Date.now()}`,
      key: '',
      value: '',
      enabled: true
    }
    updateHeaders([...headersList, newHeader])
  }

  const removeHeader = (id: string) => {
    if (headersList.length <= 1) return // Keep at least one row
    updateHeaders(headersList.filter(h => h.id !== id))
  }

  const updateHeader = (id: string, field: keyof HeaderKeyValue, value: string | boolean) => {
    updateHeaders(headersList.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Request Headers
        </label>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const [key, value] = e.target.value.split('|')
                  const newHeader: HeaderKeyValue = {
                    id: `header-${Date.now()}`,
                    key,
                    value,
                    enabled: true
                  }
                  updateHeaders([...headersList, newHeader])
                  e.target.value = '' // Reset select
                }
              }}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-postman-orange"
            >
              <option value="">Common Headers</option>
              <option value="Content-Type|application/json">Content-Type: application/json</option>
              <option value="Authorization|Bearer ">Authorization: Bearer</option>
              <option value="Accept|application/json">Accept: application/json</option>
              <option value="User-Agent|MyPostman/1.0">User-Agent: MyPostman/1.0</option>
              <option value="X-API-Key|">X-API-Key</option>
              <option value="Cache-Control|no-cache">Cache-Control: no-cache</option>
            </select>
          </div>
          <button
            onClick={addHeader}
            className="inline-flex items-center px-3 py-1.5 bg-postman-orange hover:bg-postman-orange/90 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-postman-orange/50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Header
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {headersList.map((header, index) => (
          <div 
            key={header.id}
            className="group relative bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 p-3 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center space-x-3">
              {/* Enable/Disable Checkbox */}
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                  className="w-4 h-4 text-postman-orange bg-white border-gray-300 rounded focus:ring-postman-orange dark:focus:ring-postman-orange dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              {/* Key Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="e.g. Content-Type"
                  value={header.key}
                  onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent transition-colors duration-200"
                  disabled={!header.enabled}
                />
              </div>

              {/* Value Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="e.g. application/json"
                  value={header.value}
                  onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent transition-colors duration-200"
                  disabled={!header.enabled}
                />
              </div>

              {/* Remove Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => removeHeader(header.id)}
                  disabled={headersList.length <= 1}
                  className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Remove header"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Visual indicator for disabled headers */}
            {!header.enabled && (
              <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg pointer-events-none opacity-60"></div>
            )}
          </div>
        ))}
      </div>
      
      {headersList.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No headers configured</p>
          <button
            onClick={addHeader}
            className="mt-2 text-postman-orange hover:text-postman-orange/80 text-sm font-medium"
          >
            Add your first header
          </button>
        </div>
      )}
    </div>
  )
}

const ParamsKeyValue: React.FC<{
  params: Record<string, string>
  onChange: (params: Record<string, string>) => void
}> = ({ params, onChange }) => {
  // Ref to track if we're updating internally or from external props
  const isInternalUpdate = useRef(false)
  
  // Convert params object to array of ParamKeyValue
  const [paramsList, setParamsList] = useState<ParamKeyValue[]>(() => {
    const entries = Object.entries(params || {}).map(([key, value], index) => ({
      id: `param-${index}`,
      key,
      value,
      enabled: true
    }))
    return entries.length > 0 ? entries : [{ id: 'param-0', key: '', value: '', enabled: true }]
  })

  // Update paramsList when params prop changes (only from external sources)
  useEffect(() => {
    // Skip update if it's from our own internal update
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }
    
    const entries = Object.entries(params || {}).map(([key, value], index) => ({
      id: `param-${index}`,
      key,
      value,
      enabled: true
    }))
    
    // Only update if we have valid params from external source (like loading a saved request)
    // or if it's completely different from current state
    if (entries.length > 0) {
      const currentValidParams = paramsList.filter(p => p.enabled && p.key.trim() && p.value.trim())
      const isDifferent = entries.length !== currentValidParams.length || 
                         entries.some((entry, index) => 
                           !currentValidParams[index] || 
                           currentValidParams[index].key !== entry.key ||
                           currentValidParams[index].value !== entry.value
                         )
      
      if (isDifferent) {
        setParamsList(entries)
      }
    }
  }, [params, paramsList])

  // Convert paramsList back to params object and call onChange
  const updateParams = (newParamsList: ParamKeyValue[]) => {
    setParamsList(newParamsList)
    
    const paramsObject: Record<string, string> = {}
    newParamsList.forEach(param => {
      if (param.enabled && param.key.trim() && param.value.trim()) {
        paramsObject[param.key.trim()] = param.value.trim()
      }
    })
    
    // Mark this as an internal update to prevent useEffect from overriding
    isInternalUpdate.current = true
    onChange(paramsObject)
  }

  const addParam = () => {
    const newParam: ParamKeyValue = {
      id: `param-${Date.now()}`,
      key: '',
      value: '',
      enabled: true
    }
    updateParams([...paramsList, newParam])
  }

  const removeParam = (id: string) => {
    if (paramsList.length <= 1) return // Keep at least one row
    updateParams(paramsList.filter(p => p.id !== id))
  }

  const updateParam = (id: string, field: keyof ParamKeyValue, value: string | boolean) => {
    updateParams(paramsList.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Query Parameters
        </label>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const [key, value] = e.target.value.split('|')
                  const newParam: ParamKeyValue = {
                    id: `param-${Date.now()}`,
                    key,
                    value,
                    enabled: true
                  }
                  updateParams([...paramsList, newParam])
                  e.target.value = '' // Reset select
                }
              }}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-postman-orange"
            >
              <option value="">Common Params</option>
              <option value="page|1">page: 1</option>
              <option value="limit|10">limit: 10</option>
              <option value="sort|name">sort: name</option>
              <option value="order|asc">order: asc</option>
              <option value="filter|">filter</option>
              <option value="search|">search</option>
            </select>
          </div>
          <button
            onClick={addParam}
            className="inline-flex items-center px-3 py-1.5 bg-postman-orange hover:bg-postman-orange/90 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-postman-orange/50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Param
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {paramsList.map((param, index) => (
          <div 
            key={param.id}
            className="group relative bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 p-3 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center space-x-3">
              {/* Enable/Disable Checkbox */}
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={param.enabled}
                  onChange={(e) => updateParam(param.id, 'enabled', e.target.checked)}
                  className="w-4 h-4 text-postman-orange bg-white border-gray-300 rounded focus:ring-postman-orange dark:focus:ring-postman-orange dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              {/* Key Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="e.g. page"
                  value={param.key}
                  onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent transition-colors duration-200"
                  disabled={!param.enabled}
                />
              </div>

              {/* Value Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="e.g. 1"
                  value={param.value}
                  onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent transition-colors duration-200"
                  disabled={!param.enabled}
                />
              </div>

              {/* Remove Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => removeParam(param.id)}
                  disabled={paramsList.length <= 1}
                  className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Remove parameter"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Visual indicator for disabled params */}
            {!param.enabled && (
              <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg pointer-events-none opacity-60"></div>
            )}
          </div>
        ))}
      </div>
      
      {paramsList.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-sm">No parameters configured</p>
          <button
            onClick={addParam}
            className="mt-2 text-postman-orange hover:text-postman-orange/80 text-sm font-medium"
          >
            Add your first parameter
          </button>
        </div>
      )}
    </div>
  )
}

const AuthorizationComponent: React.FC<{
  authorization: Authorization
  onChange: (authorization: Authorization) => void
}> = ({ authorization, onChange }) => {
  const [authType, setAuthType] = useState(authorization.type)
  const [token, setToken] = useState(authorization.token || '')
  const [username, setUsername] = useState(authorization.username || '')
  const [password, setPassword] = useState(authorization.password || '')
  const [apiKey, setApiKey] = useState(authorization.key || '')
  const [apiValue, setApiValue] = useState(authorization.value || '')
  const [addTo, setAddTo] = useState<'header' | 'query'>(authorization.addTo || 'header')

  useEffect(() => {
    setAuthType(authorization.type)
    setToken(authorization.token || '')
    setUsername(authorization.username || '')
    setPassword(authorization.password || '')
    setApiKey(authorization.key || '')
    setApiValue(authorization.value || '')
    setAddTo(authorization.addTo || 'header')
  }, [authorization])

  const updateAuth = () => {
    const newAuth: Authorization = {
      type: authType,
      ...(authType === 'bearer' && { token }),
      ...(authType === 'basic' && { username, password }),
      ...(authType === 'apikey' && { key: apiKey, value: apiValue, addTo }),
    }
    onChange(newAuth)
  }

  useEffect(() => {
    updateAuth()
  }, [authType, token, username, password, apiKey, apiValue, addTo])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Authorization
        </label>
      </div>

      {/* Auth Type Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Type
        </label>
        <select
          value={authType}
          onChange={(e) => setAuthType(e.target.value as Authorization['type'])}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-postman-orange focus:border-transparent"
        >
          <option value="none">No Auth</option>
          <option value="bearer">Bearer Token</option>
          <option value="basic">Basic Auth</option>
          <option value="apikey">API Key</option>
        </select>
      </div>

      {/* Bearer Token */}
      {authType === 'bearer' && (
        <div className="space-y-3 p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-200/30 dark:border-orange-700/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bearer Token
            </label>
          </div>
          <input
            type="text"
            placeholder="Enter your bearer token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent font-mono"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Will be sent as: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Authorization: Bearer {token || 'your_token'}</code>
          </p>
        </div>
      )}

      {/* Basic Auth */}
      {authType === 'basic' && (
        <div className="space-y-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Basic Authentication
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Will be sent as: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Authorization: Basic base64(username:password)</code>
          </p>
        </div>
      )}

      {/* API Key */}
      {authType === 'apikey' && (
        <div className="space-y-3 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-200/30 dark:border-green-700/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              API Key
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Key
              </label>
              <input
                type="text"
                placeholder="e.g. X-API-Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Value
              </label>
              <input
                type="text"
                placeholder="Enter API key value"
                value={apiValue}
                onChange={(e) => setApiValue(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-postman-orange focus:border-transparent font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Add to
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="header"
                  checked={addTo === 'header'}
                  onChange={(e) => setAddTo(e.target.value as 'header' | 'query')}
                  className="w-4 h-4 text-postman-orange border-gray-300 focus:ring-postman-orange dark:focus:ring-postman-orange dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Header</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="query"
                  checked={addTo === 'query'}
                  onChange={(e) => setAddTo(e.target.value as 'header' | 'query')}
                  className="w-4 h-4 text-postman-orange border-gray-300 focus:ring-postman-orange dark:focus:ring-postman-orange dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Query Parameter</span>
              </label>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Will be sent as: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
              {addTo === 'header' 
                ? `${apiKey || 'X-API-Key'}: ${apiValue || 'your_api_key'}` 
                : `?${apiKey || 'api_key'}=${apiValue || 'your_api_key'}`
              }
            </code>
          </p>
        </div>
      )}

      {/* No Auth */}
      {authType === 'none' && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm">No authorization configured</p>
          <p className="text-xs mt-1">Select an authorization type above to secure your requests</p>
        </div>
      )}
    </div>
  )
}

const BodyTab: React.FC<{
  value: string
  onChange: (value: string) => void
  label: string
  headers: Record<string, string>
}> = ({ value, onChange, label, headers }) => {
  // Content-Type detection
  const getContentType = () => {
    const contentType = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === 'content-type'
    )?.[1]?.toLowerCase()
    
    if (contentType?.includes('application/json') || contentType?.includes('text/json')) {
      return 'json'
    }
    if (contentType?.includes('application/xml') || contentType?.includes('text/xml')) {
      return 'xml'
    }
    if (contentType?.includes('text/html')) {
      return 'html'
    }
    if (contentType?.includes('text/css')) {
      return 'css'
    }
    if (contentType?.includes('application/javascript') || contentType?.includes('text/javascript')) {
      return 'javascript'
    }
    if (contentType?.includes('application/yaml') || contentType?.includes('text/yaml') || contentType?.includes('application/x-yaml')) {
      return 'yaml'
    }
    return null
  }

  // Validation functions
  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) return { isValid: true, error: null }
    try {
      JSON.parse(jsonString)
      return { isValid: true, error: null }
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Invalid JSON' }
    }
  }

  const validateXml = (xmlString: string) => {
    if (!xmlString.trim()) return { isValid: true, error: null }
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlString, 'application/xml')
      const parserError = doc.querySelector('parsererror')
      
      if (parserError) {
        return { isValid: false, error: parserError.textContent || 'Invalid XML' }
      }
      return { isValid: true, error: null }
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Invalid XML' }
    }
  }

  const validateHtml = (htmlString: string) => {
    if (!htmlString.trim()) return { isValid: true, error: null }
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')
      
      // Check for basic HTML structure issues
      const parserError = doc.querySelector('parsererror')
      if (parserError) {
        return { isValid: false, error: parserError.textContent || 'Invalid HTML' }
      }
      
      return { isValid: true, error: null }
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Invalid HTML' }
    }
  }

  const validateCss = (cssString: string) => {
    if (!cssString.trim()) return { isValid: true, error: null }
    
    // Basic CSS validation - check for balanced braces
    const openBraces = (cssString.match(/{/g) || []).length
    const closeBraces = (cssString.match(/}/g) || []).length
    
    if (openBraces !== closeBraces) {
      return { isValid: false, error: `Unbalanced braces: ${openBraces} opening, ${closeBraces} closing` }
    }
    
    return { isValid: true, error: null }
  }

  const validateJavaScript = (jsString: string) => {
    if (!jsString.trim()) return { isValid: true, error: null }
    
    try {
      // Basic syntax check using Function constructor
      new Function(jsString)
      return { isValid: true, error: null }
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Invalid JavaScript' }
    }
  }

  const validateYaml = (yamlString: string) => {
    if (!yamlString.trim()) return { isValid: true, error: null }
    
    // Basic YAML validation - check indentation and structure
    const lines = yamlString.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.trim() && line.includes(':')) {
        // Check for basic YAML syntax
        if (line.match(/^[^:]*:[^:]*$/)) {
          continue
        }
      }
    }
    
    return { isValid: true, error: null }
  }

  // Prettify functions
  const prettifyJson = () => {
    if (!value.trim()) return
    try {
      const parsed = JSON.parse(value)
      const prettified = JSON.stringify(parsed, null, 2)
      onChange(prettified)
    } catch (error) {
      console.warn('Cannot prettify invalid JSON:', error)
    }
  }

  const prettifyXml = () => {
    if (!value.trim()) return
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(value, 'application/xml')
      
      // Check for parser errors
      const parserError = doc.querySelector('parsererror')
      if (parserError) {
        console.warn('Cannot prettify invalid XML')
        return
      }
      
      // Simple XML formatting
      let formatted = value
        .replace(/></g, '>\n<')
        .replace(/\n\s*\n/g, '\n')
      
      // Add proper indentation
      const lines = formatted.split('\n')
      let indentLevel = 0
      const formattedLines = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        
        // Decrease indent for closing tags
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1)
        }
        
        const result = '  '.repeat(indentLevel) + trimmed
        
        // Increase indent for opening tags (but not self-closing)
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('<?')) {
          indentLevel++
        }
        
        return result
      })
      
      onChange(formattedLines.filter(line => line).join('\n'))
    } catch (error) {
      console.warn('Cannot prettify XML:', error)
    }
  }

  const prettifyHtml = () => {
    if (!value.trim()) return
    try {
      // Simple HTML formatting
      let formatted = value.replace(/></g, '>\n<')
      formatted = formatted.split('\n').map((line) => {
        const depth = (line.match(/</g) || []).length - (line.match(/<\//g) || []).length
        const indent = '  '.repeat(Math.max(0, depth - 1))
        return indent + line.trim()
      }).join('\n')
      
      onChange(formatted)
    } catch (error) {
      console.warn('Cannot prettify HTML:', error)
    }
  }

  const prettifyCss = () => {
    if (!value.trim()) return
    try {
      // Remove extra whitespace and normalize
      let formatted = value
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/;\s*/g, ';\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/,\s*/g, ',\n')
      
      // Add proper indentation
      const lines = formatted.split('\n')
      let indentLevel = 0
      const formattedLines = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        
        // Decrease indent for closing braces
        if (trimmed === '}') {
          indentLevel = Math.max(0, indentLevel - 1)
        }
        
        const result = '  '.repeat(indentLevel) + trimmed
        
        // Increase indent after opening braces
        if (trimmed.endsWith('{')) {
          indentLevel++
        }
        
        return result
      })
      
      onChange(formattedLines.filter(line => line).join('\n'))
    } catch (error) {
      console.warn('Cannot prettify CSS:', error)
    }
  }

  const prettifyJavaScript = () => {
    if (!value.trim()) return
    try {
      // Simple JS formatting - basic indentation
      let formatted = value
        .replace(/\{/g, ' {\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n')
      
      onChange(formatted)
    } catch (error) {
      console.warn('Cannot prettify JavaScript:', error)
    }
  }

  // Get current format and validation
  const contentType = getContentType()
  
  const getValidation = () => {
    if (!contentType) return null
    
    switch (contentType) {
      case 'json': return validateJson(value)
      case 'xml': return validateXml(value)
      case 'html': return validateHtml(value)
      case 'css': return validateCss(value)
      case 'javascript': return validateJavaScript(value)
      case 'yaml': return validateYaml(value)
      default: return null
    }
  }

  const prettify = () => {
    if (!contentType) return
    
    switch (contentType) {
      case 'json': prettifyJson(); break
      case 'xml': prettifyXml(); break
      case 'html': prettifyHtml(); break
      case 'css': prettifyCss(); break
      case 'javascript': prettifyJavaScript(); break
      default: break
    }
  }

  const validation = getValidation()

  const getFormatInfo = () => {
    const formatMap = {
      'json': { name: 'JSON', color: 'orange', icon: '{}' },
      'xml': { name: 'XML', color: 'blue', icon: '</>' },
      'html': { name: 'HTML', color: 'red', icon: '<>' },
      'css': { name: 'CSS', color: 'purple', icon: '#' },
      'javascript': { name: 'JavaScript', color: 'yellow', icon: 'JS' },
      'yaml': { name: 'YAML', color: 'green', icon: 'YML' }
    }
    return contentType ? formatMap[contentType] : null
  }

  const formatInfo = getFormatInfo()

  const getColorClasses = (color: string) => {
    const colorMap = {
      'orange': {
        bg: 'bg-orange-50/50 dark:bg-orange-900/10',
        border: 'border-orange-200/30 dark:border-orange-700/30',
        text: 'text-orange-700 dark:text-orange-300',
        textSecondary: 'text-orange-600 dark:text-orange-400',
        icon: 'text-orange-500'
      },
      'blue': {
        bg: 'bg-blue-50/50 dark:bg-blue-900/10',
        border: 'border-blue-200/30 dark:border-blue-700/30',
        text: 'text-blue-700 dark:text-blue-300',
        textSecondary: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-500'
      },
      'red': {
        bg: 'bg-red-50/50 dark:bg-red-900/10',
        border: 'border-red-200/30 dark:border-red-700/30',
        text: 'text-red-700 dark:text-red-300',
        textSecondary: 'text-red-600 dark:text-red-400',
        icon: 'text-red-500'
      },
      'purple': {
        bg: 'bg-purple-50/50 dark:bg-purple-900/10',
        border: 'border-purple-200/30 dark:border-purple-700/30',
        text: 'text-purple-700 dark:text-purple-300',
        textSecondary: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-500'
      },
      'yellow': {
        bg: 'bg-yellow-50/50 dark:bg-yellow-900/10',
        border: 'border-yellow-200/30 dark:border-yellow-700/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        textSecondary: 'text-yellow-600 dark:text-yellow-400',
        icon: 'text-yellow-500'
      },
      'green': {
        bg: 'bg-green-50/50 dark:bg-green-900/10',
        border: 'border-green-200/30 dark:border-green-700/30',
        text: 'text-green-700 dark:text-green-300',
        textSecondary: 'text-green-600 dark:text-green-400',
        icon: 'text-green-500'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Request Body
        </label>
        
        {/* Format Controls */}
        {formatInfo && (
          <div className="flex items-center space-x-3">
            {/* Validation Indicator */}
            <div className="flex items-center space-x-2">
              {validation?.isValid ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Valid {formatInfo.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Invalid {formatInfo.name}
                  </span>
                </div>
              )}
            </div>
            
            {/* Prettify Button */}
            <button
              onClick={prettify}
              disabled={!validation?.isValid}
              className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-postman-orange focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title={`Format ${formatInfo.name}`}
            >
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Prettify</span>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-32 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-y focus:ring-2 focus:ring-postman-orange focus:border-transparent transition-colors duration-200 ${
            formatInfo && !validation?.isValid && value.trim()
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          rows={6}
        />
        
        {/* Error Message */}
        {formatInfo && !validation?.isValid && value.trim() && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded px-2 py-1">
            <p className="text-xs text-red-600 dark:text-red-400 font-mono">
              {validation?.error}
            </p>
          </div>
        )}
      </div>

      {/* Format Helper Text */}
      {formatInfo && (
        <div className={`rounded-lg p-3 border ${getColorClasses(formatInfo.color).bg} ${getColorClasses(formatInfo.color).border}`}>
          <div className="flex items-start space-x-2">
            <div className={`w-4 h-4 mt-0.5 flex-shrink-0 flex items-center justify-center text-xs font-bold ${getColorClasses(formatInfo.color).icon}`}>
              {formatInfo.icon}
            </div>
            <div>
              <p className={`text-xs font-medium ${getColorClasses(formatInfo.color).text}`}>
                {formatInfo.name} Body Detected
              </p>
              <p className={`text-xs mt-1 ${getColorClasses(formatInfo.color).textSecondary}`}>
                Your Content-Type header indicates {formatInfo.name} format. 
                Make sure your body contains valid {formatInfo.name} syntax.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
