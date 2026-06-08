import { useState, useEffect } from 'react'

/**
 * Fetches a JSON manifest file from /public at runtime.
 * Returns { data, loading, error }.
 */
export function useManifest(path) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(path)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch ${path}: ${r.status}`)
        return r.json()
      })
      .then((json) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [path])

  return { data, loading, error }
}
