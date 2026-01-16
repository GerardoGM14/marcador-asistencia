import React, { useState } from 'react';
import { Briefcase, Calendar, ChevronDown, User, Activity, LayoutDashboard, Clock, Search } from 'lucide-react';
import dashboardWorkerImg from '../assets/dashboard/dashboard-trabajador.svg';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip
} from 'recharts';

const LocationFilter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const cities = ['TODOS', 'LIMA', 'AREQUIPA', 'TRUJILLO', 'CUSCO', 'PIURA'];
  
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#EC6317] w-40 shadow-sm cursor-pointer flex items-center justify-between"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#EC6317]"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredCities.map(city => (
              <div
                key={city}
                onClick={() => {
                  onChange(city);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${value === city ? 'bg-orange-50 text-[#EC6317] font-medium' : 'text-gray-700'}`}
              >
                {city}
              </div>
            ))}
            {filteredCities.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-400 text-center">No encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isWorker = user.role === 'worker';

  const getFormattedDate = () => {
    const date = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName} ${day}/${month}/${year}`;
  };

  // Data for Worker Attendance History
  const attendanceHistoryData = [
    { day: 'Lun 12', time: 7.8, status: 'Asistencia', color: '#10B981' },
    { day: 'Mar 13', time: 8.2, status: 'Tardanza', color: '#F97316' },
    { day: 'Mier 14', time: 8.0, status: 'Inasistencia', color: '#6B7280' },
    { day: 'Jue 15', time: 7.5, status: 'Asistencia', color: '#10B981' },
    { day: 'Vie 16', time: 7.9, status: 'Asistencia', color: '#10B981' },
  ];

  // Data for Worker Day Distribution
  const workerDistributionData = [
    { date: '12/01/2026', Online1: 8.5, TopSegment: 1.5, TopColor: '#F97316' },
    { date: '13/01/2026', Online1: 2.0, Offline1: 0.5, Online2: 2.0, Offline2: 0.5, TopSegment: 4.0, TopColor: '#10B981' },
    { date: '14/01/2026', Online1: 5.0, Offline1: 1.5, TopSegment: 4.0, TopColor: '#10B981' },
    { date: '15/01/2026', Online1: 5.0, Offline1: 0.5, Online2: 4.0, TopSegment: 1.0, TopColor: '#F97316' },
    { date: '16/01/2026', Online1: 5.0, Offline1: 1.0, TopSegment: 4.0, TopColor: '#10B981' },
  ];

  // Data for Top Applications
  const topAppsData = [
    { name: 'Microsoft Excel', value: 32, color: '#8B4513' },
    { name: 'Chrome', value: 15, color: '#EA580C' },
    { name: 'Microsoft Teams', value: 12, color: '#F97316' },
    { name: 'Outlook', value: 12, color: '#FDBA74' },
    { name: 'Power BI', value: 9, color: '#D97706' },
    { name: 'Word', value: 6, color: '#EAB308' },
    { name: 'Visual Studio Code', value: 5, color: '#FEF08A' },
    { name: 'Illustrator', value: 2, color: '#22C55E' },
    { name: 'Notion', value: 2, color: '#86EFAC' },
    { name: 'Photoshop', value: 2, color: '#3B82F6' },
    { name: 'Spotify', value: 2, color: '#93C5FD' },
    { name: 'Otros', value: 1, color: '#CBD5E1' },
  ];

  // Data for Consolidated Records (Worker)
  const consolidatedWorkerData = [
    { id: 1, date: '15/01/2026', efficiency: { online: 82, offline: 15, unknown: 3 }, status: 'PUNTUAL', entry_exit: '07:55 - 17:05', worked_hours: '8h 5m', overtime: '5m', tardiness: '-' },
    { id: 2, date: '14/01/2026', efficiency: { online: 55, offline: 40, unknown: 5 }, status: 'TARDE', entry_exit: '08:15 - 17:15', worked_hours: '8h', overtime: '15m', tardiness: '15m' },
    { id: 3, date: '13/01/2026', efficiency: { online: 0, offline: 0, unknown: 0 }, status: 'INASISTENCIA', entry_exit: '-', worked_hours: '-', overtime: '-', tardiness: '-' },
    { id: 4, date: '12/01/2026', efficiency: { online: 72, offline: 20, unknown: 8 }, status: 'PUNTUAL', entry_exit: '07:59 - 17:01', worked_hours: '8h 2m', overtime: '1m', tardiness: '-' },
  ];

  // Data for Top Websites
  const topWebsitesData = [
    { name: 'mail.google.com', value: 32, color: '#8B4513' },
    { name: 'sharepoint.com', value: 15, color: '#EA580C' },
    { name: 'asana.com', value: 12, color: '#F97316' },
    { name: 'monday.com', value: 12, color: '#FDBA74' },
    { name: 'salesforce.com', value: 9, color: '#D97706' },
    { name: 'clickup.com', value: 6, color: '#EAB308' },
    { name: 'gitlab.com', value: 5, color: '#FEF08A' },
    { name: 'atlassian.com', value: 2, color: '#22C55E' },
    { name: 'cloud.google.com', value: 2, color: '#86EFAC' },
    { name: 'learn.microsoft.com', value: 2, color: '#3B82F6' },
    { name: 'coursera.org', value: 2, color: '#93C5FD' },
    { name: 'Otros', value: 1, color: '#CBD5E1' },
  ];

  // Filtros para la tabla de Registros Consolidados
  const [tableFilters, setTableFilters] = useState({
    id: '',
    fecha: '',
    status: 'TODOS',
    entradaSalida: '',
    horasTrabajadas: '',
    horasExtras: '',
    tardanza: ''
  });

  // Lógica de filtrado
  const filteredConsolidatedData = consolidatedWorkerData.filter(record => {
    // Filtro ID
    if (tableFilters.id && !record.id.toString().includes(tableFilters.id)) return false;
    
    // Filtro Fecha (record.date es DD/MM/YYYY, tableFilters.fecha es YYYY-MM-DD)
    if (tableFilters.fecha) {
        const [day, month, year] = record.date.split('/');
        const recordDateISO = `${year}-${month}-${day}`;
        if (recordDateISO !== tableFilters.fecha) return false;
    }

    // Filtro Status
    if (tableFilters.status !== 'TODOS' && record.status !== tableFilters.status) return false;

    // Filtro Entrada/Salida
    if (tableFilters.entradaSalida && !record.entry_exit.toLowerCase().includes(tableFilters.entradaSalida.toLowerCase())) return false;

    // Filtro Horas Trabajadas
    if (tableFilters.horasTrabajadas && !record.worked_hours.toString().includes(tableFilters.horasTrabajadas)) return false;

    // Filtro Horas Extras
    if (tableFilters.horasExtras && !record.overtime.toLowerCase().includes(tableFilters.horasExtras.toLowerCase())) return false;

    // Filtro Tardanza
    if (tableFilters.tardanza && !record.tardiness.toLowerCase().includes(tableFilters.tardiness.toLowerCase())) return false;

    return true;
  });

  if (isWorker) {
    return (
      <div className="flex flex-col h-full bg-[#EDEDED] px-4 md:px-8 lg:px-12 py-6 overflow-y-auto custom-scrollbar">
         <div className="w-full" style={{ containerType: 'inline-size' }}>
           <div className="relative w-full">
             <img 
               src={dashboardWorkerImg} 
               alt="Dashboard Trabajador" 
               className="w-full h-auto object-top"
             />
             <div 
                className="absolute flex items-center justify-center font-medium text-white pointer-events-none"
                style={{
                  top: '29.9%',   // 36.5 / 122
                  left: '2.5%',   // 30 / 1186
                  width: '11.6%', // 137 / 1186
                  height: '13.9%', // 17 / 122
                  fontSize: '1.1cqw', // Responsivo relativo al ancho del contenedor
                  whiteSpace: 'nowrap'
                }}
              >
                {getFormattedDate()}
              </div>

              {/* Mensaje de Bienvenida y Estado */}
              <div 
                className="absolute flex flex-col justify-start text-white pointer-events-none"
                style={{
                  top: '45%',      
                  left: '2.5%',    
                  width: '38%',    
                }}
              >
                <h1 className="font-medium leading-tight" style={{ fontSize: '1.8cqw' }}>
                  Bienvenido(a), {user.name || 'TRABAJADOR'}
                </h1>
                <p className="font-light opacity-90 mt-[0.2cqw]" style={{ fontSize: '1.0cqw' }}>
                  Actualmente estás <span className="font-bold">En Turno</span>. Tu registro de entrada hoy fue a las <span className="font-bold">07:58 AM</span>.
                </p>
              </div>

              {/* Información del Turno - Segundo Cuadro */}
              <div 
                className="absolute grid grid-cols-4 items-center text-white pointer-events-none"
                style={{
                  top: '28.3%',     // 34.5 / 122
                  left: '40.5%',    // 480 / 1186
                  width: '36.3%',   // 430 / 1186
                  height: '43.4%',  // 53 / 122
                }}
              >
                {/* Columna 1 */}
                <div className="flex flex-col items-center justify-center">
                  <span style={{ fontSize: '0.75cqw' }} className="opacity-90 uppercase tracking-wide mb-[0.2cqw]">Turno Actual</span>
                  <span style={{ fontSize: '1.2cqw' }} className="font-bold leading-none">MAÑANA</span>
                </div>
                {/* Columna 2 */}
                <div className="flex flex-col items-center justify-center">
                  <span style={{ fontSize: '0.75cqw' }} className="opacity-90 uppercase tracking-wide mb-[0.2cqw]">Inicio Prog</span>
                  <span style={{ fontSize: '1.2cqw' }} className="font-bold leading-none">08:00AM</span>
                </div>
                {/* Columna 3 */}
                <div className="flex flex-col items-center justify-center">
                  <span style={{ fontSize: '0.75cqw' }} className="opacity-90 uppercase tracking-wide mb-[0.2cqw]">Inicio Real</span>
                  <span style={{ fontSize: '1.2cqw' }} className="font-bold leading-none">07:58AM</span>
                </div>
                {/* Columna 4 */}
                <div className="flex flex-col items-center justify-center">
                  <span style={{ fontSize: '0.75cqw' }} className="opacity-90 uppercase tracking-wide mb-[0.2cqw]">Estado Hoy</span>
                  <span 
                    className="font-bold text-white bg-[#63B582] rounded-full leading-none"
                    style={{ 
                      fontSize: '1.1cqw', 
                      padding: '0.3cqw 1cqw',
                    }}
                  >
                    PUNTUAL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Desempeño Laboral */}
          <div className="mt-5">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Mi desempeño laboral</h2>
                <p className="text-gray-500 text-sm">Resumen de tus indicadores de asistencia y puntualidad.</p>
              </div>
              <div className="flex flex-col items-start w-full md:w-auto">
                <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">Fecha</label>
                <div className="relative w-full md:w-auto">
                  <input 
                    type="text" 
                    value="12/01/2026 - 15/01/2026"
                    readOnly
                    className="pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none w-full md:w-[240px]"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Tarjeta 1: Horas trabajadas */}
              <div className="bg-white px-4 pb-4 pt-3 rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-700">Horas trabajadas</h3>
                  <div className="text-3xl font-bold text-gray-900 mt-1">154 h</div>
                  <p className="text-xs text-gray-400 mt-0.5">Asignadas: 160 h</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              {/* Tarjeta 2: Horas extras */}
              <div className="bg-white px-4 pb-4 pt-3 rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-700">Horas extras</h3>
                  <div className="text-3xl font-bold text-gray-900 mt-1">+6 h</div>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              {/* Tarjeta 3: Tardanzas */}
              <div className="bg-white px-4 pb-4 pt-3 rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-700">Tardanzas</h3>
                  <div className="text-3xl font-bold text-gray-900 mt-1">38 min</div>
                  <p className="text-xs text-gray-400 mt-0.5">4 días</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              {/* Tarjeta 4: Puntualidad */}
              <div className="bg-white px-4 pb-4 pt-3 rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-700">Puntualidad</h3>
                  <div className="text-3xl font-bold text-gray-900 mt-1">92%</div>
                  <p className="text-xs text-gray-400 mt-0.5">4 días</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              {/* Tarjeta 5: Inasistencia */}
              <div className="bg-white px-4 pb-4 pt-3 rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-700">Inasistencia</h3>
                  <div className="text-3xl font-bold text-gray-900 mt-1">1 día</div>
                  <p className="text-xs text-gray-400 mt-0.5">Días sin marcación inicial.</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Sección de Gráficos del Trabajador */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pb-6">
              
              {/* Gráfico 1: Historial de Asistencia */}
              <div className="bg-white px-6 pb-6 pt-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Historial de Asistencia</h3>
                    <p className="text-sm text-gray-500 mt-1">Visualiza tu registro diario de entradas y salidas de la semana.</p>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                      <span className="text-gray-600 font-medium">Asistencia</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></div>
                      <span className="text-gray-600 font-medium">Tardanza</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></div>
                      <span className="text-gray-600 font-medium">Inasistencia</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 w-full min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendanceHistoryData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      barSize={80}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }}
                        dy={5}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }}
                        tickFormatter={(value) => `${Math.floor(value)}:00`}
                        domain={[6, 10]}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${Math.floor(value)}:${Math.round((value % 1) * 60).toString().padStart(2, '0')}`, 'Hora']}
                      />
                      <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                        {attendanceHistoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico 2: Distribución de Jornada */}
              <div className="bg-white px-6 pb-6 pt-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Distribución de Jornada</h3>
                    <p className="text-sm text-gray-500 mt-1">Desglose de tus horas laborales en actividades online y offline.</p>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                      <span className="text-gray-600 font-medium">Online</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></div>
                      <span className="text-gray-600 font-medium">Offline</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 w-full min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={workerDistributionData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      barSize={80}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }}
                        dy={5}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }}
                        tickFormatter={(value) => value === 0 ? '0s' : `${value}h`}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value, name, entry) => {
                          if (name.includes('Online')) return [`${value}h`, 'Online'];
                          if (name.includes('Offline')) return [`${value}h`, 'Offline'];
                          if (name === 'TopSegment') {
                             return [`${value}h`, entry.payload.TopColor === '#10B981' ? 'Online' : 'Offline'];
                          }
                          return [value, name];
                        }}
                      />
                      <Bar dataKey="Online1" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Offline1" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Online2" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Offline2" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="TopSegment" stackId="a" radius={[4, 4, 0, 0]}>
                        {workerDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.TopColor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>





            {/* Tabla de Registros Consolidados */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Registros consolidados</h3>
                <p className="text-sm text-gray-500 mt-1">Resumen detallado de tus registros diarios y métricas de eficiencia.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[50px]">#</th>
                        <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[140px]">Fecha</th>
                        <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[220px]">Ratio de Eficiencia</th>
                        <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[140px]">Estado</th>
                        <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[140px]">Entrada / Salida</th>
                        <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[120px]">Horas trabajadas</th>
                        <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[120px]">Horas Extras</th>
                        <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[120px]">Tardanza</th>
                      </tr>
                      {/* Fila de Filtros */}
                      <tr>
                        <th className="px-2 pb-3">
                           <input 
                             type="text" 
                             value={tableFilters.id}
                             onChange={(e) => setTableFilters({...tableFilters, id: e.target.value})}
                             className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white" 
                           />
                        </th>
                        <th className="px-2 pb-3">
                           <input 
                             type="date" 
                             value={tableFilters.fecha}
                             onChange={(e) => setTableFilters({...tableFilters, fecha: e.target.value})}
                             className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white" 
                           />
                        </th>
                        <th className="px-2 pb-3">
                           {/* Ratio de eficiencia sin filtro por ahora */}
                           <div className="w-full h-8 bg-gray-50 rounded-md border border-transparent"></div>
                        </th>
                        <th className="px-2 pb-3">
                           <select 
                             value={tableFilters.status}
                             onChange={(e) => setTableFilters({...tableFilters, status: e.target.value})}
                             className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white text-gray-600"
                           >
                             <option value="TODOS">TODOS</option>
                             <option value="PUNTUAL">PUNTUAL</option>
                             <option value="TARDE">TARDE</option>
                             <option value="INASISTENCIA">INASISTENCIA</option>
                           </select>
                        </th>
                        <th className="px-2 pb-3">
                           <input 
                             type="text" 
                             value={tableFilters.entradaSalida}
                             onChange={(e) => setTableFilters({...tableFilters, entradaSalida: e.target.value})}
                             className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white" 
                           />
                        </th>
                        <th className="px-2 pb-3">
                           <input 
                             type="text" 
                             value={tableFilters.horasTrabajadas}
                             onChange={(e) => setTableFilters({...tableFilters, horasTrabajadas: e.target.value})}
                             className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white" 
                           />
                        </th>
                        <th className="px-2 pb-3">
                           <input 
                             type="text" 
                             value={tableFilters.horasExtras}
                             onChange={(e) => setTableFilters({...tableFilters, horasExtras: e.target.value})}
                             className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white" 
                           />
                        </th>
                        <th className="px-2 pb-3">
                           <input 
                             type="text" 
                             value={tableFilters.tardanza}
                             onChange={(e) => setTableFilters({...tableFilters, tardanza: e.target.value})}
                             className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white" 
                           />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredConsolidatedData.length > 0 ? (
                        filteredConsolidatedData.map((record, index) => (
                          <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-sm font-medium text-gray-900 text-center">{record.id}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                {record.date}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="w-full h-6 bg-gray-100 rounded md flex overflow-hidden">
                                <div style={{ width: `${record.efficiency.online}%` }} className="h-full bg-[#10B981]" title={`Online: ${record.efficiency.online}%`}></div>
                                <div style={{ width: `${record.efficiency.offline}%` }} className="h-full bg-[#F97316]" title={`Offline: ${record.efficiency.offline}%`}></div>
                                <div style={{ width: `${record.efficiency.unknown}%` }} className="h-full bg-[#6B7280]" title={`No definido: ${record.efficiency.unknown}%`}></div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border
                                ${record.status === 'PUNTUAL' ? 'bg-[#D1FAE5] text-[#059669] border-[#10B981]' : 
                                  record.status === 'TARDE' ? 'bg-[#FEF3C7] text-[#D97706] border-[#F59E0B]' : 
                                  'bg-[#FEE2E2] text-[#DC2626] border-[#EF4444]'}`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900 font-bold text-center">{record.entry_exit}</td>
                            <td className="py-4 px-4 text-sm text-gray-900 font-bold text-center">{record.worked_hours}</td>
                            <td className="py-4 px-4 text-sm text-[#10B981] font-bold text-center">{record.overtime}</td>
                            <td className="py-4 px-4 text-sm text-[#F97316] font-bold text-center">{record.tardiness}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-gray-500">
                            No se encontraron registros que coincidan con los filtros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
       </div>
    );
  }

  const [filters, setFilters] = useState({
    fecha: '15/01/2026 - 16/01/2026',
    locacion: localStorage.getItem('selectedLocation') || 'TODOS',
    turno: 'TODOS'
  });

  // Update localStorage and dispatch event when location changes
  const handleLocationChange = (city) => {
    setFilters(prev => ({ ...prev, locacion: city }));
    localStorage.setItem('selectedLocation', city);
    window.dispatchEvent(new Event('locationChanged'));
  };

  const getActiveWorkers = () => {
    if (filters.locacion === 'TODOS') return '50';
    if (filters.locacion === 'LIMA') return '30';
    if (filters.locacion === 'AREQUIPA') return '10';
    if (filters.locacion === 'TRUJILLO') return '5';
    if (filters.locacion === 'CUSCO') return '3';
    if (filters.locacion === 'PIURA') return '2';
    return '0';
  };

  const stats = [
    { title: 'Trabajadores Activos', value: getActiveWorkers(), subtitle: 'No Subsidiados', icon: Briefcase },
    { title: 'En turno', value: '20', subtitle: 'Turno iniciado', icon: Briefcase },
    { title: 'Completados', value: '15', subtitle: 'Entrada y salida registradas', icon: Briefcase },
    { title: 'Ausentes', value: '02', subtitle: 'Sin marca de entrada', icon: Briefcase },
    { title: 'Pendientes de inicio', value: '13', subtitle: 'Turno aún no inicia', icon: Briefcase }
  ];

  // Data for Pie Chart
  // Matching count with colors from image:
  // Green (Asistencia): 20
  // Orange (Tardanza): 15
  // Grey (Inasistencia): 15
  // Total: 50
  const pieData = [
    { name: 'Asistencia', value: 20, color: '#10B981', percentage: 40 },
    { name: 'Tardanza', value: 15, color: '#F97316', percentage: 30 },
    { name: 'Inasistencia', value: 15, color: '#6B7280', percentage: 30 },
  ];

  // Data for Bar Chart
  const barData = [
    {
      name: '15/01/2026',
      Asistencia: 35,
      Tardanza: 10,
      Inasistencia: 5,
    },
    {
      name: '16/01/2026',
      Asistencia: 30,
      Tardanza: 15,
      Inasistencia: 5,
    },
  ];

  // Data for Efficiency by Turn
  const efficiencyByTurnData = [
    { name: 'Mañana', Asistencia: 72, Tardanza: 12, Inasistencia: 8 }, // Sum: 92
    { name: 'Tarde', Asistencia: 65, Tardanza: 10, Inasistencia: 5 },  // Sum: 80
    { name: 'Noche', Asistencia: 55, Tardanza: 15, Inasistencia: 5 },  // Sum: 75
  ];

  // Data for Monthly Efficiency
  const efficiencyMonthlyData = [
    { name: 'Ene', Asistencia: 75, Tardanza: 10, Inasistencia: 5 }, // 90
    { name: 'Feb', Asistencia: 62, Tardanza: 15, Inasistencia: 8 }, // 85
    { name: 'Mar', Asistencia: 85, Tardanza: 5, Inasistencia: 5 },  // 95
    { name: 'Abr', Asistencia: 68, Tardanza: 12, Inasistencia: 10 }, // 90
    { name: 'May', Asistencia: 92, Tardanza: 3, Inasistencia: 2 },   // 97
    { name: 'Jun', Asistencia: 70, Tardanza: 15, Inasistencia: 5 },  // 90
    { name: 'Jul', Asistencia: 58, Tardanza: 12, Inasistencia: 8 },  // 78
    { name: 'Agto', Asistencia: 80, Tardanza: 8, Inasistencia: 4 },  // 92
    { name: 'Set', Asistencia: 76, Tardanza: 10, Inasistencia: 6 },  // 92
    { name: 'Oct', Asistencia: 88, Tardanza: 5, Inasistencia: 3 },   // 96
    { name: 'Nov', Asistencia: 65, Tardanza: 18, Inasistencia: 7 },  // 90
    { name: 'Dic', Asistencia: 55, Tardanza: 20, Inasistencia: 10 }, // 85
  ];

  // Consolidated Table Filters State
  const [consolidatedFilters, setConsolidatedFilters] = useState({
    date: '',
    turn: 'TODOS',
    efficiency: '',
    workers: '',
    online: '',
    offline: '',
    unknown: '',
    total: ''
  });

  // Data for Consolidated Records
  const consolidatedRecords = [
    { id: 1, date: '16/01/2026', status: 'MAÑANA', hours: { online: 500, offline: 50, unknown: 25, total_potential: 600 }, workers: 45, online_hours: '500h', offline_hours: '50h', unknown_time: '25h', total_hours: '575h' },
    { id: 2, date: '16/01/2026', status: 'TARDE', hours: { online: 450, offline: 40, unknown: 35, total_potential: 550 }, workers: 40, online_hours: '450h', offline_hours: '40h', unknown_time: '35h', total_hours: '525h' },
    { id: 3, date: '16/01/2026', status: 'NOCHE', hours: { online: 380, offline: 20, unknown: 15, total_potential: 450 }, workers: 35, online_hours: '380h', offline_hours: '20h', unknown_time: '15h', total_hours: '415h' },
    { id: 4, date: '15/01/2026', status: 'MAÑANA', hours: { online: 510, offline: 30, unknown: 20, total_potential: 600 }, workers: 45, online_hours: '510h', offline_hours: '30h', unknown_time: '20h', total_hours: '560h' },
    { id: 5, date: '15/01/2026', status: 'TARDE', hours: { online: 460, offline: 55, unknown: 30, total_potential: 580 }, workers: 42, online_hours: '460h', offline_hours: '55h', unknown_time: '30h', total_hours: '545h' },
    { id: 6, date: '15/01/2026', status: 'NOCHE', hours: { online: 400, offline: 15, unknown: 18, total_potential: 450 }, workers: 38, online_hours: '400h', offline_hours: '15h', unknown_time: '18h', total_hours: '433h' },
  ];

  const filteredConsolidatedRecords = consolidatedRecords.filter(record => {
    const matchDate = record.date.toLowerCase().includes(consolidatedFilters.date.toLowerCase());
    const matchTurn = consolidatedFilters.turn === 'TODOS' || record.status === consolidatedFilters.turn;
    const matchWorkers = record.workers.toString().includes(consolidatedFilters.workers);
    const matchOnline = record.online_hours.toLowerCase().includes(consolidatedFilters.online.toLowerCase());
    const matchOffline = record.offline_hours.toLowerCase().includes(consolidatedFilters.offline.toLowerCase());
    const matchUnknown = record.unknown_time.toLowerCase().includes(consolidatedFilters.unknown.toLowerCase());
    const matchTotal = record.total_hours.toLowerCase().includes(consolidatedFilters.total.toLowerCase());
    return matchDate && matchTurn && matchWorkers && matchOnline && matchOffline && matchUnknown && matchTotal;
  });

  return (
    <div className="flex flex-col h-full bg-[#EDEDED] px-12 py-6 space-y-4 overflow-y-auto">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Vista general de asistencia y uso del tiempo laboral.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Fecha Filter */}
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-semibold text-gray-700">Fecha</label>
            <div className="relative">
              <input 
                type="text"
                value={filters.fecha}
                readOnly
                className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#EC6317] w-56 shadow-sm cursor-pointer"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Locación Filter */}
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-semibold text-gray-700">Locación</label>
            <LocationFilter 
              value={filters.locacion}
              onChange={handleLocationChange}
            />
          </div>

          {/* Turno Filter */}
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-semibold text-gray-700">Turno</label>
            <div className="relative">
              <select 
                value={filters.turno}
                onChange={(e) => setFilters({...filters, turno: e.target.value})}
                className="pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#EC6317] w-40 shadow-sm appearance-none cursor-pointer"
              >
                <option value="TODOS">TODOS</option>
                <option value="MAÑANA">MAÑANA</option>
                <option value="TARDE">TARDE</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-gray-700">{stat.title}</span>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.subtitle}</span>
            </div>
            <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        
        {/* Pie Chart Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">Estado de Asistencia</h3>
                <p className="text-xs text-gray-500 mt-0.5 max-w-md">
                    Resumen en tiempo real del estado de conexión y actividad de los trabajadores.
                </p>
            </div>
            
            <div className="flex flex-1 items-center justify-between">
                {/* Chart Circle */}
                <div className="relative w-48 h-48 mx-auto lg:mx-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-gray-800">50</span>
                        <span className="text-[10px] text-gray-500 font-medium w-16 text-center leading-tight">trabajadores activos</span>
                    </div>
                </div>

                {/* Legend Table */}
                <div className="flex-1 pl-4 lg:pl-8">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2 text-sm">
                        <div className="font-semibold text-gray-800 mb-0.5">Estado</div>
                        <div className="font-semibold text-gray-800 mb-0.5 text-center">%</div>
                        <div className="font-semibold text-gray-800 mb-0.5 text-right">cant.</div>

                        {pieData.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                                <div className="text-center text-gray-900 font-medium">{item.percentage}</div>
                                <div className="text-right text-gray-900 font-medium">{item.value.toString().padStart(2, '0')}</div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Distribución de Jornada</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Solo personal con jornada completada</p>
                </div>
                {/* Custom Legend */}
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                        <span className="text-gray-600">Asistencia</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></div>
                        <span className="text-gray-600">Tardanza</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></div>
                        <span className="text-gray-600">Inasistencia</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={barData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        barSize={120}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            tickFormatter={(value) => `${value}`}
                        />
                        <RechartsTooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="Asistencia" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Tardanza" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Inasistencia" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* Efficiency Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        
        {/* Efficiency by Turn */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">Eficiencia por turno</h3>
                <p className="text-xs text-gray-500 mt-0.5">Comparativo porcentual de uso del tiempo por turno</p>
            </div>
            
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={efficiencyByTurnData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                        barSize={80}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <RechartsTooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="Asistencia" stackId="a" fill="#10B981" />
                        <Bar dataKey="Tardanza" stackId="a" fill="#F97316" />
                        <Bar dataKey="Inasistencia" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

             {/* Custom Legend Bottom */}
             <div className="flex justify-center items-center gap-6 text-xs mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-600 font-medium">Asistencia</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                    <span className="text-gray-600 font-medium">Tardanza</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6B7280]"></div>
                    <span className="text-gray-600 font-medium">Inasistencia</span>
                </div>
            </div>
        </div>

        {/* Monthly Efficiency */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">% Eficiencia Mensual</h3>
                <p className="text-xs text-gray-500 mt-0.5">Comparativo porcentual de uso del tiempo</p>
            </div>
            
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={efficiencyMonthlyData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                        barSize={30}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <RechartsTooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="Asistencia" stackId="a" fill="#10B981" />
                        <Bar dataKey="Tardanza" stackId="a" fill="#F97316" />
                        <Bar dataKey="Inasistencia" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

             {/* Custom Legend Bottom */}
             <div className="flex justify-center items-center gap-6 text-xs mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-600 font-medium">Asistencia</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                    <span className="text-gray-600 font-medium">Tardanza</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6B7280]"></div>
                    <span className="text-gray-600 font-medium">Inasistencia</span>
                </div>
            </div>
        </div>

      </div>

      {/* Top Usage Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        
        {/* Top Apps Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">Top Aplicaciones Más usadas</h3>
                <p className="text-xs text-gray-500 mt-0.5 max-w-md">
                    Análisis de las herramientas de software más utilizadas por el equipo durante la jornada.
                </p>
            </div>
            
            <div className="flex flex-1 items-center justify-between">
                {/* Chart Circle */}
                <div className="relative w-48 h-48 mx-auto lg:mx-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={topAppsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={90}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {topAppsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend Table */}
                <div className="flex-1 pl-2 lg:pl-4 overflow-y-auto max-h-[220px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-0.5 text-sm">
                        <div className="font-semibold text-gray-800 mb-0.5"></div>
                        <div className="font-semibold text-gray-800 mb-0.5">Estado</div>
                        <div className="font-semibold text-gray-800 mb-0.5 text-right">%</div>

                        {topAppsData.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ backgroundColor: item.color }}></div>
                                <span className="text-gray-600">{item.name}</span>
                                <div className="text-right text-gray-900 font-medium">{item.value}</div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Top Websites Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">Top Websites Más usadas</h3>
                <p className="text-xs text-gray-500 mt-0.5 max-w-md">
                    Visualización de los sitios web más frecuentados para monitorear el uso de internet.
                </p>
            </div>
            
            <div className="flex flex-1 items-center justify-between">
                {/* Chart Circle */}
                <div className="relative w-48 h-48 mx-auto lg:mx-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={topWebsitesData}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={90}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {topWebsitesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend Table */}
                <div className="flex-1 pl-2 lg:pl-4 overflow-y-auto max-h-[220px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-0.5 text-sm">
                         <div className="font-semibold text-gray-800 mb-0.5"></div>
                        <div className="font-semibold text-gray-800 mb-0.5">Estado</div>
                        <div className="font-semibold text-gray-800 mb-0.5 text-right">%</div>

                        {topWebsitesData.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ backgroundColor: item.color }}></div>
                                <span className="text-gray-600">{item.name}</span>
                                <div className="text-right text-gray-900 font-medium">{item.value}</div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>

      </div>

       {/* Consolidated Records Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col mb-6">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Registros consolidados por Turno</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Acumulado de horas según el tipo de aplicativo y turno
                </p>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <table className="w-full text-left min-w-[1200px] border border-gray-200 text-xs">
                    <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                        <tr>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider w-12 border-none rounded-tl-lg">#</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider border-none">Fecha</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider border-none">Turno</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider w-1/4 border-none">Horas Productivas</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">Trabajadores</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">Productivas</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">No Productivas</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">No definido</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none rounded-tr-lg">Total de Horas</th>
                        </tr>
                        <tr className="border-b border-gray-200 bg-[#F3F4F6]">
                            <th className="px-4 pb-4 pt-0">
                                <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input 
                                    type="text" 
                                    value={consolidatedFilters.date}
                                    onChange={(e) => setConsolidatedFilters({...consolidatedFilters, date: e.target.value})}
                                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                                />
                            </th>
                            <th className="px-4 pb-4 pt-0">
                                <div className="relative">
                                    <select 
                                        value={consolidatedFilters.turn}
                                        onChange={(e) => setConsolidatedFilters({...consolidatedFilters, turn: e.target.value})}
                                        className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600 appearance-none"
                                    >
                                        <option value="TODOS">TODOS</option>
                                        <option value="MAÑANA">MAÑANA</option>
                                        <option value="TARDE">TARDE</option>
                                        <option value="NOCHE">NOCHE</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1.5 w-3 h-3 text-gray-400 pointer-events-none" />
                                </div>
                            </th>
                            <th className="px-4 pb-4 pt-0">
                                <input 
                                    type="text" 
                                    value={consolidatedFilters.efficiency}
                                    onChange={(e) => setConsolidatedFilters({...consolidatedFilters, efficiency: e.target.value})}
                                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                                />
                            </th>
                            <th className="px-4 pb-4 pt-0">
                                <input 
                                    type="text" 
                                    value={consolidatedFilters.workers}
                                    onChange={(e) => setConsolidatedFilters({...consolidatedFilters, workers: e.target.value})}
                                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                                />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input 
                                    type="text" 
                                    value={consolidatedFilters.online}
                                    onChange={(e) => setConsolidatedFilters({...consolidatedFilters, online: e.target.value})}
                                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                                />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input 
                                    type="text" 
                                    value={consolidatedFilters.offline}
                                    onChange={(e) => setConsolidatedFilters({...consolidatedFilters, offline: e.target.value})}
                                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                                />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input 
                                    type="text" 
                                    value={consolidatedFilters.unknown}
                                    onChange={(e) => setConsolidatedFilters({...consolidatedFilters, unknown: e.target.value})}
                                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                                />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input 
                                    type="text" 
                                    value={consolidatedFilters.total}
                                    onChange={(e) => setConsolidatedFilters({...consolidatedFilters, total: e.target.value})}
                                    className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" 
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredConsolidatedRecords.length > 0 ? (
                            filteredConsolidatedRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-200 transition-colors bg-white even:bg-gray-100 border-b border-gray-100 last:border-none">
                                    <td className="py-2.5 px-4 text-xs text-gray-600 text-center">{record.id}</td>
                                    <td className="py-2.5 px-4">
                                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            {record.date}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4">
                                        <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${
                                            record.status === 'MAÑANA' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                            record.status === 'TARDE' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                            'bg-purple-50 text-purple-600 border-purple-200'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-4">
                                        <div className="flex h-6 bg-gray-100 rounded overflow-hidden w-full min-w-[120px]">
                                            <div style={{ width: `${(record.hours.online / record.hours.total_potential) * 100}%` }} className="bg-emerald-400" title={`Online: ${record.hours.online}h`}></div>
                                            <div style={{ width: `${(record.hours.offline / record.hours.total_potential) * 100}%` }} className="bg-orange-500" title={`Offline: ${record.hours.offline}h`}></div>
                                            <div style={{ width: `${(record.hours.unknown / record.hours.total_potential) * 100}%` }} className="bg-gray-500" title={`No definido: ${record.hours.unknown}h`}></div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center text-gray-600">{record.workers}</td>
                                    <td className="py-2.5 px-4 text-center text-emerald-600 font-medium">{record.online_hours}</td>
                                    <td className="py-2.5 px-4 text-center text-orange-600 font-medium">{record.offline_hours}</td>
                                    <td className="py-2.5 px-4 text-center text-gray-500">{record.unknown_time}</td>
                                    <td className="py-2.5 px-4 text-center text-gray-900 font-bold">{record.total_hours}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-8 text-center text-gray-500">
                                    No se encontraron registros
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
  );
};

export default DashboardHome;
