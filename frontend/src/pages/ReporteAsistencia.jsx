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
import { workersData } from '../data/workersData';

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
    estado: ''
  });
  
  // Mock data derived from workersData
  const allAsistencias = workersData.map((worker, i) => {
    const estados = ['EN TURNO', 'AUSENTE', 'COMPLETADO'];
    const estado = estados[i % 3];
    
    // Random variations for time metrics
    const getRandomTime = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    let online = '-';
    let offline = '-';
    let jornadaEstado = '';

    if (estado === 'EN TURNO') {
        jornadaEstado = 'ACTIVO';
        online = `${getRandomTime(1, 4)}h ${getRandomTime(10, 50)}m`;
        offline = `${getRandomTime(1, 20)}m`;
    } else if (estado === 'COMPLETADO') {
        jornadaEstado = 'COMPLETADO';
        online = `${getRandomTime(5, 8)}h ${getRandomTime(10, 50)}m`;
        offline = `${getRandomTime(10, 45)}m`;
    } else {
        // AUSENTE
        jornadaEstado = '-';
        online = '-';
        offline = '-';
    }

    return {
      id: worker.id,
      fecha: i % 2 === 0 ? '16/01/2026' : '15/01/2026',
      nombres: worker.nombres,
      dni: worker.dni,
      locacion: worker.locacion,
      jornadaHora: estado === 'AUSENTE' ? '-' : (i % 2 === 0 ? '08:00' : '14:00'),
      jornadaEstado: jornadaEstado,
      jornadaTurno: worker.turno,
      online: online,
      offline: offline,
      estado: estado
    };
  });

  const filteredAsistencias = allAsistencias.filter(item => {
    const matchesFecha = item.fecha.includes(filters.fecha);
    const matchesTrabajador = item.nombres.toLowerCase().includes(filters.trabajador.toLowerCase()) || 
                              item.dni.includes(filters.trabajador);
    const matchesLocacion = item.locacion.toLowerCase().includes(filters.locacion.toLowerCase());
    const matchesJornada = (item.jornadaHora + item.jornadaEstado + item.jornadaTurno).toLowerCase().includes(filters.jornada.toLowerCase());
    const matchesOnline = item.online.toLowerCase().includes(filters.online.toLowerCase());
    const matchesOffline = item.offline.toLowerCase().includes(filters.offline.toLowerCase());
    const matchesEstado = item.estado.toLowerCase().includes(filters.estado.toLowerCase());

    return matchesFecha && matchesTrabajador && matchesLocacion && matchesJornada && 
           matchesOnline && matchesOffline && matchesEstado;
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] border-2 border-[#FCD34D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
            EN TURNO
          </span>
        );
      case 'AUSENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] border-2 border-[#FECACA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
            AUSENTE
          </span>
        );
      case 'COMPLETADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] border-2 border-[#86EFAC]">
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
      <div className="p-4 md:p-6 pb-4 flex-shrink-0">
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
        <div className="bg-white rounded-xl shadow-sm flex flex-col max-h-full overflow-hidden p-5">
          
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
                    value="16/01/2026" 
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
          <div className="overflow-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <table className="w-full text-left min-w-[1400px] border border-gray-200">
              <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                {/* Header Titles */}
                <tr>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-16 border-none rounded-tl-lg">#</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">Fecha</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider min-w-[220px] border-none">Trabajador</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-48 border-none">Locación</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-48 border-none">Jornada</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-40 border-none">Hrs.Trabajadas</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-40 border-none">Hrs.Tardanzas</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-40 border-none rounded-tr-lg">Estado</th>
                </tr>
                {/* Filter Row */}
                <tr className="border-b border-gray-200 bg-[#F3F4F6]">
                  <td className="px-4 pb-4 pt-0">
                    <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filters.fecha}
                        onChange={(e) => setFilters({...filters, fecha: e.target.value})}
                        className="w-full px-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
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
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filters.locacion}
                        onChange={(e) => setFilters({...filters, locacion: e.target.value})}
                        className="w-full px-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filters.jornada}
                        onChange={(e) => setFilters({...filters, jornada: e.target.value})}
                        className="w-full px-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filters.online}
                        onChange={(e) => setFilters({...filters, online: e.target.value})}
                        className="w-full px-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filters.offline}
                        onChange={(e) => setFilters({...filters, offline: e.target.value})}
                        className="w-full px-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filters.estado}
                        onChange={(e) => setFilters({...filters, estado: e.target.value})}
                        className="w-full px-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-200 transition-colors bg-white even:bg-gray-100 border-b border-gray-100 last:border-none">
                    <td className="py-1.5 px-4 text-sm text-gray-600 text-center">{item.id}</td>
                    <td className="py-1.5 px-4 text-sm text-gray-600">{item.fecha}</td>
                    <td className="py-1.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm uppercase leading-tight">{item.nombres}</span>
                        <span className="text-xs text-gray-500 font-medium leading-none">DNI: {item.dni}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-4 text-xs text-gray-600 uppercase font-medium">{item.locacion}</td>
                    <td className="py-1.5 px-4">
                       <div className="flex flex-col">
                         <span className="text-xs font-bold text-gray-900">
                           {item.jornadaHora} {item.jornadaEstado && `– ${item.jornadaEstado}`}
                         </span>
                         <span className="text-[10px] text-gray-500 uppercase">{item.jornadaTurno}</span>
                       </div>
                    </td>
                    <td className="py-1.5 px-4 text-sm font-bold text-green-600">{item.online}</td>
                    <td className="py-1.5 px-4 text-sm font-bold text-[#EC6317]">{item.offline}</td>
                    <td className="py-1.5 px-4">
                      {getEstadoBadge(item.estado)}
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
          <span>Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredAsistencias.length)} de {filteredAsistencias.length} resultados</span>
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
    </div>
  );
};

export default ReporteAsistencia;