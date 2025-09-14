import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { ResponseTab } from '../hooks/useUIState'
import { useRequest } from '../hooks/useRequest'
import { getStatusColors } from '../utils/colors'

// Utility functions for formatting response metadata
const formatTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`
  } else {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0)
    return `${minutes}m ${seconds}s`
  }
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, unitIndex)
  
  if (unitIndex === 0) {
    return `${bytes} B`
  } else {
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
}

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
            time={formatTime(response.responseTime)}
            size={formatSize(response.responseSize)}
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
              {t('response.failed')}
            </span>
          </div>
          <div className="space-y-3">
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-red-200/30 dark:border-red-700/30">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-semibold">{t('response.errorMessage')}</span> {error.message}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-red-200/30 dark:border-red-700/30">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-semibold">{t('response.errorStatus')}</span> {error.status}
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
                {t('response.errorSuggestion')}
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
      label: t('response.cookies'),
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
              group relative flex items-center space-x-2 px-6 lg:px-6 py-5 lg:py-4
              text-base lg:text-sm font-semibold transition-all duration-300 
              border-b-3 whitespace-nowrap min-w-0 flex-shrink-0
              touch-manipulation active:scale-95 lg:hover:scale-[1.02]
              hover:bg-gradient-to-b hover:from-white/50 hover:to-transparent
              dark:hover:from-gray-800/50 dark:hover:to-transparent dark:bg-gray-800/80
              min-h-[64px] lg:min-h-[56px] focus:outline-none
              ${activeTab === tab.id 
                ? `text-blue-600 dark:text-blue-400 border-blue-500 
                   bg-gradient-to-b from-white to-blue-50/30 
                   dark:from-gray-800 dark:to-blue-900/30
                   shadow-lg ring-2 ring-blue-300/20 dark:ring-blue-700/30` 
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
                <div className="w-5 h-5 lg:w-4 lg:h-4">
                  {tab.icon}
                </div>
              </div>
              
              <span className="font-bold tracking-wide truncate">{tab.label}</span>
              
              {/* Emoji badge for visual appeal */}
              <span className="text-sm lg:text-xs opacity-70">{tab.badge}</span>
            </div>

            {/* Active tab indicator line */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 inset-x-0 h-1 lg:h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t-sm"></div>
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
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
        <div className="animate-[fadeIn_0.3s_ease-out]">
          {activeTab === 'body' && (
            <ResponseBody 
              key={`response-body-${response.url}-${response.responseTime}`}
              data={response.data} 
              headers={response.headers} 
              size={response.responseSize} 
            />
          )}
          
          {activeTab === 'headers' && (
            <ResponseHeaders 
              key={`response-headers-${response.url}-${response.responseTime}`}
              headers={response.headers} 
            />
          )}
          
          {activeTab === 'cookies' && (
            <ResponseCookies 
              key={`response-cookies-${response.url}-${response.responseTime}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const ResponseBody: React.FC<{ data: any; headers: Record<string, string>; size: number }> = ({ data, headers }) => {
  const { t } = useTranslation()
  const [displayData, setDisplayData] = useState(() => {
    // Show raw data by default
    return typeof data === 'string' ? data : JSON.stringify(data)
  })
  const [isPrettified, setIsPrettified] = useState(false)
  
  // Update displayData when data or headers change (new response arrives)
  useEffect(() => {
    const rawData = typeof data === 'string' ? data : JSON.stringify(data)
    setDisplayData(rawData)
    setIsPrettified(false) // Reset to raw when new response arrives
  }, [data, headers])
  
  // Content-Type detection for responses
  const getResponseContentType = () => {
    const contentType = Object.entries(headers || {}).find(
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
    if (contentType?.includes('text/plain')) {
      return 'text'
    }
    return 'text'
  }

  const contentType = getResponseContentType()

  // Prettify functions for different formats
  const prettifyResponse = () => {
    const rawData = typeof data === 'string' ? data : JSON.stringify(data)
    
    try {
      let prettified = rawData
      
      switch (contentType) {
        case 'json':
          try {
            const parsed = JSON.parse(rawData)
            prettified = JSON.stringify(parsed, null, 2)
          } catch {
            prettified = rawData // Keep as is if not valid JSON
          }
          break
          
        case 'xml':
          try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(rawData, 'application/xml')
            const parserError = doc.querySelector('parsererror')
            
            if (!parserError) {
              // Simple XML formatting
              prettified = rawData
                .replace(/></g, '>\n<')
                .replace(/\n\s*\n/g, '\n')
              
              // Add proper indentation
              const lines = prettified.split('\n')
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
              
              prettified = formattedLines.filter(line => line).join('\n')
            }
          } catch {
            prettified = rawData
          }
          break
          
        case 'html':
          try {
            prettified = rawData
              .replace(/></g, '>\n<')
              .split('\n')
              .map((line) => {
                const depth = (line.match(/</g) || []).length - (line.match(/<\//g) || []).length
                const indent = '  '.repeat(Math.max(0, depth - 1))
                return indent + line.trim()
              })
              .join('\n')
          } catch {
            prettified = rawData
          }
          break
          
        case 'css':
          try {
            prettified = rawData
              .replace(/\s*{\s*/g, ' {\n')
              .replace(/;\s*/g, ';\n')
              .replace(/\s*}\s*/g, '\n}\n')
              .replace(/,\s*/g, ',\n')
            
            // Add proper indentation
            const lines = prettified.split('\n')
            let indentLevel = 0
            const formattedLines = lines.map(line => {
              const trimmed = line.trim()
              if (!trimmed) return ''
              
              if (trimmed === '}') {
                indentLevel = Math.max(0, indentLevel - 1)
              }
              
              const result = '  '.repeat(indentLevel) + trimmed
              
              if (trimmed.endsWith('{')) {
                indentLevel++
              }
              
              return result
            })
            
            prettified = formattedLines.filter(line => line).join('\n')
          } catch {
            prettified = rawData
          }
          break
          
        default:
          prettified = rawData
          break
      }
      
      setDisplayData(prettified)
      setIsPrettified(true)
    } catch (error) {
      console.warn('Cannot prettify response:', error)
    }
  }

  const resetToRaw = () => {
    const rawData = typeof data === 'string' ? data : JSON.stringify(data)
    setDisplayData(rawData)
    setIsPrettified(false)
  }

  // Format info for UI
  const getFormatInfo = () => {
    const formatMap = {
      'json': { name: t('response.formats.json'), color: 'green', icon: '{}' },
      'xml': { name: t('response.formats.xml'), color: 'blue', icon: '</>' },
      'html': { name: t('response.formats.html'), color: 'red', icon: '<>' },
      'css': { name: t('response.formats.css'), color: 'purple', icon: '#' },
      'javascript': { name: t('response.formats.javascript'), color: 'yellow', icon: 'JS' },
      'yaml': { name: t('response.formats.yaml'), color: 'emerald', icon: 'YML' },
      'text': { name: t('response.formats.text'), color: 'gray', icon: 'TXT' }
    }
    return formatMap[contentType] || formatMap.text
  }

  const formatInfo = getFormatInfo()

  const getColorClasses = (color: string) => {
    const colorMap = {
      'green': 'from-green-500 to-green-600',
      'blue': 'from-blue-500 to-blue-600', 
      'red': 'from-red-500 to-red-600',
      'purple': 'from-purple-500 to-purple-600',
      'yellow': 'from-yellow-500 to-yellow-600',
      'emerald': 'from-emerald-500 to-emerald-600',
      'gray': 'from-gray-500 to-gray-600'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.green
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 bg-gradient-to-br ${getColorClasses(formatInfo.color)} rounded-lg flex items-center justify-center shadow-lg`}>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {t('response.body')}
          </label>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${formatInfo.color}-100 dark:bg-${formatInfo.color}-900/30 text-${formatInfo.color}-800 dark:text-${formatInfo.color}-200`}>
            {formatInfo.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Prettify/Raw Toggle Buttons */}
          {contentType !== 'text' && (
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={resetToRaw}
                disabled={!isPrettified}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-200 ${
                  !isPrettified 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {t('response.raw')}
              </button>
              <button
                onClick={prettifyResponse}
                disabled={isPrettified}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-200 ${
                  isPrettified 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {t('response.pretty')}
              </button>
            </div>
          )}
          
          <CopyButton data={displayData} />
        </div>
      </div>
      
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r from-${formatInfo.color}-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <pre className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-4 lg:p-6 font-mono text-xs lg:text-sm text-gray-900 dark:text-gray-100 overflow-auto whitespace-pre-wrap break-words shadow-lg hover:shadow-xl hover:shadow-${formatInfo.color}-500/10 transition-all duration-300 leading-relaxed max-h-[40vh] lg:max-h-none`}>
          {displayData}
        </pre>
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
  const { t } = useTranslation()
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
      <span>{copied ? t('response.copied') : t('response.copy')}</span>
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
        {t('response.noResponseDesc')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        {[
          { icon: '📄', title: t('response.emptyState.features.0.title'), desc: t('response.emptyState.features.0.description') },
          { icon: '📋', title: t('response.emptyState.features.1.title'), desc: t('response.emptyState.features.1.description') },
          { icon: '🍪', title: t('response.emptyState.features.2.title'), desc: t('response.emptyState.features.2.description') }
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
