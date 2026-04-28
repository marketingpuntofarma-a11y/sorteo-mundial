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
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 shadow-2xl">
            <Ticket className="w-10 h-10 text-purple-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
            Gran Sorteo PFM
          </h1>
          <p className="text-purple-200/80 text-lg">Registrá tu ticket y sumá chances para ganar</p>
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
                <label className="text-sm font-medium text-purple-200 ml-1">DNI</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                  <input required name="dni" type="text" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Sin puntos ni espacios" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <input required name="email" type="email" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="tu@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200 ml-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <input required name="phone" type="tel" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Código de área + número" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 mt-4 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200 ml-1">Número de Ticket</label>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-3.5 w-5 h-5 text-purple-300" />
                    <input required name="ticket" type="text" className="w-full bg-purple-500/10 border border-purple-500/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-purple-500/20 transition-all font-mono" placeholder="N° Ticket" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200 ml-1">Sucursal</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                    <select required name="branch" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                      <option value="" className="text-black">Seleccionar Sucursal</option>
                      <option value="Sucursal Centro" className="text-black">Sucursal Centro</option>
                      <option value="Sucursal Norte" className="text-black">Sucursal Norte</option>
                      <option value="Sucursal Sur" className="text-black">Sucursal Sur</option>
                      <option value="Sucursal Este" className="text-black">Sucursal Este</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold py-4 px-8 rounded-xl transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
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
