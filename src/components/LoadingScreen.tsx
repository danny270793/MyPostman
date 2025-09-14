import { useTranslation } from 'react-i18next'

interface LoadingScreenProps {
  title?: string
  subtitle?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  title, 
  subtitle 
}) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-postman-orange/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-postman-orange/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-postman-orange/3 to-transparent rounded-full blur-3xl" style={{animation: 'float 6s ease-in-out infinite'}}></div>
      </div>

      {/* Main Loading Card */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 dark:shadow-black/30 p-8 sm:p-12 flex flex-col items-center space-y-8 border border-gray-200/20 dark:border-gray-700/30 max-w-sm w-full mx-4">
        {/* Enhanced Loading Animation */}
        <div className="relative flex items-center justify-center">
          {/* Background rings */}
          <div className="absolute w-20 h-20 border-2 border-gray-200/30 dark:border-gray-600/30 rounded-full"></div>
          <div className="absolute w-16 h-16 border-2 border-gray-300/40 dark:border-gray-500/40 rounded-full animate-ping"></div>
          
          {/* Main spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-3 border-gray-200/50 dark:border-gray-600/50 rounded-full"></div>
            <div 
              className="absolute inset-0 border-3 border-postman-orange rounded-full animate-spin"
              style={{
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'var(--color-postman-orange)',
                borderLeftColor: 'var(--color-postman-orange)'
              }}
            ></div>
          </div>

          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-postman-orange to-postman-orange-dark rounded-lg flex items-center justify-center shadow-lg animate-bounce">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-postman-orange/10 rounded-full blur-xl animate-pulse"></div>
        </div>

        {/* Enhanced Text Content */}
        <div className="text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            {title || t('app.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            {subtitle || t('app.loading')}
          </p>
          
          {/* Loading dots */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-postman-orange rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-postman-orange rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-postman-orange rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-postman-orange to-postman-orange-light rounded-full animate-pulse" style={{
            width: '60%',
            animation: 'shimmer 2s ease-in-out infinite'
          }}></div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Built with ❤️ for developers
        </p>
      </div>
    </div>
  )
}
