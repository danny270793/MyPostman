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
      <aside className={`
        fixed lg:relative z-50 w-full max-w-sm lg:w-80 
        bg-gray-900/95 lg:bg-gray-900/90 
        backdrop-blur-xl border-r border-gray-700/50 
        flex flex-col overflow-hidden h-full lg:h-auto 
        transform transition-all duration-500 ease-in-out
        shadow-2xl lg:shadow-xl shadow-black/20
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Enhanced Header with Close Button for Mobile */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/5 via-transparent to-postman-orange/5"></div>
          
          {/* Mobile Close Button */}
          <button 
            className="absolute top-3 right-3 lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 z-10"
            onClick={onClose}
            aria-label={t('sidebar.close')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Enhanced Tab Navigation */}
          <div className="relative flex">
            <SidebarTabButton
              isActive={activeTab === 'collections'}
              onClick={() => onTabChange('collections')}
              icon={<CollectionsIcon />}
              label={t('tabs.collections')}
              count={0}
            />
            <SidebarTabButton
              isActive={activeTab === 'history'}
              onClick={() => onTabChange('history')}
              icon={<HistoryIcon />}
              label={t('tabs.history')}
              count={history.length}
            />
            <SidebarTabButton
              isActive={activeTab === 'saved'}
              onClick={() => onTabChange('saved')}
              icon={<SavedIcon />}
              label={t('tabs.saved')}
              count={savedRequests.length}
            />
          </div>
        </div>
        
        {/* Enhanced Tab Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6">
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
        </div>

        {/* Footer with Stats */}
        <div className="border-t border-gray-700/50 bg-gray-900/50 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{history.length + savedRequests.length} total requests</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Ready</span>
            </div>
          </div>
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
  count?: number
}> = ({ isActive, onClick, icon, label, count }) => {
  return (
    <button 
      className={`group relative flex-1 px-3 lg:px-4 py-4 text-xs font-semibold transition-all duration-300 border-b-2 ${
        isActive 
          ? 'text-white border-postman-orange bg-gradient-to-b from-gray-800/50 to-gray-700/50 shadow-lg' 
          : 'text-gray-400 border-transparent hover:text-white hover:bg-gradient-to-b hover:from-gray-800/30 hover:to-gray-700/30 hover:border-postman-orange/30'
      }`}
      onClick={onClick}
    >
      {/* Active tab indicator */}
      {isActive && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-postman-orange to-postman-orange-light"></div>
      )}
      
      <div className="flex flex-col items-center space-y-1.5">
        <div className={`relative transition-transform duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}>
          {icon}
          
          {/* Count badge */}
          {count !== undefined && count > 0 && (
            <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-postman-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
              {count > 99 ? '99+' : count}
            </div>
          )}
        </div>
        
        <span className={`text-[10px] lg:text-xs uppercase tracking-wider font-bold transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
        }`}>
          {label}
        </span>
      </div>

      {/* Hover glow effect */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-postman-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
      )}
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
    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-sm font-bold tracking-wide">{t('history.title')}</h3>
        {history.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
            {history.length} {history.length === 1 ? 'request' : 'requests'}
          </span>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">{emptyMessage}</p>
          <p className="text-gray-500 text-xs mt-2">Make your first request to see it here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.slice(0, 10).map((item, index) => (
            <div 
              key={item.id} 
              className="group relative flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-600/30 hover:shadow-lg hover:shadow-black/20 transform hover:scale-[1.02]"
              onClick={() => onLoadItem(item.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              <span className={`relative z-10 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${getMethodBadgeColors(item.method)}`}>
                {item.method}
              </span>
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-sm text-gray-200 group-hover:text-white truncate transition-colors duration-300 font-medium">
                  {item.url}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <span className={`relative z-10 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColors(item.status)}`}>
                {item.status}
              </span>
              
              {/* Arrow indicator */}
              <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
          
          {history.length > 10 && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                +{history.length - 10} more requests
              </p>
            </div>
          )}
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
    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-sm font-bold tracking-wide">{t('saved.title')}</h3>
        {savedRequests.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
            {savedRequests.length} saved
          </span>
        )}
      </div>
      
      {savedRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg border border-yellow-500/10">
            <svg className="w-8 h-8 text-yellow-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">{emptyMessage}</p>
          <p className="text-gray-500 text-xs mt-2">Save your favorite requests for quick access</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedRequests.map((request, index) => (
            <div 
              key={request.id} 
              className="group relative flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-600/30 hover:shadow-lg hover:shadow-black/20 transform hover:scale-[1.02]"
              onClick={() => onLoadRequest(request.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              {/* Star indicator */}
              <div className="relative z-10 w-6 h-6 flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>

              <span className={`relative z-10 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${getMethodBadgeColors(request.method)}`}>
                {request.method}
              </span>
              
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300 truncate">
                  {request.name}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300 truncate">
                  {request.url}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-sm font-bold tracking-wide">{t('tabs.collections')}</h3>
        <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
          Beta
        </span>
      </div>
      
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg border border-purple-500/10">
          <svg className="w-8 h-8 text-purple-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm font-medium">Collections coming soon</p>
        <p className="text-gray-500 text-xs mt-2">Organize your requests into collections</p>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/10">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-purple-300 font-medium">Coming in v2.0</span>
          </div>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Group related requests</li>
            <li>• Share collections with team</li>
            <li>• Run collections as tests</li>
            <li>• Export/Import collections</li>
          </ul>
        </div>
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
