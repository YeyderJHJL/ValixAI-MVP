// app/api/send-email/route.ts
// Maneja el envío de reportes por email usando Resend
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendReportEmail } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  console.log('📧 [EMAIL] Inicio de proceso de envío');
  
  try {
    // Validar que existe RESEND_API_KEY
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [EMAIL] RESEND_API_KEY no configurada');
      return NextResponse.json({ 
        success: false, 
        error: 'Servicio de email no configurado. Contacte al administrador.' 
      }, { status: 500 });
    }
    
    const { testId } = await req.json();
    console.log('📧 [EMAIL] testId recibido:', testId);
    
    if (!testId) {
      console.error('❌ [EMAIL] testId no proporcionado');
      return NextResponse.json({ 
        success: false, 
        error: 'testId es requerido' 
      }, { status: 400 });
    }

    const supabase = await createClient();
    console.log('📧 [EMAIL] Cliente Supabase creado');

    // 1. Obtener datos del test
    console.log('📧 [EMAIL] Buscando test en base de datos...');
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('nombre, email, id')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      console.error('❌ [EMAIL] Error buscando test:', testError);
      return NextResponse.json({ 
        success: false, 
        error: 'Test no encontrado' 
      }, { status: 404 });
    }

    console.log('✅ [EMAIL] Test encontrado:', { nombre: test.nombre, email: test.email });

    // 2. Construir URL del reporte
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('host');
    const reportUrl = `${protocol}://${host}/reporte/${test.id}`;
    console.log('📧 [EMAIL] URL del reporte:', reportUrl);

    // 3. Enviar Email con Resend
    console.log('📧 [EMAIL] Llamando a Resend...');
    const startTime = Date.now();
    
    const { data: emailData, error: emailError } = await sendReportEmail({
      to: test.email,
      nombre: test.nombre,
      reportUrl
    });
    
    const duration = Date.now() - startTime;
    console.log(`📧 [EMAIL] Resend respondió en ${duration}ms`);

    if (emailError) {
      console.error('❌ [EMAIL] Error de Resend:', emailError);
      return NextResponse.json({ 
        success: false, 
        error: `Error al enviar: ${emailError.message || 'Resend falló'}` 
      }, { status: 500 });
    }

    console.log('✅ [EMAIL] Email enviado correctamente:', emailData);

    // 4. Marcar como enviado en la base de datos
    console.log('📧 [EMAIL] Actualizando timestamp en DB...');
    const { error: updateError } = await supabase
      .from('reportes')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('test_id', testId);
    
    if (updateError) {
      console.warn('⚠️ [EMAIL] No se pudo actualizar email_sent_at:', updateError);
      // No es crítico, continuamos
    } else {
      console.log('✅ [EMAIL] Timestamp actualizado en reportes');
    }

    console.log('✅ [EMAIL] Proceso completado exitosamente');
    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado correctamente' 
    });
    
  } catch (error: any) {
    console.error('💥 [EMAIL] Error crítico:', error);
    console.error('💥 [EMAIL] Stack:', error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error interno del servidor' 
    }, { status: 500 });
  }
}
