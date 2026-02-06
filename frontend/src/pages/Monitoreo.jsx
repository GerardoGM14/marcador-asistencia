import React, { useState } from 'react';
import { 
  ChevronRight,
  RotateCcw,
  Search,
  ChevronLeft,
  Cpu,
  Building2,
  TrendingUp,
  Settings,
  HeartPulse,
  GraduationCap,
  Monitor,
  Globe,
  Video
} from 'lucide-react';
import estadoActivo from '../assets/state/estado_activo.svg';
import estadoInactivo from '../assets/state/estado_inactivo.svg';
import { usersData } from '../data/usersData';
import monitorScreen from '../assets/monitor_screen.png';
import MonitorDetailModal from '../components/monitoreo/MonitorDetailModal';

// =========================================================================================
// INSTRUCCIONES PARA AGREGAR CAPTURAS REALES:
// 1. Guarda tus capturas de pantalla en la carpeta 'src/assets/screens/'
//    (ejemplo: 'youtube.png', 'facebook.png')
// 2. Importa las imágenes descomentando y ajustando las líneas de abajo:
//
// import youtubeImg from '../assets/screens/youtube.png';
// import facebookImg from '../assets/screens/facebook.png';
// ...
//
// 3. Agrega las imágenes al objeto 'siteImages' dentro de getMonitorData
// =========================================================================================

const Monitoreo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pantallas, setPantallas] = useState('12');
  const [equipo, setEquipo] = useState('TODOS');
  const [usuario, setUsuario] = useState('TODOS');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use shared mock data (placeholder content from Usuarios)
  const allUsuarios = usersData;
  const filteredUsuarios = allUsuarios; 

  // Pagination Logic based on grid size (pantallas)
  const itemsPerPage = parseInt(pantallas);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const indexOfLastRow = currentPage * itemsPerPage;
  const indexOfFirstRow = indexOfLastRow - itemsPerPage;
  const currentItems = filteredUsuarios.slice(indexOfFirstRow, indexOfLastRow);

  // Helper for deterministic random data based on ID
  const getMonitorData = (id) => {
    // Ensure id is a number for math ops
    const numId = typeof id === 'number' ? id : id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = numId * 16807; 
    
    const websites = [
      // Productive
      'gemini.google.com', 'github.com', 'figma.com', 'jira.atlassian.com', 
      'slack.com', 'meet.google.com', 'linear.app', 'notion.so', 
      'aws.amazon.com', 'trello.com', 'outlook.office.com', 'docs.google.com',
      // Non-productive / Distractions
      'youtube.com', 'facebook.com', 'instagram.com', 'tiktok.com', 
      'netflix.com', 'twitch.tv', 'spotify.com', 'pinterest.com',
      'twitter.com', 'primevideo.com'
    ];
    
    // Deterministic choices
    const website = websites[seed % websites.length];
    const desktopId = `DESKTOP-${(seed).toString(36).substring(2, 9).toUpperCase()}`;
    
    // Time simulation (00:00 to 04:59:59)
    const totalSeconds = (seed % 14400); // Up to 4 hours
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    const recordTime = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
    
    // Recording status (simulated: ids divisible by 2 or 3 are recording)
    const isRecording = (numId % 3 === 0) || (numId % 2 === 0);
    
    // Image variation logic (filters + transforms + object position)
    const filters = [
      'none', 
      'brightness(0.95) sepia(0.1)', 
      'contrast(1.1) hue-rotate(5deg)', 
      'brightness(1.05) saturate(0.9)',
      'sepia(0.2) contrast(0.95)',
      'hue-rotate(-10deg) brightness(0.9)',
      'grayscale(0.3) contrast(1.1)',
      'saturate(1.5) brightness(0.95)'
    ];
    
    // Create random positions and zooms to simulate different screen contents from same image
    const positions = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'bottom right'];
    const scales = ['100%', '110%', '125%', '150%'];
    
    const imageStyle = {
      filter: filters[seed % filters.length],
      objectPosition: positions[seed % positions.length],
      // Randomly flip horizontally for more variation combined with scale
      transform: (seed % 2 === 0) ? `scale(${scales[seed % scales.length]}) scaleX(-1)` : `scale(${scales[seed % scales.length]})`
    };

    // Determine if productive (simple check based on known list)
    const isUnproductive = [
      'youtube.com', 'facebook.com', 'instagram.com', 'tiktok.com', 
      'netflix.com', 'twitch.tv', 'spotify.com', 'pinterest.com',
      'twitter.com', 'primevideo.com'
    ].includes(website);

    // Mapeo de imágenes por sitio web
    // Aquí es donde asocias el dominio con la imagen importada
    const siteImages = {
      // 'youtube.com': youtubeImg,
      // 'facebook.com': facebookImg,
      // 'netflix.com': netflixImg,
    };

    // Usa la imagen específica si existe, si no, usa la por defecto
    const screenImage = siteImages[website] || monitorScreen;

    return { website, desktopId, recordTime, isRecording, imageStyle, isUnproductive, screenImage };
  };

  const handleCardClick = (usuario) => {
    const monitorData = getMonitorData(usuario.id);
    setSelectedUser({ ...usuario, ...monitorData });
    setIsModalOpen(true);
  };

  const handleNextUser = () => {
    if (!selectedUser) return;
    const currentIndex = currentItems.findIndex(u => u.id === selectedUser.id);
    if (currentIndex !== -1 && currentIndex < currentItems.length - 1) {
      const nextUser = currentItems[currentIndex + 1];
      handleCardClick(nextUser);
    }
  };

  const handlePrevUser = () => {
    if (!selectedUser) return;
    const currentIndex = currentItems.findIndex(u => u.id === selectedUser.id);
    if (currentIndex > 0) {
      const prevUser = currentItems[currentIndex - 1];
      handleCardClick(prevUser);
    }
  };

  const selectedUserIndex = selectedUser ? currentItems.findIndex(u => u.id === selectedUser.id) : -1;
  const hasNext = selectedUserIndex !== -1 && selectedUserIndex < currentItems.length - 1;
  const hasPrev = selectedUserIndex > 0;

  // Helper to get grid cols class based on items per page
  const getGridClass = () => {
    switch(pantallas) {
      case '4': return 'grid-cols-1 sm:grid-cols-2';
      case '8': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case '12': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case '16': return 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
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
          <span className="font-medium text-gray-900">Monitoreo</span>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">MONITOREO EN VIVO</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Cant. de pantallas */}
            <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Cant. de pantallas:</span>
              <select 
                value={pantallas}
                onChange={(e) => {
                  setPantallas(e.target.value);
                  setCurrentPage(1); // Reset to first page on change
                }}
                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white text-gray-700 w-full sm:min-w-[60px]"
              >
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
              </select>
            </div>

            {/* Equipos */}
            <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
              <span className="text-sm font-medium text-gray-700">Equipos</span>
              <select 
                value={equipo}
                onChange={(e) => setEquipo(e.target.value)}
                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white text-gray-700 w-full sm:min-w-[120px]"
              >
                <option value="TODOS">TODOS</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Usuarios */}
            <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
              <span className="text-sm font-medium text-gray-700">Usuarios</span>
              <select 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white text-gray-700 w-full sm:min-w-[120px]"
              >
                <option value="TODOS">TODOS</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Restaurar Button */}
            <button 
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm h-9 w-full sm:w-auto"
              onClick={() => {
                setPantallas('12');
                setEquipo('TODOS');
                setUsuario('TODOS');
                setCurrentPage(1);
              }}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="font-medium text-sm">Restaurar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - Grid of Cards */}
      <div className="flex-1 px-4 pb-4 min-h-0 w-full overflow-y-auto custom-scrollbar">
        <div className={`grid ${getGridClass()} gap-4 pb-4`}>
          {currentItems.map((usuario) => {
            const { website, desktopId, recordTime, isRecording, imageStyle, isUnproductive, screenImage } = getMonitorData(usuario.id);
            return (
              <div 
                key={usuario.id} 
                className="bg-white rounded-xl border border-[#D9D9D9] p-2.5 flex flex-col cursor-pointer"
                onClick={() => handleCardClick(usuario)}
              >
                {/* Screen Preview */}
                <div className="relative h-24 bg-gray-100 rounded-lg group overflow-hidden">
                  <img 
                    src={screenImage} 
                    alt="Screen Preview" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    style={imageStyle}
                  />
                  
                  {/* Recording Badge */}
                  {isRecording && (
                    <div className="absolute top-2 right-2 bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      <span>GRABANDO {recordTime}</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="pt-3 px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1 h-5">
                      <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">{usuario.grupo || 'GRUPO 01'}</h3>
                      
                      {/* Recording Action Button vs Default Icon */}
                      {isRecording ? (
                        <button className="group/btn relative">
                           <div className="w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors">
                             <div className="w-2 h-2 bg-white rounded-[1px]"></div>
                           </div>
                        </button>
                      ) : (
                        <Video className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    
                    <h2 className="text-base font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                      {usuario.nombres}
                    </h2>
                  </div>

                  {/* Footer Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Monitor className="w-4 h-4" />
                      <span className="text-xs font-medium">{desktopId}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 ${isUnproductive ? 'text-red-500' : 'text-gray-500'}`}>
                        <Globe className="w-4 h-4" />
                        <span className={`text-xs font-medium ${isUnproductive ? 'font-bold' : ''}`}>{website}</span>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className={`w-2.5 h-2.5 rounded-full ${usuario.estado === 'INACTIVO' ? 'bg-red-500' : 'bg-[#10B981]'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
      </div>

      <MonitorDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser} 
        onNext={handleNextUser}
        onPrev={handlePrevUser}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </div>
  );
};

export default Monitoreo;
