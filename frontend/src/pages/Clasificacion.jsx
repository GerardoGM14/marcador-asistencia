import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Download,
  Settings,
  Globe, 
  AppWindow
} from 'lucide-react';
import { exportToExcel, exportToJSON } from '../utils/exportHelper';
import { classificationData } from '../data/classificationData';
import { appsSitesCategories } from '../data/appsSitesData';

const ItemIcon = ({ name, type, iconType }) => {
  const [imgError, setImgError] = useState(false);
  
  // Custom Icon Map
  const customIcons = {
    vscode: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
    postman: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg',
    gmail: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    word: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/word_48x1.svg',
    excel: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/excel_48x1.svg',
    powerpoint: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/powerpoint_48x1.svg',
    steam: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    slack: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    github: 'https://github.githubassets.com/favicons/favicon.png',
    figma: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    chrome: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg',
    facebook: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg',
    instagram: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    spotify: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    linkedin: 'https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg',
    youtube: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  };

  const getDomain = (name) => {
    if (name.includes('www.')) return name;
    if (name.endsWith('.exe')) return name.replace('.exe', '.com');
    return name;
  };

  const domain = getDomain(name);
  const faviconUrl = iconType && customIcons[iconType] 
    ? customIcons[iconType] 
    : `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  if (imgError) {
    return type === 'SITIO WEB' 
      ? <Globe className="w-5 h-5 text-blue-400" /> 
      : <AppWindow className="w-5 h-5 text-gray-500" />;
  }

  return (
    <img 
      src={faviconUrl} 
      alt={name} 
      className="w-5 h-5 object-contain"
      onError={() => setImgError(true)}
    />
  );
};

const Clasificacion = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'reviewed'
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState(classificationData);
  
  // Filters
  const [filters, setFilters] = useState({
    id: '',
    nombre: '',
    tipo: 'TODOS',
    categoria: 'TODOS',
    grupo: 'TODOS'
  });

  const handleGroupProductivityChange = (id, newStatus) => {
    setData(prevData => prevData.map(item => 
      item.id === id ? { ...item, groupProductivity: newStatus } : item
    ));
  };

  // Filter Data
  const filteredData = data.filter(item => {
    // 1. Filter by Tab
    if (item.status !== activeTab) return false;

    // 2. Filter by ID
    if (filters.id && !item.id.toString().includes(filters.id)) return false;

    // 3. Filter by Search (Nombre)
    if (filters.nombre && !item.name.toLowerCase().includes(filters.nombre.toLowerCase())) return false;

    // 4. Filter by Type
    if (filters.tipo !== 'TODOS' && item.type !== filters.tipo) return false;

    // 5. Filter by Category
    if (filters.categoria !== 'TODOS' && item.category !== filters.categoria) return false;

    // 6. Filter by Group
    if (filters.grupo !== 'TODOS' && item.group !== filters.grupo) return false;

    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const { pending: pendingCount, reviewed: reviewedCount } = data.reduce((acc, item) => {
    const matchesFilters = 
      (!filters.id || item.id.toString().includes(filters.id)) &&
      (!filters.nombre || item.name.toLowerCase().includes(filters.nombre.toLowerCase())) &&
      (filters.tipo === 'TODOS' || item.type === filters.tipo) &&
      (filters.categoria === 'TODOS' || item.category === filters.categoria) &&
      (filters.grupo === 'TODOS' || item.group === filters.grupo);

    if (matchesFilters) {
      if (item.status === 'pending') acc.pending++;
      if (item.status === 'reviewed') acc.reviewed++;
    }
    return acc;
  }, { pending: 0, reviewed: 0 });

  const handleExport = (type) => {
    if (type === 'excel') {
      exportToExcel(filteredData, 'clasificacion');
    } else if (type === 'json') {
      exportToJSON(filteredData, 'clasificacion');
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
          <span className="font-medium text-gray-900">Clasificación</span>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">
              CLASIFICACIÓN
              {filters.grupo !== 'TODOS' && (
                <span className="text-[#737373]">: {filters.grupo}</span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Grupos:</span>
              <select 
                value={filters.grupo}
                onChange={(e) => setFilters({...filters, grupo: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#EC6317] bg-white shadow-sm"
              >
                <option value="TODOS">Global (Todos los grupos)</option>
                <option value="TECNOLOGÍA">TECNOLOGÍA</option>
                <option value="ADMINISTRACIÓN">ADMINISTRACIÓN</option>
                <option value="COMERCIAL">COMERCIAL</option>
                <option value="OPERACIONES">OPERACIONES</option>
                <option value="SALUD">SALUD</option>
                <option value="PROFESIONALES">PROFESIONALES</option>
                <option value="GENERAL">GENERAL</option>
              </select>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exportar</span>
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
          
          {/* Tabs Toggle */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 mr-8 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === 'pending' 
                  ? 'border-[#EC6317] text-[#EC6317]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Por Revisar
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                activeTab === 'pending' ? 'bg-[#FFF0E6] text-[#EC6317]' : 'bg-gray-100 text-gray-600'
              }`}>
                {pendingCount}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('reviewed')}
              className={`pb-3 px-1 mr-8 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === 'reviewed' 
                  ? 'border-[#EC6317] text-[#EC6317]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Revisados
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                activeTab === 'reviewed' ? 'bg-[#FFF0E6] text-[#EC6317]' : 'bg-gray-100 text-gray-600'
              }`}>
                {reviewedCount}
              </span>
            </button>
          </div>

          {/* Scrollable Table Section */}
          <div className="overflow-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <table className="w-full text-left min-w-[1000px] border border-gray-200">
              <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                {/* Header Titles */}
                <tr>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider w-20 border-none rounded-tl-lg text-center">#</th>
                  <th className={`py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none ${filters.grupo !== 'TODOS' ? 'min-w-[200px]' : 'min-w-[300px]'}`}>Nombre / URL</th>
                  <th className="py-1.5 px-4 text-sm font-bold text-gray-600 tracking-wider border-none text-center">Tipo</th>
                  <th className={`py-1.5 px-4 text-center text-sm font-bold text-gray-600 tracking-wider border-none ${filters.grupo !== 'TODOS' ? 'w-64' : 'w-64'}`}>Categoría</th>
                  
                  {filters.grupo !== 'TODOS' ? (
                    <>
                      <th className="py-1.5 px-4 text-center text-sm font-bold text-gray-600 tracking-wider border-none w-40">Estado Global</th>
                      <th className="py-1.5 px-4 text-center text-sm font-bold text-gray-600 tracking-wider border-none w-40">Estado: {filters.grupo}</th>
                    </>
                  ) : (
                    <th className="py-1.5 px-4 text-center text-sm font-bold text-gray-600 tracking-wider border-none w-80">Acción</th>
                  )}

                  <th className={`py-1.5 px-4 text-center text-sm font-bold text-gray-600 tracking-wider border-none ${filters.grupo !== 'TODOS' ? 'w-48' : ''}`}>
                    {filters.grupo !== 'TODOS' ? `Duración: ${filters.grupo}` : 'Duración'}
                  </th>
                  <th className={`py-1.5 px-4 text-center text-sm font-bold text-gray-600 tracking-wider border-none rounded-tr-lg ${filters.grupo !== 'TODOS' ? 'w-24' : ''}`}>Configuración</th>
                </tr>
                
                {/* Filter Row */}
                <tr className="border-b border-gray-200 bg-[#F3F4F6]">
                  <td className="px-4 pb-4 pt-0">
                    <input 
                      type="text" 
                      placeholder="" 
                      value={filters.id}
                      onChange={(e) => setFilters({...filters, id: e.target.value})}
                      className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-center"
                    />
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filters.nombre}
                        onChange={(e) => setFilters({...filters, nombre: e.target.value})}
                        className="w-full pl-9 pr-3 h-9 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] focus:ring-1 focus:ring-[#EC6317] shadow-sm placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <select 
                      value={filters.tipo}
                      onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                      className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600"
                    >
                      <option value="TODOS">TODOS</option>
                      <option value="SITIO WEB">SITIO WEB</option>
                      <option value="APLICACIÓN">APLICACIÓN</option>
                    </select>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                    <select 
                      value={filters.categoria}
                      onChange={(e) => setFilters({...filters, categoria: e.target.value})}
                      className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600"
                    >
                      <option value="TODOS">TODOS</option>
                      {appsSitesCategories.map(cat => (
                        <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                     <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm opacity-50"></div>
                  </td>
                  
                  {filters.grupo !== 'TODOS' && (
                    <td className="px-4 pb-4 pt-0">
                      <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm opacity-50"></div>
                    </td>
                  )}

                  <td className="px-4 pb-4 pt-0">
                     <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm opacity-50"></div>
                  </td>
                  <td className="px-4 pb-4 pt-0">
                     <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm opacity-50"></div>
                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRows.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4 text-center text-sm text-gray-600 font-medium">
                      {item.id}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-3">
                        <ItemIcon name={item.name} type={item.type} iconType={item.iconType} />
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className="text-xs font-medium text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">{item.type}</span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <select 
                        className="w-full appearance-none bg-white border border-gray-300 text-gray-600 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#EC6317] cursor-pointer"
                        defaultValue={item.category || ""}
                      >
                        <option value="" disabled>Seleccionar</option>
                        {appsSitesCategories.map(cat => (
                          <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === 'reviewed' ? (
                          <button className={`pl-3 pr-4 py-1 text-[13px] font-semibold border rounded-full uppercase tracking-wide cursor-default flex items-center gap-2 ${
                            item.productivity === 'PRODUCTIVO'
                              ? 'text-emerald-600 border-[#8AE2AC] bg-[#EAFAEF]'
                              : 'text-[#EC6317] border-[#FDBD9B] bg-[#FFF5EF]'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              item.productivity === 'PRODUCTIVO' ? 'bg-emerald-600' : 'bg-[#EC6317]'
                            }`} />
                            {item.productivity === 'PRODUCTIVO' ? 'Productivo' : 'Improductivo'}
                          </button>
                        ) : (
                          <>
                            <button className="pl-3 pr-4 py-1 text-[13px] font-semibold text-emerald-600 border border-[#8AE2AC] bg-[#EAFAEF] rounded-full uppercase tracking-wide hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-600" />
                              Productivo
                            </button>
                            <button className="pl-3 pr-4 py-1 text-[13px] font-semibold text-[#EC6317] border border-[#FDBD9B] bg-[#FFF5EF] rounded-full uppercase tracking-wide hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#EC6317]" />
                              Improductivo
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    {filters.grupo !== 'TODOS' && (
                      <td className="py-2 px-4 text-center">
                        <div className="relative inline-block">
                          <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${
                            (item.groupProductivity || item.productivity || 'PRODUCTIVO') === 'PRODUCTIVO'
                              ? 'bg-emerald-600'
                              : 'bg-[#EC6317]'
                          }`} />
                          <select 
                            className={`appearance-none pl-8 pr-8 py-1 text-[13px] font-semibold border rounded-full uppercase tracking-wide cursor-pointer focus:outline-none ${
                              (item.groupProductivity || item.productivity || 'PRODUCTIVO') === 'PRODUCTIVO'
                                ? 'text-emerald-600 border-[#8AE2AC] bg-[#EAFAEF]'
                                : 'text-[#EC6317] border-[#FDBD9B] bg-[#FFF5EF]'
                            }`}
                            value={item.groupProductivity || item.productivity || 'PRODUCTIVO'}
                            onChange={(e) => handleGroupProductivityChange(item.id, e.target.value)}
                          >
                            <option value="PRODUCTIVO" className="bg-white text-gray-900">Productivo</option>
                            <option value="IMPRODUCTIVO" className="bg-white text-gray-900">Improductivo</option>
                          </select>
                          <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${
                            (item.groupProductivity || item.productivity || 'PRODUCTIVO') === 'PRODUCTIVO'
                              ? 'text-emerald-600'
                              : 'text-[#EC6317]'
                          }`} />
                        </div>
                      </td>
                    )}
                    <td className="py-2 px-4 text-center">
                      <span className="text-sm text-gray-600 font-medium">{item.duration}</span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentRows.length === 0 && (
                  <tr>
                    <td colspan="7" className="py-8 text-center text-gray-500 text-sm">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fixed Footer Pagination - Full Width */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 order-2 md:order-1">
          <span>Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)} de {filteredData.length} resultados</span>
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
    </div>
  );
};

export default Clasificacion;
