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
    <header className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Mobile hamburger menu */}
        <button 
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? t('sidebar.close') : t('sidebar.open')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop sidebar toggle */}
        <button 
          className="hidden lg:block p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? t('sidebar.close') : t('sidebar.open')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white truncate">
          {t('app.title')}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Language selector */}
        <select 
          value={language} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-2 py-1.5 lg:px-3 lg:py-1.5 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-postman-orange focus:border-transparent transition-colors duration-200"
        >
          <option value="en">{t('language.english')}</option>
          <option value="es">{t('language.spanish')}</option>
        </select>

        {/* Theme toggle */}
        <button 
          onClick={onToggleTheme} 
          className="p-1.5 lg:p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200 focus:ring-2 focus:ring-postman-orange"
          aria-label={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
        >
          {theme === 'light' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
