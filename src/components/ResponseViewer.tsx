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
  const { t } = useTranslation()
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
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('response.title')}
      </h3>
      
      {response && (
        <ResponseMeta 
          status={response.status}
          time="100ms" // Placeholder
          size="1KB"   // Placeholder
        />
      )}
    </div>
  )
}

const ResponseMeta: React.FC<{
  status: number
  time: string
  size: string
}> = ({ status, time, size }) => {
  return (
    <div className="flex items-center space-x-4 text-sm">
      <StatusBadge status={status} />
      <TimeIndicator time={time} />
      <SizeIndicator size={size} />
    </div>
  )
}

const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColors(status)}`}>
      {status}
    </span>
  )
}

const TimeIndicator: React.FC<{ time: string }> = ({ time }) => {
  return (
    <span className="text-gray-600 dark:text-gray-400 flex items-center">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      ~ {time}
    </span>
  )
}

const SizeIndicator: React.FC<{ size: string }> = ({ size }) => {
  return (
    <span className="text-gray-600 dark:text-gray-400 flex items-center">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      ~ {size}
    </span>
  )
}

const ErrorDisplay: React.FC<{ error: any }> = ({ error }) => {
  const { t } = useTranslation()

  return (
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
  )
}

const ResponseTabs: React.FC<{
  activeTab: ResponseTab
  onTabChange: (tab: ResponseTab) => void
}> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation()

  const tabs = [
    { id: 'body' as ResponseTab, label: t('response.data') },
    { id: 'headers' as ResponseTab, label: t('request.headers') },
    { id: 'cookies' as ResponseTab, label: 'Cookies' },
  ]

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === tab.id 
              ? 'text-postman-orange border-postman-orange bg-white dark:bg-gray-900' 
              : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

const ResponseContent: React.FC<{
  response: any
  activeTab: ResponseTab
}> = ({ response, activeTab }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-900">
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
  )
}

const ResponseBody: React.FC<{ data: any }> = ({ data }) => {
  const formattedData = formatJSON(data)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Response Body
        </label>
        <CopyButton data={formattedData} />
      </div>
      <pre className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-gray-100 overflow-x-auto whitespace-pre-wrap break-words">
        {formattedData}
      </pre>
    </div>
  )
}

const ResponseHeaders: React.FC<{ headers: Record<string, string> }> = ({ headers }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Response Headers
      </label>
      <div className="space-y-2">
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="flex p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[120px] break-all">
              {key}:
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-3 break-all flex-1">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ResponseCookies: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="text-4xl text-gray-400 mb-2">🍪</div>
      <p className="text-gray-500 dark:text-gray-400">No cookies in this response</p>
    </div>
  )
}

const CopyButton: React.FC<{ data: string }> = ({ data }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <button 
      onClick={handleCopy}
      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      Copy
    </button>
  )
}

const EmptyState: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
      <div className="text-6xl text-gray-400 dark:text-gray-500 mb-4">📝</div>
      <p className="text-gray-500 dark:text-gray-400 text-lg">{t('response.noResponse')}</p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
        Send a request to see the response here
      </p>
    </div>
  )
}
