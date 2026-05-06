'use client';

import { ChevronLeft, FileText, Info, Award, Calendar, UserCheck, Ticket, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function BasesPage() {
  const sections = [
    {
      title: "Organizador",
      icon: <Info className="w-5 h-5 text-blue-400" />,
      content: "El sorteo es organizado exclusivamente por Puntofarma."
    },
    {
      title: "Vigencia",
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      content: "Desde el 11/05/2026 hasta el 10/06/2026 inclusive."
    },
    {
      title: "Participantes",
      icon: <UserCheck className="w-5 h-5 text-blue-400" />,
      content: "Personas físicas, mayores de edad (18+), residentes en la República Argentina."
    },
    {
      title: "Mecanismo de Participación",
      icon: <Ticket className="w-5 h-5 text-blue-400" />,
      content: "Registro de tickets de compra a través de esta plataforma. Se otorgará 1 chance por cada $50.000 de compra en tickets correspondientes a clientes Particulares con la compra de productos de Perfumería y Medicina de Venta Libre."
    },
    {
      title: "REQUISITO CRÍTICO",
      icon: <div className="p-1 bg-red-500/20 rounded-lg"><Ticket className="w-5 h-5 text-red-400" /></div>,
      content: "Es condición INDISPENSABLE conservar el ticket físico original. El mismo deberá ser presentado en perfecto estado para reclamar y retirar cualquier premio obtenido."
    },
    {
      title: "Premios",
      icon: <Award className="w-5 h-5 text-blue-400" />,
      content: "Se sortearán 3 premios principales: 1er Premio: Un SMART TV de 65 pulgadas, 2do premio: Un SMART TV de 32 pulgadas, 3er Premio: Una cafetera eléctrica de filtro."
    },
    {
      title: "Sorteo",
      icon: <Share2 className="w-5 h-5 text-pink-400" />,
      content: "El sorteo se realizará el día 11/06/2026 en vivo a través de nuestra cuenta oficial de Instagram."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-bold group"
          >
            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </div>
            VOLVER
          </Link>
          <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-2xl border border-white/10">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-black tracking-widest uppercase">Bases y Condiciones</span>
          </div>
        </header>

        <main className="space-y-6">
          <section className="bg-gradient-to-br from-blue-600/20 to-transparent p-8 rounded-[32px] border border-blue-500/20 mb-10 text-center">
            <h1 className="text-4xl font-black mb-4 tracking-tighter bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              TÉRMINOS DEL SORTEO
            </h1>
            <p className="text-blue-200/60 max-w-lg mx-auto leading-relaxed">
              Leé atentamente los puntos clave para participar y asegurar tu premio en el Gran Sorteo PFM.
            </p>
          </section>

          <div className="grid gap-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white/90 mb-2 uppercase tracking-wide group-hover:text-blue-400 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-12 py-10 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-bold">
              © 2026 PUNTOFARMA - TODOS LOS DERECHOS RESERVADOS
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
