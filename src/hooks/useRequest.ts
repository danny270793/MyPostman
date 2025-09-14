import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector, useRequestLoading } from '../store/hooks'
import { requestSlice, type Authorization } from '../store/slices/requestSlice'
import { generateId } from '../utils/formatting'

/**
 * Custom hook for managing API requests
 */
export const useRequest = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const requestLoading = useRequestLoading()
  const currentRequest = useAppSelector(state => state.requests.currentRequest)
  const response = useAppSelector(state => state.requests.response)
  const error = useAppSelector(state => state.requests.error)

  const sendRequest = () => {
    if (!currentRequest.url) {
      dispatch(requestSlice.actions.showNotification({
        type: 'error',
        message: t('notifications.urlRequired')
      }))
      return
    }

    dispatch(requestSlice.actions.sendRequest({
      url: currentRequest.url,
      method: currentRequest.method,
      headers: currentRequest.headers,
      params: currentRequest.params,
      authorization: currentRequest.authorization,
      body: currentRequest.body ? JSON.parse(currentRequest.body) : undefined
    }))
  }

  const saveRequest = (name: string) => {
    if (!name || !currentRequest.url) return

    dispatch(requestSlice.actions.saveRequest({
      id: generateId(),
      name,
      url: currentRequest.url,
      method: currentRequest.method,
      headers: currentRequest.headers,
      params: currentRequest.params,
      authorization: currentRequest.authorization,
      body: currentRequest.body
    }))
  }

  const updateMethod = (method: string) => {
    dispatch(requestSlice.actions.setMethod(method as any))
  }

  const updateUrl = (url: string) => {
    dispatch(requestSlice.actions.setUrl(url))
  }

  const updateHeaders = (headers: Record<string, string>) => {
    dispatch(requestSlice.actions.setHeaders(headers))
  }

  const updateParams = (params: Record<string, string>) => {
    dispatch(requestSlice.actions.setParams(params))
  }

  const updateAuthorization = (authorization: Authorization) => {
    dispatch(requestSlice.actions.setAuthorization(authorization))
  }

  const updateBody = (body: string) => {
    dispatch(requestSlice.actions.setBody(body))
  }

  const loadHistoryItem = (id: string) => {
    dispatch(requestSlice.actions.loadHistoryItemToCurrent(id))
  }

  const loadSavedRequest = (id: string) => {
    dispatch(requestSlice.actions.loadSavedRequestToCurrent(id))
  }

  return {
    // State
    currentRequest,
    response,
    error,
    isLoading: requestLoading,
    
    // Actions
    sendRequest,
    saveRequest,
    loadHistoryItem,
    loadSavedRequest,
    
    // Field updates
    updateMethod,
    updateUrl,
    updateHeaders,
    updateParams,
    updateAuthorization,
    updateBody,
    
    // Computed values
    canSendRequest: !!currentRequest.url && !requestLoading,
    hasResponse: !!response,
    hasError: !!error,
  }
}
