// ... existing code ...
import { 
  Loader2, 
  Download, 
  MessageCircle, 
  Calendar, 
  Mail, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Trophy,
  Target,
  Clock,
  CreditCard,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function ReportePage() {
// ... existing code ...
        {/* Riesgos */}
        <RiesgoCard riesgos={reporte.riesgos} />

        {/* Assessment de Madurez */}
        {reporte.assessmentMadurez && (
          <div className="bg-gradient-to-br from-brand-400 to-accent-500 text-white p-12 md:p-20 rounded-[4rem] shadow-2xl text-center space-y-10 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-lg">
                Su Nivel Actual
              </div>
              <h3 className="text-6xl md:text-8xl font-black tracking-tighter">
                {reporte.assessmentMadurez.titulo}
              </h3>
              <p className="text-2xl md:text-3xl text-brand-50 max-w-3xl mx-auto leading-relaxed">
                {reporte.assessmentMadurez.descripcion}
              </p>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 md:p-12 rounded-[3rem] max-w-4xl mx-auto mt-12">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-xl font-bold text-brand-200 uppercase tracking-widest">🎯 Su siguiente paso:</span>
                  <p className="text-2xl md:text-4xl font-bold leading-tight">
                    {reporte.assessmentMadurez.siguientePaso}
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-300/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          </div>
        )}

        {/* Incubadora Recomendada */}
        {reporte.incubadoraRecomendada && (
          <div className="bg-white p-12 md:p-20 rounded-[4rem] border-[4px] border-accent-500/10 shadow-2xl space-y-12 relative">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent-50 text-accent-700 font-bold text-lg">
                <Trophy size={20} />
                Programa Recomendado
              </div>
              <h3 className="text-5xl md:text-6xl font-black text-accent-500">
                {reporte.incubadoraRecomendada.nombre}
              </h3>
              <p className="text-2xl text-slate-500 max-w-3xl mx-auto">
                {reporte.incubadoraRecomendada.descripcion}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Card 1: Detalles del Programa */}
              <div className="bg-slate-50 p-10 rounded-[3rem] space-y-8">
                <h4 className="text-2xl font-bold text-accent-500 flex items-center gap-3">
                  <Target className="text-brand-400" />
                  Detalles del Programa
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <span className="text-slate-500 font-medium">Programa</span>
                    <span className="font-bold text-slate-900">{reporte.incubadoraRecomendada.nombre_programa}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <span className="text-slate-500 font-medium flex items-center gap-2"><Clock size={18} /> Duración</span>
                    <span className="font-bold text-slate-900">{reporte.incubadoraRecomendada.duracion}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <span className="text-slate-500 font-medium flex items-center gap-2"><CreditCard size={18} /> Costo</span>
                    <span className={cn(
                      "font-black px-4 py-1 rounded-full",
                      reporte.incubadoraRecomendada.costo === 'Gratuito' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-accent-100 text-accent-700"
                    )}>
                      {reporte.incubadoraRecomendada.costo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Próxima Convocatoria</span>
                    <span className="font-bold text-slate-900">
                      {new Date(reporte.incubadoraRecomendada.proxima_convocatoria).toLocaleDateString('es-PE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Qué incluye */}
              <div className="bg-accent-500 p-10 rounded-[3rem] text-white space-y-8">
                <h4 className="text-2xl font-bold flex items-center gap-3">
                  <CheckCircle className="text-brand-300" />
                  ¿Qué incluye?
                </h4>
                <ul className="space-y-4">
                  {reporte.incubadoraRecomendada.que_incluye.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-lg text-accent-50">
                      <div className="w-2 h-2 rounded-full bg-brand-300 mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                variant="accent" 
                size="lg" 
                className="px-16 py-8 text-2xl rounded-[2rem] shadow-2xl shadow-accent-500/20 group"
                onClick={() => window.open(reporte.incubadoraRecomendada.link_postulacion, '_blank')}
              >
                Postular Ahora
                <ExternalLink className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {/* Roadmap */}
        <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 shadow-xl space-y-12">
// ... existing code ...
