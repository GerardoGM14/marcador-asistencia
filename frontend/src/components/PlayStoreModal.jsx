import React from 'react';
import { X, Info } from 'lucide-react';
import modalBackground from '../assets/modal/modal-background.png';
import iconShape from '../assets/modal/icon-shape.svg';
import whatsappIcon from '../assets/modal/whatsapp-icon.svg';
import playstoreLogo from '../assets/social/playstore-logo.svg';


const PlayStoreModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header Image */}
        <div className="w-full bg-[#FFF7ED] h-48 md:h-56 relative overflow-hidden">
           <img 
            src={modalBackground} 
            alt="App Preview" 
            className="w-full h-full object-cover object-center"
           />
        </div>

        {/* Body */}
        <div className="p-8 pt-10 relative">
            {/* Info Icon Floating */}
            <img 
                src={iconShape} 
                alt="Info" 
                className="absolute -top-8 left-8 w-14 h-14"
            />

            <h2 className="text-lg font-bold text-gray-900 mb-3 mt-1 leading-snug">
                ¿Desea usar la app móvil para su negocio?
            </h2>
            
            <p className="text-[16px] text-gray-600 leading-snug mb-6">
                La app móvil solo puede ser utilizada por negocios que tienen habilitado el acceso correspondiente.
                <br className="mb-2 block" />
                Si su negocio requiere esta función, o desea activarla, puede comunicarse con nosotros para brindarle la información exacta.
            </p>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-3">
                <button className="flex-1 bg-[#EC6317] hover:bg-[#d55612] text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <img src={whatsappIcon} className="w-5 h-5 text-white fill-current brightness-0 invert" alt="" />
                    Contactar soporte
                </button>
                
                <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <img src={playstoreLogo} className="w-5 h-5" alt="" />
                    Ver en Play Store
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayStoreModal;