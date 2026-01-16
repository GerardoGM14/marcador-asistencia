import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  MoreHorizontal, 
  Filter, 
  SlidersHorizontal,
  ArrowUpDown,
  FileText,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/common/ConfirmationModal';
import eraseIcon from '../assets/modal/icono_erase.svg';

const ListaClientes = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for UI controls
  const [activeTab, setActiveTab] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        toast.error('Error al cargar clientes');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setClientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${clientToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Cliente eliminado exitosamente');
        fetchClients();
      } else {
        toast.error('Error al eliminar cliente');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  const handleEdit = (id) => {
    toast('Función de editar próximamente', { icon: '✏️' });
  };

  const handleView = (id) => {
    toast('Función de ver detalles próximamente', { icon: '👀' });
  };

  const filteredClients = clients.filter(client => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'activos') return client.estado === 'Activo';
    if (activeTab === 'inactivos') return client.estado === 'Inactivo';
    if (activeTab === 'prioridad') return client.prioridad === 'Alta';
    return true;
  });

  const counts = {
    todos: clients.length,
    activos: clients.filter(c => c.estado === 'Activo').length,
    inactivos: clients.filter(c => c.estado === 'Inactivo').length,
    prioridad: clients.filter(c => c.prioridad === 'Alta').length
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Top Bar with Tabs and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
           <button 
             onClick={() => setActiveTab('todos')}
             className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
               activeTab === 'todos' 
                 ? 'text-orange-500 bg-orange-50' 
                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
             }`}
           >
             <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
               activeTab === 'todos' ? 'border-orange-500' : 'border-gray-300'
             }`}>
                {activeTab === 'todos' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
             </div>
             Todos 
             <span className={`text-xs px-1.5 py-0.5 rounded-full ${
               activeTab === 'todos' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
             }`}>{counts.todos}</span>
           </button>
           
           <button 
             onClick={() => setActiveTab('activos')}
             className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
               activeTab === 'activos' 
                 ? 'text-orange-500 bg-orange-50' 
                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
             }`}
           >
             <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
               activeTab === 'activos' ? 'border-orange-500' : 'border-gray-300'
             }`}>
                {activeTab === 'activos' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
             </div>
             Activos
             <span className={`text-xs px-1.5 py-0.5 rounded-full ${
               activeTab === 'activos' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
             }`}>{counts.activos}</span>
           </button>

           <button 
             onClick={() => setActiveTab('inactivos')}
             className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
               activeTab === 'inactivos' 
                 ? 'text-orange-500 bg-orange-50' 
                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
             }`}
           >
             <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
               activeTab === 'inactivos' ? 'border-orange-500' : 'border-gray-300'
             }`}>
                {activeTab === 'inactivos' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
             </div>
             Inactivos
             <span className={`text-xs px-1.5 py-0.5 rounded-full ${
               activeTab === 'inactivos' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
             }`}>{counts.inactivos}</span>
           </button>

           <button 
             onClick={() => setActiveTab('prioridad')}
             className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
               activeTab === 'prioridad' 
                 ? 'text-orange-500 bg-orange-50' 
                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
             }`}
           >
             <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
               activeTab === 'prioridad' ? 'border-orange-500' : 'border-gray-300'
             }`}>
                {activeTab === 'prioridad' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
             </div>
             Prioridad Alta
             <span className={`text-xs px-1.5 py-0.5 rounded-full ${
               activeTab === 'prioridad' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
             }`}>{counts.prioridad}</span>
           </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors border ${
              showFilters 
                ? 'text-orange-500 bg-orange-50 border-orange-500' 
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} className={showFilters ? "text-orange-500" : "text-gray-500"} />
            Filtro
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel (Conditional) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="space-y-1">
               <label className="text-xs font-medium text-gray-500">Rango de Fechas</label>
               <input type="date" className="w-full h-9 px-3 border border-gray-200 rounded-md text-sm" />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-medium text-gray-500">Estado de Membresía</label>
               <select className="w-full h-9 px-3 border border-gray-200 rounded-md text-sm">
                 <option>Todos</option>
                 <option>Activo</option>
                 <option>Vencido</option>
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-xs font-medium text-gray-500">Agente</label>
               <select className="w-full h-9 px-3 border border-gray-200 rounded-md text-sm">
                 <option>Todos</option>
                 <option>Usuario Actual</option>
               </select>
             </div>
             <div className="flex items-end">
               <button className="w-full h-9 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-900 transition-colors">
                 Aplicar Filtros
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            {/* Table Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    # <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Nro <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    CLIENTE <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    F. Contrato <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Membresía <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Agente <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Proyecto <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Servicios <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Costo <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Mensualidad <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-700">
                    Estado <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-700">
                    Acciones <ArrowUpDown size={12} />
                  </div>
                </th>
              </tr>

              {/* Filter Row (Conditional) */}
              {showColumnFilters && (
                <tr className="bg-white border-b border-gray-100">
                  <td className="p-2"></td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" placeholder="dd/mm/aaaa" className="w-full h-8 px-2 border border-orange-300 rounded text-xs focus:outline-none focus:border-orange-500 text-center" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                  <td className="p-2">
                     <input type="text" className="w-full h-8 px-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-500" />
                  </td>
                </tr>
              )}
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="13" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                      <p className="text-sm">Cargando clientes...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="13" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <FileText size={24} />
                      </div>
                      <p className="font-medium text-gray-900">No hay clientes registrados en esta categoría</p>
                      <p className="text-sm">Los clientes registrados aparecerán aquí</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{client.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{client.nro}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 uppercase">{client.cliente}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FileText size={12} className="text-red-500" />
                        <span>{client.ruc}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{client.emision}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 uppercase">{client.formula}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{client.os}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 uppercase max-w-[150px] truncate" title={client.proyecto}>
                    {client.proyecto}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 uppercase max-w-[150px] truncate" title={client.servicios}>
                    {client.servicios}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{client.costo}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{client.saldo}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase ${
                      client.estado === 'Activo' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        client.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {client.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleView(client.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(client.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination / Footer */}
        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
           Mostrando {clients.length} resultados
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar cliente?"
        description="Esta acción eliminará permanentemente al cliente y todos sus datos asociados. No se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        imageSrc={eraseIcon}
      />
    </div>
  );
};

export default ListaClientes;