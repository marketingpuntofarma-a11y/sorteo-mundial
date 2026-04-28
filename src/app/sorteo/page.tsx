'use client';

import { useState } from 'react';
import { Trophy, Users, Ticket as TicketIcon, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Winner {
  name: string;
  surname: string;
  dni: string;
  phone: string;
}

export default function SorteoPage() {
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [stats, setStats] = useState({ chances: 0, totalTickets: 0, totalParticipants: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleSorteo = async () => {
    setLoading(true);
    setError(null);
    setWinner(null);

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
        totalTickets: data.totalTickets,
        totalParticipants: data.totalUniqueParticipants
      });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#e879f9', '#ffffff']
      });

    } catch (err) {
      setError('Error al realizar el sorteo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-purple-900/40 to-indigo-900/40 blur-[150px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-4">
            Gran Sorteo PFM
          </h1>
          <p className="text-xl text-white/50">¿Quién será el gran ganador?</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-8">
            {error}
          </div>
        )}

        {!winner && !loading && (
          <button
            onClick={handleSorteo}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold tracking-tighter text-white bg-white/5 border-2 border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <Sparkles className="w-6 h-6 mr-3 text-purple-400 group-hover:animate-spin" />
            INICIAR SORTEO
            <Sparkles className="w-6 h-6 ml-3 text-indigo-400 group-hover:animate-spin" />
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-4 border-indigo-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white/50 animate-pulse" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white/80 animate-pulse">Mezclando bolillas...</p>
          </div>
        )}

        {winner && !loading && (
          <div className="animate-in zoom-in duration-500 fade-in slide-in-from-bottom-10">
            <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-10 rounded-[3rem] shadow-2xl shadow-purple-900/50">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 mb-8 shadow-xl shadow-yellow-500/20">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-4xl text-white/60 font-medium mb-2">¡TENEMOS GANADOR!</h2>
              <h3 className="text-6xl font-black text-white mb-8 tracking-tight">
                {winner.name} {winner.surname}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">DNI</p>
                  <p className="font-mono text-xl">{winner.dni}</p>
                </div>
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">Teléfono</p>
                  <p className="font-mono text-xl">{winner.phone}</p>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-8 pt-8 border-t border-white/10 text-white/50">
                <div className="flex items-center">
                  <TicketIcon className="w-5 h-5 mr-2 text-purple-400" />
                  <span>Ganó con {stats.chances} chance(s)</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-400" />
                  <span>De {stats.totalParticipants} participantes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setWinner(null)}
              className="mt-8 px-8 py-4 bg-white/5 hover:bg-white/10 transition-colors rounded-full font-medium text-white/70 hover:text-white"
            >
              Realizar otro sorteo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
