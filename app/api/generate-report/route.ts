import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generarReporte } from '@/lib/ai/report-generator';
import { determinarNivelMadurez, matchIncubadora } from '@/lib/utils/madurez-matcher';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('🤖 [GENERATE] Inicio');
  
  try {
    const { testId } = await req.json();
    console.log('🤖 [GENERATE] testId:', testId);
    
    const supabase = await createClient();
    
    // 1. Obtener test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError || !test) {
      console.error('❌ [GENERATE] Test no encontrado');
      throw new Error('Test no encontrado');
    }

    console.log(`✅ [GENERATE] Test: ${test.nombre} (${Date.now() - startTime}ms)`);
    
    // 2. Verificar si ya existe
    const { data: existing } = await supabase
      .from('reportes')
      .select('id')
      .eq('test_id', testId)
      .maybeSingle();
    
    if (existing) {
      console.log(`ℹ️ [GENERATE] Reporte ya existe: ${existing.id}`);
      return NextResponse.json({ success: true, reportId: existing.id, cached: true });
    }
    
    console.log(`🧠 [GENERATE] Generando reporte... (${Date.now() - startTime}ms)`);
    
    // 3. Generar con IA (con timeout)
    const reporteData = await Promise.race([
      generarReporte(test),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT: >25s')), 25000)
      )
    ]) as any;
    
    console.log(`✅ [GENERATE] Reporte generado (${Date.now() - startTime}ms)`);
    
    // 4. Determinar nivel de madurez
    console.log('📊 [GENERATE] Determinando nivel de madurez...');
    const assessment = determinarNivelMadurez({
      tieneNegocio: test.tiene_negocio,
      anosNegocio: test.anos_negocio,
      formalizado: test.formalizado,
      tieneContactos: test.tiene_contactos,
      conoceCompetencia: test.conoce_competencia,
    });
    console.log(`✅ [GENERATE] Nivel: ${assessment.nivel}`);

    // 5. Buscar incubadora
    console.log('🏢 [GENERATE] Buscando incubadora...');
    const incubadora = await matchIncubadora(assessment.nivel, supabase);
    console.log(incubadora ? `✅ Incubadora: ${incubadora.nombre}` : '⚠️ Sin incubadora');
    
    // 6. Guardar todo
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
        recursos: reporteData.recursos_recomendados || [],
        assessment_madurez: assessment,           // ← AGREGAR
        incubadora_recomendada: incubadora,       // ← AGREGAR
      })
      .select()
      .single();
    
    if (reporteError) {
      console.error('❌ [GENERATE] Error guardando:', reporteError);
      throw reporteError;
    }

    console.log(`✅ [GENERATE] Guardado: ${reporte.id} (Total: ${Date.now() - startTime}ms)`);
    
    return NextResponse.json({ 
      success: true, 
      reportId: reporte.id,
      time: Date.now() - startTime 
    });
    
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error(`💥 [GENERATE] Error after ${elapsed}ms:`, error.message);
    
    if (error.message.includes('TIMEOUT') || elapsed > 25000) {
      return NextResponse.json({ 
        success: false, 
        error: 'TIMEOUT',
        message: 'Generación tardó demasiado. Recargue en 30s.',
      }, { status: 408 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}