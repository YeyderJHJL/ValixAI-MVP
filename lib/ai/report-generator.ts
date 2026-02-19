// lib/ai/report-generator.ts
import Anthropic from '@anthropic-ai/sdk';
import { calcularViabilidadBase } from '@/lib/utils/viability-calculator';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generarReporte(testData: any) {
  console.log('🧮 Calculando viabilidad base...');
  const viabilidad = calcularViabilidadBase(testData);
  
  // Intentar con IA
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY no configurada');
    }
    
    console.log('🤖 Generando con Claude...');
    const respuestaIA = await generarConIA(testData, viabilidad);
    
    return {
      ...viabilidad,
      ...respuestaIA,
      generadoPor: 'ia'
    };
  } catch (error: any) {
    console.warn('⚠️ IA falló, usando fallback:', error.message);
    const fallback = generarFallback(testData, viabilidad);
    
    return {
      ...viabilidad,
      ...fallback,
      generadoPor: 'fallback'
    };
  }
}

async function generarConIA(testData: any, viabilidad: any) {
  const prompt = `Eres un consultor experto en emprendimiento senior en Perú. 
Analiza esta idea de negocio para un profesional de ${testData.edad} años.

DATOS:
- Nombre: ${testData.nombre}
- Profesión: ${testData.profesion}
- Idea: ${testData.descripcion_idea}
- Miedo: ${testData.mayor_miedo}
- Capital: ${testData.capital_disponible}
- Score Viabilidad: ${viabilidad.score}%

Genera un JSON con esta estructura exacta:
{
  "por_que_viable": ["razón 1", "razón 2", "razón 3"],
  "riesgos_personalizados": [
    {
      "titulo": "Riesgo X",
      "nivel": "ALTO",
      "descripcion": "Explicación con datos del mercado peruano",
      "mitigacion": "Pasos concretos"
    }
  ],
  "roadmap_personalizado": {
    "semanas": [
      {
        "numero": "1-2",
        "titulo": "Fase 1",
        "tareas": ["tarea 1", "tarea 2", "tarea 3"]
      },
      {
        "numero": "3-4",
        "titulo": "Fase 2",
        "tareas": ["tarea 1", "tarea 2"]
      }
    ]
  },
  "mensaje_miedo": "Respuesta empática al miedo del usuario",
  "recursos_recomendados": [
    {
      "titulo": "Recurso 1",
      "descripcion": "Por qué es útil",
      "link": "https://example.com"
    }
  ]
}

REGLAS:
1. Usa lenguaje profesional pero cercano
2. Sé específico con el mercado peruano
3. Responde SOLO con el JSON (sin markdown, sin explicaciones)`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2500,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  
  // Limpiar respuesta (a veces Claude agrega ```json)
  const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('IA no devolvió JSON válido');
  }
  
  return JSON.parse(jsonMatch[0]);
}

function generarFallback(testData: any, viabilidad: any) {
  return {
    por_que_viable: [
      `Su experiencia como ${testData.profesion} es un activo invaluable en el mercado peruano`,
      "Existe una demanda creciente por servicios especializados para profesionales senior",
      "Su enfoque maduro le permite tomar decisiones más estratégicas que el promedio"
    ],
    riesgos_personalizados: [
      {
        titulo: "Adaptación a herramientas digitales",
        nivel: "MEDIO",
        descripcion: "El 68% de profesionales senior en Perú reportan dificultades con plataformas digitales según estudio INEI 2024",
        mitigacion: "Considere delegar la configuración técnica inicial o usar herramientas 'no-code' como Canva, WhatsApp Business, y Google Forms"
      },
      {
        titulo: "Construcción de presencia digital",
        nivel: "MEDIO",
        descripcion: "En Perú, el 73% de clientes buscan servicios profesionales en Google antes de contratar",
        mitigacion: "Invierta en un perfil de Google Business (gratuito) y pida testimonios en LinkedIn de sus contactos actuales"
      }
    ],
    roadmap_personalizado: {
      semanas: [
        { 
          numero: "1-2", 
          titulo: "Validación inicial", 
          tareas: [
            "Definir propuesta de valor específica",
            "Entrevistar a 5 clientes potenciales de su red",
            "Documentar objeciones y necesidades reales"
          ]
        },
        { 
          numero: "3-4", 
          titulo: "Estructura básica", 
          tareas: [
            "Crear presencia digital mínima (LinkedIn + WhatsApp Business)",
            "Definir paquetes de servicio con precios",
            "Preparar presentación de servicios (PDF simple)"
          ]
        },
        { 
          numero: "5-8", 
          titulo: "Primeras ventas", 
          tareas: [
            "Contactar 20 personas de su red con oferta específica",
            "Objetivo: 2-3 reuniones comerciales",
            "Cerrar al menos 1 cliente piloto"
          ]
        }
      ]
    },
    mensaje_miedo: `Es completamente normal sentir "${testData.mayor_miedo}". Sin embargo, su trayectoria profesional le ha dado las herramientas para superar desafíos similares. La diferencia es que ahora tiene el control total de su tiempo y puede avanzar a su propio ritmo, sin la presión de una organización.`,
    recursos_recomendados: [
      { 
        titulo: "Cámara de Comercio de Lima - Centro de Emprendimiento", 
        descripcion: "Asesoría gratuita para formalización y primeros pasos legales",
        link: "https://www.camaralima.org.pe"
      },
      { 
        titulo: "PRODUCE - Innóvate Perú", 
        descripcion: "Programas de cofinanciamiento para emprendimientos formalizados",
        link: "https://www.innovateperu.gob.pe"
      }
    ]
  };
}