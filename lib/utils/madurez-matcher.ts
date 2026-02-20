// lib/utils/madurez-matcher.ts

interface TestData {
  tieneNegocio: boolean;
  anosNegocio?: string | null;
  formalizado?: string | null;
  tieneContactos: string;
  conoceCompetencia: string;
}

export function determinarNivelMadurez(data: TestData) {
  // CRECIMIENTO: Negocio establecido
  if (data.tieneNegocio && data.anosNegocio === '15-mas') {
    return {
      nivel: 'crecimiento',
      titulo: 'CRECIMIENTO',
      descripcion: 'Tiene un negocio establecido. Su enfoque debe ser escalar y profesionalizar operaciones.',
      siguientePaso: 'Buscar programas de aceleración que le ayuden a expandirse a nuevos mercados o mejorar eficiencia operativa.'
    };
  }
  
  // VALIDACIÓN: Idea clara con preparación
  if (
    ['muchos', 'algunos'].includes(data.tieneContactos) && 
    ['si-profundo', 'si-basico'].includes(data.conoceCompetencia)
  ) {
    return {
      nivel: 'validacion',
      titulo: 'VALIDACIÓN',
      descripcion: 'Tiene idea clara y preparación básica. Necesita validar con clientes reales.',
      siguientePaso: 'Conseguir sus primeros 3-5 clientes para validar que hay demanda real por su servicio.'
    };
  }
  
  // IDEACIÓN: Explorando
  return {
    nivel: 'ideacion',
    titulo: 'IDEACIÓN',
    descripcion: 'Está en fase de exploración. Necesita definir mejor su propuesta de valor y mercado objetivo.',
    siguientePaso: 'Investigar a fondo su mercado, refinar su idea y construir una red de contactos antes de lanzar.'
  };
}

export async function matchIncubadora(nivel: string, supabase: any) {
  console.log('🏢 [INCUBADORA] Buscando para nivel:', nivel);
  
  const { data, error } = await supabase
    .from('incubadoras')
    .select('*')
    .contains('nivel_madurez', [nivel])
    .eq('activo', true)
    .order('costo', { ascending: false }) // Gratuito primero (alfabéticamente al revés)
    .limit(1);
  
  if (error) {
    console.error('❌ [INCUBADORA] Error:', error);
    return null;
  }
  
  if (!data || data.length === 0) {
    console.warn('⚠️ [INCUBADORA] No se encontró match para nivel:', nivel);
    return null;
  }
  
  console.log('✅ [INCUBADORA] Match:', data[0].nombre);
  return data[0];
}