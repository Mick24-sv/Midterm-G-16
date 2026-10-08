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
}

export default App;
