import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCadastrarAnimalPage from './pages/AdminCadastrarAnimalPage';
import AdotanteDashboardPage from './pages/AdotanteDashboardPage';
import EscolhaAnimalPage from './pages/EscolhaAnimalPage';
import AnimaisListPage from './pages/AnimaisListPage';
import AgendarVisitaPage from './pages/AgendarVisitaPage';

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (role && payload.tipo !== role) return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/animal"
          element={
            <PrivateRoute role="ADMIN">
              <AdminCadastrarAnimalPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/animal/:id"
          element={
            <PrivateRoute role="ADMIN">
              <AdminCadastrarAnimalPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="ADOTANTE">
              <AdotanteDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/animais"
          element={
            <PrivateRoute role="ADOTANTE">
              <EscolhaAnimalPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/animais/:tipo"
          element={
            <PrivateRoute role="ADOTANTE">
              <AnimaisListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/agendar/:animalId"
          element={
            <PrivateRoute role="ADOTANTE">
              <AgendarVisitaPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
