import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useLoading } from './context/LoadingContext'
import { authChannel } from './utils/authChannel'
import Loader from './components/common/Loader'
import SessionExpiredModal from './components/common/SessionExpiredModal'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import DashboardHome from './pages/DashboardHome'
import MenuRol from './pages/MenuRol'
import Trabajadores from './pages/Trabajadores'
import RegistroCompra from './pages/RegistroCompra'
import ListaClientes from './pages/ListaClientes'
import MonitorTiempoReal from './pages/MonitorTiempoReal'
import Subsidiados from './pages/Subsidiados'
import AppsSitios from './pages/AppsSitios'
import ReporteAsistencia from './pages/ReporteAsistencia'
import Productividad from './pages/Productividad'
import Usuarios from './pages/Usuarios'
import Monitoreo from './pages/Monitoreo'

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, showLoader, hideLoader } = useLoading();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.data?.type === 'LOGOUT') {
        localStorage.removeItem('user');
        setIsSessionExpired(true);
      }
    };

    authChannel.onmessage = handleAuthMessage;

    return () => {
      authChannel.onmessage = null;
    };
  }, []);

  const handleSessionExpiredClose = () => {
    setIsSessionExpired(false);
    navigate('/');
  };

  useEffect(() => {
    // Activar loader en cada cambio de ruta
    showLoader();
    
    // Simular tiempo de carga (ajustable)
    const timer = setTimeout(() => {
      hideLoader();
    }, 800); // 800ms de carga simulada

    return () => clearTimeout(timer);
  }, [location.pathname, showLoader, hideLoader]);

  return (
    <>
      <Toaster 
        position="bottom-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      />
      {isLoading && <Loader />}
      <SessionExpiredModal isOpen={isSessionExpired} onClose={handleSessionExpiredClose} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/menu-rol" element={<MenuRol />} />
          <Route path="/gestion/trabajador" element={<Trabajadores />} />
          <Route path="/dashboard/registro-compra" element={<RegistroCompra />} />
          <Route path="/gestion/subsidiados" element={<Subsidiados />} />
          <Route path="/gestion/apps-sitios" element={<AppsSitios />} />
          <Route path="/gestion/reporte-asistencia" element={<ReporteAsistencia />} />
          <Route path="/gestion/productividad" element={<Productividad />} />
          <Route path="/gestion/usuarios" element={<Usuarios />} />
          <Route path="/gestion/monitoreo" element={<Monitoreo />} />
          <Route path="/dashboard/lista-clientes" element={<ListaClientes />} />
          <Route path="/dashboard/monitor" element={<MonitorTiempoReal />} />
          {/* Placeholder routes for other sidebar items */}
          <Route path="*" element={<div className="p-8">Página en construcción</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
