import { useTranslation } from 'react-i18next'
import { useRequestHistory, useSavedRequests } from '../store/hooks'
import type { SidebarTab } from '../hooks/useUIState'
import { getMethodBadgeColors, getStatusColors } from '../utils/colors'

interface SidebarProps {
  isOpen: boolean
  activeTab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  onClose: () => void
  onLoadHistoryItem: (id: string) => void
  onLoadSavedRequest: (id: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  onLoadHistoryItem,
  onLoadSavedRequest
}) => {
  const { t } = useTranslation()
  const history = useRequestHistory()
  const savedRequests = useSavedRequests()

  if (!isOpen) return null

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        onClick={onClose}
      />

      <aside className="fixed lg:relative z-30 w-full lg:w-72 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden h-full lg:h-auto transform transition-transform duration-300 ease-in-out">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          <SidebarTabButton
            isActive={activeTab === 'collections'}
            onClick={() => onTabChange('collections')}
            icon={<CollectionsIcon />}
            label={t('tabs.collections')}
          />
          <SidebarTabButton
            isActive={activeTab === 'history'}
            onClick={() => onTabChange('history')}
            icon={<HistoryIcon />}
            label={t('tabs.history')}
          />
          <SidebarTabButton
            isActive={activeTab === 'saved'}
            onClick={() => onTabChange('saved')}
            icon={<SavedIcon />}
            label={t('tabs.saved')}
          />
        </div>
        
        {/* Tab content */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {activeTab === 'history' && (
            <HistoryContent 
              history={history}
              onLoadItem={onLoadHistoryItem}
              emptyMessage={t('history.empty')}
            />
          )}
          
          {activeTab === 'saved' && (
            <SavedContent 
              savedRequests={savedRequests}
              onLoadRequest={onLoadSavedRequest}
              emptyMessage={t('saved.empty')}
            />
          )}
          
          {activeTab === 'collections' && (
            <CollectionsContent />
          )}
        </div>
      </aside>
    </>
  )
}

// Sub-components for better organization
const SidebarTabButton: React.FC<{
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}> = ({ isActive, onClick, icon, label }) => {
  return (
    <button 
      className={`flex-1 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-colors duration-200 border-b-2 ${
        isActive 
          ? 'text-white border-postman-orange bg-gray-700' 
          : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <span className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </span>
    </button>
  )
}

const HistoryContent: React.FC<{
  history: any[]
  onLoadItem: (id: string) => void
  emptyMessage: string
}> = ({ history, onLoadItem, emptyMessage }) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h3 className="text-white text-sm font-semibold">{t('history.title')}</h3>
      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl text-gray-500 mb-2">🕒</div>
          <p className="text-gray-400 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.slice(0, 10).map((item) => (
            <div 
              key={item.id} 
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-600"
              onClick={() => onLoadItem(item.id)}
            >
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getMethodBadgeColors(item.method)}`}>
                {item.method}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate">{item.url}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColors(item.status)}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SavedContent: React.FC<{
  savedRequests: any[]
  onLoadRequest: (id: string) => void
  emptyMessage: string
}> = ({ savedRequests, onLoadRequest, emptyMessage }) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h3 className="text-white text-sm font-semibold">{t('saved.title')}</h3>
      {savedRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl text-gray-500 mb-2">⭐</div>
          <p className="text-gray-400 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {savedRequests.map((request) => (
            <div 
              key={request.id} 
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-600"
              onClick={() => onLoadRequest(request.id)}
            >
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getMethodBadgeColors(request.method)}`}>
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
  )
}

const CollectionsContent: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h3 className="text-white text-sm font-semibold">{t('tabs.collections')}</h3>
      <div className="text-center py-8">
        <div className="text-4xl text-gray-500 mb-2">📁</div>
        <p className="text-gray-400 text-sm">Collections coming soon...</p>
      </div>
    </div>
  )
}

// Icon components
const CollectionsIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
  </svg>
)

const HistoryIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SavedIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)
