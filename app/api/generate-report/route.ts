// app/api/generate-report/route.ts
// Genera reportes de viabilidad usando IA con timeout para Vercel
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generarReporte } from '@/lib/ai/report-generator';

// CRÍTICO: Timeout máximo para Vercel (30 segundos)
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('🤖 [GENERATE] Inicio de generación de reporte');
  
  try {
    const { testId } = await req.json();
    console.log(`🤖 [GENERATE] testId: ${testId} (timestamp: ${Date.now() - startTime}ms)`);
    
    const supabase = await createClient();
    
    // 1. Obtener datos del test
    console.log(`🤖 [GENERATE] Buscando test... (${Date.now() - startTime}ms)`);
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError || !test) {
      console.error('❌ [GENERATE] Test no encontrado:', testError);
      throw new Error('Test no encontrado');
    }

    console.log(`✅ [GENERATE] Test encontrado: ${test.nombre} (${Date.now() - startTime}ms)`);
    
    // 2. Verificar si ya existe reporte
    const { data: existing } = await supabase
      .from('reportes')
      .select('id')
      .eq('test_id', testId)
      .single();
    
    if (existing) {
      console.log(`ℹ️ [GENERATE] Reporte ya existe: ${existing.id} (${Date.now() - startTime}ms)`);
      return NextResponse.json({ success: true, reportId: existing.id });
    }
    
    // 3. Generar con IA usando Promise.race para timeout
    console.log(`🤖 [GENERATE] Iniciando generación con IA... (${Date.now() - startTime}ms)`);
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: La generación tardó más de 25 segundos')), 25000);
    });
    
    const reporteData = await Promise.race([
      generarReporte(test),
      timeoutPromise
    ]) as any;
    
    console.log(`✅ [GENERATE] Reporte generado por IA (${Date.now() - startTime}ms)`);
    
    // 4. Guardar en DB
    console.log(`🤖 [GENERATE] Guardando en base de datos... (${Date.now() - startTime}ms)`);
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
      console.error('❌ [GENERATE] Error guardando reporte:', reporteError);
      throw reporteError;
    }

    const totalTime = Date.now() - startTime;
    console.log(`✅ [GENERATE] Reporte guardado: ${reporte.id} (TOTAL: ${totalTime}ms)`);
    
    return NextResponse.json({ success: true, reportId: reporte.id });
    
  } catch (error: any) {
    const totalTime = Date.now() - startTime;
    
    if (error.message.includes('Timeout')) {
      console.error(`⏱️ [GENERATE] TIMEOUT después de ${totalTime}ms`);
      return NextResponse.json({ 
        success: false, 
        error: 'La generación está tardando más de lo esperado. Por favor recargue la página en 30 segundos.',
        code: 'TIMEOUT'
      }, { status: 408 });
    }
    
    console.error(`💥 [GENERATE] Error general (${totalTime}ms):`, error);
    console.error('💥 [GENERATE] Stack:', error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

