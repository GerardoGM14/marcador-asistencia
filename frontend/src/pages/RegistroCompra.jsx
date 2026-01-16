import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  ChevronDown, 
  FileText,
  CheckCircle2,
  User,
  MapPin,
  Briefcase,
  CreditCard,
  Settings,
  Link as LinkIcon,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import DatePicker from '../components/ui/DatePicker';

const RegistroCompra = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  
  // Estado único para todo el formulario
  const [formData, setFormData] = useState({
    // Cliente
    tTipoDocumento: '',
    tNumeroDocumento: '',
    tRazonSocial: '',
    tRubro: '',
    tCategoria: '',
    tCanalCaptacion: '',
    tNivelPrioridad: '',
    tDireccionFiscal: '',
    tCiudad: '',
    tContactoNombre: '',
    tContactoCargo: '',
    tContactoTelefono: '',
    tContactoEmail: '',
    // Contrato
    tAgenteVentas: '',
    tTipoServicio: '',
    tNombreProyecto: '',
    tCentroCosto: '',
    tPlanSuscripcion: '',
    tDireccionServicio: '',
    fFechaContrato: '',
    fFechaCapacitacion: '',
    fFechaEntrega: '',
    tTipoMoneda: 'S',
    iCostoImplementacion: '',
    tModalidadMembresia: '',
    iCostoMembresia: '',
    fInicioMembresia: '',
    fFinMembresia: '',
    lAplicaIGV: false,
    tObservaciones: '',
    tURLDocumentacion: '',
    lEstado: true
  });

  // Efecto para actualizar fecha inicio membresía cuando cambia fecha entrega
  useEffect(() => {
    if (formData.fFechaEntrega) {
      setFormData(prev => ({
        ...prev,
        fInicioMembresia: prev.fFechaEntrega
      }));
    }
  }, [formData.fFechaEntrega]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Validación específica para teléfono
    if (name === 'tContactoTelefono') {
      // Solo permitir números y máximo 9 dígitos
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      // Convertir a array y combinar con archivos existentes si se desea, 
      // o reemplazar completamente. Aquí reemplazamos para coincidir con el input.
      // Si queremos acumular: setFiles(prev => [...prev, ...Array.from(e.target.files)]);
      // Pero el input type="file" estándar reemplaza la selección. 
      // Para permitir agregar más, mejor usamos un botón "Agregar" o gestionamos con un input oculto.
      // Por simplicidad y UX común, permitiremos acumular archivos si el usuario selecciona de nuevo.
      
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente si se borró
      e.target.value = ''; 
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleDateChange = (name, value) => {
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'tTipoDocumento', 'tNumeroDocumento', 'tRazonSocial', 'tRubro', 'tCategoria',
      'tCanalCaptacion', 'tNivelPrioridad', 'tDireccionFiscal', 'tCiudad',
      'tContactoNombre', 'tContactoCargo', 'tContactoTelefono', 'tContactoEmail',
      'tAgenteVentas', 'tTipoServicio', 'tCentroCosto', 'tTipoMoneda',
      'iCostoImplementacion', 'tModalidadMembresia', 'fFechaContrato',
      'fFechaCapacitacion', 'fFechaEntrega', 'fInicioMembresia'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es obligatorio';
      }
    });

    // Validaciones condicionales
    if (formData.tTipoServicio) {
       if (!formData.tPlanSuscripcion) newErrors.tPlanSuscripcion = 'Este campo es obligatorio';
       if (!formData.tNombreProyecto) newErrors.tNombreProyecto = 'Este campo es obligatorio';
    }

    if (formData.tModalidadMembresia && formData.tModalidadMembresia !== 'NO_APLICA') {
       if (!formData.iCostoMembresia) newErrors.iCostoMembresia = 'Este campo es obligatorio';
    }

    // Validación de email
    if (formData.tContactoEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tContactoEmail)) {
      newErrors.tContactoEmail = 'Ingrese un correo válido (ej: usuario@dominio.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Por favor complete todos los campos obligatorios marcados en rojo.');
      // Si hay errores en la primera pestaña, cambiar a ella
      const infoFields = ['tTipoDocumento', 'tNumeroDocumento', 'tRazonSocial', 'tRubro', 'tCategoria', 'tCanalCaptacion', 'tNivelPrioridad', 'tDireccionFiscal', 'tCiudad', 'tContactoNombre', 'tContactoCargo', 'tContactoTelefono', 'tContactoEmail'];
      const hasInfoErrors = infoFields.some(field => !formData[field] || (field === 'tContactoEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tContactoEmail)));
      
      if (hasInfoErrors) {
        setActiveTab('info');
      } else {
        setActiveTab('servicios');
      }
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos para envío (convertir strings vacíos a 0 en campos numéricos)
      const payload = {
        ...formData,
        iCostoMembresia: formData.iCostoMembresia === '' ? 0 : Number(formData.iCostoMembresia),
        iCostoImplementacion: formData.iCostoImplementacion === '' ? 0 : Number(formData.iCostoImplementacion)
      };

      const formDataToSend = new FormData();
      
      Object.keys(payload).forEach(key => {
        if (key !== 'tURLDocumentacion') {
             formDataToSend.append(key, payload[key]);
        }
      });
      
      files.forEach(file => {
        formDataToSend.append('tURLDocumentacion', file);
      });

      const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('El cliente ha sido subido exitosamente');
        // Opcional: Redirigir o limpiar formulario
        console.log('Cliente ID:', data.id);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al registrar cliente');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const baseClass = "w-full h-10 px-3 py-2 bg-white border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500";
    const borderClass = errors[fieldName] ? "border-[#EC6317] ring-1 ring-[#EC6317]" : "border-gray-200";
    return `${baseClass} ${borderClass}`;
  };

  const getSelectClass = (fieldName) => {
    return `${getInputClass(fieldName)} appearance-none`;
  };

  return (
    <div className="w-full p-4">
      {/* Header & Breadcrumbs */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Auditoría de Personal</h1>
        </div>
        <div className="text-sm text-gray-500 ml-2 md:ml-8">
          <span>Gestión</span>
          <span className="mx-2">/</span>
          <span>Clientes</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Auditoría de Personal</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        
        {/* Top Controls: Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'info' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FileText size={16} />
              Información General
            </button>
            
            <button 
              onClick={() => setActiveTab('servicios')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'servicios' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Settings size={16} />
              Servicios y Configuración
            </button>
          </div>

          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
               Cancelar
             </button>
             
             <div className="relative group">
               <button 
                 onClick={handleSubmit}
                 disabled={loading || activeTab === 'info'}
                 className="flex items-center gap-2 px-4 py-2 bg-[#EC6317] text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <CheckCircle2 size={16} />
                 {loading ? 'Guardando...' : 'Guardar Cliente'}
               </button>

               {activeTab === 'info' && (
                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                   Completa la configuración de servicios
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* SECCIÓN 1 & 2: INFORMACIÓN GENERAL */}
          {activeTab === 'info' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* SECCIÓN 1: DATOS GENERALES DEL CLIENTE */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <User className="text-[#EC6317]" size={20} />
                    <h2 className="text-base font-bold text-gray-800">Datos Generales</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {/* Tipo Cliente */}
                   <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Tipo Cliente <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tTipoDocumento"
                        value={formData.tTipoDocumento}
                        onChange={handleChange}
                        className={getSelectClass('tTipoDocumento')}
                      >
                        <option value="">Seleccione...</option>
                        <option value="RUC">RUC</option>
                        <option value="DNI">DNI</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* RUC/DNI */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">RUC / DNI <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                          type="text" 
                          name="tNumeroDocumento"
                          value={formData.tNumeroDocumento}
                          onChange={handleChange}
                          maxLength={11}
                          placeholder="Ingrese número"
                          className={getInputClass('tNumeroDocumento')}
                        />
                        <Search className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-orange-500" size={16} />
                    </div>
                  </div>

                  {/* Razón Social / Nombre */}
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Razón Social / Nombre <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="tRazonSocial"
                      value={formData.tRazonSocial}
                      onChange={handleChange}
                      // readOnly // Quitamos readOnly para permitir edición manual por ahora
                      placeholder="Se obtendrá de SUNAT/RENIEC"
                      className={getInputClass('tRazonSocial')}
                    />
                  </div>

                  {/* Rubro */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Rubro <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tRubro"
                        value={formData.tRubro}
                        onChange={handleChange}
                        className={getSelectClass('tRubro')}
                      >
                        <option value="">Seleccione...</option>
                        <option>Ferretería</option>
                        <option>Minimarket</option>
                        <option>Construcción</option>
                        <option>Restaurante</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Categoría */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Categoría <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tCategoria"
                        value={formData.tCategoria}
                        onChange={handleChange}
                        className={getSelectClass('tCategoria')}
                      >
                        <option value="">Seleccione...</option>
                        <option>Remype</option>
                        <option>Corporativo</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                   {/* Forma de Contacto */}
                   <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Forma de Contacto <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tCanalCaptacion"
                        value={formData.tCanalCaptacion}
                        onChange={handleChange}
                        className={getSelectClass('tCanalCaptacion')}
                      >
                        <option value="">Seleccione...</option>
                        <option>Redes Sociales</option>
                        <option>Recomendación</option>
                        <option>Campo</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Prioridad */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Prioridad <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tNivelPrioridad"
                        value={formData.tNivelPrioridad}
                        onChange={handleChange}
                        className={getSelectClass('tNivelPrioridad')}
                      >
                        <option value="">Seleccione...</option>
                        <option>Alta</option>
                        <option>Media</option>
                        <option>Baja</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                </div>
              </div>

              {/* SECCIÓN 2: UBICACIÓN Y CONTACTO */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <MapPin className="text-[#EC6317]" size={20} />
                    <h2 className="text-base font-bold text-gray-800">Ubicación y Contacto</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {/* Dirección Facturación */}
                   <div className="space-y-1 lg:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Dirección de Facturación <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="tDireccionFiscal"
                      value={formData.tDireccionFiscal}
                      onChange={handleChange}
                      // readOnly 
                      placeholder="Se obtendrá de SUNAT (Dirección Principal)"
                      className={getInputClass('tDireccionFiscal')}
                    />
                  </div>

                   {/* Ciudad */}
                   <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Ciudad <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="tCiudad"
                      value={formData.tCiudad}
                      onChange={handleChange}
                      placeholder="Ingrese ciudad"
                      className={getInputClass('tCiudad')}
                    />
                  </div>

                  {/* Nombre Contacto */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Nombre Contacto <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="tContactoNombre"
                      value={formData.tContactoNombre}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                      className={getInputClass('tContactoNombre')}
                    />
                  </div>

                  {/* Cargo Contacto */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Cargo Contacto <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="tContactoCargo"
                      value={formData.tContactoCargo}
                      onChange={handleChange}
                      placeholder="Ej: Gerente General"
                      className={getInputClass('tContactoCargo')}
                    />
                  </div>

                  {/* Teléfono y Correo */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Teléfono Contacto <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        name="tContactoTelefono"
                        value={formData.tContactoTelefono}
                        onChange={handleChange}
                        placeholder="999 999 999"
                        className={getInputClass('tContactoTelefono')}
                      />
                      {formData.tContactoTelefono && formData.tContactoTelefono.length === 9 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-medium text-gray-600 bg-white pl-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-auto border border-gray-100 shadow-sm">
                            <rect width="3" height="2" fill="#D91023"/>
                            <rect width="1" height="2" x="1" fill="#FFF"/>
                          </svg>
                          <span>(+51)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 lg:col-span-2">
                     <label className="text-xs font-medium text-gray-500">Correo Contacto <span className="text-red-500">*</span></label>
                     <input 
                      type="email" 
                      name="tContactoEmail"
                      value={formData.tContactoEmail}
                      onChange={handleChange}
                      placeholder="ejemplo@empresa.com"
                      className={getInputClass('tContactoEmail')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 3, 4, 5 & 6: SERVICIOS Y CONFIGURACIÓN */}
          {activeTab === 'servicios' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* SECCIÓN 3: DETALLES DEL SERVICIO */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Briefcase className="text-[#F2911C]" size={20} />
                    <h2 className="text-base font-bold text-gray-800">Detalles del Servicio</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Agente de Ventas */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Agente de Ventas <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tAgenteVentas"
                        value={formData.tAgenteVentas}
                        onChange={handleChange}
                        className={getSelectClass('tAgenteVentas')}
                      >
                        <option value="">Seleccione...</option>
                        <option>Usuario Actual</option>
                        <option>Otro Agente</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Tipo de Servicio */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Tipo de Servicio <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tTipoServicio"
                        value={formData.tTipoServicio}
                        onChange={handleChange}
                        className={getSelectClass('tTipoServicio')}
                      >
                        <option value="">Seleccione...</option>
                        <option value="FAST_CLOUD">Fast Cloud Restaurante</option>
                        <option value="RPA">RPA</option>
                        <option value="OTRO">Otro</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Centro de Costo */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Centro de Costo <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="tCentroCosto"
                        value={formData.tCentroCosto}
                        onChange={handleChange}
                        className={getSelectClass('tCentroCosto')}
                      >
                        <option value="">Seleccione...</option>
                        <option>Sertech</option>
                        <option>Licencia de Uso</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  
                  {/* Conditional: Plan del Servicio */}
                  {formData.tTipoServicio && (
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Plan del Servicio</label>
                        <div className="relative">
                        <select 
                            name="tPlanSuscripcion"
                            value={formData.tPlanSuscripcion}
                            onChange={handleChange}
                            className={getSelectClass('tPlanSuscripcion')}
                        >
                            <option value="">Seleccione Plan...</option>
                            <option>Básico</option>
                            <option>Premium</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                  )}

                  {/* Dirección de Servicio */}
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Dirección de Servicio</label>
                    <input 
                      type="text" 
                      name="tDireccionServicio"
                      value={formData.tDireccionServicio}
                      onChange={handleChange}
                      // readOnly
                      placeholder="Se obtendrá de SUNAT (Dirección Principal)"
                      className={getInputClass('tDireccionServicio')}
                    />
                  </div>

                  {/* Conditional: Título del Servicio */}
                  {formData.tTipoServicio && (
                     <div className="space-y-1 lg:col-span-2">
                        <label className="text-xs font-medium text-gray-500">Título del Servicio</label>
                        <input 
                        type="text" 
                        name="tNombreProyecto"
                        value={formData.tNombreProyecto}
                        onChange={handleChange}
                        placeholder="Especifique título del servicio"
                        className={getInputClass('tNombreProyecto')}
                        />
                    </div>
                  )}
                </div>
              </div>

              {/* SECCIÓN 4: FECHAS Y PLAZOS */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Calendar className="text-[#F2911C]" size={20} />
                    <h2 className="text-base font-bold text-gray-800">Fechas y Plazos</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DatePicker 
                        label="Fecha Contrato" 
                        required 
                        value={formData.fFechaContrato}
                        onChange={(val) => handleDateChange('fFechaContrato', val)}
                        error={errors.fFechaContrato}
                    />
                    <DatePicker 
                        label="Fecha Capacitación" 
                        required 
                        value={formData.fFechaCapacitacion}
                        onChange={(val) => handleDateChange('fFechaCapacitacion', val)}
                        error={errors.fFechaCapacitacion}
                    />
                    <DatePicker 
                        label="Fecha Prevista Entrega" 
                        required 
                        value={formData.fFechaEntrega}
                        onChange={(val) => handleDateChange('fFechaEntrega', val)}
                        error={errors.fFechaEntrega}
                    />
                </div>
              </div>

              {/* SECCIÓN 5: ECONÓMICO Y MEMBRESÍA */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <CreditCard className="text-[#F2911C]" size={20} />
                    <h2 className="text-base font-bold text-gray-800">Económico y Membresía</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Moneda <span className="text-red-500">*</span></label>
                        <div className="relative">
                        <select 
                            name="tTipoMoneda"
                            value={formData.tTipoMoneda}
                            onChange={handleChange}
                            className={getSelectClass('tTipoMoneda')}
                        >
                            <option value="S">SOLES (S/)</option>
                            <option value="D">DÓLARES ($)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Monto Implementación <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500 font-medium">
                                {formData.tTipoMoneda === 'S' ? 'S/' : '$'}
                            </span>
                            <input 
                            type="number" 
                            name="iCostoImplementacion"
                            value={formData.iCostoImplementacion}
                            onChange={handleChange}
                            placeholder="0.00"
                            className={`w-full h-10 pl-8 pr-3 py-2 bg-white border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-right ${
                              errors.iCostoImplementacion ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                            }`}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Tipo Membresía <span className="text-red-500">*</span></label>
                        <div className="relative">
                        <select 
                            name="tModalidadMembresia"
                            value={formData.tModalidadMembresia}
                            onChange={handleChange}
                            className={getSelectClass('tModalidadMembresia')}
                        >
                            <option value="">Seleccione...</option>
                            <option value="NO_APLICA">NO APLICA</option>
                            <option value="MENSUAL">MENSUAL</option>
                            <option value="ANUAL">ANUAL</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Conditional: Monto Membresía */}
                    {formData.tModalidadMembresia && formData.tModalidadMembresia !== 'NO_APLICA' && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Monto Membresía</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500 font-medium">
                                    {formData.tTipoMoneda === 'S' ? 'S/' : '$'}
                                </span>
                                <input 
                                type="number" 
                                name="iCostoMembresia"
                                value={formData.iCostoMembresia}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={`w-full h-10 pl-8 pr-3 py-2 bg-white border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-right ${
                                  errors.iCostoMembresia ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                                }`}
                                />
                            </div>
                        </div>
                    )}

                    <DatePicker 
                        label="Inicio Membresía" 
                        required 
                        value={formData.fInicioMembresia}
                        onChange={(val) => handleDateChange('fInicioMembresia', val)}
                        error={errors.fInicioMembresia}
                    />

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Fin Membresía</label>
                        <input 
                          type="text" 
                          readOnly
                          placeholder="Automático"
                          className="w-full h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600"
                        />
                    </div>

                    <div className="space-y-1 flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="lAplicaIGV"
                                checked={formData.lAplicaIGV}
                                onChange={handleChange}
                                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500" 
                            />
                            <span className="text-sm font-medium text-gray-700">Incluye IGV</span>
                        </label>
                    </div>
                </div>
              </div>

              {/* SECCIÓN 6: OTROS */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <LinkIcon className="text-[#F2911C]" size={20} />
                    <h2 className="text-base font-bold text-gray-800">Adicionales</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Comentario</label>
                        <textarea 
                            name="tObservaciones"
                            value={formData.tObservaciones}
                            onChange={handleChange}
                            className="w-full h-24 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                            placeholder="Ingrese comentarios adicionales..."
                        ></textarea>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Documentos Adjuntos</label>
                        <input 
                          type="file" 
                          onChange={handleFileChange}
                          multiple
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                        />
                        {files.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 gap-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-md group hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="p-1.5 bg-white rounded-md border border-gray-200">
                                                <FileText size={16} className="text-orange-500" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                                                <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            title="Eliminar archivo"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Estado</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    name="lEstado" 
                                    checked={formData.lEstado === true}
                                    onChange={() => setFormData(prev => ({ ...prev, lEstado: true }))}
                                    className="text-orange-500 focus:ring-orange-500" 
                                />
                                <span className="text-sm text-gray-700">Activo</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    name="lEstado" 
                                    checked={formData.lEstado === false}
                                    onChange={() => setFormData(prev => ({ ...prev, lEstado: false }))}
                                    className="text-orange-500 focus:ring-orange-500" 
                                />
                                <span className="text-sm text-gray-700">Inactivo</span>
                            </label>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegistroCompra;
