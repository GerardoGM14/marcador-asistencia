import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Plus,
  Cpu,
  Building2,
  TrendingUp,
  Settings,
  HeartPulse,
  GraduationCap,
  Users
} from 'lucide-react';
import NuevoUsuarioModal from '../components/usuarios/NuevoUsuarioModal';
import estadoActivo from '../assets/state/estado_activo.svg';
import estadoInactivo from '../assets/state/estado_inactivo.svg';
import { exportToExcel, exportToJSON } from '../utils/exportHelper';
import { usersData } from '../data/usersData';

const Usuarios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nombre: '',
    grupo: 'TODOS',
    rol: 'TODOS',
    ultimaActividad: '',
    estado: 'TODOS'
  });
  
  // Use shared mock data
  const allUsuarios = usersData;

  const filteredUsuarios = allUsuarios.filter(u => {
    const matchesNombre = u.nombres.toLowerCase().includes(filters.nombre.toLowerCase()) || u.email.toLowerCase().includes(filters.nombre.toLowerCase());
    const matchesGrupo = filters.grupo === 'TODOS' || u.grupo === filters.grupo;
    const matchesRol = filters.rol === 'TODOS' || u.rol === filters.rol;
    const matchesUltimaActividad = u.ultimaActividad.toLowerCase().includes(filters.ultimaActividad.toLowerCase());
    const matchesEstado = filters.estado === 'TODOS' || u.estado === filters.estado;

    return matchesNombre && matchesGrupo && matchesRol && matchesUltimaActividad && matchesEstado;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsuarios.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredUsuarios.slice(indexOfFirstRow, indexOfLastRow);

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'ACTIVO': return estadoActivo;
      case 'INACTIVO': return estadoInactivo;
      default: return estadoActivo;
    }
  };

  const getGrupoIcon = (grupo) => {
    switch(grupo) {
      case 'TECNOLOGÍA': return Cpu;
      case 'ADMINISTRACIÓN': return Building2;
      case 'COMERCIAL': return TrendingUp;
      case 'OPERACIONES': return Settings;
      case 'SALUD': return HeartPulse;
      case 'PROFESIONALES': return GraduationCap;
      case 'GENERAL': return Users;
      default: return Users;
    }
  };

  const handleExport = (type) => {
    if (type === 'excel') {
      exportToExcel(filteredUsuarios, 'usuarios');
    } else if (type === 'json') {
      exportToJSON(filteredUsuarios, 'usuarios');
    }
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      {/* Fixed Header Section */}
      <div className="p-4 md:p-6 pb-4 flex-shrink-0">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>Gestión</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Usuarios</span>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">USUARIOS</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">Exportar</span>
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1">
                  <button 
                    onClick={() => handleExport('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="font-medium">Excel</span>
                  </button>
                  <button 
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="font-medium">JSON</span>
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#EC6317] text-white rounded-lg hover:bg-[#d65812] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Nuevo Usuario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - Single Card */}
      <div className="flex-1 px-4 pb-4 min-h-0 w-full">
        <div className="bg-white rounded-xl shadow-sm flex flex-col max-h-full overflow-hidden p-5">
          
          {/* Scrollable Table Section */}
          <div className="overflow-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <table className="w-full text-left min-w-[1000px] border border-gray-200">
              <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                {/* Header Titles */}
                <tr>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-20 border-none rounded-tl-lg">#</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider min-w-[300px] border-none">Usuario</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none">Grupo</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none">Rol</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none">Última Actividad</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none rounded-tr-lg">Estado</th>
                </tr>
                {/* Filter Row - Integrated into header visually */}
                <tr className="border-b border-gray-200 bg-[#F3F4F6]">
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre o email..." 
                        value={filters.nombre}
                        onChange={(e) => setFilters({...filters, nombre: e.target.value})}
                        className="w-full pl-9 pr-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <select 
                      value={filters.grupo}
                      onChange={(e) => setFilters({...filters, grupo: e.target.value})}
                      className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600"
                    >
                      <option value="TODOS">TODOS</option>
                      <option value="TECNOLOGÍA">TECNOLOGÍA</option>
                      <option value="ADMINISTRACIÓN">ADMINISTRACIÓN</option>
                      <option value="COMERCIAL">COMERCIAL</option>
                      <option value="OPERACIONES">OPERACIONES</option>
                      <option value="SALUD">SALUD</option>
                      <option value="PROFESIONALES">PROFESIONALES</option>
                      <option value="GENERAL">GENERAL</option>
                    </select>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <select 
                      value={filters.rol}
                      onChange={(e) => setFilters({...filters, rol: e.target.value})}
                      className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600"
                    >
                      <option value="TODOS">TODOS</option>
                      <option value="MIEMBRO">MIEMBRO</option>
                      <option value="SUPERVISOR">SUPERVISOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.ultimaActividad}
                      onChange={(e) => setFilters({...filters, ultimaActividad: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <select 
                      value={filters.estado}
                      onChange={(e) => setFilters({...filters, estado: e.target.value})}
                      className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600"
                    >
                      <option value="TODOS">TODOS</option>
                      <option value="ACTIVO">ACTIVO</option>
                      <option value="INACTIVO">INACTIVO</option>
                    </select>
                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-200 transition-colors bg-white even:bg-gray-100 border-b border-gray-100 last:border-none">
                    <td className="py-1.5 px-4 text-sm text-gray-600 text-center">{usuario.id}</td>
                    <td className="py-1.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={`https://api.dicebear.com/9.x/notionists/svg?seed=${usuario.nombres}`} 
                          alt="avatar" 
                          className="w-8 h-8 rounded-full bg-gray-100"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm uppercase leading-tight">{usuario.nombres}</span>
                        <span className="text-xs text-gray-500 font-medium leading-none">{usuario.email}</span>
                      </div>
                    </div>
                  </td>
                    <td className="py-1.5 px-4">
                      {(() => {
                        const Icon = getGrupoIcon(usuario.grupo);
                        return (
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 uppercase font-medium">{usuario.grupo}</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-1.5 px-4 text-xs text-gray-600 uppercase font-medium">
                      {usuario.rol}
                    </td>
                    <td className="py-1.5 px-4 text-xs text-gray-600 font-medium">{usuario.ultimaActividad}</td>
                    <td className="py-1.5 px-4">
                      <img 
                        src={getEstadoIcon(usuario.estado)} 
                        alt={usuario.estado} 
                        className="h-6 w-auto max-w-none object-contain" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fixed Footer Pagination - Full Width */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 order-2 md:order-1">
          <span>Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredUsuarios.length)} de {filteredUsuarios.length} resultados</span>
        </div>
        
        <div className="flex items-center gap-2 order-1 md:order-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <div key={page} className="relative group flex-shrink-0">
                <button 
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page 
                      ? 'bg-[#EC6317] text-white' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {page}
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none shadow-sm">
                  Página {page}
                  {/* Triangle arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 order-3">
          <span>Filas por página</span>
          <select 
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[#EC6317] bg-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Modal Integration */}
      <NuevoUsuarioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Usuarios;