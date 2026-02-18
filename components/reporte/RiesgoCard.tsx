import { AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Riesgo {
  titulo: string;
  nivel: string;
  descripcion: string;
  mitigacion: string;
}

export function RiesgoCard({ riesgos }: { riesgos: Riesgo[] }) {
  return (
    <div className="space-y-8">
      <h3 className="text-4xl font-bold text-slate-900 text-center">Análisis de Riesgos y Mitigación</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {riesgos.map((r, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                <AlertCircle size={32} />
              </div>
              <span className={cn(
                "px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider",
                r.nivel === 'ALTO' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
              )}>
                Riesgo {r.nivel}
              </span>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">{r.titulo}</h4>
              <p className="text-lg text-slate-600 leading-relaxed">{r.descripcion}</p>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <div className="flex gap-3 items-start">
                <ShieldCheck className="text-accent-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-bold text-slate-900">Estrategia de Mitigación:</p>
                  <p className="text-lg text-slate-600">{r.mitigacion}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
