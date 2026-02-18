import { TestFormData } from "./validators";

export interface ViabilityResult {
  score: number;
  nivel: 'BAJA' | 'MEDIA' | 'ALTA';
  factores: { factor: string; tipo: 'positivo' | 'negativo' }[];
}

export function calcularViabilidadBase(data: any): ViabilityResult {
  let score = 50; // Base
  const factores: { factor: string; tipo: 'positivo' | 'negativo' }[] = [];

  // Contactos
  if (data.tiene_contactos === 'muchos') {
    score += 15;
    factores.push({ factor: 'Sólida red de contactos en el sector', tipo: 'positivo' });
  } else if (data.tiene_contactos === 'ninguno') {
    score -= 10;
    factores.push({ factor: 'Falta de red de contactos inicial', tipo: 'negativo' });
  }

  // Competencia
  if (data.conoce_competencia === 'si-profundo') {
    score += 10;
    factores.push({ factor: 'Conocimiento profundo del mercado', tipo: 'positivo' });
  } else if (data.conoce_competencia === 'no') {
    score -= 5;
    factores.push({ factor: 'Necesidad de investigar a la competencia', tipo: 'negativo' });
  }

  // Capital
  if (data.capital_disponible === 'mas-20000') {
    score += 10;
    factores.push({ factor: 'Respaldo financiero suficiente para escalar', tipo: 'positivo' });
  } else if (data.capital_disponible === 'menos-1000') {
    score -= 5;
    factores.push({ factor: 'Presupuesto inicial muy ajustado', tipo: 'negativo' });
  }

  // Tiempo
  if (data.tiempo_disponible >= 20) {
    score += 10;
    factores.push({ factor: 'Alta disponibilidad de tiempo', tipo: 'positivo' });
  } else if (data.tiempo_disponible < 5) {
    score -= 10;
    factores.push({ factor: 'Tiempo limitado para la ejecución', tipo: 'negativo' });
  }

  // Normalizar score
  score = Math.max(0, Math.min(100, score));

  let nivel: 'BAJA' | 'MEDIA' | 'ALTA' = 'MEDIA';
  if (score >= 75) nivel = 'ALTA';
  if (score < 40) nivel = 'BAJA';

  return { score, nivel, factores };
}
