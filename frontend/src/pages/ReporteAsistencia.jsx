import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Eye,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import { exportToExcel, exportToJSON } from '../utils/exportHelper';

const ReporteAsistencia = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    fecha: '',
    trabajador: '',
    locacion: '',
    jornada: '',
    online: '',
    offline: '',
    noDefinido: '',
    estado: ''
  });
  
  // Mock data matching the requested design
  const allAsistencias = Array(50).fill({}).map((_, i) => {
    const estados = ['EN TURNO', 'AUSENTE', 'COMPLETADO'];
    const estado = estados[i % 3];
    
    return {
      id: i + 1,
      fecha: '20/02/2025',
      nombres: i % 3 === 0 ? 'PÉREZ GARCÍA, MARIO' : (i % 3 === 1 ? 'FLORES RIVERA, CARLOS' : 'LOPEZ MARTINEZ, SANDRA'),
      dni: i % 3 === 0 ? '12345678' : (i % 3 === 1 ? '13579864' : '87654321'),
      locacion: 'NUEVO CHIMBOTE',
      jornadaHora: i % 3 === 0 ? '14:00' : (i % 3 === 1 ? '11:30' : (estado === 'AUSENTE' ? '-' : '09:00')),
      jornadaEstado: i % 3 === 0 ? 'ACTIVO' : (i % 3 === 1 ? 'ACTIVO' : (estado === 'AUSENTE' ? '' : 'ACTIVO')),
      jornadaTurno: i % 3 === 0 ? 'TARDE' : (i % 3 === 1 ? 'TARDE' : 'MAÑANA'),
      online: estado === 'AUSENTE' ? '-' : (i % 3 === 0 ? '-' : '5h 10m'),
      offline: estado === 'AUSENTE' ? '-' : (i % 3 === 0 ? '-' : '8m'),
      noDefinido: estado === 'AUSENTE' ? '-' : (i % 3 === 0 ? '-' : '4m'),
      estado: estado
    };
  });

  const filteredAsistencias = allAsistencias.filter(item => {
    const matchesTrabajador = item.nombres.toLowerCase().includes(filters.trabajador.toLowerCase()) || 
                              item.dni.includes(filters.trabajador);
    const matchesLocacion = item.locacion.toLowerCase().includes(filters.locacion.toLowerCase());
    // Add more filters as needed
    return matchesTrabajador && matchesLocacion;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredAsistencias.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAsistencias.slice(indexOfFirstRow, indexOfLastRow);

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'EN TURNO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
            EN TURNO
          </span>
        );
      case 'AUSENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
            AUSENTE
          </span>
        );
      case 'COMPLETADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
            COMPLETADO
          </span>
        );
      default:
        return null;
    }
  };

  const handleExport = (type) => {
    if (type === 'excel') {
      exportToExcel(filteredAsistencias, 'reporte_asistencia');
    } else if (type === 'json') {
      exportToJSON(filteredAsistencias, 'reporte_asistencia');
    }
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      {/* Fixed Header Section */}
      <div className="p-6 pb-4 flex-shrink-0">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>Gestión</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Reporte de Asistencia</span>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">REPORTE DE ASISTENCIA</h1>
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
          </div>
        </div>
      </div>

      {/* Content Area - Single Card */}
      <div className="flex-1 px-4 pb-4 min-h-0 w-full">
        <div className="bg-white rounded-xl shadow-sm flex flex-col h-full overflow-hidden p-5">
          
          {/* Top Controls Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar en toda la tabla ..." 
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] bg-white shadow-sm"
                />
             </div>
             
             <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-auto">
                  <input 
                    type="text" 
                    value="20/02/2025" 
                    readOnly
                    className="w-full md:w-40 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none bg-white shadow-sm text-gray-700"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
               </div>
               <button className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
               </button>
               <button className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                  <SlidersHorizontal className="w-4 h-4 text-gray-600" />
               </button>
             </div>
          </div>

          {/* Scrollable Table Section */}
          <div className="flex-1 overflow-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <table className="w-full text-left min-w-[1400px] border border-gray-200">
              <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                {/* Header Titles */}
                <tr>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-16 border-none rounded-tl-lg">#</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">Fecha</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider min-w-[280px] border-none">Trabajador</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-48 border-none">Locación</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-48 border-none">Jornada</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">Online</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">Offline</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">No definido</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-40 border-none">Estado</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-24 border-none rounded-tr-lg"></th>
                </tr>
                {/* Filter Row */}
                <tr className="border-b border-gray-200 bg-[#F3F4F6]">
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre o documento..." 
                        value={filters.trabajador}
                        onChange={(e) => setFilters({...filters, trabajador: e.target.value})}
                        className="w-full pl-9 pr-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0"></td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-200 transition-colors bg-white even:bg-gray-100 border-b border-gray-100 last:border-none">
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">{item.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.fecha}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm uppercase leading-tight">{item.nombres}</span>
                        <span className="text-xs text-gray-500 font-medium leading-none">DNI: {item.dni}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600 uppercase font-medium">{item.locacion}</td>
                    <td className="py-3 px-4">
                       <div className="flex flex-col">
                         <span className="text-xs font-bold text-gray-900">
                           {item.jornadaHora} {item.jornadaEstado && `– ${item.jornadaEstado}`}
                         </span>
                         <span className="text-[10px] text-gray-500 uppercase">{item.jornadaTurno}</span>
                       </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-green-600">{item.online}</td>
                    <td className="py-3 px-4 text-sm font-bold text-[#EC6317]">{item.offline}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-500">{item.noDefinido}</td>
                    <td className="py-3 px-4">
                      {getEstadoBadge(item.estado)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fixed Footer Pagination - Full Width */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredAsistencias.length)} de {filteredAsistencias.length} resultados</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <div key={page} className="relative group">
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
            </div>
          ))}

          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
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
    </div>
  );
};

export default ReporteAsistencia;