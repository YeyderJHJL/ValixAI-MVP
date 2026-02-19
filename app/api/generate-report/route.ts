// app/api/generate-report/route.ts
// Genera reportes de viabilidad usando IA con timeout para Vercel
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generarReporte } from '@/lib/ai/report-generator';

// CRÍTICO: Timeout máximo para Vercel (30 segundos)
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { testId } = await req.json();
    console.log('🔄 Generando reporte para:', testId);
    
    const supabase = await createClient();
    
    // 1. Obtener datos del test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError || !test) {
      console.error('❌ Test no encontrado:', testError);
      throw new Error('Test no encontrado');
    }

    console.log('✅ Test encontrado:', test.nombre);
    
    // 2. Verificar si ya existe reporte
    const { data: existing } = await supabase
      .from('reportes')
      .select('id')
      .eq('test_id', testId)
      .single();
    
    if (existing) {
      console.log('ℹ️ Reporte ya existe:', existing.id);
      return NextResponse.json({ success: true, reportId: existing.id });
    }
    
    // 3. Generar con IA (o fallback)
    console.log('🤖 Llamando a IA...');
    const reporteData = await generarReporte(test);
    console.log('✅ Reporte generado');
    
    // 4. Guardar en DB
    const { data: reporte, error: reporteError } = await supabase
      .from('reportes')
      .insert({
        test_id: testId,
        viability_score: reporteData.score,
        viability_nivel: reporteData.nivel,
        por_que_viable: reporteData.por_que_viable,
        riesgos: reporteData.riesgos_personalizados,
        roadmap: reporteData.roadmap_personalizado,
        mensaje_miedo: reporteData.mensaje_miedo,
        recursos: reporteData.recursos_recomendados,
      })
      .select()
      .single();
    
    if (reporteError) {
      console.error('❌ Error guardando reporte:', reporteError);
      throw reporteError;
    }

    console.log('✅ Reporte guardado:', reporte.id);
    
    return NextResponse.json({ success: true, reportId: reporte.id });
    
  } catch (error: any) {
    console.error('💥 Error generating report:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

