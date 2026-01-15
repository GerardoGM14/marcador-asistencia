import React, { useState } from 'react';
import { Briefcase, Calendar, ChevronDown } from 'lucide-react';
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

const DashboardHome = () => {
  const [filters, setFilters] = useState({
    fecha: '05/01/2026 - 06/01/2026',
    locacion: 'TODOS',
    turno: 'TODOS'
  });

  const stats = [
    { title: 'Trabajadores Activos', value: '55', subtitle: 'No Subsidiados', icon: Briefcase },
    { title: 'En turno', value: '20', subtitle: 'Turno iniciado', icon: Briefcase },
    { title: 'Completados', value: '15', subtitle: 'Entrada y salida registradas', icon: Briefcase },
    { title: 'Ausentes', value: '02', subtitle: 'Sin marca de entrada', icon: Briefcase },
    { title: 'Pendientes de inicio', value: '18', subtitle: 'Turno aún no inicia', icon: Briefcase }
  ];

  // Data for Pie Chart
  // Matching count with colors from image:
  // Blue (En Turno): 15
  // Green (Completados): 20
  // Grey (Pendientes): 18
  // Red (Ausentes): 2
  const pieData = [
    { name: 'En Turno', value: 15, color: '#3B82F6', percentage: 27 },
    { name: 'Completados', value: 20, color: '#10B981', percentage: 36 },
    { name: 'Pendientes', value: 18, color: '#9CA3AF', percentage: 33 },
    { name: 'Ausentes', value: 2, color: '#EF4444', percentage: 4 },
  ];

  // Data for Bar Chart
  const barData = [
    {
      name: '05/01/2026',
      Online: 340,
      Offline: 45,
      NoDefinido: 25,
    },
    {
      name: '06/01/2026',
      Online: 340,
      Offline: 45,
      NoDefinido: 25,
    },
  ];

  // Data for Efficiency by Turn
  const efficiencyByTurnData = [
    { name: 'Mañana', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Tarde', Online: 90, Offline: 6, NoDefinido: 4 },
    { name: 'Noche', Online: 82, Offline: 13, NoDefinido: 5 },
  ];

  // Data for Monthly Efficiency
  const efficiencyMonthlyData = [
    { name: 'Ene', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Feb', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Mar', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Abr', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'May', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Jun', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Jul', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Agto', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Set', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Oct', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Nov', Online: 85, Offline: 10, NoDefinido: 5 },
    { name: 'Dic', Online: 85, Offline: 10, NoDefinido: 5 },
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

  // Data for Consolidated Records
  const consolidatedRecords = [
    { id: 1, date: '06/01/2026', status: 'PUNTUAL', efficiency: { online: 60, offline: 35, unknown: 5 }, workers: 45, online_hours: '500h', offline_hours: '50h', unknown_time: '2m', total_hours: '550h 2m' },
    { id: 1, date: '06/01/2026', status: 'TARDE', efficiency: { online: 55, offline: 40, unknown: 5 }, workers: 45, online_hours: '500h', offline_hours: '50h', unknown_time: '2m', total_hours: '550h 2m' },
    { id: 1, date: '06/01/2026', status: 'INASISTENCIA', efficiency: { online: 70, offline: 25, unknown: 5 }, workers: 45, online_hours: '500h', offline_hours: '50h', unknown_time: '2m', total_hours: '550h 2m' },
    { id: 1, date: '05/01/2026', status: 'PUNTUAL', efficiency: { online: 65, offline: 30, unknown: 5 }, workers: 45, online_hours: '500h', offline_hours: '50h', unknown_time: '2m', total_hours: '550h 2m' },
    { id: 1, date: '05/01/2026', status: 'TARDE', efficiency: { online: 50, offline: 45, unknown: 5 }, workers: 45, online_hours: '500h', offline_hours: '50h', unknown_time: '2m', total_hours: '550h 2m' },
    { id: 1, date: '05/01/2026', status: 'INASISTENCIA', efficiency: { online: 75, offline: 20, unknown: 5 }, workers: 45, online_hours: '500h', offline_hours: '50h', unknown_time: '2m', total_hours: '550h 2m' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#EDEDED] p-6 space-y-4 overflow-y-auto">
      
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
            <div className="relative">
              <select 
                value={filters.locacion}
                onChange={(e) => setFilters({...filters, locacion: e.target.value})}
                className="pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#EC6317] w-40 shadow-sm appearance-none cursor-pointer"
              >
                <option value="TODOS">TODOS</option>
                <option value="LIMA">LIMA</option>
                <option value="AREQUIPA">AREQUIPA</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
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
                        <span className="text-2xl font-bold text-gray-800">55</span>
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
                        <span className="text-gray-600">Online</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></div>
                        <span className="text-gray-600">Offline</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></div>
                        <span className="text-gray-600">No definido</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={barData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                            tickFormatter={(value) => value === 0 ? '0s' : `${value}h 0m`}
                        />
                        <RechartsTooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="Online" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Offline" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="NoDefinido" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
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
                        <Bar dataKey="Online" stackId="a" fill="#10B981" />
                        <Bar dataKey="Offline" stackId="a" fill="#F97316" />
                        <Bar dataKey="NoDefinido" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

             {/* Custom Legend Bottom */}
             <div className="flex justify-center items-center gap-6 text-xs mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-600 font-medium">Online</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                    <span className="text-gray-600 font-medium">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6B7280]"></div>
                    <span className="text-gray-600 font-medium">No definido</span>
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
                        <Bar dataKey="Online" stackId="a" fill="#10B981" />
                        <Bar dataKey="Offline" stackId="a" fill="#F97316" />
                        <Bar dataKey="NoDefinido" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

             {/* Custom Legend Bottom */}
             <div className="flex justify-center items-center gap-6 text-xs mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-600 font-medium">Online</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                    <span className="text-gray-600 font-medium">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6B7280]"></div>
                    <span className="text-gray-600 font-medium">No definido</span>
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
                    Detalle histórico de asistencia, puntualidad y métricas de eficiencia por turno.
                </p>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <table className="w-full text-left min-w-[1200px] border border-gray-200 text-xs">
                    <thead className="bg-[#F3F4F6] sticky top-0 z-10">
                        <tr>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider w-12 border-none rounded-tl-lg">#</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider border-none">Fecha</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider border-none">Turno</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider w-1/4 border-none">Ratio de Eficiencia</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">Trabajadores</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">Online</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">Offline</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-center border-none">No definido</th>
                            <th className="pt-2 pb-1 px-4 text-xs font-bold text-gray-600 tracking-wider text-right border-none rounded-tr-lg">Total de Horas</th>
                        </tr>
                        <tr className="border-b border-gray-200 bg-[#F3F4F6]">
                            <th className="px-4 pb-4 pt-0">
                                <div className="h-9 border border-gray-300 rounded-lg bg-white shadow-sm"></div>
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input type="text" className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" />
                            </th>
                            <th className="px-4 pb-4 pt-0">
                                <div className="relative">
                                    <select className="w-full h-9 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] bg-white shadow-sm text-gray-600 appearance-none">
                                        <option>TODOS</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1.5 w-3 h-3 text-gray-400 pointer-events-none" />
                                </div>
                            </th>
                            <th className="px-4 pb-4 pt-0">
                                <input type="text" className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" />
                            </th>
                            <th className="px-4 pb-4 pt-0">
                                <input type="text" className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input type="text" className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input type="text" className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input type="text" className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" />
                            </th>
                             <th className="px-4 pb-4 pt-0">
                                <input type="text" className="w-full h-9 px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#EC6317] shadow-sm bg-white" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {consolidatedRecords.map((record, index) => (
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
                                        record.status === 'PUNTUAL' ? 'bg-green-50 text-green-600 border-green-200' :
                                        record.status === 'TARDE' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                        'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="py-2.5 px-4">
                                    <div className="flex h-6 rounded overflow-hidden w-full max-w-[200px]">
                                        <div style={{ width: `${record.efficiency.online}%` }} className="bg-emerald-400"></div>
                                        <div style={{ width: `${record.efficiency.offline}%` }} className="bg-orange-500"></div>
                                        <div style={{ width: `${record.efficiency.unknown}%` }} className="bg-gray-500"></div>
                                    </div>
                                </td>
                                <td className="py-2.5 px-4 text-center text-gray-600">{record.workers}</td>
                                <td className="py-2.5 px-4 text-center text-emerald-600 font-medium">{record.online_hours}</td>
                                <td className="py-2.5 px-4 text-center text-orange-600 font-medium">{record.offline_hours}</td>
                                <td className="py-2.5 px-4 text-center text-gray-500">{record.unknown_time}</td>
                                <td className="py-2.5 px-4 text-right text-gray-900 font-bold">{record.total_hours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
  );
};

export default DashboardHome;
