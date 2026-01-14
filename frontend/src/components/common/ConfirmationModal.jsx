import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * ConfirmationModal Component
 * 
 * Un componente modal reutilizable para confirmaciones (ej. cerrar sesión, eliminar, etc.)
 * 
 * Props:
 * @param {boolean} isOpen - Controla si el modal está visible
 * @param {function} onClose - Función para cerrar el modal (botón cancelar/X)
 * @param {function} onConfirm - Función a ejecutar al confirmar la acción
 * @param {string} title - Título del modal
 * @param {string} description - Descripción o mensaje del modal
 * @param {string} confirmText - Texto del botón de confirmación
 * @param {string} cancelText - Texto del botón de cancelar
 * @param {string} imageSrc - Ruta de la imagen a mostrar. 
 *                            NOTA: Puedes subir tus imágenes a 'src/assets/modal/' 
 *                            y pasarlas importadas a este prop.
 */
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  imageSrc 
}) => {
  
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center p-6 pt-8">
          
          {/* Imagen / Ilustración */}
          {imageSrc && (
            <div className="mb-6 w-32 h-32 flex items-center justify-center">
              <img 
                src={imageSrc} 
                alt="Illustration" 
                className="w-full h-full object-contain" 
              />
            </div>
          )}

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Descripción */}
          <p className="text-gray-600 text-base leading-relaxed mb-8 px-4">
            {description}
          </p>

          {/* Botones de Acción */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
