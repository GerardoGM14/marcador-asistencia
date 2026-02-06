import React, { useState, useEffect } from 'react';
import { 
  BriefcaseBusiness, 
  Home, 
  ShoppingCart, 
  ShieldBan, 
  ShoppingBag, 
  ChevronLeft, 
  Settings, 
  Users, 
  ShieldCheck, 
  List, 
  Wrench, 
  Database, 
  MapPin, 
  Cloud, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Store,
  Activity,
  HeartPulse,
  BarChart3,
  Monitor,
  AppWindow
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoFastCloud from '../../assets/logo-fastcloud-dark.png';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('security');
  const [openSubmenus, setOpenSubmenus] = useState({
    procesos: true,
    maestros: false,
    gestion: false
  });
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isWorkerRole = user.role === 'worker';

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (window.innerWidth < 768 && setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [location, setIsMobileOpen]);

  const primaryItems = [
    { id: 'security', icon: BriefcaseBusiness },
  ];

  const toggleSubmenu = (menu) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`flex flex-col h-screen bg-[#191A1A] text-gray-300 flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'} fixed md:static inset-y-0 left-0 z-50 md:relative ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      
      {/* Header (Full Width) */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} border-b border-gray-800 flex-shrink-0 relative`}>
        <div className={`flex items-center gap-2 transition-all duration-300 ${isCollapsed ? 'w-7 h-8 overflow-hidden relative justify-center' : ''}`}>
           <img 
             src={logoFastCloud} 
             alt="FastCloud" 
             className={`transition-all duration-300 ${
               isCollapsed 
                 ? 'h-8 w-auto max-w-none absolute left-0' 
                 : 'h-10 w-auto object-contain'
             }`} 
           />
           <span className={`text-gray-500 text-xs mt-1 transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-[100px] ml-2'}`}>V 1.0.0</span>
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-gray-400 hover:text-white transition-all duration-300 z-50 hidden md:block ${isCollapsed ? 'absolute -right-3 top-6 bg-[#2D3748] rounded-full p-1 border border-gray-700 shadow-lg' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Primary Sidebar (Icons Left) */}
        <div className={`w-16 flex flex-col items-center py-4 bg-[#191A1A] border-r border-gray-800 z-20 overflow-y-auto ${isCollapsed ? 'border-none' : ''}`}>
          
          {/* Main Navigation Icons */}
          <div className="flex flex-col gap-2 w-full px-2">
            {primaryItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveMainTab(item.id)}
                className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all group mx-auto ${activeMainTab === item.id ? 'bg-[#2D3748] text-[#EC6317]' : 'text-gray-400 hover:text-white'}`}
              >
                 {activeMainTab === item.id && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#EC6317] rounded-r-full"></div>
                 )}
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
      </div>

      {/* Secondary Sidebar (Menu Content) - Only visible when NOT collapsed */}
      <div className={`flex-1 flex flex-col bg-[#191A1A] overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
        
        {/* Scrollable Menu Area */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar pb-24 min-w-[220px]">
          
          <h3 className="text-gray-500 font-semibold text-sm mb-4 px-2 tracking-wider">
            {isWorkerRole ? 'PORTAL TRABAJADOR' : 'SEGURIDAD'}
          </h3>

          {/* Dashboard Link */}
          <Link 
            to="/dashboard"
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors mb-0.5 ${location.pathname === '/dashboard' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:bg-[#2D3748] hover:text-gray-200'}`}
          >
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="font-medium text-sm">Dashboard</span>
            </div>
          </Link>

          {/* Gestión Group */}
          {!isWorkerRole && (
          <div className="mb-1">
            <button 
              onClick={() => toggleSubmenu('gestion')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2D3748] text-gray-400 hover:text-gray-200 transition-colors mb-0.5"
            >
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="w-4 h-4" />
                <span className="font-medium text-sm">Gestión</span>
              </div>
              {openSubmenus.gestion ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            
             {openSubmenus.gestion && (
              <div className="pl-3 mt-0.5 space-y-0.5">
                <Link to="/gestion/trabajador" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/gestion/trabajador' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <Users className="w-3.5 h-3.5" />
                  <span>Trabajador</span>
                </Link>
                <Link to="/gestion/subsidiados" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/gestion/subsidiados' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Subsidiados</span>
                </Link>
                <Link to="/gestion/apps-sitios" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/gestion/apps-sitios' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <AppWindow className="w-3.5 h-3.5" />
                  <span>Apps y Sitios</span>
                </Link>
                <Link to="/gestion/reporte-asistencia" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/gestion/reporte-asistencia' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <List className="w-3.5 h-3.5" />
                  <span>Reporte de Asistencia</span>
                </Link>
                <Link to="/gestion/productividad" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/gestion/productividad' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Productividad</span>
                </Link>
                <Link to="/gestion/usuarios" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/gestion/usuarios' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <Users className="w-3.5 h-3.5" />
                  <span>Usuarios</span>
                </Link>
                <Link to="/gestion/monitoreo" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/gestion/monitoreo' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Monitoreo</span>
                </Link>
              </div>
             )}
          </div>
          )}

          {/* Procesos Group */}
          {/*
          <div className="mb-1">
            <button 
              onClick={() => toggleSubmenu('procesos')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2D3748] text-gray-400 hover:text-gray-200 transition-colors mb-0.5"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium text-sm">Procesos</span>
              </div>
              {openSubmenus.procesos ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            
            {openSubmenus.procesos && (
              <div className="pl-3 mt-0.5 space-y-0.5">
                <Link to="/dashboard/usuarios" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/dashboard/usuarios' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <Users className="w-3.5 h-3.5" />
                  <span>Usuarios</span>
                </Link>
                <Link to="/dashboard/permisos" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/dashboard/permisos' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Permisos</span>
                </Link>
                <Link to="/dashboard/menu-rol" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/dashboard/menu-rol' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <List className="w-3.5 h-3.5" />
                  <span>Menú por Rol</span>
                </Link>
                <Link to="/dashboard/configuracion" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/dashboard/configuracion' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configuración</span>
                </Link>
              </div>
            )}
          </div>
          */}

          {/* Maestros Group */}
          {/*
          <div className="mb-1">
            <button 
              onClick={() => toggleSubmenu('maestros')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2D3748] text-gray-400 hover:text-gray-200 transition-colors mb-0.5"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="font-medium text-sm">Maestros</span>
              </div>
              {openSubmenus.maestros ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            
            {openSubmenus.maestros && (
              <div className="pl-3 mt-0.5 space-y-0.5">
                <Link to="/dashboard/roles" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/dashboard/roles' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <ShieldBan className="w-3.5 h-3.5" />
                  <span>Roles</span>
                </Link>
                <Link to="/dashboard/areas" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/dashboard/areas' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Áreas</span>
                </Link>
                <Link to="/dashboard/sucursales" className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors text-sm ${location.pathname === '/dashboard/sucursales' ? 'bg-[#EC6317] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <Store className="w-3.5 h-3.5" />
                  <span>Sucursales</span>
                </Link>
              </div>
            )}
          </div>
          */}

        </div>
        
        </div>
      </div>

      {/* Storage Widget (Full Width Footer) */}
      {!isCollapsed && !isWorkerRole && (
        <div className="p-4 border-t border-gray-800 bg-[#191A1A] flex-shrink-0">
            <div className="flex items-center gap-2 mb-3 text-gray-300">
                <Cloud size={18} />
                <span className="text-sm font-medium">Almacenamiento</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                <div className="bg-[#EC6317] h-1.5 rounded-full" style={{ width: '50%' }}></div>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">476 GB disponibles de 938 GB</p>
            
            <button className="w-full py-2.5 px-3 bg-[#2D2D2D] hover:bg-[#383838] rounded-lg text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors border border-gray-700">
                <HelpCircle size={14} />
                Más almacenamiento
            </button>
        </div>
      )}
    </div>
    </>
  );
};

export default Sidebar;
