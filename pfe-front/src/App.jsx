import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import Dashboard from "./pages/Dashboard";
import { ThemeContextProvider } from './theme/ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <Router>
        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          {/* Placeholder for protected routes */}
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
