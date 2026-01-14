import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Clock, ArrowDown, ArrowUp, Activity, Terminal } from 'lucide-react';

const MonitorTiempoReal = () => {
  const socket = useSocket();
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Verificar conexión
    setIsConnected(socket.connected);
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Escuchar eventos del webhook
    socket.on('dashboard_update', (data) => {
      console.log('Datos recibidos:', data);
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        ...data
      };
      setLogs(prev => [newLog, ...prev]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('dashboard_update');
    };
  }, [socket]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Monitor de Asistencia en Tiempo Real
          </h1>
          <p className="text-gray-500 mt-1">Escuchando eventos externos vía Webhook + Sockets</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`} />
          {isConnected ? 'Conectado al Servidor' : 'Desconectado'}
        </div>
      </div>

      {/* Grid de Stats Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-gray-500 text-sm font-medium mb-2">Último Ingreso</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ArrowDown className="text-green-500" size={24} />
            {logs.find(l => l.accion === 'ingreso')?.hora || '--:--'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-gray-500 text-sm font-medium mb-2">Última Salida</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ArrowUp className="text-red-500" size={24} />
            {logs.find(l => l.accion === 'salida')?.hora || '--:--'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-gray-500 text-sm font-medium mb-2">Total Eventos</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Terminal className="text-purple-500" size={24} />
            {logs.length}
          </div>
        </div>
      </div>

      {/* Terminal de Logs */}
      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg font-mono text-sm">
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-[#3e3e3e]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-xs ml-2">Console Output - Live Stream</span>
        </div>
        <div className="p-4 h-[400px] overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <div className="text-gray-500 italic text-center mt-20">Esperando datos entrantes...</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="text-gray-300 hover:bg-[#2d2d2d] p-2 rounded transition-colors border-b border-gray-800 font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400">[{log.timestamp}]</span>
                    <span className="text-green-500 font-bold">» PAYLOAD RECIBIDO</span>
                </div>
                {/* Mostramos el objeto JSON completo tal cual llega */}
                <pre className="pl-4 text-yellow-100/80 overflow-x-auto">
                   {JSON.stringify(
                       Object.fromEntries(Object.entries(log).filter(([k]) => k !== 'id' && k !== 'timestamp')), 
                       null, 
                       2
                   )}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitorTiempoReal;
