<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AdopterRegistrationForm from './pages/AdopterRegistrationForm'
import AdoptionRequestsPage from './pages/AdoptionRequestsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<AdopterRegistrationForm />} />
        <Route path="/requests" element={<AdoptionRequestsPage />} />
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
=======
import PetsPage from './pages/PetsPage';
import './App.css';

function App() {
  return (
    <>
      {/* ── Top nav bar ─────────────────────────── */}
      <nav className="navbar">
        <div className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">🐾</span>
          <span className="navbar__name">PawsHome</span>
        </div>
        <div className="navbar__links">
          <a href="#" className="navbar__link navbar__link--active">Browse Pets</a>
          <a href="#" className="navbar__link">How It Works</a>
          <a href="#" className="navbar__link">Contact</a>
        </div>
      </nav>

      {/* ── Main content ────────────────────────── */}
      <PetsPage />
    </>
  );
>>>>>>> bc85fd6c00cc6b88f71361c7ae31df3ea23c44e6
}

export default App;
