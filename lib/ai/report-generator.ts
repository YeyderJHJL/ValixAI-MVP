import Anthropic from '@anthropic-ai/sdk';
import { calcularViabilidadBase } from '@/lib/utils/viability-calculator';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generarReporte(testData: any) {
  // PASO 1: Cálculo determinista
  const viabilidad = calcularViabilidadBase(testData);
  
  // PASO 2: IA para personalización
  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('No API Key');
    
    const respuestaIA = await generarConIA(testData, viabilidad);
    return {
      ...viabilidad,
      ...respuestaIA,
      generadoPor: 'ia'
    };
  } catch (error) {
    console.error('IA falló, usando fallback:', error);
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
    "por_que_viable": ["razon 1", "razon 2", "razon 3"],
    "riesgos_personalizados": [
      {"titulo": "Riesgo X", "nivel": "ALTO/MEDIO/BAJO", "descripcion": "...", "mitigacion": "..."}
    ],
    "roadmap_personalizado": {
      "semanas": [
        {"numero": "1-2", "titulo": "Fase 1", "tareas": ["tarea 1", "tarea 2"]}
      ]
    },
    "mensaje_miedo": "Respuesta empática al miedo del usuario",
    "recursos_recomendados": [
      {"titulo": "Recurso", "descripcion": "...", "link": "..."}
    ]
  }
  
  REGLAS:
  1. Usa lenguaje profesional pero cercano.
  2. Sé específico con el mercado peruano.
  3. Responde SOLO con el JSON.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from AI');
  
  return JSON.parse(jsonMatch[0]);
}

function generarFallback(testData: any, viabilidad: any) {
  return {
    por_que_viable: [
      `Su experiencia como ${testData.profesion} es un activo invaluable.`,
      "Existe una demanda creciente por servicios especializados para el segmento senior.",
      "Su enfoque permite una ejecución más madura y estratégica que el promedio."
    ],
    riesgos_personalizados: [
      {
        titulo: "Curva de aprendizaje tecnológica",
        nivel: "MEDIO",
        descripcion: "La implementación de herramientas digitales puede tomar más tiempo del previsto.",
        mitigacion: "Delegar la configuración técnica inicial o usar herramientas 'no-code'."
      }
    ],
    roadmap_personalizado: {
      semanas: [
        { numero: "1-4", titulo: "Validación y Estructura", tareas: ["Definir propuesta de valor", "Entrevistar 5 clientes potenciales"] },
        { numero: "5-8", titulo: "Lanzamiento Mínimo", tareas: ["Crear presencia digital básica", "Primeras ofertas"] }
      ]
    },
    mensaje_miedo: `Es normal sentir miedo por "${testData.mayor_miedo}", pero su trayectoria profesional le ha dado las herramientas para superar desafíos mayores.`,
    recursos_recomendados: [
      { titulo: "Cámara de Comercio de Lima", descripcion: "Recursos para formalización", link: "https://www.camaralima.org.pe" }
    ]
  };
}
