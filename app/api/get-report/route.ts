import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { testSchema } from '@/lib/utils/validators';
import { trackEvent, EVENTS } from '@/lib/analytics/posthog';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validación con Zod
    const validatedData = testSchema.parse(body);
    
    // Cliente Supabase (Server Side)
    const supabase = await createClient();
    
    // Guardar test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .insert({
        nombre: validatedData.nombre,
        edad: validatedData.edad,
        email: validatedData.email,
        profesion: validatedData.profesion,
        tiene_negocio: validatedData.tieneNegocio,
        descripcion_idea: validatedData.descripcionIdea,
        tiene_contacts: validatedData.tieneContactos, // Nota: Ajustado a schema DB si es necesario
        tiene_contactos: validatedData.tieneContactos,
        conoce_competencia: validatedData.conoceCompetencia,
        capital_disponible: validatedData.capitalDisponible,
        tiempo_disponible: validatedData.tiempoDisponible,
        mayor_miedo: validatedData.mayorMiedo,
        mayor_dificultad: validatedData.mayorDificultad,
        user_agent: req.headers.get('user-agent'),
      })
      .select()
      .single();
    
    if (testError) {
      console.error('Supabase Error:', testError);
      throw testError;
    }
    
    // Track evento (Backend)
    await trackEvent({
      event: EVENTS.TEST_COMPLETED,
      userId: test.id,
      properties: {
        profesion: validatedData.profesion,
        tieneNegocio: validatedData.tieneNegocio,
      }
    });
    
    // Trigger generación de reporte (async)
    // En un entorno real usaríamos un Queue o Background Job
    // Aquí hacemos un fetch interno
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;
    
    fetch(`${baseUrl}/api/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId: test.id })
    }).catch(err => console.error('Error triggering report generation:', err));
    
    return NextResponse.json({
      success: true,
      testId: test.id,
      redirectUrl: `/reporte/${test.id}`
    });
    
  } catch (error: any) {
    console.error('Error en submit-test:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error al guardar test: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
}
