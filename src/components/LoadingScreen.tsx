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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-600 rounded-full"></div>
          <div 
            className="w-16 h-16 border-4 border-postman-orange rounded-full animate-spin absolute top-0 left-0" 
            style={{
              borderTopColor: 'transparent', 
              borderRightColor: 'transparent'
            }}
          ></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title || t('app.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {subtitle || t('app.loading')}
          </p>
        </div>
      </div>
    </div>
  )
}
