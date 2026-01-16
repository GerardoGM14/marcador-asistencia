import React, { useState, useRef, useEffect } from 'react';
import { X, User, Briefcase, Check, UserPlus, ChevronDown, Search } from 'lucide-react';
import { workersData } from '../../data/workersData';

const NuevoTrabajadorModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('personales');
  const [isPuestoDropdownOpen, setIsPuestoDropdownOpen] = useState(false);
  const [puestoSearchTerm, setPuestoSearchTerm] = useState('');
  const puestoDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    tipoDocumento: 'DNI',
    documento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    estadoCivil: '',
    telefono: '',
    correo: '',
    // Laborales
    contratacion: 'PLANILLA',
    puesto: '',
    locacion: '',
    fechaIngreso: '',
    estadoLaboral: '',
    turno: '',
    tipoJornada: '',
    horaEntrada: '',
    horaSalida: '',
    diaDescanso: ''
  });

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (puestoDropdownRef.current && !puestoDropdownRef.current.contains(event.target)) {
        setIsPuestoDropdownOpen(false);
      }
    };

    if (isPuestoDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPuestoDropdownOpen]);

  if (!isOpen) return null;

  // Obtener puestos únicos
  const uniquePuestos = [...new Set(workersData.map(w => w.puesto))].sort();
  const filteredPuestos = uniquePuestos.filter(puesto => 
    puesto.toLowerCase().includes(puestoSearchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restricciones de entrada
    if (name === 'documento' && formData.tipoDocumento === 'DNI') {
      // Solo permitir números y máximo 8 dígitos
      if (!/^\d*$/.test(value)) return;
      if (value.length > 8) return;
    }

    if (name === 'telefono') {
      // Solo permitir números
      if (!/^\d*$/.test(value)) return;
    }

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Lógica automática de horarios y jornadas
      if (name === 'turno' || name === 'tipoJornada') {
        const currentTurno = name === 'turno' ? value : prev.turno;
        const currentJornada = name === 'tipoJornada' ? value : prev.tipoJornada;

        if (currentTurno === 'manana') {
          if (currentJornada === 'completa') {
            newData.horaEntrada = '08:00';
            newData.horaSalida = '17:00';
          } else if (currentJornada === 'parcial') {
            newData.horaEntrada = '08:00';
            newData.horaSalida = '13:00';
          }
        } else if (currentTurno === 'tarde') {
          if (currentJornada === 'completa') {
            newData.horaEntrada = '14:00';
            newData.horaSalida = '22:00';
          } else if (currentJornada === 'parcial') {
            newData.horaEntrada = '14:00';
            newData.horaSalida = '18:00';
          }
        } else if (currentTurno === 'noche') {
          newData.horaEntrada = '18:00';
          if (currentJornada === 'completa') {
            newData.horaSalida = '05:00';
          } else if (currentJornada === 'parcial') {
            newData.horaSalida = '22:00';
          }
        }
      }

      return newData;
    });
  };

  // Validaciones
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateDocumento = (tipo, numero) => {
    if (!numero) return false;
    if (tipo === 'DNI') return /^\d{8}$/.test(numero);
    return numero.length >= 3;
  };

  const validateTelefono = (telefono) => {
    return /^\d{9,}$/.test(telefono);
  };

  const isPersonalesValid = 
    formData.tipoDocumento && 
    validateDocumento(formData.tipoDocumento, formData.documento) && 
    formData.nombres && 
    formData.apellidos && 
    formData.fechaNacimiento && 
    formData.sexo && 
    formData.estadoCivil && 
    validateTelefono(formData.telefono) && 
    validateEmail(formData.correo);

  const isLaboralesValid = 
    formData.contratacion && 
    formData.puesto && 
    formData.locacion && 
    formData.fechaIngreso && 
    formData.estadoLaboral && 
    formData.turno && 
    formData.tipoJornada && 
    formData.horaEntrada && 
    formData.horaSalida && 
    formData.diaDescanso;

  const isFormValid = isPersonalesValid && isLaboralesValid;

  const getTooltipMessage = () => {
    if (isFormValid) return '';

    // Validaciones específicas de Datos Personales
    if (!formData.documento) return 'Ingrese el documento';
    if (!validateDocumento(formData.tipoDocumento, formData.documento)) return `El ${formData.tipoDocumento} debe ser válido (DNI: 8 dígitos)`;
    
    if (!formData.nombres) return 'Ingrese los nombres';
    if (!formData.apellidos) return 'Ingrese los apellidos';
    if (!formData.fechaNacimiento) return 'Ingrese la fecha de nacimiento';
    if (!formData.sexo) return 'Seleccione el sexo';
    if (!formData.estadoCivil) return 'Seleccione el estado civil';
    
    if (!formData.telefono) return 'Ingrese el teléfono';
    if (!validateTelefono(formData.telefono)) return 'El teléfono debe tener al menos 9 dígitos';
    
    if (!formData.correo) return 'Ingrese el correo';
    if (!validateEmail(formData.correo)) return 'Ingrese un correo válido';

    // Validaciones de Datos Laborales
    if (!isLaboralesValid) return 'Complete todos los datos laborales';
    
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Nuevo Trabajador</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 pt-1">
          <button
            onClick={() => setActiveTab('personales')}
            className={`flex items-center gap-2 px-1 py-2.5 text-sm font-semibold border-b-2 transition-colors mr-6 ${
              activeTab === 'personales' 
                ? 'border-[#EC6317] text-[#EC6317]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4" />
            Datos Personales
          </button>
          <button
            onClick={() => setActiveTab('laborales')}
            className={`flex items-center gap-2 px-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'laborales' 
                ? 'border-[#EC6317] text-[#EC6317]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Datos Laborales
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-white">
          <form id="trabajador-form" onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === 'personales' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {/* Documento */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Documento</label>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#EC6317] focus-within:border-[#EC6317]">
                    <div className="relative border-r border-gray-300 bg-white min-w-[80px]">
                      <select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        className="w-full h-full px-3 py-2 text-sm appearance-none bg-transparent focus:outline-none text-gray-700"
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">CE</option>
                        <option value="PAS">PAS</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    <input
                      type="text"
                      name="documento"
                      required
                      value={formData.documento}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
                      placeholder="Número"
                    />
                  </div>
                </div>

                {/* Nombres */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    required
                    value={formData.nombres}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm"
                  />
                </div>

                {/* Apellidos */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    required
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm"
                  />
                </div>

                {/* Fecha Nacimiento */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm text-gray-500"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>

                {/* Sexo */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Sexo</label>
                  <div className="relative">
                    <select
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm appearance-none text-gray-500 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Estado Civil */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Estado Civil</label>
                  <div className="relative">
                    <select
                      name="estadoCivil"
                      value={formData.estadoCivil}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm appearance-none text-gray-500 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="soltero">Soltero/a</option>
                      <option value="casado">Casado/a</option>
                      <option value="divorciado">Divorciado/a</option>
                      <option value="viudo">Viudo/a</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Contacto Section */}
                <div className="col-span-1 md:col-span-2 pt-2 -mb-2">
                  <h3 className="text-sm font-bold text-gray-700">Contacto</h3>
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Nro. Teléfono/Celular</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm"
                  />
                </div>

                {/* Correo */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'laborales' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {/* Header Información Laboral */}
                <div className="col-span-1 md:col-span-2 -mb-2">
                  <h3 className="text-sm font-bold text-gray-700">Información laboral</h3>
                </div>

                {/* Contratación */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Contratación</label>
                  <div className="flex items-center gap-4 h-[38px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.contratacion === 'PLANILLA' 
                          ? 'border-[#EC6317]' 
                          : 'border-gray-300'
                      }`}>
                        {formData.contratacion === 'PLANILLA' && (
                          <div className="w-2 h-2 rounded-full bg-[#EC6317]" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="contratacion" 
                        value="PLANILLA"
                        checked={formData.contratacion === 'PLANILLA'}
                        onChange={handleChange}
                        className="hidden" 
                      />
                      <span className="text-sm text-gray-600">PLANILLA</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.contratacion === 'RRHH' 
                          ? 'border-[#EC6317]' 
                          : 'border-gray-300'
                      }`}>
                        {formData.contratacion === 'RRHH' && (
                          <div className="w-2 h-2 rounded-full bg-[#EC6317]" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="contratacion" 
                        value="RRHH"
                        checked={formData.contratacion === 'RRHH'}
                        onChange={handleChange}
                        className="hidden" 
                      />
                      <span className="text-sm text-gray-600">RRHH</span>
                    </label>
                  </div>
                </div>

                {/* Puesto */}
                <div className="space-y-1.5" ref={puestoDropdownRef}>
                  <label className="text-sm font-medium text-gray-600">Puesto</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPuestoDropdownOpen(!isPuestoDropdownOpen)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm bg-white text-left flex items-center justify-between"
                    >
                      <span className={formData.puesto ? 'text-gray-700' : 'text-gray-500'}>
                        {formData.puesto || 'Seleccionar puesto'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {isPuestoDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="text"
                              value={puestoSearchTerm}
                              onChange={(e) => setPuestoSearchTerm(e.target.value)}
                              placeholder="Buscar puesto..."
                              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317]"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {filteredPuestos.length > 0 ? (
                            filteredPuestos.map((puesto, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, puesto }));
                                  setIsPuestoDropdownOpen(false);
                                  setPuestoSearchTerm('');
                                }}
                                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between ${
                                  formData.puesto === puesto ? 'bg-orange-50 text-[#EC6317]' : 'text-gray-700'
                                }`}
                              >
                                <span>{puesto}</span>
                                {formData.puesto === puesto && <Check className="w-4 h-4" />}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-center text-xs text-gray-500">
                              No se encontraron resultados
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Locación */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Sede</label>
                  <div className="relative">
                    <select
                      name="locacion"
                      value={formData.locacion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm appearance-none text-gray-500 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="LIMA">LIMA</option>
                      <option value="AREQUIPA">AREQUIPA</option>
                      <option value="TRUJILLO">TRUJILLO</option>
                      <option value="CUSCO">CUSCO</option>
                      <option value="PIURA">PIURA</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Fecha de Ingreso */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Fecha de Ingreso</label>
                  <input
                    type="date"
                    name="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm text-gray-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                {/* Estado Laboral */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Estado Laboral</label>
                  <div className="relative">
                    <select
                      name="estadoLaboral"
                      value={formData.estadoLaboral}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm appearance-none text-gray-500 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Header Jornada y horario */}
                <div className="col-span-1 md:col-span-2 pt-2 -mb-2">
                  <h3 className="text-sm font-bold text-gray-700">Jornada y horario</h3>
                </div>

                {/* Turno */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Turno</label>
                  <div className="relative">
                    <select
                      name="turno"
                      value={formData.turno}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm appearance-none text-gray-500 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="manana">Mañana</option>
                      <option value="tarde">Tarde</option>
                      <option value="noche">Noche</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tipo de jornada */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Tipo de jornada</label>
                  <div className="relative">
                    <select
                      name="tipoJornada"
                      value={formData.tipoJornada}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm appearance-none text-gray-500 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="completa">Completa</option>
                      <option value="parcial">Parcial</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Horarios (Entrada y Salida) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-600">Hora de Entrada</label>
                    <div className="relative">
                      <input
                        type="time"
                        name="horaEntrada"
                        value={formData.horaEntrada}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm text-gray-500"
                        placeholder="--:--"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-600">Hora de Salida</label>
                    <div className="relative">
                      <input
                        type="time"
                        name="horaSalida"
                        value={formData.horaSalida}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm text-gray-500"
                        placeholder="--:--"
                      />
                    </div>
                  </div>
                </div>

                {/* Día de Descanso */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">Día de Descanso</label>
                  <div className="relative">
                    <select
                      name="diaDescanso"
                      value={formData.diaDescanso}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm appearance-none text-gray-500 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          
          <div className="relative group">
            <button
              type="submit"
              form="trabajador-form"
              disabled={!isFormValid}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all ${
                isFormValid 
                  ? 'bg-[#EC6317] hover:bg-[#d65812]' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              Guardar
            </button>

            {/* Tooltip */}
            {!isFormValid && (
              <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-1.5 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {getTooltipMessage()}
                {/* Arrow */}
                <div className="absolute top-full right-8 -mt-1 border-4 border-transparent border-t-gray-800" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoTrabajadorModal;