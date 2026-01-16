import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import NuevoSubsidiadoModal from '../components/subsidiados/NuevoSubsidiadoModal';
import { workersData } from '../data/workersData';
import { suspensionTypes } from '../data/suspensionTypes';

const Subsidiados = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    trabajador: '',
    puesto: '',
    sede: '',
    turno: '',
    tipoSubsidio: '',
    tipoSuspension: '',
    desde: '',
    hasta: '',
    dias: ''
  });
  
  // Mock data derived from workersData
  const allSubsidiados = workersData.map((worker, i) => {
    const isSubsidiado = i % 2 === 0;
    
    // Generate random suspension type with number
    let suspensionType = '-';
    let desde = '-';
    let hasta = '-';
    let dias = '-';

    if (isSubsidiado) {
      const randomIndex = Math.floor(Math.random() * suspensionTypes.length);
      const type = suspensionTypes[randomIndex];
      
      let displayNum;
      if (randomIndex < 12) {
        displayNum = randomIndex + 1;
      } else {
        displayNum = 20 + (randomIndex - 12);
      }
      
      const number = displayNum.toString().padStart(2, '0');
      suspensionType = `${number} - ${type}`;

      // Random dates logic
      const start = new Date(2025, 0, 1);
      const end = new Date(2025, 11, 31);
      const randomStartDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const duration = Math.floor(Math.random() * 15) + 1; // 1 to 15 days
      const randomEndDate = new Date(randomStartDate);
      randomEndDate.setDate(randomStartDate.getDate() + duration);

      const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
      };

      desde = formatDate(randomStartDate);
      hasta = formatDate(randomEndDate);
      dias = duration;
    }

    return {
      id: worker.id,
      nombres: worker.nombres,
      dni: worker.dni,
      puesto: worker.puesto,
      sede: worker.locacion,
      turno: worker.turno,
      tipoSubsidio: isSubsidiado ? 'SUBSIDIADO' : 'NO SUBSIDIADO',
      tipoSuspension: suspensionType,
      desde: desde,
      hasta: hasta,
      dias: dias
    };
  });

  const filteredSubsidiados = allSubsidiados.filter(t => {
    const matchesTrabajador = t.nombres.toLowerCase().includes(filters.trabajador.toLowerCase()) || 
                              t.dni.includes(filters.trabajador);
    const matchesPuesto = t.puesto.toLowerCase().includes(filters.puesto.toLowerCase());
    const matchesSede = t.sede.toLowerCase().includes(filters.sede.toLowerCase());
    const matchesTurno = t.turno.toLowerCase().includes(filters.turno.toLowerCase());
    const matchesTipoSubsidio = t.tipoSubsidio.toLowerCase().includes(filters.tipoSubsidio.toLowerCase());
    const matchesTipoSuspension = t.tipoSuspension.toLowerCase().includes(filters.tipoSuspension.toLowerCase());
    const matchesDesde = t.desde.includes(filters.desde);
    const matchesHasta = t.hasta.includes(filters.hasta);
    const matchesDias = t.dias.toString().includes(filters.dias);

    return matchesTrabajador && matchesPuesto && matchesSede && matchesTurno && 
           matchesTipoSubsidio && matchesTipoSuspension && matchesDesde && matchesHasta && matchesDias;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredSubsidiados.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSubsidiados.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6] p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Subsidiados</h1>
          <p className="text-gray-500 mt-1">Gestión de personal subsidiado</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#EC6317] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#d55814] transition-colors shadow-sm w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Subsidiado</span>
        </button>
      </div>

      {/* Content Area - Single Card */}
      <div className="flex-1 px-4 pb-4 min-h-0 w-full">
        <div className="bg-white rounded-xl shadow-sm flex flex-col h-full overflow-hidden p-5">
          
          {/* Filters and Period Row */}
          <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-3 mb-4">
               <span className="text-sm font-bold text-gray-700">PERIODO:</span>
               <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm w-full md:w-auto">
                  <span className="text-sm text-gray-700 flex-1">Enero de 2026</span>
                  <Calendar className="w-4 h-4 text-gray-500" />
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                 <button className="flex-1 md:flex-none p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex justify-center items-center">
                    <Filter className="w-4 h-4 text-gray-600" />
                 </button>
                 <button className="flex-1 md:flex-none p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex justify-center items-center">
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
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider min-w-[280px] border-none">Trabajador</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-40 border-none">Puesto</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">Sede</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-24 border-none">Turno</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-56 border-none">Tipo Subsidio</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-64 border-none">Tipo Suspensión</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">Desde</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none">Hasta</th>
                  <th className="pt-2 pb-1 px-4 text-sm font-bold text-gray-600 tracking-wider w-20 border-none rounded-tr-lg">Días</th>
                </tr>
                {/* Filter Row */}
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
                        value={filters.trabajador}
                        onChange={(e) => setFilters({...filters, trabajador: e.target.value})}
                        className="w-full pl-9 pr-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
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
                      value={filters.sede}
                      onChange={(e) => setFilters({...filters, sede: e.target.value})}
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
                      value={filters.tipoSubsidio}
                      onChange={(e) => setFilters({...filters, tipoSubsidio: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.tipoSuspension}
                      onChange={(e) => setFilters({...filters, tipoSuspension: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.desde}
                      onChange={(e) => setFilters({...filters, desde: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.hasta}
                      onChange={(e) => setFilters({...filters, hasta: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.dias}
                      onChange={(e) => setFilters({...filters, dias: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                    />
                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-200 transition-colors bg-white even:bg-gray-100 border-b border-gray-100 last:border-none">
                    <td className="py-2.5 px-4 text-sm text-gray-600 text-center">{row.id}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm uppercase leading-tight">{row.nombres}</span>
                        <span className="text-xs text-gray-500 font-medium leading-none">DNI: {row.dni}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 uppercase leading-tight font-medium">
                      {row.puesto}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 uppercase font-medium">{row.sede}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 uppercase font-medium">{row.turno}</td>
                    <td className="py-2.5 px-4">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide ${
                            row.tipoSubsidio === 'SUBSIDIADO' 
                                ? 'bg-[#DCFCE7] text-[#166534] border-[#166534]' 
                                : 'bg-sky-100 text-sky-700 border-sky-700'
                        }`}>
                            {row.tipoSubsidio}
                        </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 uppercase font-medium">{row.tipoSuspension}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 font-medium">{row.desde}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 font-medium">{row.hasta}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 font-medium">{row.dias}</td>
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
          <span>Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredSubsidiados.length)} de {filteredSubsidiados.length} resultados</span>
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
      
      {/* Modal */}
      <NuevoSubsidiadoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Subsidiados;