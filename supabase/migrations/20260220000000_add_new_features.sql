-- Migration: Agregar tablas y columnas para Rutas de Negocio, Assessment de Madurez e Incubadoras
-- Fecha: 2026-02-20

BEGIN;

-- ========================================
-- TABLA: rutas_negocio
-- ========================================
CREATE TABLE IF NOT EXISTS rutas_negocio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nombre TEXT NOT NULL,
  descripcion_corta TEXT NOT NULL,
  profesion TEXT NOT NULL, -- 'contador', 'abogado', 'ingeniero', etc.
  
  -- Requisitos
  capital_minimo TEXT NOT NULL, -- Ej: '0', '5000'
  capital_maximo TEXT NOT NULL, -- Ej: '10000', '50000'
  tiempo_minimo INTEGER NOT NULL, -- Horas por semana
  
  -- Proyecciones
  inversion_inicial TEXT NOT NULL,
  tiempo_hasta_ingresos TEXT NOT NULL,
  ingreso_proyectado TEXT NOT NULL,
  
  -- Justificación
  por_que_funciona TEXT NOT NULL,
  
  activo BOOLEAN DEFAULT TRUE
);

-- Insertar rutas de negocio para diferentes profesiones
INSERT INTO rutas_negocio (nombre, descripcion_corta, profesion, capital_minimo, capital_maximo, tiempo_minimo, inversion_inicial, tiempo_hasta_ingresos, ingreso_proyectado, por_que_funciona) VALUES

-- CONTADORES
('Consultoría Tributaria Boutique', 'Asesoría especializada para 5-10 PYMEs', 'contador', '0', '10000', 10, 'S/0-2,000', '3-6 meses', 'S/2,500-4,000/mes', 'Alta demanda: 850K PYMEs en Perú, 60% sin contador full-time'),
('Outsourcing Contable para Startups', 'Gestión contable mensual para empresas tech', 'contador', '5000', '15000', 15, 'S/5,000-8,000', '2-4 meses', 'S/3,500-6,000/mes', 'Ecosistema startup en crecimiento: 2,300+ startups en Lima necesitan contabilidad especializada'),
('Planificación Financiera Personal 50+', 'Asesoría de retiro e inversiones para profesionales senior', 'contador', '0', '5000', 8, 'S/500-2,000', '4-8 meses', 'S/2,000-3,500/mes', '1.2M peruanos 50+ con ingresos medios-altos buscan planificación de retiro'),

-- ABOGADOS
('Asesoría Legal para Emprendedores', 'Paquetes de constitución y contratos básicos', 'abogado', '0', '8000', 12, 'S/1,000-3,000', '3-5 meses', 'S/3,000-5,000/mes', '45,000 nuevas empresas se registran anualmente en Perú'),
('Mediación y Arbitraje Comercial', 'Resolución alternativa de conflictos para PYMEs', 'abogado', '5000', '20000', 10, 'S/3,000-10,000', '6-12 meses', 'S/4,000-8,000/mes', 'Congestión judicial: procesos tardan 3-5 años, empresas buscan alternativas rápidas'),
('Compliance y Protección de Datos', 'Asesoría GDPR/Ley 29733 para empresas digitales', 'abogado', '8000', '25000', 15, 'S/5,000-12,000', '4-8 meses', 'S/5,000-10,000/mes', 'Nueva regulación obliga a 15,000+ empresas a cumplir con protección de datos'),

-- INGENIEROS
('Consultoría en Eficiencia Energética', 'Auditorías y optimización para industrias', 'ingeniero', '10000', '30000', 12, 'S/8,000-15,000', '4-8 meses', 'S/4,500-8,000/mes', 'Ley de Eficiencia Energética obliga auditorías a 3,500+ empresas industriales'),
('Automatización de Procesos Industriales', 'Implementación IoT y sensores para PYMEs manufactureras', 'ingeniero', '15000', '50000', 20, 'S/12,000-25,000', '6-12 meses', 'S/6,000-12,000/mes', 'Industria 4.0: 68% de PYMEs buscan automatización para competir'),
('Inspección Técnica de Edificaciones', 'Evaluación estructural para inmuebles antiguos', 'ingeniero', '8000', '20000', 10, 'S/5,000-10,000', '3-6 meses', 'S/3,500-6,000/mes', 'Lima tiene 180,000+ edificios de 40+ años que requieren inspección obligatoria'),

-- MÉDICOS
('Telemedicina Especializada', 'Consultas virtuales para pacientes crónicos', 'medico', '5000', '15000', 12, 'S/4,000-8,000', '4-6 meses', 'S/4,000-7,000/mes', 'Post-pandemia: 42% de peruanos prefieren consultas virtuales'),
('Medicina Ocupacional para PYMEs', 'Exámenes y planes de salud laboral', 'medico', '10000', '30000', 15, 'S/8,000-15,000', '6-10 meses', 'S/5,000-9,000/mes', 'Ley 29783 obliga a 120,000+ empresas a implementar salud ocupacional'),
('Asesoría en Nutrición Corporativa', 'Programas de bienestar para empleados', 'medico', '3000', '12000', 10, 'S/2,000-5,000', '3-8 meses', 'S/3,000-6,000/mes', 'Empresas invierten S/850M anuales en programas de bienestar'),

-- ARQUITECTOS
('Remodelación y Diseño para AirBnB', 'Optimización de espacios para rentabilidad turística', 'arquitecto', '8000', '25000', 15, 'S/5,000-12,000', '4-8 meses', 'S/4,000-8,000/mes', 'Cusco y Lima tienen 12,000+ propiedades AirBnB que buscan diferenciación'),
('Consultoría en Espacios Comerciales', 'Diseño de retail para aumentar ventas', 'arquitecto', '5000', '20000', 12, 'S/3,000-10,000', '5-10 meses', 'S/3,500-7,000/mes', '35,000 locales comerciales en centros comerciales necesitan renovación cada 3-5 años'),

-- PROFESIÓN GENERAL (para otros casos)
('Consultoría Estratégica Senior', 'Asesoría para PYMEs en crecimiento', 'general', '0', '5000', 10, 'S/500-2,000', '4-8 meses', 'S/2,500-5,000/mes', 'Su experiencia profesional es el activo más valioso en un mercado que valora el expertise');

-- ========================================
-- TABLA: incubadoras
-- ========================================
CREATE TABLE IF NOT EXISTS incubadoras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  nombre_programa TEXT NOT NULL,
  duracion TEXT NOT NULL,
  que_incluye TEXT[] NOT NULL,
  costo TEXT NOT NULL,
  nivel_madurez TEXT[] NOT NULL, -- ['ideacion'], ['validacion'], ['crecimiento']
  proxima_convocatoria DATE,
  link_postulacion TEXT NOT NULL,
  sitio_web TEXT NOT NULL,
  
  activo BOOLEAN DEFAULT TRUE
);

-- Insertar incubadoras
INSERT INTO incubadoras (nombre, descripcion, nombre_programa, duracion, que_incluye, costo, nivel_madurez, proxima_convocatoria, link_postulacion, sitio_web) VALUES

('Jaku', 
 'Incubadora de impacto social para emprendimientos en etapa temprana', 
 'Jaku Incubator', 
 '8 semanas', 
 ARRAY['Metodología Lean Startup', 'Capital semilla hasta S/5,000', 'Mentores expertos en validación', 'Red de inversionistas ángeles'],
 'S/500',
 ARRAY['ideacion', 'validacion'],
 '2026-03-15',
 'https://jaku.pe/postular',
 'https://jaku.pe'),

('Scale', 
 'Aceleradora para startups con tracción buscando escalar', 
 'Scale Accelerator', 
 '12 semanas', 
 ARRAY['Mentoría 1-1 con founders exitosos', 'Networking con VCs', 'Pitch Day con inversores', 'Acceso a partners corporativos'],
 'Gratuito (equity 5-7%)',
 ARRAY['validacion', 'crecimiento'],
 '2026-04-01',
 'https://scale.pe/aplicar',
 'https://scale.pe');

-- ========================================
-- MODIFICAR TABLA: reportes
-- ========================================
ALTER TABLE reportes 
ADD COLUMN IF NOT EXISTS rutas_recomendadas JSONB,
ADD COLUMN IF NOT EXISTS assessment_madurez JSONB,
ADD COLUMN IF NOT EXISTS incubadora_recomendada JSONB;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_rutas_profesion ON rutas_negocio(profesion);
CREATE INDEX IF NOT EXISTS idx_rutas_activo ON rutas_negocio(activo);
CREATE INDEX IF NOT EXISTS idx_incubadoras_activo ON incubadoras(activo);

-- RLS (Row Level Security)
ALTER TABLE rutas_negocio ENABLE ROW LEVEL SECURITY;
ALTER TABLE incubadoras ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer (público)
CREATE POLICY "Anyone can read rutas" ON rutas_negocio
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read incubadoras" ON incubadoras
  FOR SELECT USING (true);

COMMIT;
