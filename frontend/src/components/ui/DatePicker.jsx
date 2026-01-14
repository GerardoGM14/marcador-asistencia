import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const DatePicker = ({ label, value, onChange, placeholder = "dd/mm/aaaa", required = false, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // Para navegación (mes/año visible)
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada real
  const containerRef = useRef(null);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["DO", "LU", "MA", "MI", "JU", "VI", "SA"];

  // Sincronizar value externo con estado interno
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      // Crear fecha usando UTC para evitar problemas de zona horaria al visualizar
      const date = new Date(year, month - 1, day);
      setSelectedDate(date);
      setCurrentDate(date);
    } else {
        setSelectedDate(null);
    }
  }, [value]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    
    // Formato YYYY-MM-DD para el input nativo HTML si fuera necesario, o para pasar al padre
    const formattedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];

    // Espacios vacíos antes del primer día
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;

      const isToday = 
        new Date().getDate() === day && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={(e) => { e.preventDefault(); handleDayClick(day); }}
          className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm transition-all duration-200
            ${isSelected 
              ? 'bg-[#F2911C] text-white font-semibold shadow-md shadow-orange-200' 
              : 'text-gray-700 hover:bg-orange-50 hover:text-[#F2911C]'
            }
            ${isToday && !isSelected ? 'border border-[#F2911C] text-[#F2911C] font-medium' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const formatDateDisplay = (date) => {
    if (!date) return "";
    const d = new Date(date);
    // Ajuste para mostrar la fecha correctamente sin desplazamiento de zona horaria
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-1 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-xs font-medium text-gray-500">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        className="relative cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input 
          type="text" 
          readOnly
          placeholder={placeholder}
          value={formatDateDisplay(selectedDate)}
          className={`w-full h-10 px-3 py-2 bg-white border rounded-md text-sm text-gray-700 focus:outline-none transition-colors cursor-pointer
            ${error ? 'border-red-500 ring-1 ring-red-500' : (isOpen ? 'border-[#F2911C] ring-1 ring-[#F2911C]' : 'border-gray-200 group-hover:border-orange-300')}
          `}
        />
        <CalendarIcon className={`absolute right-3 top-2.5 transition-colors pointer-events-none ${isOpen ? 'text-[#F2911C]' : 'text-gray-400 group-hover:text-orange-400'}`} size={16} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-100">
          {/* Header del Calendario */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 capitalize">
              {months[currentDate.getMonth()]} <span className="text-gray-400 font-normal">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-1">
              <button 
                onClick={(e) => { e.preventDefault(); handlePrevMonth(); }}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); handleNextMonth(); }}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-[10px] font-semibold text-gray-400 tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de días */}
          <div className="grid grid-cols-7 gap-y-1 justify-items-center">
            {renderCalendarDays()}
          </div>
          
          {/* Botones de acción rápida */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
             <button 
                onClick={(e) => { 
                    e.preventDefault(); 
                    setSelectedDate(null); 
                    onChange('');
                    setIsOpen(false);
                }}
                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
             >
                Borrar
             </button>
             <button 
                onClick={(e) => { 
                    e.preventDefault(); 
                    const today = new Date();
                    handleDayClick(today.getDate());
                }}
                className="text-xs font-medium text-[#EC6317] hover:text-orange-700 transition-colors"
             >
                Hoy
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;