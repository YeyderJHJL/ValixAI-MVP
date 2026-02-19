"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { testSchema, TestFormData } from "@/lib/utils/validators";
import { TestStep1 } from "@/components/test/TestStep1";
import { TestStep2 } from "@/components/test/TestStep2";
import { TestStep3 } from "@/components/test/TestStep3";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Idea" },
  { id: 3, title: "Recursos" },
];

export default function TestPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    mode: "onChange",
    defaultValues: {
      tieneNegocio: false,
      tiempoDisponible: 10,
    }
  });

  const nextStep = async () => {
    console.log("🚀 [SUBMIT] Intentando avanzar al siguiente paso");
    const fields = getFieldsForStep(step);
    const isValid = await methods.trigger(fields as any);
    
    console.log("🚀 [SUBMIT] Campos a validar:", fields);
    console.log("🚀 [SUBMIT] isValid:", isValid);
    console.log("🚀 [SUBMIT] Errores:", methods.formState.errors);
    
    if (isValid) {
      setStep((s) => Math.min(s + 1, STEPS.length));
      console.log("✅ [SUBMIT] Avanzando a paso:", step + 1);
    } else {
      console.error("❌ [SUBMIT] Validación falló. Errores:", methods.formState.errors);
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1: return ["nombre", "edad", "email", "profesion"];
      case 2: return ["tieneNegocio", "descripcionIdea", "tieneContactos", "conoceCompetencia"];
      case 3: return ["capitalDisponible", "tiempoDisponible", "mayorMiedo", "mayorDificultad"];
      default: return [];
    }
  };

  const onSubmit = async (data: TestFormData) => {
    console.log("🚀 [SUBMIT] Inicio de submit");
    console.log("🚀 [SUBMIT] Data completa:", data);
    
    // Validación manual adicional antes de enviar
    if (!data.nombre || data.nombre.trim().length < 2) {
      const error = "El nombre es requerido (mínimo 2 caracteres)";
      console.error("❌ [SUBMIT] Validación falló:", error);
      setSubmitError(error);
      return;
    }
    
    if (!data.email || !data.email.includes("@")) {
      const error = "Email inválido";
      console.error("❌ [SUBMIT] Validación falló:", error);
      setSubmitError(error);
      return;
    }
    
    if (!data.descripcionIdea || data.descripcionIdea.trim().length < 10) {
      const error = "Debe describir su idea (mínimo 10 caracteres)";
      console.error("❌ [SUBMIT] Validación falló:", error);
      setSubmitError(error);
      return;
    }
    
    console.log("✅ [SUBMIT] Validación manual OK");
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log("🚀 [SUBMIT] Enviando request a /api/submit-test");
      const response = await fetch("/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      console.log("🚀 [SUBMIT] Response status:", response.status);
      const result = await response.json();
      console.log("🚀 [SUBMIT] Response data:", result);
      
      if (result.success) {
        console.log("✅ [SUBMIT] Success! Redirigiendo a:", result.redirectUrl);
        router.push(result.redirectUrl);
      } else {
        const errorMsg = result.error || "Hubo un error al procesar su test";
        console.error("❌ [SUBMIT] Error del servidor:", errorMsg);
        setSubmitError(errorMsg);
      }
    } catch (error: any) {
      console.error("💥 [SUBMIT] Error de conexión:", error);
      setSubmitError(`Error de conexión: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      console.log("🚀 [SUBMIT] Fin de submit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {STEPS.map((s) => (
                <div 
                  key={s.id}
                  className={cn(
                    "text-lg font-bold transition-colors",
                    step >= s.id ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {s.id}. {s.title}
                </div>
              ))}
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(step / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {step === 1 && <TestStep1 />}
                {step === 2 && <TestStep2 />}
                {step === 3 && <TestStep3 />}

                <div className="mt-12 flex flex-col md:flex-row gap-4">
                  {step > 1 && (
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Anterior
                    </Button>
                  )}
                  
                  {step < STEPS.length ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="flex-1"
                    >
                      Siguiente
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      loading={isSubmitting}
                      className="flex-1"
                    >
                      Obtener mi Reporte
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
    </div>
  );
}

import { cn } from "@/lib/utils/cn";