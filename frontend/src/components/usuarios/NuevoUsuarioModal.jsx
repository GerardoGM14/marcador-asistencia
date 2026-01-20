import React, { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Search, Check } from 'lucide-react';
import { workersData } from '../../data/workersData';

const NuevoUsuarioModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    grupo: '',
    rol: '',
    estado: '',
    estadoMonitoreo: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = workersData.filter(worker => 
        worker.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.dni.includes(searchTerm)
      );
      setFilteredWorkers(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredWorkers([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const generateEmail = (nombresCompletos) => {
    const parts = nombresCompletos.split(',');
    if (parts.length < 2) return 'usuario@empresa.com';
    
    const apellidos = parts[0].trim().split(' ');
    const nombre = parts[1].trim().split(' ')[0];
    
    const apellidoPrincipal = apellidos[0].toLowerCase();
    const nombrePrincipal = nombre.toLowerCase();
    
    return `${nombrePrincipal}.${apellidoPrincipal}@empresa.com`;
  };

  const handleSelectWorker = (worker) => {
    const parts = worker.nombres.split(',');
    const apellidos = parts[0].trim();
    const nombres = parts[1].trim();

    setFormData(prev => ({
      ...prev,
      nombres: nombres,
      apellidos: apellidos,
      email: generateEmail(worker.nombres),
      rol: 'MIEMBRO', // Default role
      estado: 'ACTIVO' // Default state
    }));
    
    setSearchTerm(worker.nombres);
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Nuevo Usuario</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <form id="usuario-form" onSubmit={handleSubmit} className="space-y-3">
            
            {/* Buscador */}
            <div className="relative" ref={wrapperRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Trabajador
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] placeholder:text-gray-400"
                  placeholder="Buscar trabajador por documento o nombre..."
                  autoComplete="off"
                />
              </div>
              
              {/* Dropdown de Sugerencias */}
              {showSuggestions && filteredWorkers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredWorkers.map((worker) => (
                    <button
                      key={worker.id}
                      type="button"
                      onClick={() => handleSelectWorker(worker)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col border-b border-gray-50 last:border-none"
                    >
                      <span className="text-sm font-medium text-gray-900">{worker.nombres}</span>
                      <span className="text-xs text-gray-500">DNI: {worker.dni} • {worker.puesto}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nombres y Apellidos (Read Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres
                </label>
                <input
                  type="text"
                  value={formData.nombres}
                  readOnly
                  disabled
                  className="w-full px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={formData.apellidos}
                  readOnly
                  disabled
                  className="w-full px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Correo (Read Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                disabled
                className="w-full px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Sección Configuración */}
            <div className="pt-1 space-y-3">
              <h3 className="text-sm font-bold text-gray-800">Configuración del Usuario</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Fila 1: Estado y Monitoreo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white text-gray-600"
                  >
                    <option value="" disabled hidden>Seleccionar</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de monitoreo
                  </label>
                  <select
                    name="estadoMonitoreo"
                    value={formData.estadoMonitoreo}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white text-gray-600"
                  >
                    <option value="" disabled hidden>Seleccionar</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>

                {/* Fila 2: Grupo y Rol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grupo
                  </label>
                  <select
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white text-gray-600"
                  >
                    <option value="" disabled hidden>Seleccionar</option>
                    <option value="TECNOLOGÍA">TECNOLOGÍA</option>
                    <option value="ADMINISTRACIÓN">ADMINISTRACIÓN</option>
                    <option value="COMERCIAL">COMERCIAL</option>
                    <option value="OPERACIONES">OPERACIONES</option>
                    <option value="SALUD">SALUD</option>
                    <option value="PROFESIONALES">PROFESIONALES</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white text-gray-600"
                  >
                    <option value="" disabled hidden>Seleccionar</option>
                    <option value="MIEMBRO">MIEMBRO</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            form="usuario-form"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#EC6317] hover:bg-[#d95813] rounded-lg shadow-sm transition-colors"
          >
            <Check size={16} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevoUsuarioModal;
