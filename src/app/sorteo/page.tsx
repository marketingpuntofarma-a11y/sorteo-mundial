'use client';

import { useState } from 'react';
import { Trophy, Sparkles, Users, Ticket as TicketIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SorteoPage() {
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [stats, setStats] = useState({ chances: 0, totalTickets: 0, totalParticipants: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleSorteo = async () => {
    setLoading(true);
    setError(null);
    setWinner(null);

    // Animación de espera
    await new Promise(r => setTimeout(r, 2000));

    try {
      const res = await fetch('/api/sorteo');
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setWinner(data.winner);
      setStats({
        chances: data.totalChances,
        totalTickets: data.totalTicketsInPool,
        totalParticipants: data.totalUniqueParticipants
      });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#1d4ed8', '#ffffff']
      });

    } catch (err) {
      setError('Error al realizar el sorteo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4 text-white relative overflow-hidden font-sans">
      {/* Background Watermark */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: 'url("/puntitofarma_mundial.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-8 animate-in fade-in">
            {error}
          </div>
        )}

        {!winner && !loading && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="inline-flex p-6 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 mb-4 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
              <Trophy className="w-20 h-20 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4 uppercase leading-none">
              Gran Sorteo <span className="text-blue-500">PFM</span>
            </h1>
            <p className="text-blue-200/50 mb-10 text-xl font-medium tracking-wide">
              ¿Quién será el gran ganador de hoy?
            </p>
            <button
              onClick={handleSorteo}
              className="group relative inline-flex items-center justify-center px-16 py-8 text-3xl font-black tracking-tighter text-white bg-blue-600 border-2 border-blue-400/50 rounded-full hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(37,99,235,0.4)] uppercase"
            >
              <Sparkles className="w-8 h-8 mr-4 text-blue-200 group-hover:animate-spin" />
              INICIAR SORTEO
              <Sparkles className="w-8 h-8 ml-4 text-blue-200 group-hover:animate-spin" />
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-10 py-20">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-r-4 border-blue-400 animate-spin-reverse opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-blue-400 animate-pulse" />
              </div>
            </div>
            <p className="text-3xl font-black text-white animate-pulse tracking-[0.3em] uppercase italic">Mezclando bolillas...</p>
          </div>
        )}

        {winner && !loading && (
          <div className="animate-in zoom-in duration-500 fade-in slide-in-from-bottom-10 w-full">
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
              
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 mb-10 shadow-2xl shadow-blue-500/30">
                <Trophy className="w-14 h-14 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl text-blue-400 font-black italic tracking-tighter mb-4 uppercase">¡TENEMOS GANADOR!</h2>
              <h3 className="text-6xl md:text-8xl font-black italic text-white mb-12 tracking-tighter uppercase leading-tight drop-shadow-2xl">
                {winner.name} {winner.surname}
              </h3>
              
              <div className="max-w-md mx-auto mb-12">
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5 shadow-inner backdrop-blur-md">
                  <p className="text-blue-200/40 text-sm font-bold uppercase tracking-[0.3em] mb-3">DNI del Ganador</p>
                  <p className="font-mono text-5xl font-black tracking-[0.2em] text-white">
                    ****{winner.dni?.toString().slice(-4)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-10 mt-12 pt-12 border-t border-white/10 text-white/40">
                <div className="flex items-center justify-center">
                  <TicketIcon className="w-6 h-6 mr-3 text-blue-500" />
                  <span className="text-lg font-bold uppercase tracking-widest">Ganó con <b className="text-white text-2xl">{stats.chances}</b> chances</span>
                </div>
                <div className="flex items-center justify-center">
                  <Users className="w-6 h-6 mr-3 text-blue-400" />
                  <span className="text-lg font-bold uppercase tracking-widest">De <b className="text-white text-2xl">{stats.totalParticipants}</b> participantes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setWinner(null)}
              className="mt-12 px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-full font-black text-white/70 hover:text-white uppercase tracking-widest text-sm hover:scale-105"
            >
              Realizar otro sorteo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
