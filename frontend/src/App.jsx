import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useLoading } from './context/LoadingContext'
import Loader from './components/common/Loader'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import DashboardHome from './pages/DashboardHome'
import MenuRol from './pages/MenuRol'
import Trabajadores from './pages/Trabajadores'
import RegistroCompra from './pages/RegistroCompra'
import ListaClientes from './pages/ListaClientes'
import MonitorTiempoReal from './pages/MonitorTiempoReal'

function App() {
  const location = useLocation();
  const { isLoading, showLoader, hideLoader } = useLoading();

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
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="menu-rol" element={<MenuRol />} />
          <Route path="trabajadores" element={<Trabajadores />} />
          <Route path="registro-compra" element={<RegistroCompra />} />
          <Route path="lista-clientes" element={<ListaClientes />} />
          <Route path="monitor" element={<MonitorTiempoReal />} />
          {/* Placeholder routes for other sidebar items */}
          <Route path="*" element={<div className="p-8">Página en construcción</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
