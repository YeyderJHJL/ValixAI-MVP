import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generarReporte } from '@/lib/ai/report-generator';

export async function POST(req: NextRequest) {
  try {
    const { testId } = await req.json();
    const supabase = await createClient();
    
    // 1. Obtener datos del test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError || !test) throw new Error('Test no encontrado');
    
    // 2. Verificar si ya existe
    const { data: existing } = await supabase
      .from('reportes')
      .select('id')
      .eq('test_id', testId)
      .single();
    
    if (existing) return NextResponse.json({ success: true, reportId: existing.id });
    
    // 3. Generar con IA
    const reporteData = await generarReporte(test);
    
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
    
    if (reporteError) throw reporteError;
    
    return NextResponse.json({ success: true, reportId: reporte.id });
    
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
