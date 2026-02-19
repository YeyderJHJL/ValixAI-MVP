// lib/utils/viability-calculator.ts

export function calcularViabilidadBase(testData: any) {
  let score = 50;
  const factores: Array<{tipo: string, factor: string, impacto: string}> = [];
  
  // Contactos
  if (testData.tiene_contactos === 'muchos') {
    score += 25;
    factores.push({ tipo: 'positivo', factor: 'Red de contactos sólida (20+)', impacto: '+25' });
  } else if (testData.tiene_contactos === 'algunos') {
    score += 15;
    factores.push({ tipo: 'positivo', factor: 'Tienes algunos contactos (5-20)', impacto: '+15' });
  } else if (testData.tiene_contactos === 'ninguno') {
    score -= 20;
    factores.push({ tipo: 'negativo', factor: 'Sin red de contactos establecida', impacto: '-20' });
  }
  
  // Competencia
  if (testData.conoce_competencia === 'si-profundo') {
    score += 15;
    factores.push({ tipo: 'positivo', factor: 'Conoce su competencia a fondo', impacto: '+15' });
  } else if (testData.conoce_competencia === 'no') {
    score -= 10;
    factores.push({ tipo: 'negativo', factor: 'No ha investigado la competencia', impacto: '-10' });
  }
  
  // Capital
  if (testData.capital_disponible === '5000-10000' || testData.capital_disponible === '10000-mas') {
    score += 10;
    factores.push({ tipo: 'positivo', factor: 'Capital disponible adecuado', impacto: '+10' });
  } else if (testData.capital_disponible === '0') {
    score -= 10;
    factores.push({ tipo: 'negativo', factor: 'Sin capital inicial disponible', impacto: '-10' });
  }
  
  // Tiempo
  if (testData.tiempo_disponible >= 30) {
    score += 5;
    factores.push({ tipo: 'positivo', factor: 'Disponibilidad de tiempo suficiente', impacto: '+5' });
  }
  
  // Experiencia
  if (testData.tiene_negocio === true) {
    score += 10;
    factores.push({ tipo: 'positivo', factor: 'Ya tiene experiencia con negocio propio', impacto: '+10' });
  }
  
  score = Math.max(0, Math.min(100, score));
  
  let nivel: string, nivelColor: string, nivelTexto: string;
  if (score >= 75) {
    nivel = 'ALTA';
    nivelColor = 'green';
    nivelTexto = 'Su idea tiene alta probabilidad de éxito';
  } else if (score >= 50) {
    nivel = 'MEDIA';
    nivelColor = 'yellow';
    nivelTexto = 'Su idea es viable con algunos ajustes';
  } else {
    nivel = 'BAJA';
    nivelColor = 'red';
    nivelTexto = 'Su idea necesita más preparación antes de lanzar';
  }
  
  return { score: Math.round(score), nivel, nivelColor, nivelTexto, factores };
}
