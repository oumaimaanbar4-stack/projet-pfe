import { BrowserRouter , Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import Dashboard from "./pages/Dashboard";
import Clients from './pages/Clients';
import Factures from './pages/Factures';
import Rapports from './pages/Rapports';
import { ThemeContextProvider } from './theme/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        
          <Routes>

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/clients" element={<Clients />} /> 
            <Route path="/factures" element={<Factures />} /> 
            <Route path="/rapports" element={<Rapports />} /> 

          </Routes>
       
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;
