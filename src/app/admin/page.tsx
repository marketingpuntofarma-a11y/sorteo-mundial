'use client';

import { useState, useEffect } from 'react';
import { Trash2, LogOut, Users, RefreshCw, Search, Download, Hash, Trophy, Sparkles, Pencil, Ticket as TicketIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';


export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'participants' | 'sorteo'>('participants');

  // Estados para el sorteo
  const [sorteoLoading, setSorteoLoading] = useState(false);
  const [winners, setWinners] = useState<any[]>([]);
  const [sorteoStats, setSorteoStats] = useState({ chances: 0, totalTickets: 0, totalParticipants: 0 });
  const [sorteoError, setSorteoError] = useState<string | null>(null);

  // Estados para la edición
  const [editingParticipant, setEditingParticipant] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    dni: '',
    email: '',
    phone: '',
    ticket: '',
    branch: '',
    amount: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        fetchParticipants();
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión');
    }
  };

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/participants');
      if (res.ok) {
        const data = await res.json();
        setParticipants(data);
      }
    } catch (err) {
      console.error('Error fetching participants');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataToExport = participants.map(p => ({
      ID: p.id,
      Fecha: new Date(p.createdAt).toLocaleString(),
      Nombre: p.name,
      Apellido: p.surname,
      DNI: p.dni,
      Email: p.email,
      Teléfono: p.phone,
      Ticket: p.ticket,
      Sucursal: p.branch,
      Importe: p.amount,
      Chances: p.amount ? Math.floor(parseFloat(p.amount.replace(/\./g, '').replace(',', '.')) / 50000) : 0
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participantes");
    XLSX.writeFile(wb, `Sorteo_Participantes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredParticipants = participants.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(search) ||
      p.surname?.toLowerCase().includes(search) ||
      p.dni?.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search) ||
      p.ticket?.toLowerCase().includes(search) ||
      p.branch?.toLowerCase().includes(search) ||
      p.phone?.toLowerCase().includes(search) ||
      p.id?.toString().includes(search)
    );
  });

  const handleEditClick = (p: any) => {
    setEditingParticipant(p);
    setEditForm({
      name: p.name || '',
      surname: p.surname || '',
      dni: p.dni || '',
      email: p.email || '',
      phone: p.phone || '',
      ticket: p.ticket || '',
      branch: p.branch || '',
      amount: p.amount || ''
    });
    setSaveError('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingParticipant.id,
          ...editForm
        })
      });
      if (res.ok) {
        setParticipants(participants.map(p => p.id === editingParticipant.id ? { ...p, ...editForm } : p));
        setEditingParticipant(null);
      } else {
        const data = await res.json();
        setSaveError(data.error || 'Error al guardar los cambios');
      }
    } catch (err) {
      setSaveError('Error de red al intentar guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setParticipants(participants.filter(p => p.id !== id));
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleSorteo = async () => {
    setSorteoLoading(true);
    setSorteoError(null);
    setWinners([]);

    await new Promise(r => setTimeout(r, 2000));

    try {
      const res = await fetch('/api/sorteo');
      const data = await res.json();

      if (!res.ok) {
        setSorteoError(data.error);
        return;
      }

      setWinners(data.winners);
      setSorteoStats({
        chances: data.winners.reduce((acc: number, w: any) => acc + (w.totalChances || 0), 0), // Total chances of winners (optional display)
        totalTickets: data.totalTicketsInPool,
        totalParticipants: data.totalUniqueParticipants
      });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#e879f9', '#ffffff']
      });

    } catch (err) {
      setSorteoError('Error al realizar el sorteo');
    } finally {
      setSorteoLoading(false);
    }
  };


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-white">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Panel Admin
            </h1>
            <p className="text-white/60 mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Usuario</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white/5 p-6 rounded-3xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Users className="text-blue-400 w-8 h-8" />
              </div>
              Panel de Administración
            </h1>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setActiveTab('participants')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'participants' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                Participantes
              </button>
              <button 
                onClick={() => setActiveTab('sorteo')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sorteo' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                Realizar Sorteo
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'participants' && (
              <>
                <div className="relative group min-w-[280px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-green-500/10 text-green-400 px-5 py-3 rounded-xl hover:bg-green-500/20 transition-all border border-green-500/20 font-bold"
                >
                  <Download className="w-5 h-5" /> Exportar
                </button>
                <button 
                  onClick={fetchParticipants}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                  title="Refrescar"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-3 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              <LogOut className="w-5 h-5" /> Salir
            </button>
          </div>
        </header>

        {activeTab === 'participants' ? (
          <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-widest">
                    <th className="px-6 py-5 font-bold flex items-center gap-2"><Hash className="w-3 h-3" /> ID</th>
                    <th className="px-6 py-5 font-bold">Participante</th>
                    <th className="px-6 py-5 font-bold">DNI / Email</th>
                    <th className="px-6 py-5 font-bold">Ticket / Sucursal</th>
                    <th className="px-6 py-4 text-right">Importe</th>
                    <th className="px-6 py-4 text-center">Chances</th>
                    <th className="px-6 py-4 text-center">Fecha Reg.</th>
                    <th className="px-6 py-5 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 text-white/40 font-mono text-xs">
                        {p.id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-white">{p.name} {p.surname}</div>
                        <div className="text-sm text-white/50">{p.phone}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-white font-medium">{p.dni}</div>
                        <div className="text-xs text-white/40 truncate max-w-[150px]">{p.email}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-tighter">
                          #{p.ticket}
                        </span>
                        <div className="text-xs text-white/50 mt-1">{p.branch}</div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-green-400 font-bold">
                        {p.amount ? `$ ${p.amount}` : '-'}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          {p.amount ? Math.floor(parseFloat(p.amount.replace(/\./g, '').replace(',', '.')) / 50000) : 0}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center text-white/60 text-sm">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-3 text-blue-400 hover:bg-blue-500/10 rounded-2xl transition-all"
                            title="Editar registro"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredParticipants.length === 0 && !loading && (
                    <tr>
                      <td colSpan={8} className="px-6 py-20 text-center text-white/40 font-medium">
                        {searchTerm ? 'No se encontraron resultados para tu búsqueda.' : 'No hay registros todavía.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-6xl w-full text-center">
              {sorteoError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-8">
                  {sorteoError}
                </div>
              )}

              {winners.length === 0 && !sorteoLoading && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 mb-4">
                    <Trophy className="w-16 h-16 text-purple-400" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4 uppercase">
                    Gran Sorteo <span className="text-blue-400">PFM</span>
                  </h2>
                  <p className="text-white/50 mb-10 text-lg">
                    El sistema seleccionará 3 ganadores distintos de forma aleatoria,<br />
                    ponderando las chances acumuladas por cada DNI (ticket a ticket).
                  </p>
                  <button
                    onClick={handleSorteo}
                    className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold tracking-tighter text-white bg-white/5 border-2 border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <Sparkles className="w-6 h-6 mr-3 text-purple-400 group-hover:animate-spin" />
                    INICIAR SORTEO
                    <Sparkles className="w-6 h-6 ml-3 text-indigo-400 group-hover:animate-spin" />
                  </button>
                </div>
              )}

              {sorteoLoading && (
                <div className="flex flex-col items-center justify-center space-y-8">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-4 border-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-white/50 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white/80 animate-pulse tracking-widest uppercase">Mezclando bolillas...</p>
                </div>
              )}

              {winners.length > 0 && !sorteoLoading && (
                <div className="animate-in zoom-in duration-500 fade-in slide-in-from-bottom-10 w-full space-y-12">
                  <div className="text-center">
                    <h2 className="text-4xl font-black italic text-blue-400 uppercase tracking-tighter mb-2">¡RESULTADOS DEL SORTEO!</h2>
                    <p className="text-white/40 uppercase tracking-widest text-sm">Se han seleccionado 3 ganadores distintos</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mx-auto">
                    {winners.map((w, idx) => (
                      <div key={idx} className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                        
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 mb-6 shadow-xl shadow-yellow-500/20">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>

                        <div className="flex-grow">
                          <h4 className="text-blue-400 font-black italic tracking-tighter text-sm uppercase mb-1">
                            {w.prize}
                          </h4>
                          <h3 className="text-2xl md:text-3xl font-black italic text-white mb-6 tracking-tighter uppercase leading-tight h-16 flex items-center justify-center">
                            {w.name} {w.surname}
                          </h3>
                          
                          <div className="bg-black/40 rounded-xl p-3 border border-white/5 mb-6">
                            <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em] mb-1">DNI del Ganador</p>
                            <p className="font-mono text-xl font-black tracking-widest text-white">
                              ****{w.dni?.toString().slice(-4)}
                            </p>
                          </div>
                        </div>                        
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setWinners([])}
                    className="mt-8 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-full font-bold text-white/70 hover:text-white uppercase tracking-widest text-sm"
                  >
                    Realizar nuevo sorteo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {editingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Pencil className="text-blue-400 w-6 h-6" /> Editar Registro #{editingParticipant.id}
              </h2>
              <button 
                onClick={() => setEditingParticipant(null)}
                className="text-white/40 hover:text-white transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Nombre</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Apellido</label>
                  <input
                    type="text"
                    value={editForm.surname}
                    onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">DNI</label>
                  <input
                    type="text"
                    value={editForm.dni}
                    onChange={(e) => setEditForm({ ...editForm, dni: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">N° Ticket</label>
                  <input
                    type="text"
                    value={editForm.ticket}
                    onChange={(e) => setEditForm({ ...editForm, ticket: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sucursal</label>
                  <input
                    type="text"
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Importe (ej. 77.485,32)</label>
                  <input
                    type="text"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {saveError && (
                <p className="text-red-400 text-sm text-center">{saveError}</p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

