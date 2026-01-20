import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Plus,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import NuevoTrabajadorModal from '../components/trabajadores/NuevoTrabajadorModal';
import estadoActivo from '../assets/state/estado_activo.svg';
import estadoBaja from '../assets/state/estado_baja.svg';
import { exportToExcel, exportToJSON } from '../utils/exportHelper';

import { workersData } from '../data/workersData';

const Trabajadores = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nombre: '',
    contratacion: 'TODOS',
    puesto: '',
    locacion: '',
    turno: '',
    horario: '',
    descanso: '',
    estado: 'TODOS'
  });
  
  // Use shared mock data
  const allTrabajadores = workersData;

  const filteredTrabajadores = allTrabajadores.filter(t => {
    const matchesNombre = t.nombres.toLowerCase().includes(filters.nombre.toLowerCase()) || t.dni.includes(filters.nombre);
    const matchesContratacion = filters.contratacion === 'TODOS' || t.contratacion === filters.contratacion;
    const matchesPuesto = t.puesto.toLowerCase().includes(filters.puesto.toLowerCase());
    const matchesLocacion = t.locacion.toLowerCase().includes(filters.locacion.toLowerCase());
    const matchesTurno = t.turno.toLowerCase().includes(filters.turno.toLowerCase());
    const matchesHorario = t.horario.toLowerCase().includes(filters.horario.toLowerCase());
    const matchesDescanso = t.descanso.toLowerCase().includes(filters.descanso.toLowerCase());
    const matchesEstado = filters.estado === 'TODOS' || t.estado === filters.estado;

    return matchesNombre && matchesContratacion && matchesPuesto && matchesLocacion && 
           matchesTurno && matchesHorario && matchesDescanso && matchesEstado;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTrabajadores.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTrabajadores.slice(indexOfFirstRow, indexOfLastRow);

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'ACTIVO': return estadoActivo;
      case 'BAJA': return estadoBaja;
      default: return estadoActivo;
    }
  };

  const handleExport = (type) => {
    if (type === 'excel') {
      exportToExcel(filteredTrabajadores, 'trabajadores');
    } else if (type === 'json') {
      exportToJSON(filteredTrabajadores, 'trabajadores');
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
          <span className="font-medium text-gray-900">Trabajador</span>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">TRABAJADOR</h1>
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
              <span className="font-medium">Nuevo Trabajador</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - Single Card */}
      <div className="flex-1 px-4 pb-4 min-h-0 w-full">
        <div className="bg-white rounded-xl shadow-sm flex flex-col h-full overflow-hidden p-5">
          
          {/* Scrollable Table Section */}
          <div className="flex-1 overflow-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <table className="w-full text-left min-w-[1200px] border border-gray-200">
              <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                {/* Header Titles */}
                <tr>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-20 border-none rounded-tl-lg">#</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider min-w-[300px] border-none">Trabajador</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none">Contratación</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none">Puesto</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none w-24">Locación</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-24 border-none">Turno</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-28 border-none">Horario</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-48 border-none">Día de descanso</th>
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
                      placeholder="Buscar por nombre o documento..." 
                      value={filters.nombre}
                      onChange={(e) => setFilters({...filters, nombre: e.target.value})}
                      className="w-full pl-9 pr-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                    />
                  </div>
                </td>
                <td className="px-4 pb-4 pt-0">
                  <select 
                    value={filters.contratacion}
                    onChange={(e) => setFilters({...filters, contratacion: e.target.value})}
                    className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600"
                  >
                    <option value="TODOS">TODOS</option>
                    <option value="PLANILLA">PLANILLA</option>
                  </select>
                </td>
                <td className="px-4 pb-4 pt-0">
                  <input 
                    type="text" 
                    value={filters.puesto}
                    onChange={(e) => setFilters({...filters, puesto: e.target.value})}
                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                  />
                </td>
                <td className="px-4 pb-4 pt-0">
                  <input 
                    type="text" 
                    value={filters.locacion}
                    onChange={(e) => setFilters({...filters, locacion: e.target.value})}
                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                  />
                </td>
                <td className="px-4 pb-4 pt-0">
                  <input 
                    type="text" 
                    value={filters.turno}
                    onChange={(e) => setFilters({...filters, turno: e.target.value})}
                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                  />
                </td>
                <td className="px-4 pb-4 pt-0">
                  <input 
                    type="text" 
                    value={filters.horario}
                    onChange={(e) => setFilters({...filters, horario: e.target.value})}
                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                  />
                </td>
                <td className="px-4 pb-4 pt-0">
                  <input 
                    type="text" 
                    value={filters.descanso}
                    onChange={(e) => setFilters({...filters, descanso: e.target.value})}
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
                    <option value="BAJA">BAJA</option>
                  </select>
                </td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRows.map((trabajador) => (
                <tr key={trabajador.id} className="hover:bg-gray-200 transition-colors bg-white even:bg-gray-100 border-b border-gray-100 last:border-none">
                  <td className="py-1.5 px-4 text-sm text-gray-600 text-center">{trabajador.id}</td>
                  <td className="py-1.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-sm uppercase leading-tight">{trabajador.nombres}</span>
                      <span className="text-xs text-gray-500 font-medium leading-none">DNI: {trabajador.dni}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-[#FFF5EB] text-[#EC6317] border border-[#EC6317] shadow-sm">
                      {trabajador.contratacion}
                    </span>
                  </td>
                  <td className="py-1.5 px-4 text-xs text-gray-600 uppercase max-w-[200px] leading-tight font-medium">
                    {trabajador.puesto}
                  </td>
                  <td className="py-1.5 px-4 text-xs text-gray-600 uppercase font-medium">{trabajador.locacion}</td>
                  <td className="py-1.5 px-4 text-xs text-gray-600 uppercase font-medium">{trabajador.turno}</td>
                  <td className="py-1.5 px-4 text-xs font-bold text-gray-900">{trabajador.horario}</td>
                  <td className="py-1.5 px-4 text-xs text-gray-600 font-medium">{trabajador.descanso}</td>
                  <td className="py-1.5 px-4">
                    <img 
                      src={getEstadoIcon(trabajador.estado)} 
                      alt={trabajador.estado} 
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
          <span>Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredTrabajadores.length)} de {filteredTrabajadores.length} resultados</span>
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
      <NuevoTrabajadorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Trabajadores;
