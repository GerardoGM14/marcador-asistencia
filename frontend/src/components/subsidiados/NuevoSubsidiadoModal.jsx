import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Calendar, Check, Plus, ChevronDown } from 'lucide-react';
import { suspensionTypes } from '../../data/suspensionTypes';

const NuevoSubsidiadoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    condicion: 'subsidiado', // 'subsidiado' or 'no_subsidiado'
    tipoSuspension: '',
    desde: '',
    hasta: '',
    dias: '',
    observacion: ''
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Calculate days when dates change
  useEffect(() => {
    if (formData.desde && formData.hasta) {
      const start = new Date(formData.desde);
      const end = new Date(formData.hasta);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start date
      
      if (!isNaN(diffDays) && diffDays > 0) {
        setFormData(prev => ({ ...prev, dias: diffDays }));
      } else {
        setFormData(prev => ({ ...prev, dias: '' }));
      }
    }
  }, [formData.desde, formData.hasta]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-gray-800" />
            <h2 className="text-lg font-bold text-gray-900">Nuevo Subsidios y No Subsidios</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Section: Trabajador */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-700">Trabajador</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nro Documento */}
              <div className="col-span-1 space-y-1">
                <label className="text-sm font-medium text-gray-600">Nro Documento</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    placeholder="Ingrese un n° d..."
                    className="w-full pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] transition-all bg-white"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EC6317]">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Nombre Completo */}
              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Condición de subsidio */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-700">Condición de subsidio</h3>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Condición</label>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="condicion" 
                      value="subsidiado"
                      checked={formData.condicion === 'subsidiado'}
                      onChange={handleChange}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#EC6317] transition-all"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-[#EC6317] rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Subsidiado</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="condicion" 
                      value="no_subsidiado"
                      checked={formData.condicion === 'no_subsidiado'}
                      onChange={handleChange}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#EC6317] transition-all"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-[#EC6317] rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">No Subsidiado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Field: Tipo de suspensión Laboral */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Tipo de suspensión Laboral</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] bg-white text-gray-700 flex items-center justify-between"
              >
                <span className="truncate">
                  {formData.tipoSuspension || "Seleccionar"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
                  {suspensionTypes.map((type, index) => {
                    let displayNum;
                    if (index < 12) {
                      displayNum = index + 1;
                    } else {
                      displayNum = 20 + (index - 12);
                    }
                    const number = displayNum.toString().padStart(2, '0');
                    const fullText = `${number} - ${type}`;
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, tipoSuspension: fullText }));
                          setIsDropdownOpen(false);
                        }}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-[#FFF0E6] hover:text-[#EC6317] cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                      >
                        {fullText}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Row: Dates and Days */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Desde</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="desde"
                  value={formData.desde}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] bg-white text-gray-700"
                />
                {/* Custom calendar icon overlay if needed, but native date picker usually suffices. 
                    The design shows a calendar icon on the right. Native inputs have it on right in some browsers, or we can force it.
                    For consistency with design, let's keep native behavior but ensure it looks clean.
                */}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Hasta</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="hasta"
                  value={formData.hasta}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] bg-white text-gray-700"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Días</label>
              <input 
                type="text" 
                name="dias"
                value={formData.dias}
                readOnly
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Field: Observación */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Observación</label>
            <textarea 
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              placeholder="Ingrese una observación..."
              rows={2}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] bg-white text-gray-700 resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2 bg-[#EC6317] text-white rounded-lg hover:bg-[#d65812] transition-colors text-sm font-medium shadow-sm"
          >
            <Check className="w-4 h-4" />
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default NuevoSubsidiadoModal;
