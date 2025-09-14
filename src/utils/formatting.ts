/**
 * Utility functions for formatting data throughout the application
 */

/**
 * Format JSON data with proper indentation
 */
export const formatJSON = (data: any): string => {
  try {
    if (typeof data === 'string') {
      return JSON.stringify(JSON.parse(data), null, 2)
    }
    return JSON.stringify(data, null, 2)
  } catch (error) {
    return String(data)
  }
}

/**
 * Parse JSON string safely
 */
export const parseJSON = (jsonString: string): any | null => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    return null
  }
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Format response time (placeholder for future implementation)
 */
export const formatResponseTime = (time: number): string => {
  if (time < 1000) {
    return `${time}ms`
  } else {
    return `${(time / 1000).toFixed(2)}s`
  }
}

/**
 * Format response size (placeholder for future implementation)
 */
export const formatResponseSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
