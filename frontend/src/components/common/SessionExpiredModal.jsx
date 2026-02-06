import React from 'react';
import { ArrowRight } from 'lucide-react';
import logoFastCloud from '../../assets/logo-fastcloud-dark.png';

const SessionExpiredModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center animate-in fade-in zoom-in duration-200">
        <div className="mb-6 flex justify-center">
             <img src={logoFastCloud} alt="FastCloud" className="h-12 object-contain" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sesión Cerrada</h2>
        
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          Tu sesión ha sido cerrada en otra pestaña o ventana.
          <br />
          Para continuar trabajando, por favor inicia sesión nuevamente.
        </p>
        
        <button 
          onClick={onClose}
          className="w-full bg-[#E17100] hover:bg-[#c66300] text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group"
        >
          Volver a Iniciar Sesión
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default SessionExpiredModal;
