import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { TestFormData } from "@/lib/utils/validators";

export function TestStep1() {
  const { register, formState: { errors } } = useFormContext<TestFormData>();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Cuéntenos sobre usted</h2>
        <p className="text-xl text-gray-600">Esta información nos ayuda a personalizar su reporte.</p>
      </div>
      
      <div className="grid gap-8">
        <div className="group">
          <Input
            label="Nombre completo"
            placeholder="Ej. Juan Pérez"
            className="group-hover:border-brand-300 transition-colors"
            {...register("nombre")}
            error={errors.nombre?.message}
          />
          <p className="mt-2 text-sm text-slate-400">Usaremos su nombre para personalizar el reporte profesional.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Edad"
            type="number"
            placeholder="50"
            {...register("edad")}
            error={errors.edad?.message}
          />
          <Input
            label="Profesión u oficio principal"
            placeholder="Ej. Contador, Ingeniero, Docente"
            {...register("profesion")}
            error={errors.profesion?.message}
          />
        </div>

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="juan@ejemplo.com"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>
    </div>
  );
}
