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
    if (value.length >= 4) {
      value = value.slice(0, 4) + '-' + value.slice(4, 12);
    }
    setTicketValue(value);
  };

  const [amountValue, setAmountValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');

  const formatNumber = (val: string) => {
    let value = val.replace(/[^\d,]/g, '');
    const parts = value.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (parts.length > 2) value = parts[0] + ',' + parts[1];
    else value = parts.join(',');
    return value;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountValue(formatNumber(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneValue(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Prepender el prefijo 011 al teléfono
    data.phone = `011${phoneValue}`;

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
        setAmountValue('');
        setPhoneValue('');
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-2 sm:p-4 text-white relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0072bc]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-slate-900/80 backdrop-blur-3xl p-6 md:p-10 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          
          <div className="text-center mb-6">
            <div className="inline-block bg-white rounded-full mb-4 shadow-[0_0_30px_rgba(255,255,255,0.2)] w-20 h-20 flex items-center justify-center overflow-hidden border-4 border-blue-500/30">
               <img src="/logo.png" alt="PuntoFarma" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">
              Gran Sorteo <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600">Mundial PFM</span>
            </h1>
            <p className="text-sm text-blue-200/60 font-medium tracking-wide">REGISTRÁ TU TICKET Y GANÁ</p>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 mb-6">
                <Send className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Ya estás participando!</h2>
              <p className="text-green-100/80 mb-6 text-base">{success}</p>
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <p className="text-xs text-blue-200 uppercase tracking-widest mb-1 font-bold">Chances acumuladas</p>
                <p className="text-5xl font-black text-white">{chances}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl font-bold w-full border border-white/10"
              >
                Registrar otro ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 ml-2">Nombre</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="name" type="text" placeholder="Ej: Juan" className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 ml-2">Apellido</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="surname" type="text" placeholder="Ej: Pérez" className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 ml-2">DNI</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="dni" type="text" placeholder="Ej: 1234567" className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-200/60 ml-2">Teléfono *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors z-10" />
                    <div className="relative flex items-center">
                      <span className="absolute left-12 text-blue-400 font-bold border-r border-white/10 pr-3 mr-3 h-5 flex items-center text-sm">011</span>
                      <input 
                        required 
                        name="phone_display" 
                        type="tel" 
                        value={phoneValue}
                        onChange={handlePhoneChange}
                        placeholder="" 
                        autoComplete="off"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-24 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/50 ml-2">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  <input required name="email" type="email" placeholder="tu@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-300 ml-2">N° Ticket</label>
                  <div className="relative group">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-white transition-colors" />
                    <input 
                      required 
                      name="ticket" 
                      type="text" 
                      value={ticketValue}
                      onChange={handleTicketChange}
                      maxLength={13}
                      placeholder="0000-00000000" 
                      pattern="[0-9]{4}-[0-9]{8}"
                      className="w-full bg-blue-500/5 border border-blue-500/20 rounded-xl px-12 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-blue-300/20" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 ml-2">Sucursal</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <select 
                      required 
                      name="branch" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/50 ml-2">Importe (GS) *</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    required 
                    name="amount" 
                    type="text" 
                    value={amountValue}
                    onChange={handleAmountChange}
                    placeholder="Ej: 150.000" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" 
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-2 rounded-xl text-center text-xs">
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-black text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'REGISTRAR TICKET'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
