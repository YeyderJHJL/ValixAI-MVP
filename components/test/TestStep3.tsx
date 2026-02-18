import { useFormContext } from "react-hook-form";
import { TestFormData } from "@/lib/utils/validators";
import { Input } from "@/components/ui/Input";

export function TestStep3() {
  const { register, formState: { errors } } = useFormContext<TestFormData>();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Recursos y Desafíos</h2>
        <p className="text-xl text-gray-600">Sea honesto, esto nos permite darle consejos realistas.</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="block text-xl font-medium text-gray-700">Capital disponible para invertir</label>
          <select 
            className="w-full h-[60px] rounded-lg border-2 border-gray-300 px-4 text-xl focus:ring-2 focus:ring-blue-500"
            {...register("capitalDisponible")}
          >
            <option value="">Seleccione una opción</option>
            <option value="menos-1000">Menos de S/ 1,000</option>
            <option value="1000-5000">S/ 1,000 - S/ 5,000</option>
            <option value="5000-20000">S/ 5,000 - S/ 20,000</option>
            <option value="mas-20000">Más de S/ 20,000</option>
          </select>
          {errors.capitalDisponible && <p className="text-lg text-red-500">{errors.capitalDisponible.message}</p>}
        </div>

        <Input
          label="Horas semanales que puede dedicarle"
          type="number"
          placeholder="Ej. 10"
          {...register("tiempoDisponible")}
          error={errors.tiempoDisponible?.message}
        />

        <div className="space-y-2">
          <label className="block text-xl font-medium text-gray-700">¿Cuál es su mayor miedo al emprender?</label>
          <textarea
            className={cn(
              "w-full min-h-[100px] rounded-lg border-2 border-gray-300 p-4 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none",
              errors.mayorMiedo && "border-red-500"
            )}
            placeholder="Ej. Perder mis ahorros, no entender la tecnología..."
            {...register("mayorMiedo")}
          />
          {errors.mayorMiedo && <p className="text-lg text-red-500">{errors.mayorMiedo.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-xl font-medium text-gray-700">¿Qué se le hace más difícil hoy?</label>
          <textarea
            className={cn(
              "w-full min-h-[100px] rounded-lg border-2 border-gray-300 p-4 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none",
              errors.mayorDificultad && "border-red-500"
            )}
            placeholder="Ej. Conseguir clientes, formalizar la empresa..."
            {...register("mayorDificultad")}
          />
          {errors.mayorDificultad && <p className="text-lg text-red-500">{errors.mayorDificultad.message}</p>}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils/cn";
