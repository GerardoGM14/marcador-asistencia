import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar
} from 'lucide-react';
import NuevaAppSitioModal from '../components/apps_sitios/NuevaAppSitioModal';
import { workersData } from '../data/workersData';
import { suspensionTypes } from '../data/suspensionTypes';
import { appsSitesCategories } from '../data/appsSitesData';
import estadoActivo from '../assets/state/estado_activo.svg';
import estadoBaja from '../assets/state/estado_baja.svg';

const AppsSitios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nombre: '',
    webSites: '',
    apps: '',
    estado: ''
  });
  
  // Mock data - Static 3 categories including REDES SOCIALES
  const allCategories = appsSitesCategories;

  const filteredCategories = allCategories.filter(t => {
    const matchesNombre = t.nombre.toLowerCase().includes(filters.nombre.toLowerCase());
    const matchesWebSites = t.webSites.toString().includes(filters.webSites);
    const matchesApps = t.apps.toString().includes(filters.apps);
    const matchesEstado = t.estado.toLowerCase().includes(filters.estado.toLowerCase());

    return matchesNombre && matchesWebSites && matchesApps && matchesEstado;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCategories.slice(indexOfFirstRow, indexOfLastRow);

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'ACTIVO': return estadoActivo;
      case 'INACTIVO': return estadoBaja;
      default: return estadoActivo;
    }
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
          <span className="font-medium text-gray-900">Apps y Sitios</span>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">CATEGORÍAS DE APPS Y SITIOS</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#EC6317] text-white rounded-lg hover:bg-[#d65812] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Nueva App/Sitio</span>
          </button>
        </div>
      </div>

      {/* Content Area - Single Card */}
      <div className="flex-1 px-4 pb-4 min-h-0 w-full">
        <div className="bg-white rounded-xl shadow-sm flex flex-col max-h-full overflow-hidden p-5">
          
          {/* Scrollable Table Section */}
          <div className="overflow-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <table className="w-full text-left min-w-[800px] border border-gray-200">
              <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                {/* Header Titles */}
                <tr>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-16 border-none rounded-tl-lg">#</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider min-w-[220px] border-none">Nombre de la Categoria</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-56 border-none text-center">Web-Sites asignadas</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-48 border-none text-center">App asignadas</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none text-center">Estado</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-32 border-none text-center rounded-tr-lg">Acciones</th>
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
                        placeholder="Buscar por nombre..." 
                        value={filters.nombre}
                        onChange={(e) => setFilters({...filters, nombre: e.target.value})}
                        className="w-full pl-9 pr-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.webSites}
                      onChange={(e) => setFilters({...filters, webSites: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white text-center" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.apps}
                      onChange={(e) => setFilters({...filters, apps: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white text-center" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      value={filters.estado}
                      onChange={(e) => setFilters({...filters, estado: e.target.value})}
                      className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white text-center" 
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    {/* Empty cell for actions filter */}
                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-200 transition-colors bg-white even:bg-gray-100 border-b border-gray-100 last:border-none">
                    <td className="py-1.5 px-4 text-sm text-gray-600 text-center">{row.id}</td>
                    <td className="py-1.5 px-4">
                      <span className="font-bold text-gray-900 text-sm uppercase leading-tight">{row.nombre}</span>
                    </td>
                    <td className="py-1.5 px-4 text-sm text-gray-600 text-center font-medium">
                      {row.webSites}
                    </td>
                    <td className="py-1.5 px-4 text-sm text-gray-600 text-center font-medium">{row.apps}</td>
                    <td className="py-1.5 px-4 text-center">
                        <img 
                            src={getEstadoIcon(row.estado)} 
                            alt={row.estado} 
                            className="h-6 w-auto max-w-none object-contain mx-auto" 
                        />
                    </td>
                    <td className="py-1.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
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
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 order-2 md:order-1">
          <span>Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredCategories.length)} de {filteredCategories.length} resultados</span>
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
      <NuevaAppSitioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AppsSitios;
