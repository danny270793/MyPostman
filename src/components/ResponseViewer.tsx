import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ResponseTab } from '../hooks/useUIState'
import { useRequest } from '../hooks/useRequest'
import { getStatusColors } from '../utils/colors'
import { formatJSON } from '../utils/formatting'

interface ResponseViewerProps {
  activeTab: ResponseTab
  onTabChange: (tab: ResponseTab) => void
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  activeTab,
  onTabChange
}) => {
  const { response, error, hasResponse, hasError } = useRequest()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Response Header */}
      <ResponseHeader response={response} />

      {/* Error Display */}
      {hasError && <ErrorDisplay error={error} />}

      {/* Response Content */}
      {hasResponse && (
        <>
          <ResponseTabs 
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
          <ResponseContent 
            response={response}
            activeTab={activeTab}
          />
        </>
      )}

      {/* Empty State */}
      {!hasResponse && !hasError && <EmptyState />}
    </div>
  )
}

// Sub-components
const ResponseHeader: React.FC<{ response: any }> = ({ response }) => {
  const { t } = useTranslation()

  return (
    <div className="relative p-4 lg:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/2 via-transparent to-postman-orange/2"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            {t('response.title')}
          </h3>
        </div>
        
        {response && (
          <ResponseMeta 
            status={response.status}
            time="100ms" // Placeholder
            size="1KB"   // Placeholder
          />
        )}
      </div>
    </div>
  )
}

const ResponseMeta: React.FC<{
  status: number
  time: string
  size: string
}> = ({ status, time, size }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <StatusBadge status={status} />
      <div className="flex items-center space-x-4 text-sm">
        <TimeIndicator time={time} />
        <SizeIndicator size={size} />
      </div>
    </div>
  )
}

const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    } else if (status >= 400) {
      return (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
    return (
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div className="flex items-center">
      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg ${getStatusColors(status)} transition-all duration-300 transform hover:scale-105`}>
        {getStatusIcon(status)}
        {status}
      </span>
    </div>
  )
}

const TimeIndicator: React.FC<{ time: string }> = ({ time }) => {
  return (
    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/50 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-xs font-medium">~ {time}</span>
    </div>
  )
}

const SizeIndicator: React.FC<{ size: string }> = ({ size }) => {
  return (
    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/50 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className="text-xs font-medium">~ {size}</span>
    </div>
  )
}

const ErrorDisplay: React.FC<{ error: any }> = ({ error }) => {
  const { t } = useTranslation()

  return (
    <div className="m-4 lg:m-6 bg-gradient-to-r from-red-50 via-red-50 to-orange-50 dark:from-red-900/20 dark:via-red-900/10 dark:to-orange-900/20 border-2 border-red-200/50 dark:border-red-700/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-base font-bold text-red-800 dark:text-red-200">
              {t('response.error')}
            </h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-200">
              Failed
            </span>
          </div>
          <div className="space-y-3">
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-red-200/30 dark:border-red-700/30">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-semibold">Message:</span> {error.message}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-red-200/30 dark:border-red-700/30">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-semibold">Status:</span> {error.status}
              </p>
            </div>
          </div>
          
          {/* Retry suggestion */}
          <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Try checking your URL, network connection, or server availability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ResponseTabs: React.FC<{
  activeTab: ResponseTab
  onTabChange: (tab: ResponseTab) => void
}> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation()

  const tabs = [
    { 
      id: 'body' as ResponseTab, 
      label: t('response.data'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      badge: '📄'
    },
    { 
      id: 'headers' as ResponseTab, 
      label: t('request.headers'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: '📋'
    },
    { 
      id: 'cookies' as ResponseTab, 
      label: 'Cookies',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      badge: '🍪'
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
                ? `text-blue-600 dark:text-blue-400 border-blue-500 
                   bg-gradient-to-b from-white to-blue-50/30 
                   dark:from-gray-800 dark:to-blue-900/30
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-t-lg"></div>
            )}
            
            <div className="relative z-10 flex items-center space-x-2">
              <div className={`transition-all duration-300 ${
                activeTab === tab.id ? 'text-blue-500 dark:text-blue-400 scale-110' : 'group-hover:scale-105'
              }`}>
                {tab.icon}
              </div>
              
              <span className="font-bold tracking-wide">{tab.label}</span>
              
              {/* Emoji badge for visual appeal */}
              <span className="text-xs opacity-70">{tab.badge}</span>
            </div>

            {/* Active tab indicator line */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

const ResponseContent: React.FC<{
  response: any
  activeTab: ResponseTab
}> = ({ response, activeTab }) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
        <div className="animate-[fadeIn_0.3s_ease-out]">
          {activeTab === 'body' && (
            <ResponseBody data={response.data} />
          )}
          
          {activeTab === 'headers' && (
            <ResponseHeaders headers={response.headers} />
          )}
          
          {activeTab === 'cookies' && (
            <ResponseCookies />
          )}
        </div>
      </div>
    </div>
  )
}

const ResponseBody: React.FC<{ data: any }> = ({ data }) => {
  const formattedData = formatJSON(data)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Response Body
          </label>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
            JSON
          </span>
        </div>
        <CopyButton data={formattedData} />
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <pre className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-6 font-mono text-sm text-gray-900 dark:text-gray-100 overflow-x-auto whitespace-pre-wrap break-words shadow-lg hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 leading-relaxed">
          {formattedData}
        </pre>
        
        {/* Size indicator */}
        <div className="absolute top-4 right-4 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-600 dark:text-gray-400 font-medium">
          {new Blob([formattedData]).size} bytes
        </div>
      </div>
    </div>
  )
}

const ResponseHeaders: React.FC<{ headers: Record<string, string> }> = ({ headers }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
          Response Headers
        </label>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
          {Object.keys(headers).length} headers
        </span>
      </div>
      
      <div className="grid gap-3">
        {Object.entries(headers).map(([key, value], index) => (
          <div 
            key={key} 
            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl p-4 shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:scale-[1.02]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:min-w-[160px] lg:min-w-[200px]">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="font-bold text-gray-900 dark:text-gray-100 break-all text-sm">
                  {key}
                </span>
              </div>
              <div className="flex-1 ml-0 sm:ml-4">
                <span className="text-gray-600 dark:text-gray-400 break-all text-sm font-medium bg-gray-100/50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                  {value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ResponseCookies: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400/20 to-yellow-500/20 rounded-3xl flex items-center justify-center shadow-lg border border-orange-300/20 dark:border-orange-500/20">
        <div className="text-4xl">🍪</div>
      </div>
      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No Cookies Found</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
        This response doesn't contain any cookies. Cookies will appear here when present in the response headers.
      </p>
      
      <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Cookies help track sessions and user preferences</span>
        </div>
      </div>
    </div>
  )
}

const CopyButton: React.FC<{ data: string }> = ({ data }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <button 
      onClick={handleCopy}
      className={`
        group relative px-3 py-2 text-xs font-semibold rounded-lg
        transition-all duration-300 transform hover:scale-105
        flex items-center space-x-2 shadow-lg
        ${copied 
          ? 'bg-green-500 text-white' 
          : 'bg-white/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400 hover:bg-postman-orange hover:text-white border-2 border-gray-200/50 dark:border-gray-600/50 hover:border-postman-orange'
        }
      `}
    >
      <svg className={`w-3 h-3 transition-transform duration-300 ${copied ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        )}
      </svg>
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  )
}

const EmptyState: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="relative mb-8 animate-[float_3s_ease-in-out_infinite]">
        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl border border-gray-200/50 dark:border-gray-600/50">
          <div className="text-5xl">📝</div>
        </div>
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-postman-orange rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-6 -right-4 w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-4">
        {t('response.noResponse')}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 text-base mb-8 max-w-md">
        Send a request to see the response here. The response data, headers, and cookies will be displayed in organized tabs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        {[
          { icon: '📄', title: 'Response Body', desc: 'JSON, XML, HTML data' },
          { icon: '📋', title: 'Headers', desc: 'HTTP response headers' },
          { icon: '🍪', title: 'Cookies', desc: 'Session cookies' }
        ].map((item, index) => (
          <div 
            key={index} 
            className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/30 dark:border-gray-600/30 backdrop-blur-sm shadow-lg"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-1">{item.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
