import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import Spinner from '../components/Spinner'
import AlertMessage from '../components/AlertMessage'
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

export default function AdoptionRequestsPage() {
  const { data: adopters, loading, error, refetch } = useFetch<Adopter[]>(
    'http://localhost:3000/adopters'
  )

  const [localAdopters, setLocalAdopters] = useState<Adopter[] | null>(null)
  const list = localAdopters ?? adopters ?? []

  // Sync localAdopters when fresh data arrives
  useState(() => {
    if (adopters) setLocalAdopters(adopters)
  })

  const [search, setSearch] = useState('')
  const filtered = list.filter(a =>
    `${a.first_name} ${a.last_name} ${a.email} ${a.phone} ${a.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-PH', {
      year: 'numeric', month: 'short', day: 'numeric',
    })

  // ── Cancellation ────────────────────────────────────────────────────
  const [confirmTarget, setConfirmTarget] = useState<Adopter | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const openConfirm  = (a: Adopter) => { setCancelError(''); setConfirmTarget(a) }
  const closeConfirm = () => { if (cancelling) return; setConfirmTarget(null); setCancelError('') }

  const handleCancel = async () => {
    if (!confirmTarget) return
    setCancelling(true)
    setCancelError('')

    if (!navigator.onLine) {
      setCancelError('You are offline. Please check your connection and try again.')
      setCancelling(false)
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/adopters/${confirmTarget.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message ?? `Server error (${res.status})`)
      }
      setLocalAdopters(prev => (prev ?? list).filter(a => a.id !== confirmTarget.id))
      setConfirmTarget(null)
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Cancellation failed.')
    } finally {
      setCancelling(false)
    }
  }

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
        <Link to="/register" className="ar-new-btn">+ New Request</Link>
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
            disabled={loading}
          />
        </div>
        {!loading && !error && (
          <span className="ar-count">
            {filtered.length} of {list.length} request{list.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Loading ──────────────────────────────────────────── */}
      {loading && (
        <div className="ar-state">
          <Spinner label="Loading adoption requests…" size="lg" />
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="ar-state ar-state--error">
          <AlertMessage
            type="error"
            message={error}
          />
          <button className="ar-retry" onClick={refetch}>Retry</button>
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────────── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="ar-state">
          <span aria-hidden="true" style={{ fontSize: 40 }}>🐕</span>
          <p>{search ? 'No results match your search.' : 'No adoption requests yet.'}</p>
          {!search && (
            <Link to="/register" className="ar-retry">Register First Adopter</Link>
          )}
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────── */}
      {!loading && !error && filtered.length > 0 && (
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
                <th>Action</th>
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
                    <a href={`mailto:${a.email}`} className="ar-email-link">{a.email}</a>
                  </td>
                  <td>{a.phone}</td>
                  <td className="ar-address">{a.address}</td>
                  <td className="ar-date">{formatDate(a.created_at)}</td>
                  <td><span className="ar-badge ar-badge--pending">Pending</span></td>
                  <td>
                    <button
                      className="ar-cancel-btn"
                      onClick={() => openConfirm(a)}
                      aria-label={`Cancel request for ${a.first_name} ${a.last_name}`}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Confirm Modal ────────────────────────────────────── */}
      {confirmTarget && (
        <div
          className="ar-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          onClick={e => { if (e.target === e.currentTarget) closeConfirm() }}
        >
          <div className="ar-modal">
            <div className="ar-modal-icon" aria-hidden="true">⚠️</div>
            <h2 id="confirm-title" className="ar-modal-title">Cancel Adoption Request?</h2>
            <p className="ar-modal-body">
              You are about to cancel the request for{' '}
              <strong>{confirmTarget.first_name} {confirmTarget.last_name}</strong>.
              This action cannot be undone.
            </p>

            {cancelError && (
              <div style={{ marginBottom: 16 }}>
                <AlertMessage
                  type="error"
                  message={cancelError}
                  onDismiss={() => setCancelError('')}
                />
              </div>
            )}

            <div className="ar-modal-actions">
              <button className="ar-modal-keep" onClick={closeConfirm} disabled={cancelling}>
                Keep Request
              </button>
              <button className="ar-modal-confirm" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
