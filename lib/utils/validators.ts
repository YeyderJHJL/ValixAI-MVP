import { z } from "zod";

export const testSchema = z.object({
  // Step 1: Personal
  nombre: z.string().min(2, "El nombre es muy corto").max(50),
  edad: z.coerce.number().min(50, "Este servicio es para mayores de 50 años").max(85),
  email: z.string().email("Email inválido"),
  profesion: z.string().min(3, "Por favor indique su profesión"),
  
  // Step 2: Idea
  tieneNegocio: z.coerce.boolean(),
  descripcionIdea: z.string().min(10, "Por favor describa un poco más su idea").max(500),
  tieneContactos: z.enum(['muchos', 'algunos', 'pocos', 'ninguno']),
  conoceCompetencia: z.enum(['si-profundo', 'si-basico', 'no']),
  
  // Step 3: Resources & Fears
  capitalDisponible: z.string().min(1, "Seleccione una opción"),
  tiempoDisponible: z.coerce.number().min(1, "Mínimo 1 hora"),
  mayorMiedo: z.string().min(3, "Por favor comparta su mayor preocupación"),
  mayorDificultad: z.string().min(3, "Por favor indique qué se le hace más difícil"),
});

export type TestFormData = z.infer<typeof testSchema>;
