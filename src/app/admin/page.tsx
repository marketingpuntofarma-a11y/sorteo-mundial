'use client';

import { useState, useEffect } from 'react';
import { Trash2, LogOut, Users, RefreshCw, Search, Download, Hash } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
              <Users className="text-blue-400" /> Control de Participantes
            </h1>
            <p className="text-white/60 mt-1">Gestiona los registros del sorteo</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors w-4 h-4" />
              <input 
                type="text"
                placeholder="Buscar por DNI, Nombre, Ticket..."
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
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-3 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              <LogOut className="w-5 h-5" /> Salir
            </button>
          </div>
        </header>

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
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
      </div>
    </div>
  );
}
