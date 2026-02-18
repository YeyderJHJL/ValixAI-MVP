import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2, Rocket, ShieldCheck, Users, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 font-bold text-lg mb-4">
              <Star size={20} className="fill-brand-700" />
              <span>Exclusivo para Profesionales 50+</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-brand-900 leading-[1.1] tracking-tight">
              Emprenda con la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">
                seguridad de un experto
              </span>
            </h1>
            
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transformamos su experiencia profesional en un modelo de negocio validado por IA. Sin riesgos innecesarios, con pasos claros.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/test" className="w-full md:w-auto">
                <Button size="lg" className="w-full group">
                  Validar mi idea ahora
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-slate-500 font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>+500 reportes generados</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between group hover:border-brand-200 transition-colors">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                  <ShieldCheck size={36} />
                </div>
                <h3 className="text-3xl font-bold text-brand-900">Análisis de Riesgo Local</h3>
                <p className="text-xl text-slate-600 leading-relaxed">
                  No usamos teorías genéricas. Analizamos el mercado peruano actual, la competencia real y los costos operativos específicos de su sector.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center text-brand-600 font-bold text-xl">
                Ver ejemplo de reporte <ArrowRight className="ml-2" />
              </div>
            </div>

            <div className="md:col-span-4 bg-brand-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-brand-200">
                <Rocket size={36} />
              </div>
              <div className="space-y-4 mt-12">
                <h3 className="text-3xl font-bold">Roadmap en 5 min</h3>
                <p className="text-lg text-brand-100/80">
                  Obtenga un plan de acción detallado mientras se toma un café.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-accent-500 p-10 rounded-[2.5rem] text-white">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Users size={36} />
                </div>
                <h3 className="text-3xl font-bold">Enfoque Senior</h3>
                <p className="text-lg text-white/90">
                  Diseñado para quienes valoran el tiempo y la claridad sobre el hype tecnológico.
                </p>
              </div>
            </div>

            <div className="md:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-brand-900">Validación con Claude 3.5</h3>
                  <p className="text-xl text-slate-600">
                    Utilizamos la IA más avanzada del mundo para procesar su experiencia y darle un feedback honesto y constructivo.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="text-center">
                    <div className="text-4xl font-black text-brand-600">98%</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Precisión</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* ... footer ... */}
    </div>
  );
}
