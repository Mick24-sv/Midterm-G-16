import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './AdoptionRequestsPage.css'

interface Adopter {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

type FetchStatus = 'loading' | 'success' | 'error'

export default function AdoptionRequestsPage() {
  const [adopters, setAdopters] = useState<Adopter[]>([])
  const [filtered, setFiltered] = useState<Adopter[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/adopters')
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json() as Promise<Adopter[]>
      })
      .then(data => {
        setAdopters(data)
        setFiltered(data)
        setStatus('success')
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load requests.')
        setStatus('error')
      })
  }, [])

  // Client-side search filter
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      adopters.filter(a =>
        `${a.first_name} ${a.last_name} ${a.email} ${a.phone} ${a.address}`
          .toLowerCase()
          .includes(q)
      )
    )
  }, [search, adopters])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <div className="ar-wrapper">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="ar-page-header">
        <div className="ar-title-group">
          <span className="ar-paw" aria-hidden="true">🐾</span>
          <div>
            <h1 className="ar-title">Adoption Requests</h1>
            <p className="ar-subtitle">All registered adopters and their information.</p>
          </div>
        </div>
        <Link to="/register" className="ar-new-btn">
          + New Request
        </Link>
      </div>

      {/* ── Search ──────────────────────────────────────────── */}
      <div className="ar-toolbar">
        <div className="ar-search-wrap">
          <span className="ar-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="ar-search"
            placeholder="Search by name, email, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search adoption requests"
          />
        </div>
        {status === 'success' && (
          <span className="ar-count">
            {filtered.length} of {adopters.length} request{adopters.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── States ──────────────────────────────────────────── */}
      {status === 'loading' && (
        <div className="ar-state">
          <div className="ar-spinner" aria-label="Loading…" />
          <p>Loading adoption requests…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="ar-state ar-state--error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <p>{error}</p>
          <button className="ar-retry" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {status === 'success' && filtered.length === 0 && (
        <div className="ar-state">
          <span aria-hidden="true" style={{ fontSize: 40 }}>🐕</span>
          <p>{search ? 'No results match your search.' : 'No adoption requests yet.'}</p>
          {!search && (
            <Link to="/register" className="ar-retry">
              Register First Adopter
            </Link>
          )}
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────── */}
      {status === 'success' && filtered.length > 0 && (
        <div className="ar-table-wrap">
          <table className="ar-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Registered</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id}>
                  <td className="ar-id">{i + 1}</td>
                  <td className="ar-name">
                    <span className="ar-avatar" aria-hidden="true">
                      {a.first_name[0]}{a.last_name[0]}
                    </span>
                    {a.first_name} {a.last_name}
                  </td>
                  <td>
                    <a href={`mailto:${a.email}`} className="ar-email-link">
                      {a.email}
                    </a>
                  </td>
                  <td>{a.phone}</td>
                  <td className="ar-address">{a.address}</td>
                  <td className="ar-date">{formatDate(a.created_at)}</td>
                  <td>
                    <span className="ar-badge ar-badge--pending">Pending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

