import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2, Rocket, ShieldCheck, Users, ArrowRight, Star, Sparkles, Quote } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen mesh-gradient">
      <Header />
      
      <main>
        {/* Hero Section Refinado */}
        <section className="relative pt-24 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-brand-100 shadow-sm text-brand-600 font-bold text-lg animate-fade-in">
                <Sparkles size={20} className="text-brand-400" />
                <span>IA para Emprendedores Senior</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-accent-500 leading-[1.05] tracking-tight max-w-4xl">
                Su experiencia vale <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400">
                  un nuevo negocio.
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-slate-500 max-w-3xl leading-relaxed font-medium">
                ValixAI analiza su trayectoria profesional y valida su idea de negocio en minutos. **Seguro, privado y profesional.**
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                <Link href="/test" className="w-full sm:w-auto">
                  <span className="inline-block w-full">
                    <Button
                      size="lg"
                      className="w-full sm:px-16 text-2xl shadow-2xl shadow-brand-400/20 group"
                    >
                      Comenzar Validación
                      <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </span>
                </Link>
                <p className="text-lg text-slate-400 font-medium italic">
                  "La mejor herramienta para mi segunda etapa profesional"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Trust Section */}
        <section className="py-12 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale">
            <div className="text-2xl font-bold text-accent-300">CONSULTORÍA</div>
            <div className="text-2xl font-bold text-accent-300">ESTRATEGIA</div>
            <div className="text-2xl font-bold text-accent-300">INVERSIÓN</div>
            <div className="text-2xl font-bold text-accent-300">EXPERIENCIA</div>
          </div>
        </section>

        {/* Bento Grid con más detalle */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-accent-500">¿Cómo funciona ValixAI?</h2>
            <p className="text-xl text-slate-500">Un proceso riguroso diseñado para perfiles directivos y profesionales.</p>
          </div>
          
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7 bg-white p-12 rounded-[3rem] border border-slate-100 premium-shadow group hover:border-brand-200 transition-all">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-400">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="text-4xl font-bold text-accent-500">Validación de Mercado Real</h3>
                  <p className="text-2xl text-slate-500 leading-relaxed">
                    Cruzamos su idea con datos de la **Cámara de Comercio** y tendencias actuales en Perú. No es una opinión, es un análisis de viabilidad técnica.
                  </p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-6">
                  <div className="p-6 bg-brand-50 rounded-2xl">
                    <div className="text-brand-600 font-bold text-3xl">100%</div>
                    <div className="text-brand-700 font-medium">Confidencial</div>
                  </div>
                  <div className="p-6 bg-accent-50 rounded-2xl">
                    <div className="text-accent-500 font-bold text-3xl">24/7</div>
                    <div className="text-accent-600 font-medium">Disponibilidad</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-8">
              <div className="bg-accent-500 p-12 rounded-[3rem] text-white premium-shadow relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-400/20 rounded-full blur-3xl group-hover:bg-brand-400/40 transition-all" />
                <Rocket size={48} className="text-brand-300 mb-8" />
                <h3 className="text-3xl font-bold mb-4">Roadmap Estratégico</h3>
                <p className="text-xl text-accent-100/80 leading-relaxed">
                  Reciba un cronograma de 12 semanas para lanzar su negocio sin dejar su actividad actual.
                </p>
              </div>
              
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 premium-shadow">
                <Quote size={48} className="text-brand-100 mb-6" />
                <p className="text-xl text-slate-600 italic mb-8">
                  "A mis 58 años, ValixAI me dio la claridad que necesitaba para lanzar mi consultoría. El reporte es increíblemente detallado."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full" />
                  <div>
                    <div className="font-bold text-accent-500">Ricardo M.</div>
                    <div className="text-slate-500">Ex-Director Regional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
