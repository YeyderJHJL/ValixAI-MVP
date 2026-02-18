import { cn } from "@/lib/utils/cn";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

interface ViabilityCardProps {
  score: number;
  nivel: string;
  factores: string[];
}

export function ViabilityCard({ score, nivel, factores }: ViabilityCardProps) {
  const colors = {
    ALTA: "text-accent-600 bg-accent-50 border-accent-100",
    MEDIA: "text-brand-600 bg-brand-50 border-brand-100",
    BAJA: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * score) / 100}
              className={cn("transition-all duration-1000 ease-out", 
                score >= 75 ? "text-accent-500" : score >= 40 ? "text-brand-500" : "text-red-500"
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-slate-900">{score}%</span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Viabilidad</span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg border", colors[nivel as keyof typeof colors])}>
            <TrendingUp size={20} />
            Nivel de Viabilidad: {nivel}
          </div>
          
          <h3 className="text-3xl font-bold text-slate-900">¿Por qué es viable su idea?</h3>
          <ul className="space-y-4">
            {factores.map((f, i) => (
              <li key={i} className="flex gap-3 text-xl text-slate-600">
                <CheckCircle2 className="text-accent-500 flex-shrink-0 mt-1" size={24} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
