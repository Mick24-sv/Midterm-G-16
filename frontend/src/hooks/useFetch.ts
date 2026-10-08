import { useState, useEffect, useCallback } from 'react'

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: string
  refetch: () => void
}

/**
 * Generic data-fetching hook with loading, error, and refetch support.
 *
 * @param url  - The endpoint to GET from.
 * @param deps - Extra dependencies that should trigger a re-fetch (default: []).
 */
export function useFetch<T>(url: string, deps: unknown[] = []): UseFetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError('')

      // Offline guard
      if (!navigator.onLine) {
        setError('You are offline. Please check your internet connection.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(url)
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message ?? `Request failed (${res.status})`)
        }
        const json = (await res.json()) as T
        if (!cancelled) {
          setData(json)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, tick, ...deps])

  return { data, loading, error, refetch }
}

