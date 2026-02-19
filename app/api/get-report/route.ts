// app/api/get-report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const testId = searchParams.get('testId');
    
    if (!testId) {
      return NextResponse.json({
        success: false,
        error: 'testId requerido'
      }, { status: 400 });
    }

    console.log('📊 Obteniendo reporte para:', testId);
    
    const supabase = await createClient();
    
    // Query 1: Obtener test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError || !test) {
      console.error('❌ Test no encontrado:', testError);
      return NextResponse.json({
        success: false,
        error: 'Test no encontrado'
      }, { status: 404 });
    }
    
    // Query 2: Obtener reporte
    const { data: reporte, error: reporteError } = await supabase
      .from('reportes')
      .select('*')
      .eq('test_id', testId)
      .maybeSingle(); // No falla si no existe
    
    // Si no hay reporte aún
    if (!reporte) {
      console.log('⏳ Reporte en generación...');
      return NextResponse.json({
        success: true,
        status: 'generating',
        message: 'Reporte en generación...'
      });
    }

    console.log('✅ Reporte encontrado');
    
    // Actualizar viewed_at si es primera vez
    if (!reporte.viewed_at) {
      await supabase
        .from('reportes')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', reporte.id);
    }
    
    // Mapear campos snake_case a camelCase para frontend
    return NextResponse.json({
      success: true,
      status: 'ready',
      data: {
        test: {
          nombre: test.nombre,
          edad: test.edad,
          profesion: test.profesion,
          descripcionIdea: test.descripcion_idea,
          tieneNegocio: test.tiene_negocio,
          mayorMiedo: test.mayor_miedo,
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
        }
      }
    });
    
  } catch (error: any) {
    console.error('💥 Error obteniendo reporte:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener reporte: ' + error.message
    }, { status: 500 });
  }
}
