// Script para ejecutar la migración en Supabase
// Ejecutar con: node scripts/run-migration.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer variables de entorno
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Ejecutando migración...\n');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260220000000_add_new_features.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Dividir por comandos individuales (usando BEGIN/COMMIT como delimitadores)
  // Supabase no permite múltiples comandos en una sola query, así que ejecutamos manualmente
  
  try {
    // Crear tabla rutas_negocio
    console.log('1️⃣ Creando tabla rutas_negocio...');
    const { error: error1 } = await supabase.rpc('exec_sql', { 
      sql_query: `
        CREATE TABLE IF NOT EXISTS rutas_negocio (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          nombre TEXT NOT NULL,
          descripcion_corta TEXT NOT NULL,
          profesion TEXT NOT NULL,
          capital_minimo TEXT NOT NULL,
          capital_maximo TEXT NOT NULL,
          tiempo_minimo INTEGER NOT NULL,
          inversion_inicial TEXT NOT NULL,
          tiempo_hasta_ingresos TEXT NOT NULL,
          ingreso_proyectado TEXT NOT NULL,
          por_que_funciona TEXT NOT NULL,
          activo BOOLEAN DEFAULT TRUE
        );
      `
    });
    
    if (error1 && !error1.message.includes('already exists')) {
      console.error('❌ Error creando rutas_negocio:', error1);
    } else {
      console.log('✅ Tabla rutas_negocio creada\n');
    }
    
    // Insertar datos en rutas_negocio
    console.log('2️⃣ Insertando rutas de negocio...');
    const rutas = [
      {
        nombre: 'Consultoría Tributaria Boutique',
        descripcion_corta: 'Asesoría especializada para 5-10 PYMEs',
        profesion: 'contador',
        capital_minimo: '0',
        capital_maximo: '10000',
        tiempo_minimo: 10,
        inversion_inicial: 'S/0-2,000',
        tiempo_hasta_ingresos: '3-6 meses',
        ingreso_proyectado: 'S/2,500-4,000/mes',
        por_que_funciona: 'Alta demanda: 850K PYMEs en Perú, 60% sin contador full-time'
      },
      {
        nombre: 'Outsourcing Contable para Startups',
        descripcion_corta: 'Gestión contable mensual para empresas tech',
        profesion: 'contador',
        capital_minimo: '5000',
        capital_maximo: '15000',
        tiempo_minimo: 15,
        inversion_inicial: 'S/5,000-8,000',
        tiempo_hasta_ingresos: '2-4 meses',
        ingreso_proyectado: 'S/3,500-6,000/mes',
        por_que_funciona: 'Ecosistema startup en crecimiento: 2,300+ startups en Lima necesitan contabilidad especializada'
      },
      {
        nombre: 'Planificación Financiera Personal 50+',
        descripcion_corta: 'Asesoría de retiro e inversiones para profesionales senior',
        profesion: 'contador',
        capital_minimo: '0',
        capital_maximo: '5000',
        tiempo_minimo: 8,
        inversion_inicial: 'S/500-2,000',
        tiempo_hasta_ingresos: '4-8 meses',
        ingreso_proyectado: 'S/2,000-3,500/mes',
        por_que_funciona: '1.2M peruanos 50+ con ingresos medios-altos buscan planificación de retiro'
      },
      {
        nombre: 'Asesoría Legal para Emprendedores',
        descripcion_corta: 'Paquetes de constitución y contratos básicos',
        profesion: 'abogado',
        capital_minimo: '0',
        capital_maximo: '8000',
        tiempo_minimo: 12,
        inversion_inicial: 'S/1,000-3,000',
        tiempo_hasta_ingresos: '3-5 meses',
        ingreso_proyectado: 'S/3,000-5,000/mes',
        por_que_funciona: '45,000 nuevas empresas se registran anualmente en Perú'
      },
      {
        nombre: 'Mediación y Arbitraje Comercial',
        descripcion_corta: 'Resolución alternativa de conflictos para PYMEs',
        profesion: 'abogado',
        capital_minimo: '5000',
        capital_maximo: '20000',
        tiempo_minimo: 10,
        inversion_inicial: 'S/3,000-10,000',
        tiempo_hasta_ingresos: '6-12 meses',
        ingreso_proyectado: 'S/4,000-8,000/mes',
        por_que_funciona: 'Congestión judicial: procesos tardan 3-5 años, empresas buscan alternativas rápidas'
      },
      {
        nombre: 'Consultoría Estratégica Senior',
        descripcion_corta: 'Asesoría para PYMEs en crecimiento',
        profesion: 'general',
        capital_minimo: '0',
        capital_maximo: '5000',
        tiempo_minimo: 10,
        inversion_inicial: 'S/500-2,000',
        tiempo_hasta_ingresos: '4-8 meses',
        ingreso_proyectado: 'S/2,500-5,000/mes',
        por_que_funciona: 'Su experiencia profesional es el activo más valioso en un mercado que valora el expertise'
      }
    ];
    
    const { data: insertedRutas, error: error2 } = await supabase
      .from('rutas_negocio')
      .insert(rutas)
      .select();
    
    if (error2) {
      console.error('❌ Error insertando rutas:', error2);
    } else {
      console.log(`✅ ${insertedRutas.length} rutas insertadas\n`);
    }
    
    // Crear tabla incubadoras (similar)
    console.log('3️⃣ Creando tabla incubadoras...');
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS incubadoras (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          nombre TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          nombre_programa TEXT NOT NULL,
          duracion TEXT NOT NULL,
          que_incluye TEXT[] NOT NULL,
          costo TEXT NOT NULL,
          nivel_madurez TEXT[] NOT NULL,
          proxima_convocatoria DATE,
          link_postulacion TEXT NOT NULL,
          sitio_web TEXT NOT NULL,
          activo BOOLEAN DEFAULT TRUE
        );
      `
    });
    
    if (error3 && !error3.message.includes('already exists')) {
      console.error('❌ Error creando incubadoras:', error3);
    } else {
      console.log('✅ Tabla incubadoras creada\n');
    }
    
    // Insertar incubadoras
    console.log('4️⃣ Insertando incubadoras...');
    const incubadoras = [
      {
        nombre: 'Jaku',
        descripcion: 'Incubadora de impacto social para emprendimientos en etapa temprana',
        nombre_programa: 'Jaku Incubator',
        duracion: '8 semanas',
        que_incluye: ['Metodología Lean Startup', 'Capital semilla hasta S/5,000', 'Mentores expertos en validación', 'Red de inversionistas ángeles'],
        costo: 'S/500',
        nivel_madurez: ['ideacion', 'validacion'],
        proxima_convocatoria: '2026-03-15',
        link_postulacion: 'https://jaku.pe/postular',
        sitio_web: 'https://jaku.pe'
      },
      {
        nombre: 'Scale',
        descripcion: 'Aceleradora para startups con tracción buscando escalar',
        nombre_programa: 'Scale Accelerator',
        duracion: '12 semanas',
        que_incluye: ['Mentoría 1-1 con founders exitosos', 'Networking con VCs', 'Pitch Day con inversores', 'Acceso a partners corporativos'],
        costo: 'Gratuito (equity 5-7%)',
        nivel_madurez: ['validacion', 'crecimiento'],
        proxima_convocatoria: '2026-04-01',
        link_postulacion: 'https://scale.pe/aplicar',
        sitio_web: 'https://scale.pe'
      }
    ];
    
    const { data: insertedIncubadoras, error: error4 } = await supabase
      .from('incubadoras')
      .insert(incubadoras)
      .select();
    
    if (error4) {
      console.error('❌ Error insertando incubadoras:', error4);
    } else {
      console.log(`✅ ${insertedIncubadoras.length} incubadoras insertadas\n`);
    }
    
    console.log('🎉 Migración completada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`  - Rutas de negocio: ${insertedRutas?.length || 0}`);
    console.log(`  - Incubadoras: ${insertedIncubadoras?.length || 0}`);
    
  } catch (error) {
    console.error('💥 Error ejecutando migración:', error);
    process.exit(1);
  }
}

runMigration();
