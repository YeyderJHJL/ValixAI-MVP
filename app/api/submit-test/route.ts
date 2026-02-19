// app/api/submit-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 Datos recibidos:', body);
    
    // Validación manual (más seguro que Zod por ahora)
    if (!body.nombre || !body.email || !body.edad) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos obligatorios: nombre, email, edad'
      }, { status: 400 });
    }

    if (!body.descripcionIdea || !body.profesion) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos: descripcionIdea, profesion'
      }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // Preparar datos para insert (snake_case según tu DB)
    const testData = {
      nombre: body.nombre,
      edad: parseInt(body.edad),
      email: body.email,
      profesion: body.profesion,
      tiene_negocio: body.tieneNegocio === true || body.tieneNegocio === 'true',
      anos_negocio: body.anosNegocio || null,
      formalizado: body.formalizado || null,
      ingresos_mensuales: body.ingresosMensuales || null,
      descripcion_idea: body.descripcionIdea,
      tiene_contactos: body.tieneContactos,
      conoce_competencia: body.conoceCompetencia,
      capital_disponible: body.capitalDisponible,
      tiempo_disponible: parseInt(body.tiempoDisponible),
      mayor_miedo: body.mayorMiedo,
      mayor_dificultad: body.mayorDificultad,
      user_agent: req.headers.get('user-agent'),
    };

    console.log('💾 Intentando guardar:', testData);
    
    // Guardar test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .insert(testData)
      .select()
      .single();
    
    if (testError) {
      console.error('❌ Error Supabase:', testError);
      return NextResponse.json({
        success: false,
        error: 'Error de base de datos: ' + testError.message,
        details: testError
      }, { status: 500 });
    }

    console.log('✅ Test guardado:', test.id);
    
    // Trigger generación de reporte (async, no bloqueante)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;
    
    fetch(`${baseUrl}/api/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId: test.id })
    }).catch(err => console.error('⚠️ Error trigger reporte:', err));
    
    return NextResponse.json({
      success: true,
      testId: test.id,
      redirectUrl: `/reporte/${test.id}`
    });
    
  } catch (error: any) {
    console.error('💥 Error general:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error del servidor: ' + error.message,
      stack: error.stack
    }, { status: 500 });
  }
}