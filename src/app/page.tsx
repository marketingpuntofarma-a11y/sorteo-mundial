'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Ticket, User, CreditCard, Phone, Mail, MapPin, Send, Loader2, Info, X } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chances, setChances] = useState<number>(0);
  const [currentChances, setCurrentChances] = useState<number>(0);

  const [showPopup, setShowPopup] = useState(true);
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
        setCurrentChances(result.currentTicketChances);
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
      {/* Fullscreen Watermark Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: 'url("/puntitofarma_mundial.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0072bc]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white/[0.05] backdrop-blur-md p-6 md:p-10 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          
          <div className="text-center mb-8 relative -mt-6 md:-mt-10 -mx-6 md:-mx-10">
            <div className="relative w-full overflow-hidden rounded-t-[40px] border-b border-white/10 shadow-2xl">
              <img 
                src="/logo_v3.png" 
                alt="Fondo Mundial" 
                className="w-full h-auto object-cover opacity-90 block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            
            <div className="relative z-10 -mt-20 px-4">
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white mb-1 leading-[0.9]">
                GRAN SORTEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">MUNDIAL</span>
                <br />
                <span className="text-blue-400 not-italic text-4xl uppercase tracking-tighter">Puntofarma</span>
              </h1>
              <p className="text-[8px] md:text-[10px] text-blue-200/40 font-bold tracking-[0.4em] uppercase mt-3">
                Registrá tu ticket y ganá
              </p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/50 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Send className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">¡YA ESTÁS PARTICIPANDO!</h2>
              <p className="text-blue-200/80 mb-8 text-lg font-medium">{success}</p>
              
              <div className="bg-gradient-to-b from-blue-600/20 to-blue-900/40 rounded-[32px] p-8 border border-blue-400/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] relative group overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="grid grid-cols-2 gap-4 divide-x divide-blue-400/20">
                  <div className="text-center">
                    <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] mb-1 font-black">Sumaste</p>
                    <p className="text-5xl font-black text-white">{currentChances}</p>
                    <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] font-black">Chances</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] mb-1 font-black">Total</p>
                    <p className="text-5xl font-black text-white">{chances}</p>
                    <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] font-black">Acumuladas</p>
                  </div>
                </div>
                <p className="mt-6 text-[10px] text-blue-100/60 uppercase tracking-widest font-bold italic border-t border-blue-400/10 pt-4">
                  Ticket sujeto a revisión, conserve el original.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <a 
                  href="/bases" 
                  className="text-sm text-blue-400 hover:text-blue-300 underline font-bold tracking-wide transition-colors"
                >
                  Ver Bases y Condiciones
                </a>

                <button
                  onClick={() => setSuccess(null)}
                  className="px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white transition-all rounded-2xl font-black text-lg w-full shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.5)] active:scale-95 uppercase tracking-wider"
                >
                  Registrar otro ticket
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-200/50 ml-2 uppercase tracking-wider">Nombre</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="name" type="text" placeholder="Ej: Juan" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/10" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-200/50 ml-2 uppercase tracking-wider">Apellido</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="surname" type="text" placeholder="Ej: Pérez" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/10" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-200/50 ml-2 uppercase tracking-wider">DNI</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input required name="dni" type="text" placeholder="Sin puntos ni espacios" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/10" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-400/70 ml-2 uppercase tracking-wider">Teléfono *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors z-10" />
                    <div className="relative flex items-center">
                      <span className="absolute left-12 text-blue-400 font-black border-r border-white/10 pr-3 mr-3 h-5 flex items-center text-sm">011</span>
                      <input 
                        required 
                        name="phone_display" 
                        type="tel" 
                        value={phoneValue}
                        onChange={handlePhoneChange}
                        placeholder="" 
                        autoComplete="off"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-24 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-blue-200/50 ml-2 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  <input required name="email" type="email" placeholder="tu@email.com" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-300 ml-2 uppercase tracking-wider">N° Ticket</label>
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
                      className="w-full bg-blue-600/10 border border-blue-500/40 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder:text-blue-300/20" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-200/50 ml-2 uppercase tracking-wider">Sucursal</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <select 
                      required 
                      name="branch" 
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                      <option value="" className="bg-slate-900">Seleccionar...</option>
                      <option value="FARMACIA MARIA LAURA CURRO S.C.S" className="bg-slate-900">FARMACIA MARIA LAURA CURRO S.C.S</option>
                      <option value="PFM NUEVA FARMACIA BARRIAL S. C. S" className="bg-slate-900">PFM NUEVA FARMACIA BARRIAL S. C. S</option>
                      <option value="NUEVA FARMACIA MOURIN S.C.S" className="bg-slate-900">NUEVA FARMACIA MOURIN S.C.S</option>
                      <option value="FARMACIA PFM CUATRO S.R.L." className="bg-slate-900">FARMACIA PFM CUATRO S.R.L.</option>
                      <option value="ROCALAN S.C.S" className="bg-slate-900">ROCALAN S.C.S</option>
                      <option value="FARMACIA CABEZUELO S.C.S" className="bg-slate-900">FARMACIA CABEZUELO S.C.S</option>
                      <option value="PFM MARCOS AVELLANEDA" className="bg-slate-900">PFM MARCOS AVELLANEDA</option>
                      <option value="FARMACIA ESCALADA DE LANUS S.C.S" className="bg-slate-900">FARMACIA ESCALADA DE LANUS S.C.S</option>
                      <option value="PFM FARMACIA CENTRAL S.C.S" className="bg-slate-900">PFM FARMACIA CENTRAL S.C.S</option>
                      <option value="RIVADALVEAR S.C.S" className="bg-slate-900">RIVADALVEAR S.C.S</option>
                      <option value="FARMACUSTOM BERNAL S.C.S" className="bg-slate-900">FARMACUSTOM BERNAL S.C.S</option>
                      <option value="FARMACIA PASTEUR DE MARCELA NOVO Y CIA" className="bg-slate-900">FARMACIA PASTEUR DE MARCELA NOVO Y CIA</option>
                      <option value="FARMACIA DE LA PLAZA S.C.S" className="bg-slate-900">FARMACIA DE LA PLAZA S.C.S</option>
                      <option value="FARMACIA TORRES S.C.S" className="bg-slate-900">FARMACIA TORRES S.C.S</option>
                      <option value="LA GRAN BURZACO S. C. S." className="bg-slate-900">LA GRAN BURZACO S. C. S.</option>
                      <option value="FARMACIA LIBERTADORES DE BURZACO S. C. S." className="bg-slate-900">FARMACIA LIBERTADORES DE BURZACO S. C. S.</option>
                      <option value="GRUPO FARMACEUTICO S.C.S" className="bg-slate-900">GRUPO FARMACEUTICO S.C.S</option>
                      <option value="PFM NUEVA PRADO S.CS" className="bg-slate-900">PFM NUEVA PRADO S.CS</option>
                      <option value="SBATELLA FARMACEUTICA S.C.S" className="bg-slate-900">SBATELLA FARMACEUTICA S.C.S</option>
                      <option value="PFM ITATI S.C.S" className="bg-slate-900">PFM ITATI S.C.S</option>
                      <option value="PFM BEFFA S.C.S" className="bg-slate-900">PFM BEFFA S.C.S</option>
                      <option value="PFM SAN MARTIN 2101 S.C.S" className="bg-slate-900">PFM SAN MARTIN 2101 S.C.S</option>
                      <option value="PFM CHINGOLO S.C.S" className="bg-slate-900">PFM CHINGOLO S.C.S</option>
                      <option value="FARMACIA TUYUTI S.C.S" className="bg-slate-900">FARMACIA TUYUTI S.C.S</option>
                      <option value="FARMACIA BIO S.C.S" className="bg-slate-900">FARMACIA BIO S.C.S</option>
                      <option value="WARNES FARMACEUTICA S.C.S" className="bg-slate-900">WARNES FARMACEUTICA S.C.S</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pb-2">
                <label className="text-xs font-semibold text-blue-200/50 ml-2 uppercase tracking-wider">Importe (Pesos Argentinos $) *</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    required 
                    name="amount" 
                    type="text" 
                    value={amountValue}
                    onChange={handleAmountChange}
                    placeholder="Ej: 150.000" 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20" 
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-center text-sm font-bold animate-shake">
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(0,0,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-3 border border-white/10"
              >
                {loading ? <Loader2 className="animate-spin w-7 h-7" /> : 'REGISTRAR TICKET'}
              </button>

              <div className="mt-8 text-center">
                <Link 
                  href="/bases" 
                  className="text-[10px] text-white/60 hover:text-blue-300 uppercase tracking-[0.3em] font-black transition-all border-b border-white/10 hover:border-blue-400/50 pb-1 drop-shadow-sm"
                >
                  Ver Bases y Condiciones
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1329] border border-white/10 p-6 md:p-8 rounded-[32px] w-full max-w-md shadow-2xl relative text-center overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
            
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-[240px] h-24 mx-auto mb-4 mt-2">
              <img 
                src="/puntitofarma_mundial.png" 
                alt="Equipo Sorteo" 
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
              ¿Cómo participar?
            </h3>
            
            <p className="text-sm text-blue-100/80 leading-relaxed mb-6 font-medium">
              Con la compra de <span className="text-blue-400 font-bold">$50.000</span> pesos o más en un mismo ticket ya podés participar del sorteo mundial. Revisa las{' '}
              <Link href="/bases" className="text-blue-400 hover:text-blue-300 underline font-bold transition-colors">
                Bases y condiciones
              </Link>.
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-98 uppercase tracking-wider text-sm cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
