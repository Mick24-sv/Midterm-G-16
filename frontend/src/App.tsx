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
}

export default App
