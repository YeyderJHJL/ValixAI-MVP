import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail({ to, nombre, reportUrl }: { to: string, nombre: string, reportUrl: string }) {
  return await resend.emails.send({
    from: 'ValixAI <reportes@valixai.com>', // Cambiar por dominio verificado en producción
    to: [to],
    subject: `Tu Reporte de Viabilidad de Negocio - ${nombre}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #4f46e5;">Hola ${nombre},</h1>
        <p style="font-size: 18px; color: #334155;">Tu análisis de viabilidad de negocio ya está listo.</p>
        <p style="font-size: 16px; color: #64748b;">Nuestra IA ha procesado tu idea y generado una hoja de ruta personalizada para tu perfil senior.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${reportUrl}" style="background-color: #4f46e5; color: white; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px;">Ver mi Reporte Completo</a>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">Si no solicitaste este reporte, puedes ignorar este correo.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="text-align: center; color: #94a3b8;">© 2024 ValixAI - Emprendimiento Senior</p>
      </div>
    `,
  });
}
