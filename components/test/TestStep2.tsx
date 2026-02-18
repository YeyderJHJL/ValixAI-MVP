import { useFormContext } from "react-hook-form";
import { TestFormData } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2 } from "lucide-react";

export function TestStep2() {
  const { register, formState: { errors }, watch } = useFormContext<TestFormData>();
  const tieneNegocio = watch("tieneNegocio");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Su Idea de Negocio</h2>
        <p className="text-xl text-gray-600">No se preocupe por los detalles técnicos, descríbalo con sus palabras.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block text-xl font-bold text-brand-900">
            ¿Ya tiene un negocio en marcha?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={cn(
              "relative flex flex-col p-6 border-2 rounded-[2rem] cursor-pointer transition-all hover:bg-brand-50",
              tieneNegocio === true ? "border-brand-600 bg-brand-50 ring-4 ring-brand-100" : "border-slate-200 bg-white"
            )}>
              <input type="radio" className="hidden" value="true" {...register("tieneNegocio", { setValueAs: v => v === "true" })} />
              <span className="text-2xl font-bold text-brand-900">Sí, ya inicié</span>
              <span className="text-lg text-slate-500">Tengo ventas o local activo</span>
              {tieneNegocio === true && <CheckCircle2 className="absolute top-4 right-4 text-brand-600" />}
            </label>
            
            <label className={cn(
              "relative flex flex-col p-6 border-2 rounded-[2rem] cursor-pointer transition-all hover:bg-brand-50",
              tieneNegocio === false ? "border-brand-600 bg-brand-50 ring-4 ring-brand-100" : "border-slate-200 bg-white"
            )}>
              <input type="radio" className="hidden" value="false" {...register("tieneNegocio", { setValueAs: v => v === "true" })} />
              <span className="text-2xl font-bold text-brand-900">No, es una idea</span>
              <span className="text-lg text-slate-500">Estoy en fase de planeación</span>
              {tieneNegocio === false && <CheckCircle2 className="absolute top-4 right-4 text-brand-600" />}
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xl font-medium text-gray-700">
            ¿En qué consiste su idea o negocio?
          </label>
          <textarea
            className={cn(
              "w-full min-h-[150px] rounded-lg border-2 border-gray-300 p-4 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none",
              errors.descripcionIdea && "border-red-500"
            )}
            placeholder="Ej. Quiero poner una consultoría de gestión para pequeñas empresas basada en mis 30 años de experiencia..."
            {...register("descripcionIdea")}
          />
          {errors.descripcionIdea && <p className="text-lg text-red-500">{errors.descripcionIdea.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xl font-medium text-gray-700">¿Tiene contactos en el sector?</label>
            <select 
              className="w-full h-[60px] rounded-lg border-2 border-gray-300 px-4 text-xl focus:ring-2 focus:ring-blue-500"
              {...register("tieneContactos")}
            >
              <option value="muchos">Muchos contactos</option>
              <option value="algunos">Algunos contactos</option>
              <option value="pocos">Pocos contactos</option>
              <option value="ninguno">Ninguno por ahora</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xl font-medium text-gray-700">¿Conoce a la competencia?</label>
            <select 
              className="w-full h-[60px] rounded-lg border-2 border-gray-300 px-4 text-xl focus:ring-2 focus:ring-blue-500"
              {...register("conoceCompetencia")}
            >
              <option value="si-profundo">Sí, los conozco muy bien</option>
              <option value="si-basico">Conozco algunos</option>
              <option value="no">No los conozco aún</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
