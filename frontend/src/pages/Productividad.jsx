import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Printer, ChevronDown, ChevronRight, Search, Check } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { workersData } from '../data/workersData';

const Productividad = () => {
  const [dateRange, setDateRange] = useState('ÚLTIMOS 7 DÍAS');
  const [selectedWorker, setSelectedWorker] = useState({ id: 'all', nombres: 'TODOS' });
  const [isWorkerDropdownOpen, setIsWorkerDropdownOpen] = useState(false);
  const [workerSearchTerm, setWorkerSearchTerm] = useState('');
  const [productivityTab, setProductivityTab] = useState('Día');
  const [topTab, setTopTab] = useState('Usuarios');
  const [topCount, setTopCount] = useState(10); // Nuevo estado para cantidad de trabajadores
  const [isTopCountDropdownOpen, setIsTopCountDropdownOpen] = useState(false); // Estado para dropdown de cantidad
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const topCountDropdownRef = useRef(null); // Ref para nuevo dropdown
  const yearDropdownRef = useRef(null);

  // Helper to generate dates for a specific year
  const getDatesForYear = (year) => {
    return [
      `01/01/${year}`,
      `02/01/${year}`,
      `03/01/${year}`,
      `04/01/${year}`,
      `05/01/${year}`,
      `06/01/${year}`,
      `07/01/${year}`,
    ];
  };

  // Mock Data for Area Chart
  const [areaChartData, setAreaChartData] = useState([
    { date: '01/01/2026', online: 8, offline: 2, nodefinido: 0.8 },
    { date: '02/01/2026', online: 7, offline: 2.5, nodefinido: 1.2 },
    { date: '03/01/2026', online: 8.5, offline: 1.5, nodefinido: 0.5 },
    { date: '04/01/2026', online: 6.5, offline: 3, nodefinido: 1.5 },
    { date: '05/01/2026', online: 8, offline: 2, nodefinido: 0.7 },
    { date: '06/01/2026', online: 7, offline: 1, nodefinido: 0.4 },
    { date: '07/01/2026', online: 7.5, offline: 2.5, nodefinido: 1.0 },
  ]);

  // Generate initial bar chart data from real workers
  const generateInitialBarData = (count) => {
    return workersData.slice(0, count).map(worker => {
      const getRandom = (min, max) => Number((Math.random() * (max - min) + min).toFixed(1));
      return {
        name: worker.nombres.split(',')[1].trim().split(' ')[0] + ' ' + worker.nombres.split(',')[0].split(' ')[0], // Nombre + Apellido
        online: getRandom(6, 9),
        offline: getRandom(1, 3),
        nodefinido: getRandom(0, 1)
      };
    });
  };

  // Mock Data for Bar Chart
  const [barChartData, setBarChartData] = useState(generateInitialBarData(10));

  // Effect to update charts when worker is selected or year changes
  useEffect(() => {
    const dates = getDatesForYear(selectedYear);
    const getRandom = (min, max) => Number((Math.random() * (max - min) + min).toFixed(1));

    if (selectedWorker.id !== 'all') {
      // Generate random variations for specific worker
      setAreaChartData(dates.map(date => ({
        date,
        online: getRandom(6, 9),
        offline: getRandom(0.5, 2.5),
        nodefinido: getRandom(0, 1)
      })));

      // For bar chart, just show this worker compared to average
      setBarChartData([
        { name: selectedWorker.nombres.split(',')[1].trim().split(' ')[0] + ' ' + selectedWorker.nombres.split(',')[0].split(' ')[0], online: getRandom(7, 9), offline: getRandom(1, 2), nodefinido: getRandom(0, 1) },
        { name: 'Promedio Equipo', online: 7.5, offline: 2, nodefinido: 0.5 },
      ]);
    } else {
      // Reset to default data when "TODOS" is selected
      setAreaChartData(dates.map((date, index) => {
        // Base values slightly randomized for variety across years
        const baseOnline = [8, 7, 8.5, 6.5, 8, 7, 7.5][index];
        const baseOffline = [2, 2.5, 1.5, 3, 2, 1, 2.5][index];
        const baseNodefinido = [0.8, 1.2, 0.5, 1.5, 0.7, 0.4, 1.0][index];
        
        return {
          date,
          online: baseOnline,
          offline: baseOffline,
          nodefinido: baseNodefinido
        };
      }));

      setBarChartData(generateInitialBarData(topCount));
    }
  }, [selectedWorker, topCount, selectedYear]);

  const formatYAxisTime = (value) => {
    return `${value}h 0m`;
  };

  const formatXAxisDate = (dateStr) => {
    // Input: dd/mm/yyyy
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).replace('.', '');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWorkerDropdownOpen(false);
      }
      if (topCountDropdownRef.current && !topCountDropdownRef.current.contains(event.target)) {
        setIsTopCountDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredWorkers = workersData.filter(worker => 
    worker.nombres.toLowerCase().includes(workerSearchTerm.toLowerCase())
  );

  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker);
    setIsWorkerDropdownOpen(false);
    setWorkerSearchTerm('');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span>Gestión</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900">Productividad</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard de productividad</h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Analiza el rendimiento del equipo y optimiza los flujos de trabajo con métricas clave y reportes detallados en tiempo real.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-end gap-3">
          {/* Fechas Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-600">Fechas</label>
            <div className="relative">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#EC6317] cursor-pointer min-w-[140px]"
              >
                <option>ÚLTIMOS 7 DÍAS</option>
                <option>ÚLTIMOS 30 DÍAS</option>
                <option>ESTE MES</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Trabajador Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-600">Trabajador</label>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsWorkerDropdownOpen(!isWorkerDropdownOpen)}
                className="flex items-center justify-between w-[280px] h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#EC6317] hover:border-gray-400 transition-colors"
              >
                <span className="truncate">{selectedWorker.nombres}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isWorkerDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isWorkerDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[280px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {/* Search Bar */}
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input 
                        type="text"
                        placeholder="Buscar trabajador..."
                        value={workerSearchTerm}
                        onChange={(e) => setWorkerSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded bg-gray-50 focus:outline-none focus:border-[#EC6317] focus:bg-white transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Workers List */}
                  <div className="max-h-[240px] overflow-y-auto">
                    {/* Option: TODOS */}
                    <button
                      onClick={() => handleWorkerSelect({ id: 'all', nombres: 'TODOS' })}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-orange-50 flex items-center justify-between group transition-colors"
                    >
                      <span className={`font-medium ${selectedWorker.id === 'all' ? 'text-[#EC6317]' : 'text-gray-700'}`}>TODOS</span>
                      {selectedWorker.id === 'all' && <Check className="w-4 h-4 text-[#EC6317]" />}
                    </button>

                    {/* Filtered Workers */}
                    {filteredWorkers.map(worker => (
                      <button
                        key={worker.id}
                        onClick={() => handleWorkerSelect(worker)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-orange-50 flex items-center justify-between group transition-colors border-t border-gray-50"
                      >
                        <span className={`truncate ${selectedWorker.id === worker.id ? 'text-[#EC6317] font-medium' : 'text-gray-700'}`}>
                          {worker.nombres}
                        </span>
                        {selectedWorker.id === worker.id && <Check className="w-4 h-4 text-[#EC6317]" />}
                      </button>
                    ))}

                    {filteredWorkers.length === 0 && (
                      <div className="px-3 py-4 text-center text-sm text-gray-500">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <button className="h-9 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Printer className="w-4 h-4" />
            Imprimir Página
          </button>
        </div>
      </div>

      {/* Placeholder Content replaced with Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Chart 1: Productividad */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Productividad</h3>
                      <p className="text-sm text-gray-500">Solo personal con jornada completada</p>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                        <span className="text-gray-600 font-medium">Online</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EC6317]"></div>
                        <span className="text-gray-600 font-medium">Offline</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></div>
                        <span className="text-gray-600 font-medium">No definido</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-6 justify-between items-center">
                    <div className="flex">
                      {['Día', 'Semana', 'Mes'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setProductivityTab(tab)}
                          className={`pb-2 px-4 text-sm font-medium transition-colors relative ${
                            productivityTab === tab 
                              ? 'text-[#EC6317]' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab}
                          {productivityTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC6317]" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative mb-2" ref={yearDropdownRef}>
                      <button 
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span>{selectedYear}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isYearDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                          {[2024, 2025, 2026].map((year) => (
                            <button
                              key={year}
                              onClick={() => {
                                setSelectedYear(year);
                                setIsYearDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 flex items-center justify-between group transition-colors"
                            >
                              <span className={`${selectedYear === year ? 'text-[#EC6317] font-medium' : 'text-gray-700'}`}>
                                {year}
                              </span>
                              {selectedYear === year && <Check className="w-3.5 h-3.5 text-[#EC6317]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={areaChartData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }}
                          dy={10}
                          padding={{ left: 10, right: 10 }}
                          tickFormatter={formatXAxisDate}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: '#374151', fontSize: 11 }}
                          tickFormatter={formatYAxisTime}
                        />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area 
                          type="linear" 
                          dataKey="nodefinido" 
                          stackId="1" 
                          stroke="none"
                          fill="#6B7280" 
                          fillOpacity={1}
                        />
                        <Area 
                          type="linear" 
                          dataKey="offline" 
                          stackId="1" 
                          stroke="none"
                          fill="#EC6317" 
                          fillOpacity={1}
                        />
                        <Area 
                          type="linear" 
                          dataKey="online" 
                          stackId="1" 
                          stroke="none"
                          fill="#10B981" 
                          fillOpacity={1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Top de Trabajadores y Turnos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Top de Trabajadores y Turnos</h3>
                      <p className="text-sm text-gray-500">Solo personal con jornada completada</p>
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
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></div>
                        <span className="text-gray-600 font-medium">No definido</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-6 justify-between items-center">
                    <div className="flex">
                      {['Usuarios', 'Turnos'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setTopTab(tab)}
                          className={`pb-2 px-4 text-sm font-medium transition-colors relative ${
                            topTab === tab 
                              ? 'text-[#EC6317]' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab}
                          {topTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC6317]" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Top Count Dropdown */}
                    <div className="relative" ref={topCountDropdownRef}>
                      <button 
                        onClick={() => setIsTopCountDropdownOpen(!isTopCountDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span>{topCount === workersData.length ? 'Todos' : `Top ${topCount}`}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isTopCountDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isTopCountDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                          {[5, 10, 20, workersData.length].map((count) => (
                            <button
                              key={count}
                              onClick={() => {
                                setTopCount(count);
                                setIsTopCountDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 flex items-center justify-between group transition-colors"
                            >
                              <span className={`${topCount === count ? 'text-[#EC6317] font-medium' : 'text-gray-700'}`}>
                                {count === workersData.length ? 'Todos' : `Top ${count}`}
                              </span>
                              {topCount === count && <Check className="w-3.5 h-3.5 text-[#EC6317]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-[400px] w-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div style={{ height: Math.max(400, barChartData.length * 20) }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={barChartData}
                          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                          barSize={barChartData.length > 10 ? 12 : 20}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                          <XAxis 
                            type="number"
                            domain={[0, 13]}
                            ticks={[0, 2, 4, 6, 8, 10, 12]}
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#374151', fontSize: 11 }}
                            tickFormatter={formatYAxisTime}
                          />
                          <YAxis 
                            type="category"
                            dataKey="name" 
                            interval={0}
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }}
                            width={140}
                          />
                          <RechartsTooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="online" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="offline" stackId="a" fill="#EC6317" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="nodefinido" stackId="a" fill="#6B7280" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
    </div>
  );
};

export default Productividad;
