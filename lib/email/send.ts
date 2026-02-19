import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail({ to, nombre, reportUrl }: { to: string, nombre: string, reportUrl: string }) {
  return await resend.emails.send({
    from: 'ValixAI <onboarding@resend.dev>', // Cambiar por dominio verificado en producción
    to: [to],
    subject: `✨ Tu Reporte de Viabilidad está listo, ${nombre}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Container principal -->
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1C9B9B 0%, #0F2C4C 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15);">
                
                <!-- Header con gradiente -->
                <tr>
                  <td style="padding: 50px 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: white; letter-spacing: -0.5px;">
                      Valix<span style="color: #5EDED6;">AI</span>
                    </h1>
                    <p style="margin: 10px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.8); letter-spacing: 1px; text-transform: uppercase;">
                      Emprendimiento Senior
                    </p>
                  </td>
                </tr>
                
                <!-- Contenido principal -->
                <tr>
                  <td style="background-color: white; padding: 50px 40px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 28px; color: #0F2C4C; font-weight: bold;">
                      ¡Hola ${nombre}! 👋
                    </h2>
                    
                    <p style="margin: 0 0 20px 0; font-size: 18px; color: #334155; line-height: 1.6;">
                      Tu <strong>análisis de viabilidad de negocio</strong> ya está listo.
                    </p>
                    
                    <p style="margin: 0 0 30px 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                      Nuestra IA ha procesado tu idea y generado una hoja de ruta personalizada con:
                    </p>
                    
                    <!-- Lista de beneficios -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 35px;">
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="font-size: 24px; margin-right: 10px;">📊</span>
                          <span style="font-size: 16px; color: #475569;">Score de viabilidad personalizado</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="font-size: 24px; margin-right: 10px;">🎯</span>
                          <span style="font-size: 16px; color: #475569;">3 Rutas de negocio recomendadas</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="font-size: 24px; margin-right: 10px;">🚀</span>
                          <span style="font-size: 16px; color: #475569;">Plan de acción para los próximos 3 meses</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="font-size: 24px; margin-right: 10px;">🏢</span>
                          <span style="font-size: 16px; color: #475569;">Incubadora recomendada para tu perfil</span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #1C9B9B 0%, #0F2C4C 100%); color: white; padding: 18px 50px; text-decoration: none; font-weight: bold; border-radius: 12px; font-size: 18px; box-shadow: 0 10px 30px rgba(28, 155, 155, 0.3);">
                            Ver mi Reporte Completo →
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 0 0; font-size: 14px; color: #94a3b8; line-height: 1.6; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                      💡 <strong>Consejo:</strong> Descarga tu reporte en PDF y revísalo con calma. Si tienes dudas, estamos aquí para ayudarte.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">
                      Si no solicitaste este reporte, puedes ignorar este correo.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      © 2025 ValixAI - Validación de Ideas para Profesionales 50+
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}
