BEGIN;

-- Tabla principal de tests completados
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Datos personales
  nombre TEXT NOT NULL,
  edad INTEGER NOT NULL CHECK (edad BETWEEN 50 AND 85),
  email TEXT NOT NULL,
  
  -- Profesión
  profesion TEXT NOT NULL,
  
  -- Estado actual
  tiene_negocio BOOLEAN NOT NULL,
  anos_negocio TEXT,
  formalizado TEXT,
  ingresos_mensuales TEXT,
  
  -- Idea de negocio
  descripcion_idea TEXT NOT NULL,
  tiene_contactos TEXT NOT NULL,
  conoce_competencia TEXT NOT NULL,
  
  -- Recursos
  capital_disponible TEXT NOT NULL,
  tiempo_disponible INTEGER NOT NULL,
  
  -- Barreras emocionales
  mayor_miedo TEXT NOT NULL,
  mayor_dificultad TEXT NOT NULL,
  
  -- Metadata
  user_agent TEXT,
  ip_address INET,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Tabla de reportes generados
CREATE TABLE IF NOT EXISTS reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Score calculado
  viability_score INTEGER NOT NULL CHECK (viability_score BETWEEN 0 AND 100),
  viability_nivel TEXT NOT NULL CHECK (viability_nivel IN ('BAJA', 'MEDIA', 'ALTA')),
  
  -- Contenido generado por IA
  por_que_viable JSONB NOT NULL,           -- Array de razones
  riesgos JSONB NOT NULL,                  -- Array de objetos riesgo
  roadmap JSONB NOT NULL,                  -- Objeto con semanas
  mensaje_miedo TEXT NOT NULL,             -- Respuesta personalizada al miedo
  
  -- Recursos recomendados
  recursos JSONB NOT NULL,                 -- Array de recursos
  
  -- Analytics
  viewed_at TIMESTAMP WITH TIME ZONE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  whatsapp_clicked_at TIMESTAMP WITH TIME ZONE,
  pdf_downloaded_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de eventos de analytics
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  evento_tipo TEXT NOT NULL,               -- 'test_started', 'test_completed', 'report_viewed', etc
  evento_data JSONB                        -- Metadata del evento
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tests_email ON tests(email);
CREATE INDEX IF NOT EXISTS idx_tests_created_at ON tests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reportes_test_id ON reportes(test_id);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos(evento_tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_created_at ON eventos(created_at DESC);

-- RLS (Row Level Security) - Por ahora público en MVP
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden insertar tests (público)
CREATE POLICY "Anyone can insert tests" ON tests
  FOR INSERT WITH CHECK (true);

-- Política: Solo pueden leer su propio reporte (por ahora todos)
CREATE POLICY "Anyone can read reports" ON reportes
  FOR SELECT USING (true);

-- Política: Todos pueden insertar eventos
CREATE POLICY "Anyone can insert events" ON eventos
  FOR INSERT WITH CHECK (true);

COMMIT;