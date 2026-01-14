import React from 'react';

/**
 * Loader Component
 * 
 * Componente de carga con diseño personalizado:
 * - Spinner circular (Gris oscuro + Naranja)
 * - Icono de rayito en el centro (tomado de public/icon.svg)
 */
const Loader = () => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#1a1a1a]/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Spinner SVG */}
        <svg 
          className="w-full h-full animate-spin" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track (Círculo de fondo) */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#333333" 
            strokeWidth="8" 
          />
          {/* Indicator (Arco de progreso) */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#E17100" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray="70 200" // ~25% del perímetro (2 * pi * 42 ≈ 263)
            className="opacity-90"
          />
        </svg>

        {/* Icono Central (Rayito) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/icon.svg" 
            alt="Loading..." 
            className="w-10 h-10 object-contain drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
