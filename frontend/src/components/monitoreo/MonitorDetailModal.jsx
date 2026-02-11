import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { 
  X, 
  ChevronLeft,
  ChevronRight,
  Video, 
  Camera,
  Monitor,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import hangoutVideoIcon from '../../assets/modal/hangout_video.svg';

const MonitorDetailModal = ({ isOpen, onClose, user, onNext, onPrev, hasNext, hasPrev }) => {
  const socket = useSocket();
  const [streamImage, setStreamImage] = useState(null);
  const [showAllRecordings, setShowAllRecordings] = useState(false);
  const mainModalRef = useRef(null);
  const [secondaryMaxHeight, setSecondaryMaxHeight] = useState(undefined);

  // Sync secondary modal max-height with main modal height using ResizeObserver
  useLayoutEffect(() => {
    if (!isOpen || !mainModalRef.current) return;

    const updateHeight = () => {
      // Check if we are in side-by-side mode (lg screens, > 1024px)
      const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches;
      
      if (mainModalRef.current && isLargeScreen) {
        setSecondaryMaxHeight(mainModalRef.current.offsetHeight);
      } else {
        setSecondaryMaxHeight(undefined);
      }
    };

    // Initial update
    updateHeight();

    // Create observer
    const observer = new ResizeObserver(updateHeight);
    observer.observe(mainModalRef.current);
    
    // Add window resize listener to handle breakpoint changes
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [isOpen, user]); // Re-run if modal opens/closes or user changes
  
  // Reset view state when modal closes or user changes (optional)
  useEffect(() => {
    if (!isOpen) {
      setShowAllRecordings(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // CONDICIÓN TEMPORAL PARA PRUEBAS:
    // Solo activar el socket si el usuario es "ALVARADO LOPEZ, JUAN CARLOS"
    const TARGET_USER = "ALVARADO LOPEZ, JUAN CARLOS";
    
    if (!socket || !isOpen || !user || user.nombres !== TARGET_USER) return;

    console.log(`Iniciando transmisión para usuario objetivo: ${user.nombres}`);
    socket.emit('monitor:start_stream', { userId: user.id });

    // Listen for stream frames (Compatibility with both event names)
    const handleStreamFrame = (data) => {
      // Support for new format { frame: "base64..." } and old formats
      const imageSrc = data.frame || data.image || data; 
      setStreamImage(imageSrc);
    };

    socket.on('monitor:start_frame', handleStreamFrame);
    socket.on('monitor:frame', handleStreamFrame);

    return () => {
      // Cleanup: stop stream and remove listener
      console.log(`Deteniendo transmisión para: ${user.nombres}`);
      socket.emit('monitor:stop_stream', { userId: user.id });
      socket.off('monitor:start_frame', handleStreamFrame);
      socket.off('monitor:frame', handleStreamFrame);
      setStreamImage(null);
    };
  }, [socket, isOpen, user]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Mock data for "All Recordings" - Reacts to user change with random length
  const allRecordings = useMemo(() => {
    if (!user) return [];
    // Generate a pseudo-random length based on user ID to keep it consistent for same user but different across users
    const seed = user.id.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const count = (seed % 15) + 3; // Random number between 3 and 17
    
    return Array.from({ length: count }, (_, i) => ({
      id: `${user.id}-${i}`,
      name: `Grabación ${user.id}${100 + i}`,
      time: '10:30 AM',
      size: '15 MB',
      duration: '05:00'
    }));
  }, [user?.id]);

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-x-auto"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm fixed"
            onClick={onClose}
          />

          {/* Wrapper for side-by-side modals */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 z-10 w-full h-full pointer-events-none py-4 px-2 md:px-0">
             {/* Main Modal */}
            <motion.div 
              ref={mainModalRef}
              layout
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
              className="relative bg-[#EDEDED] rounded-xl w-full max-w-md md:max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] md:max-h-[90vh] pointer-events-auto shrink-0"
            >
              
              {/* Header */}
              <div className="px-3 py-2 border-b border-gray-200 grid grid-cols-[1fr_auto_1fr] items-center bg-[#EDEDED] shadow-sm z-10">
                {/* Navigation */}
                <div className="flex items-center gap-1 justify-self-start">
                  <button 
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={onNext}
                    disabled={!hasNext}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info - Centered */}
                <div className="flex flex-col items-center text-center gap-0 justify-self-center">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none">
                    {user.grupo || 'GRUPO 01'}
                  </span>
                  <h2 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-tight leading-tight">
                    {user.nombres}
                  </h2>
                </div>

                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors justify-self-end"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-[#EDEDED] flex flex-col items-center">
                
                {/* Screen Container */}
                <div className="w-full bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 mb-4 max-w-lg">
                  <div className="aspect-video relative bg-black rounded-lg overflow-hidden border border-gray-100">
                    {/* Browser UI Mockup */}
                    <div className="absolute top-0 left-0 right-0 h-5 bg-[#1e1e1e] flex items-center px-2 gap-1.5 opacity-90 z-10">
                        <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
                    </div>

                    <img 
                      src={streamImage && typeof streamImage === 'string' ? (streamImage.startsWith('data:') ? streamImage : `data:image/jpeg;base64,${streamImage}`) : user.screenImage} 
                      alt="Screen Live View" 
                      className="w-full h-full object-cover"
                      style={streamImage ? {} : user.imageStyle}
                    />
                    
                    {/* Unproductive Overlay */}
                    {user.isUnproductive && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-20">
                        SITIO NO PRODUCTIVO
                      </div>
                    )}

                    {/* Recording Overlay */}
                    {user.isRecording && (
                        <div className="absolute bottom-3 right-3 bg-[#EF4444] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse z-20">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          GRABANDO {user.recordTime}
                        </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 h-9 bg-[#EC6317] hover:bg-[#d65812] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99]">
                    <img src={hangoutVideoIcon} alt="Grabar" className="w-5 h-5" />
                    Grabar Pantalla
                  </button>
                  <button className="flex-1 h-9 bg-white hover:bg-gray-50 text-gray-700 border-[1.5px] border-[#CCCCCC] rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99]">
                    <Camera className="w-5 h-5 text-gray-500" />
                    Tomar Captura
                  </button>
                </div>

                {/* Real-time Details */}
                <div className="w-full mt-4 bg-white p-3 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Detalles en tiempo Real</h3>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <Monitor className="w-4 h-4" />
                        <span className="uppercase">{user.desktopId || 'DESKTOP-UNKNOWN'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <Globe className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{user.website || 'Navegando...'}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full border ${user.isUnproductive ? 'border-red-500 bg-red-50 text-red-600' : 'border-green-500 bg-green-50 text-green-600'} text-[10px] font-bold uppercase flex items-center gap-1`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isUnproductive ? 'bg-red-600' : 'bg-green-600'}`}></div>
                      {user.isUnproductive ? 'NO PRODUCTIVO' : 'PRODUCTIVO'}
                    </div>
                  </div>
                </div>

                {/* Recent Recordings */}
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-800">Grabaciones Recientes</h3>
                    <button 
                      onClick={() => setShowAllRecordings(!showAllRecordings)}
                      className="text-xs font-semibold text-[#EC6317] hover:underline"
                    >
                      {showAllRecordings ? 'Ocultar' : 'Ver Todos'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="bg-white p-2 rounded-lg border border-gray-200 cursor-pointer">
                        <div className="aspect-video bg-[#1e1e1e] rounded-md mb-2 relative flex items-center justify-center overflow-hidden group">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded backdrop-blur-[2px]">05:00</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 mb-0.5 truncate">Grabación 1145</h4>
                        <p className="text-[10px] text-gray-500 truncate">10:30 AM • 15 MB</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Secondary Modal: All Recordings */}
            <AnimatePresence mode="popLayout">
              {showAllRecordings && (
                <motion.div 
                  style={{ height: secondaryMaxHeight ? `${secondaryMaxHeight}px` : 'auto' }}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
                  className="bg-[#EDEDED] rounded-xl w-full max-w-md md:max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] md:max-h-[90vh] pointer-events-auto shrink-0"
                >
                   {/* Header */}
                  <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-[#EDEDED] shadow-sm z-10">
                    <h2 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-tight leading-tight pl-1">
                      HISTORIAL DE GRABACIÓN
                    </h2>
                    <button 
                      onClick={() => setShowAllRecordings(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content - Grid of all recordings */}
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {allRecordings.map((rec) => (
                        <div key={rec.id} className="bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-[#1e1e1e] rounded-md mb-2 relative flex items-center justify-center overflow-hidden group">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded backdrop-blur-[2px]">{rec.duration}</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-800 mb-0.5 truncate">{rec.name}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{rec.time} • {rec.size}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonitorDetailModal;