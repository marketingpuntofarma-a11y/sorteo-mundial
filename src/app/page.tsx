'use client';

import Link from 'next/link';
import { Ticket } from 'lucide-react';

export default function Home() {
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

          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/50 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <Ticket className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">EL SORTEO HA FINALIZADO</h2>
            <p className="text-blue-100/80 mb-8 text-md font-medium max-w-sm mx-auto leading-relaxed">
              El plazo para el registro de tickets y la participación en el sorteo ha concluido. ¡Muchas gracias a todos por participar!
            </p>
            
            <div className="flex flex-col gap-4 items-center">
              <Link 
                href="/bases" 
                className="text-sm text-blue-400 hover:text-blue-300 underline font-bold tracking-wide transition-colors"
              >
                Ver Bases y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
