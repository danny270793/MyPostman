/**
 * Utility functions for managing colors throughout the application
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type StatusCode = number

/**
 * Get Tailwind classes for HTTP method styling
 */
export const getMethodColors = (method: HttpMethod): string => {
  switch (method) {
    case 'GET':
      return 'bg-green-600 border-green-600 text-white'
    case 'POST':
      return 'bg-postman-orange border-postman-orange text-white'
    case 'PUT':
      return 'bg-blue-600 border-blue-600 text-white'
    case 'DELETE':
      return 'bg-red-600 border-red-600 text-white'
    case 'PATCH':
      return 'bg-yellow-600 border-yellow-600 text-white'
    default:
      return 'bg-gray-600 border-gray-600 text-white'
  }
}

/**
 * Get Tailwind classes for method badges in sidebar/history
 */
export const getMethodBadgeColors = (method: HttpMethod): string => {
  switch (method) {
    case 'GET':
      return 'bg-green-100 text-green-800'
    case 'POST':
      return 'bg-orange-100 text-orange-800'
    case 'PUT':
      return 'bg-blue-100 text-blue-800'
    case 'DELETE':
      return 'bg-red-100 text-red-800'
    case 'PATCH':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get Tailwind classes for status code badges
 */
export const getStatusColors = (status: StatusCode): string => {
  if (status >= 200 && status < 300) {
    return 'bg-green-100 text-green-800'
  } else if (status >= 300 && status < 400) {
    return 'bg-blue-100 text-blue-800'
  } else if (status >= 400 && status < 500) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (status >= 500) {
    return 'bg-red-100 text-red-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get semantic color name for status code
 */
export const getStatusCategory = (status: StatusCode): 'success' | 'info' | 'warning' | 'error' | 'default' => {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 300 && status < 400) return 'info'
  if (status >= 400 && status < 500) return 'warning'
  if (status >= 500) return 'error'
  return 'default'
}
