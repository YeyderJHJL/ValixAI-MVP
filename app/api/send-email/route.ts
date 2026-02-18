import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendReportEmail } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  try {
    const { testId } = await req.json();
    
    if (!testId) {
      return NextResponse.json({ success: false, error: 'testId es requerido' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Obtener datos del test y verificar existencia
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('nombre, email, id')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      console.error('Error buscando test:', testError);
      return NextResponse.json({ success: false, error: 'Test no encontrado' }, { status: 404 });
    }

    // 2. Construir URL del reporte
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const reportUrl = `${protocol}://${host}/reporte/${test.id}`;

    // 3. Enviar Email
    const { data: emailData, error: emailError } = await sendReportEmail({
      to: test.email,
      nombre: test.nombre,
      reportUrl
    });

    if (emailError) {
      console.error('Error de Resend:', emailError);
      return NextResponse.json({ success: false, error: 'Error al enviar el correo' }, { status: 500 });
    }

    // 4. Registrar éxito en la base de datos
    await supabase
      .from('reportes')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('test_id', testId);

    return NextResponse.json({ success: true, message: 'Email enviado correctamente' });
    
  } catch (error: any) {
    console.error('Error crítico en send-email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error interno del servidor' 
    }, { status: 500 });
  }
}
