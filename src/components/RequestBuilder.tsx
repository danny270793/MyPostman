import { useTranslation } from 'react-i18next'
import type { ActiveTab } from '../hooks/useUIState'
import { useRequest } from '../hooks/useRequest'
import { getMethodColors } from '../utils/colors'
import { parseJSON, formatJSON } from '../utils/formatting'

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
  const { t } = useTranslation()
  const {
    currentRequest,
    isLoading,
    canSendRequest,
    sendRequest,
    updateMethod,
    updateUrl,
    updateHeaders,
    updateBody
  } = useRequest()

  const handleHeadersChange = (value: string) => {
    const parsed = parseJSON(value)
    if (parsed !== null) {
      updateHeaders(parsed)
    }
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
        headers={formatJSON(currentRequest.headers)}
        body={currentRequest.body}
        onHeadersChange={handleHeadersChange}
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
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 lg:items-center">
        <select 
          value={method} 
          onChange={(e) => onMethodChange(e.target.value)}
          className={`px-4 py-2 border rounded-md text-white font-semibold text-sm min-w-[80px] focus:ring-2 focus:ring-offset-2 focus:ring-postman-orange focus:border-transparent ${getMethodColors(method as any)}`}
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
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-postman-orange focus:border-transparent text-sm"
        />
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <SendButton 
            isLoading={isLoading}
            canSend={canSendRequest}
            onSend={onSendRequest}
            label={isLoading ? t('request.sending') : t('request.send')}
          />
          
          <SaveButton onClick={onSaveRequest} />
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
      className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
        !canSend 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-postman-orange hover:bg-postman-orange-hover shadow-lg hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-postman-orange'
      }`}
    >
      {isLoading && <LoadingSpinner />}
      <span>{label}</span>
    </button>
  )
}

const SaveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:ring-2 focus:ring-postman-orange sm:w-auto"
    >
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
      </svg>
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
    { id: 'params' as ActiveTab, label: 'Params' },
    { id: 'auth' as ActiveTab, label: 'Authorization' },
    { id: 'headers' as ActiveTab, label: t('request.headers') },
    { id: 'body' as ActiveTab, label: t('request.body') },
  ]

  return (
    <div className="flex flex-wrap sm:flex-nowrap border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 whitespace-nowrap ${
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

const TabContent: React.FC<{
  activeTab: ActiveTab
  headers: string
  body: string
  onHeadersChange: (value: string) => void
  onBodyChange: (value: string) => void
}> = ({ activeTab, headers, body, onHeadersChange, onBodyChange }) => {
  const { t } = useTranslation()

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      {activeTab === 'headers' && (
        <HeadersTab 
          value={headers}
          onChange={onHeadersChange}
          label={t('request.placeholders.headers')}
        />
      )}

      {activeTab === 'body' && (
        <BodyTab 
          value={body}
          onChange={onBodyChange}
          label={t('request.placeholders.body')}
        />
      )}

      {activeTab === 'params' && <ComingSoonTab icon="🔗" />}
      {activeTab === 'auth' && <ComingSoonTab icon="🔐" />}
    </div>
  )
}

const HeadersTab: React.FC<{
  value: string
  onChange: (value: string) => void
  label: string
}> = ({ value, onChange, label }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Request Headers (JSON format)
      </label>
      <textarea
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-y focus:ring-2 focus:ring-postman-orange focus:border-transparent"
        rows={6}
      />
    </div>
  )
}

const BodyTab: React.FC<{
  value: string
  onChange: (value: string) => void
  label: string
}> = ({ value, onChange, label }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Request Body
      </label>
      <textarea
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-y focus:ring-2 focus:ring-postman-orange focus:border-transparent"
        rows={6}
      />
    </div>
  )
}

const ComingSoonTab: React.FC<{ icon: string }> = ({ icon }) => {
  return (
    <div className="text-center py-8">
      <div className="text-4xl text-gray-400 mb-2">{icon}</div>
      <p className="text-gray-500 dark:text-gray-400">Coming soon...</p>
    </div>
  )
}
