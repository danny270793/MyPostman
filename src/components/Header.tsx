import { useTranslation } from 'react-i18next'
import { useAppDispatch, useLanguage } from '../store/hooks'
import { appSlice } from '../store/slices/appSlice'

interface HeaderProps {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  onToggleSidebar: () => void
  onToggleTheme: () => void
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  theme,
  onToggleSidebar,
  onToggleTheme
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const language = useLanguage()

  const handleLanguageChange = (newLanguage: string) => {
    dispatch(appSlice.actions.setLanguage(newLanguage as 'en' | 'es'))
  }

  return (
    <header className="relative h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5 dark:shadow-black/20 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-postman-orange/5 via-transparent to-postman-orange/5"></div>
      
      <div className="relative flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Enhanced Mobile/Desktop Menu Toggle */}
          <button 
            className={`group relative p-3 lg:p-2 rounded-2xl lg:rounded-xl transition-all duration-300 transform touch-manipulation active:scale-95 lg:hover:scale-110 focus:scale-110 focus-ring min-w-[48px] min-h-[48px] lg:min-w-[40px] lg:min-h-[40px] ${
              sidebarOpen 
                ? 'bg-postman-orange text-white shadow-lg shadow-postman-orange/25' 
                : 'text-gray-600 dark:text-gray-300 hover:text-postman-orange dark:hover:text-postman-orange hover:bg-postman-orange/10 dark:hover:bg-postman-orange/20'
            }`}
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? t('sidebar.close') : t('sidebar.open')}
          >
            <div className="relative w-6 h-6 lg:w-5 lg:h-5 flex flex-col justify-center">
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                sidebarOpen ? 'rotate-45 translate-y-0.5' : 'translate-y-0'
              }`}></span>
              <span className={`block h-0.5 bg-current rounded-full my-1 transition-all duration-300 ${
                sidebarOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                sidebarOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-0'
              }`}></span>
            </div>
          </button>

          {/* Enhanced App Title with Logo */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-postman-orange to-postman-orange-dark rounded-lg shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent truncate">
              {t('app.title')}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Enhanced Language Selector */}
          <div className="relative">
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-2xl lg:rounded-xl px-4 py-2.5 lg:px-3 lg:py-1.5 pr-10 lg:pr-8 text-base lg:text-sm text-gray-900 dark:text-gray-100 focus-ring transition-all duration-300 hover:border-postman-orange/50 hover:shadow-lg hover:shadow-postman-orange/10 cursor-pointer touch-manipulation min-h-[48px] lg:min-h-[36px]"
            >
              <option value="en">{t('language.english')}</option>
              <option value="es">{t('language.spanish')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Enhanced Theme Toggle */}
          <button 
            onClick={onToggleTheme} 
            className="group relative p-3 lg:p-2 rounded-2xl lg:rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:text-postman-orange dark:hover:text-postman-orange focus-ring transition-all duration-300 hover:border-postman-orange/50 hover:shadow-lg hover:shadow-postman-orange/10 active:scale-95 lg:hover:scale-110 transform touch-manipulation min-w-[48px] min-h-[48px] lg:min-w-[40px] lg:min-h-[40px]"
            aria-label={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
          >
            <div className="relative w-5 h-5 lg:w-4 lg:h-4 flex items-center justify-center">
              {theme === 'light' ? (
                <svg className="w-5 h-5 lg:w-4 lg:h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 lg:w-4 lg:h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                theme === 'light' ? 'bg-blue-400/20 opacity-0 group-hover:opacity-100' : 'bg-yellow-400/20 opacity-0 group-hover:opacity-100'
              }`}></div>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
