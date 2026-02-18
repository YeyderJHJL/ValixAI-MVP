"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ViabilityCard } from "@/components/reporte/ViabilityCard";
import { RiesgoCard } from "@/components/reporte/RiesgoCard";
import { trackEvent, EVENTS } from "@/lib/analytics/posthog";
import { 
  Loader2, 
  Download, 
  MessageCircle, 
  Calendar, 
  Mail, 
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function ReportePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de Email
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/get-report?testId=${id}`);
        const result = await res.json();
        
        if (result.status === 'generating') {
          setTimeout(fetchReport, 3000);
        } else if (result.status === 'ready') {
          setData(result.data);
          setLoading(false);
          trackEvent({ event: EVENTS.REPORT_VIEWED, userId: id as string });
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, [id]);

  const handleSendEmail = async () => {
    setEmailStatus('sending');
    setErrorMessage(null);
    
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: id }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setEmailStatus('success');
        trackEvent({ event: 'email_sent_success', userId: id as string });
      } else {
        setEmailStatus('error');
        setErrorMessage(result.error || "Ocurrió un error al enviar el correo.");
      }
    } catch (error) {
      setEmailStatus('error');
      setErrorMessage("Error de conexión. Verifique su internet.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 mesh-gradient">
        <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Generando su Reporte Profesional</h2>
          <p className="text-xl text-slate-500">Nuestra IA está analizando su idea de negocio...</p>
        </div>
      </div>
    );
  }

  const { test, reporte } = data;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      {/* Notificación Flotante de Estado de Email */}
      {emailStatus !== 'idle' && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6 animate-in fade-in slide-in-from-top-4">
          {emailStatus === 'success' && (
            <div className="bg-green-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-500">
              <CheckCircle size={28} />
              <div className="flex-1">
                <p className="font-bold">¡Correo enviado!</p>
                <p className="text-sm opacity-90">Revise su bandeja de entrada (y spam).</p>
              </div>
              <button onClick={() => setEmailStatus('idle')} className="p-1 hover:bg-white/20 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
          )}
          {emailStatus === 'error' && (
            <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-500">
              <AlertCircle size={28} />
              <div className="flex-1">
                <p className="font-bold">Error al enviar</p>
                <p className="text-sm opacity-90">{errorMessage}</p>
              </div>
              <button onClick={() => setEmailStatus('idle')} className="p-1 hover:bg-white/20 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 pt-16 space-y-16">
        {/* Header del Reporte */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-500 font-bold">
            <Calendar size={18} />
            Generado el {new Date().toLocaleDateString()}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
            Análisis de Viabilidad <br />
            <span className="text-brand-600">{test.nombre}</span>
          </h1>
          
          {/* Acciones Principales (Top) */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant={emailStatus === 'success' ? "secondary" : "primary"}
              onClick={handleSendEmail}
              loading={emailStatus === 'sending'}
              disabled={emailStatus === 'success'}
              className={cn(
                "min-w-[280px] shadow-xl",
                emailStatus === 'success' && "bg-green-50 text-green-700 border-green-200"
              )}
            >
              {emailStatus === 'success' ? (
                <><CheckCircle className="mr-2" /> Reporte en su Email</>
              ) : (
                <><Mail className="mr-2" /> Enviar Reporte por Email</>
              )}
            </Button>
            <Button variant="secondary" onClick={() => window.print()} className="min-w-[200px]">
              <Download className="mr-2" /> Guardar PDF
            </Button>
          </div>
        </div>

        {/* Sección de Viabilidad */}
        <ViabilityCard 
          score={reporte.viability.score} 
          nivel={reporte.viability.nivel} 
          factores={reporte.viability.porQueViable} 
        />

        {/* Mensaje de Empatía */}
        <div className="bg-brand-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h3 className="text-3xl font-bold italic opacity-80">"Sobre su mayor desafío..."</h3>
            <p className="text-2xl md:text-3xl text-brand-100 leading-relaxed font-medium">
              {reporte.mensajeMiedo}
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Riesgos */}
        <RiesgoCard riesgos={reporte.riesgos} />

        {/* Roadmap */}
        <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 shadow-xl space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-bold text-slate-900">Plan de Acción Personalizado</h3>
            <p className="text-xl text-slate-500">Pasos estratégicos para los próximos 3 meses.</p>
          </div>
          <div className="space-y-12">
            {reporte.roadmap.semanas.map((s: any, i: number) => (
              <div key={i} className="flex gap-8 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    {s.numero}
                  </div>
                  {i < reporte.roadmap.semanas.length - 1 && <div className="w-1 h-full bg-slate-100 my-4" />}
                </div>
                <div className="pb-4 flex-1">
                  <h4 className="text-2xl font-bold text-slate-900 mb-6">{s.titulo}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {s.tareas.map((t: string, j: number) => (
                      <div key={j} className="flex gap-4 text-lg text-slate-600 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                        <div className="w-6 h-6 rounded-full border-2 border-brand-200 flex-shrink-0 mt-1" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final con Feedback de Email */}
        <div className="bg-white p-16 rounded-[4rem] border-2 border-brand-100 shadow-2xl text-center space-y-10 relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <h3 className="text-4xl font-bold text-slate-900">¿Desea ejecutar este plan?</h3>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              No emprenda solo. Obtenga una sesión de consultoría gratuita para revisar este reporte a detalle.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
            <Button 
              variant="primary" 
              size="lg" 
              className="bg-accent-600 hover:bg-accent-700 px-12 shadow-xl shadow-accent-200"
              onClick={() => {
                trackEvent({ event: EVENTS.WHATSAPP_CLICKED, userId: id as string });
                window.open(`https://wa.me/51999999999?text=Hola, acabo de ver mi reporte de ValixAI para mi idea de ${test.profesion} y me gustaría asesoría personalizada.`, '_blank');
              }}
            >
              <MessageCircle className="mr-2" />
              Asesoría por WhatsApp
            </Button>
            
            <Button 
              variant={emailStatus === 'success' ? "secondary" : "secondary"} 
              size="lg"
              onClick={handleSendEmail}
              loading={emailStatus === 'sending'}
              disabled={emailStatus === 'success'}
              className={cn(emailStatus === 'success' && "text-green-600 border-green-200 bg-green-50")}
            >
              {emailStatus === 'success' ? (
                <><CheckCircle className="mr-2" /> ¡Enviado!</>
              ) : (
                <><Mail className="mr-2" /> Reenviar por Email</>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
