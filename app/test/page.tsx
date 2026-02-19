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
    const fields = getFieldsForStep(step);
    const isValid = await methods.trigger(fields as any);
    console.log("Errores 1:", methods.formState.errors);
    if (isValid) setStep((s) => Math.min(s + 1, STEPS.length));
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
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        router.push(result.redirectUrl);
      } else {
        alert("Hubo un error al procesar su test. Por favor intente de nuevo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
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