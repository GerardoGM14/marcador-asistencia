import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { User, Lock, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import logoBackground from '../assets/logo-background.svg';
import tiktokLogo from '../assets/social/tiktok-logo.svg';
import facebookLogo from '../assets/social/facebook-logo.svg';
import instagramLogo from '../assets/social/instagram-logo.svg';
import playstoreLogo from '../assets/social/playstore-logo.svg';
import PlayStoreModal from './PlayStoreModal';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Estado para el slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoading();
  
  const slides = [
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      alt: "Colaboración en equipo"
    },
    {
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      alt: "Reunión de negocios"
    },
    {
      url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      alt: "Oficina moderna"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    showLoader();

    try {
      // Simular delay de red
      setTimeout(() => {
        // Login Simulado (Local Storage)
        if (email === 'admin@fastcloud.com' && password === 'admin123') {
            // Guardar usuario en localStorage
            const user = {
              id: 1,
              name: 'Administrador',
              email: 'admin@fastcloud.com',
              role: 'admin'
            };
            localStorage.setItem('user', JSON.stringify(user));
            
            navigate('/dashboard');
        } else if (email === 'trabajador@fastcloud.com' && password === 'trabajador123') {
            const user = {
              id: 2,
              name: 'Trabajador Demo',
              email: 'trabajador@fastcloud.com',
              role: 'worker'
            };
            localStorage.setItem('user', JSON.stringify(user));
            
            navigate('/dashboard');
        } else {
          setError('Credenciales inválidas (Prueba: admin@fastcloud.com / admin123)');
          hideLoader();
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado');
      hideLoader();
    }
  };

  // Cambio automático de slides cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans overflow-hidden">
      <div className="w-full h-screen lg:h-screen p-4 lg:p-8 flex" style={{ zoom: 0.9 }}>
        {/* Sección Izquierda - Slider de Imágenes */}
      <div className="hidden lg:flex w-1/2 h-full relative bg-gray-900 overflow-hidden rounded-3xl">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              backgroundImage: `url("${slide.url}")`
            }}
          >
            {/* Overlay oscuro suave */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ))}
        
        {/* Controles del Slider */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
        >
          <ChevronLeft size={40} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
        >
          <ChevronRight size={40} />
        </button>

        {/* Indicadores (Dots) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative overflow-y-auto scrollbar-hide">
        
        <div className="w-full max-w-md relative z-10">
          {/* Logo Placeholder */}
          <div className="flex justify-center mb-8 md:mb-10">
            <div className="flex flex-col items-center">
              <img 
                src="/logo_fastcloud.png" 
                alt="FastCloud Logo" 
                className="h-24 md:h-28 w-auto object-contain mb-[-20px] md:mb-[-25px]" 
              />
              <div className="text-[#383A3D] text-base md:text-lg mt-0 mr-20 font-medium tracking-wide relative -top-1">Timer</div>
            </div>
          </div>

          <h1 className="text-[#EC6317] text-2xl md:text-3xl font-bold mb-2 md:mb-3">Bienvenido</h1>
          <p className="text-[#383A3D] text-sm md:text-base mb-6 md:mb-8">
            Inicie sesión para gestionar su cuenta y disfrutar de todos los beneficios que tenemos para usted.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Usuario */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="USUARIO"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[#383A3D] placeholder-gray-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-colors"
                required
              />
            </div>

            {/* Input Contraseña */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="CONTRASEÑA"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-[#383A3D] placeholder-gray-400 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Opciones Extra */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-[#383A3D] cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#EA580C] focus:ring-[#EA580C] mr-2 accent-[#EA580C]" />
                Recordar mis datos.
              </label>
              <a href="#" className="text-[#EA580C] hover:underline font-medium">
                ¿Olvidó su contraseña?
              </a>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              className="w-full bg-[#EC6317] hover:bg-[#d55814] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-none focus:outline-none focus:ring-0"
            >
              Iniciar Sesión
            </button>

          </form>

          {/* Footer Social */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex gap-6 items-center">
              <a href="#" className="transition transform hover:scale-110">
                <img src={tiktokLogo} alt="TikTok" className="w-6 h-6" />
              </a>
              <a href="#" className="transition transform hover:scale-110">
                <img src={facebookLogo} alt="Facebook" className="w-6 h-6" />
              </a>
              <a href="#" className="transition transform hover:scale-110">
                <img src={instagramLogo} alt="Instagram" className="w-9 h-9" />
              </a>
              <button 
                onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} 
                className="transition transform hover:scale-110 focus:outline-none"
              >
                <img src={playstoreLogo} alt="Play Store" className="w-9 h-9" />
              </button>
            </div>
            
            <div className="text-sm text-[#383A3D] font-medium tracking-wide">
              Copyright © 2025 - Sertech Perú E.I.R.L
            </div>
          </div>
        </div>
      </div>

      {/* Detalle decorativo esquina inferior derecha - Fixed para ignorar padding */}
      <div className="fixed bottom-0 right-0 pointer-events-none translate-x-12 translate-y-4 z-50">
          <img src={logoBackground} alt="Fondo decorativo" className="w-32 h-32 md:w-64 md:h-64 opacity-30" />
      </div>

      {/* PlayStore Modal */}
      <PlayStoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
