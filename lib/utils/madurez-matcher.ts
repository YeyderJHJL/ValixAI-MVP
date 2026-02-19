import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';

export type NivelMadurez = 'ideacion' | 'validacion' | 'crecimiento';

export interface AssessmentMadurez {
  nivel: NivelMadurez;
  titulo: string;
  descripcion: string;
  siguientePaso: string;
}

export function determinarNivelMadurez(testData: {
  tiene_negocio: boolean;
  anos_negocio?: string | null;
  formalizado?: string | null;
  tiene_contactos: string;
  conoce_competencia: string;
}): AssessmentMadurez {
  console.log('📊 [MADUREZ] Determinando nivel para:', {
    tiene_negocio: testData.tiene_negocio,
    anos_negocio: testData.anos_negocio,
    tiene_contactos: testData.tiene_contactos,
    conoce_competencia: testData.conoce_competencia
  });

  // 1. CRECIMIENTO: Tiene negocio establecido por mucho tiempo
  if (testData.tiene_negocio && testData.anos_negocio === '15-mas') {
    return {
      nivel: 'crecimiento',
      titulo: 'CRECIMIENTO',
      descripcion: 'Tiene un negocio establecido. Su enfoque debe ser escalar y profesionalizar operaciones.',
      siguientePaso: 'Buscar programas de aceleración que le ayuden a expandirse a nuevos mercados o mejorar eficiencia operativa.'
    };
  }

  // 2. VALIDACIÓN: Tiene idea clara y preparación básica
  const tieneBuenosContactos = ['muchos', 'algunos'].includes(testData.tiene_contactos);
  const conoceCompetencia = ['si-profundo', 'si-basico'].includes(testData.conoce_competencia);

  if (tieneBuenosContactos && conoceCompetencia) {
    return {
      nivel: 'validacion',
      titulo: 'VALIDACIÓN',
      descripcion: 'Tiene idea clara y preparación básica. Necesita validar con clientes reales.',
      siguientePaso: 'Conseguir sus primeros 3-5 clientes para validar que hay demanda real por su servicio.'
    };
  }

  // 3. IDEACIÓN: Fase de exploración
  return {
    nivel: 'ideacion',
    titulo: 'IDEACIÓN',
    descripcion: 'Está en fase de exploración. Necesita definir mejor su propuesta de valor y mercado objetivo.',
    siguientePaso: 'Investigar a fondo su mercado, refinar su idea y construir una red de contactos antes de lanzar.'
  };
}

export async function matchIncubadora(
  nivel: NivelMadurez,
  supabase: SupabaseClient<Database>
) {
  console.log(`🏢 [INCUBADORA] Buscando match para nivel: ${nivel}`);

  const { data: incubadoras, error } = await supabase
    .from('incubadoras')
    .select('*')
    .contains('nivel_madurez', [nivel])
    .eq('activo', true);

  if (error) {
    console.error('❌ [INCUBADORA] Error al buscar incubadoras:', error);
    return null;
  }

  if (!incubadoras || incubadoras.length === 0) {
    console.log('🏢 [INCUBADORA] No se encontraron incubadoras para este nivel');
    return null;
  }

  // Ordenar: Gratuito primero, luego por convocatoria más cercana
  const sorted = incubadoras.sort((a, b) => {
    // Prioridad 1: Gratuito
    if (a.costo === 'Gratuito' && b.costo !== 'Gratuito') return -1;
    if (a.costo !== 'Gratuito' && b.costo === 'Gratuito') return 1;

    // Prioridad 2: Convocatoria (ASC)
    const dateA = a.proxima_convocatoria ? new Date(a.proxima_convocatoria).getTime() : Infinity;
    const dateB = b.proxima_convocatoria ? new Date(b.proxima_convocatoria).getTime() : Infinity;
    
    return dateA - dateB;
  });

  const match = sorted[0];
  console.log(`🏢 [INCUBADORA] Match encontrado: ${match.nombre}`);
  
  return match;
}
