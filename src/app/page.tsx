'use client';

import { useState } from 'react';
import { Ticket, User, CreditCard, Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chances, setChances] = useState<number>(0);

  const [ticketValue, setTicketValue] = useState('');

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4, 12);
    }
    setTicketValue(value);
  };

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
        setTicketValue('');
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] flex items-center justify-center p-4 sm:p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[40px] border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-white rounded-full mb-6 shadow-xl w-24 h-24 flex items-center justify-center">
               <img src="https://logodownload.org/wp-content/uploads/2022/04/punto-farma-logo.png" alt="PuntoFarma" className="w-20 h-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
              Gran Sorteo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Mundial PFM</span>
            </h1>
            <p className="text-xl text-white/80 font-medium">Registrá tu ticket y sumá chances para ganar</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 mb-8">
                <Send className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">¡Ya estás participando!</h2>
              <p className="text-green-100/80 mb-8 text-lg">{success}</p>
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                <p className="text-sm text-blue-200 uppercase tracking-widest mb-2 font-bold">Chances acumuladas</p>
                <p className="text-6xl font-black text-white">{chances}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="mt-10 px-8 py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl font-bold w-full border border-white/10"
              >
                Registrar otro ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Nombre</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="name" type="text" placeholder="Ej: Juan" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Apellido</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="surname" type="text" placeholder="Ej: Pérez" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 ml-2">DNI (Sin puntos ni espacios)</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  <input required name="dni" type="text" placeholder="Ej: 1234567" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="email" type="email" placeholder="tu@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Teléfono</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="phone" type="tel" placeholder="Ej: 0981123456" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-300 ml-2">N° Ticket (0000-00000000)</label>
                  <div className="relative group">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-white transition-colors" />
                    <input 
                      required 
                      name="ticket" 
                      type="text" 
                      value={ticketValue}
                      onChange={handleTicketChange}
                      maxLength={13}
                      placeholder="0001-00793301" 
                      pattern="[0-9]{4}-[0-9]{8}"
                      title="Formato requerido: 4 números, guión y 8 números"
                      className="w-full bg-blue-500/10 border border-blue-500/30 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-blue-300/30" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-2">Sucursal</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <select 
                      required 
                      name="branch" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                      <option value="" className="bg-slate-900">Seleccionar...</option>
                      <option value="Sucursal Central" className="bg-slate-900">Sucursal Central</option>
                      <option value="Sucursal Norte" className="bg-slate-900">Sucursal Norte</option>
                      <option value="Sucursal Sur" className="bg-slate-900">Sucursal Sur</option>
                      <option value="Sucursal Este" className="bg-slate-900">Sucursal Este</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl text-center text-sm">
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-5 rounded-[20px] font-black text-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'REGISTRAR TICKET'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
