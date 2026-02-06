import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import { Building2, MapPin, Search, Bell, ChevronDown, User, Settings, Lock, HelpCircle, LogOut, Menu } from 'lucide-react';
import ConfirmationModal from '../common/ConfirmationModal';
import { authChannel } from '../../utils/authChannel';

// Importamos la imagen local que subiste
import logoutIllustration from '../../assets/modal/icono_logout.svg';

const Topbar = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const getInitialLocation = () => {
    const stored = localStorage.getItem('selectedLocation');
    return (stored === 'TODOS' || !stored) ? 'LIMA' : stored;
  };
  const [currentLocation, setCurrentLocation] = useState(getInitialLocation());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showLoader } = useLoading();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isWorker = user.role === 'worker';
  const avatarUrl = isWorker 
    ? "https://api.dicebear.com/7.x/notionists/svg?seed=Worker" 
    : "https://api.dicebear.com/7.x/notionists/svg?seed=Felix";

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsProfileOpen(false); // Cerrar el menú dropdown
  };

  const confirmLogout = () => {
    // Activar loader
    showLoader();
    
    // Notificar a otras pestañas
    authChannel.postMessage({ type: 'LOGOUT' });

    // Simular pequeño delay antes de salir
    setTimeout(() => {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      // Navigate to login page
      navigate('/');
    }, 1000);
  };

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = () => {
      const newLocation = localStorage.getItem('selectedLocation');
      if (newLocation) {
        setCurrentLocation(newLocation === 'TODOS' ? 'LIMA' : newLocation);
      }
    };

    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-20 relative shadow-sm">
      {/* Left Section: Selectors */}
      <div className="flex items-center h-full">
        
        {/* Mobile Menu Button */}
        <button 
          className="mr-3 md:hidden text-gray-500 hover:text-gray-700 p-1"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Empresa Selector */}
        <div className="flex items-center gap-3 cursor-pointer group pr-2 hidden sm:flex">
          <Building2 className="w-5 h-5 text-gray-500 group-hover:text-[#E17100] transition-colors stroke-[1.5]" />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-gray-500 font-medium leading-tight">Empresa</span>
            <div className="flex items-center gap-1.5">
               <span className="text-xs font-bold text-gray-800 leading-tight group-hover:text-[#E17100] transition-colors">SERTECH E.I.R.L</span>
               <ChevronDown className="w-3 h-3 text-gray-400 mt-0.5" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-4 hidden sm:block"></div>

        {/* Sucursal Selector */}
        <div className="flex items-center gap-3 cursor-pointer group pl-2 hidden sm:flex">
          <MapPin className="w-5 h-5 text-gray-500 group-hover:text-[#E17100] transition-colors stroke-[1.5]" />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-gray-500 font-medium leading-tight">Sucursal</span>
            <div className="flex items-center gap-1.5">
               <span className="text-xs font-bold text-gray-800 leading-tight group-hover:text-[#E17100] transition-colors">{currentLocation}</span>
               <ChevronDown className="w-3 h-3 text-gray-400 mt-0.5" />
            </div>
          </div>
        </div>

      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-5">
        <button className="text-gray-500 hover:text-[#E17100] transition-colors p-1">
          <Search className="w-4 h-4 stroke-[2]" />
        </button>
        <button className="text-gray-500 hover:text-[#E17100] transition-colors p-1 relative">
          <Bell className="w-4 h-4 stroke-[2]" />
          {/* Notification Dot - Optional based on image, but common */}
          {/* <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span> */}
        </button>
        
        {/* Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-gray-900 overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#E17100] hover:ring-offset-1 transition-all flex items-center justify-center focus:outline-none"
            >
               <img 
                  src={avatarUrl}
                  alt="User Avatar" 
                  className="w-full h-full object-cover bg-gray-100"
               />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {/* Header with User Info */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-gray-900 overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
                            <img 
                                src={avatarUrl}
                                alt="User Avatar" 
                                className="w-full h-full object-cover bg-gray-100"
                            />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'Usuario'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email || 'user@fastcloud.com'}</p>
                         </div>
                    </div>

                    <div className="px-1 py-1 space-y-0.5">
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group">
                            <User className="w-4 h-4 text-gray-500 group-hover:text-gray-800" />
                            <span className="font-medium">Perfil</span>
                        </button>
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group">
                            <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-800" />
                            <span className="font-medium">Configuración</span>
                        </button>
                        
                        <div className="my-1 border-t border-gray-100 mx-2"></div>
                        
                        <button 
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                            <LogOut className="w-4 h-4 group-hover:text-red-700" />
                            <span className="font-medium group-hover:text-red-700">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="¿Cerrar sesión?"
        description="¿Estás seguro de que deseas cerrar tu sesión actual? Tendrás que volver a ingresar tus credenciales para acceder."
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        imageSrc={logoutIllustration}
      />
    </div>
  );
};

export default Topbar;
