'use client';

import { useState } from 'react';
import { Ticket, User, CreditCard, Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chances, setChances] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Ocurrió un error al registrar.');
      } else {
        setSuccess('¡Registro exitoso! Recibirás un correo de confirmación.');
        setChances(result.chances);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]"></div>
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[40px] border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-white rounded-full mb-6 shadow-xl">
             <img src="https://www.puntofarma.com.py/images/logo.png" alt="PuntoFarma" className="h-12 w-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            Gran Sorteo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Mundial PFM</span>
          </h1>
          <p className="text-xl text-white/80 font-medium">Registrá tu ticket y sumá chances para ganar</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 mb-6">
                <Send className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Ya estás participando!</h2>
              <p className="text-green-200 mb-6">{success}</p>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-sm text-purple-200 mb-2">Chances acumuladas</p>
                <p className="text-5xl font-black text-white">{chances}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-medium w-full"
              >
                Registrar otro ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200 ml-1">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <input required name="name" type="text" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Juan" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200 ml-1">Apellido</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <input required name="surname" type="text" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Pérez" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 ml-2">DNI (Sin puntos ni espacios)</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  <input type="text" placeholder="Ej: 1234567" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value.replace(/\D/g, '')})} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input type="email" placeholder="tu@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Teléfono</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input type="tel" placeholder="Ej: 0981123456" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Número de Ticket (XXXX-XXXXXXXX)</label>
                  <div className="relative group">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input type="text" placeholder="0001-00793301" pattern="\d{4}-\d{8}" title="Formato: XXXX-XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" value={formData.ticket} onChange={(e) => setFormData({...formData, ticket: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Sucursal</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} required>
                      <option value="" className="bg-slate-800">Seleccionar Sucursal</option>
                      <option value="Sucursal Central" className="bg-slate-800">Sucursal Central</option>
                      <option value="Sucursal Norte" className="bg-slate-800">Sucursal Norte</option>
                      <option value="Sucursal Sur" className="bg-slate-800">Sucursal Sur</option>
                      <option value="Sucursal Este" className="bg-slate-800">Sucursal Este</option>
                    </select>
                  </div>
                </div>
              </div>

              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Registrar Ticket'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
