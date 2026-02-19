import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testId = searchParams.get('testId');

  if (!testId) {
    return NextResponse.json({ error: 'testId is required' }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // 1. Buscar el test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ status: 'error', error: 'Test no encontrado' });
    }

    // 2. Buscar el reporte
    const { data: reporte, error: reporteError } = await supabase
      .from('reportes')
      .select('*')
      .eq('test_id', testId)
      .single();

    if (reporteError || !reporte) {
      // Si no hay reporte, asumimos que se está generando
      return NextResponse.json({ status: 'generating' });
    }

    // 3. Retornar datos formateados
    return NextResponse.json({
      status: 'ready',
      data: {
        test: {
          nombre: test.nombre,
          profesion: test.profesion,
          descripcionIdea: test.descripcion_idea,
        },
        reporte: {
          viability: {
            score: reporte.viability_score,
            nivel: reporte.viability_nivel,
            porQueViable: reporte.por_que_viable,
          },
          riesgos: reporte.riesgos,
          roadmap: reporte.roadmap,
          mensajeMiedo: reporte.mensaje_miedo,
          recursos: reporte.recursos,
          assessmentMadurez: reporte.assessment_madurez,
          incubadoraRecomendada: reporte.incubadora_recomendada,
        }
      }
    });

  } catch (error: any) {
    console.error('💥 [GET-REPORT] Error:', error);
    return NextResponse.json({ status: 'error', error: error.message });
  }
}
