BEGIN;

-- 1. Permitir lectura pública de tests (necesario para que el .select() tras el insert funcione)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tests' AND policyname = 'Anyone can read tests'
    ) THEN
        CREATE POLICY "Anyone can read tests" ON tests
          FOR SELECT USING (true);
    END IF;
END $$;

-- 2. Permitir inserción pública de reportes (necesario para la API de generación)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reportes' AND policyname = 'Anyone can insert reports'
    ) THEN
        CREATE POLICY "Anyone can insert reports" ON reportes
          FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 3. Permitir lectura pública de eventos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'eventos' AND policyname = 'Anyone can read events'
    ) THEN
        CREATE POLICY "Anyone can read events" ON eventos
          FOR SELECT USING (true);
    END IF;
END $$;

COMMIT;