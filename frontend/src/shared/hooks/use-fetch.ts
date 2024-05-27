import { useCallback, useState } from 'react'
import { AxiosError } from 'axios'
import ErrorModel from 'src/shared/models/error.model.ts'


export const useFetch = <Response>(params: UseFetchParams<Response>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AxiosError | null>(null)
  const [data, setData] = useState<Response | null>(null)
  
  const execute = useCallback(async (...param: Parameters<UseFetchParams['requestCb']>) => {
    setIsLoading(true)
    try {
      const response = await params.requestCb(...param)
      setData(response)
      return {error: null, response}
    }catch (e: any) {
      setError(e)
      if(!params.notShowDialogError) {
        ErrorModel.errorOccured(e?.response?.data?.message ?? e?.message)
      }
      return {error: e, response: null}
    }finally {
      setIsLoading(false)
    }
  }, [])

  return {
    execute,
    isLoading,
    error,
    data
  }
}


interface UseFetchParams <Response = void, CbType = void>{
  requestCb: (...param: any) => Promise<Response>
  notShowDialogError?: boolean
}