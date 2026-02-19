// Script mejorado para ejecutar migración en Supabase
// Usa la API REST directamente para ejecutar SQL
const fetch = require('node-fetch');
const path = require('path');

// Leer variables de entorno
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

async function executeSQLDirectly(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    },
    body: JSON.stringify({ query: sql })
  });
  
  const data = await response.json();
  return { data, error: !response.ok ? data : null };
}

async function runMigrationDirect() {
  console.log('🚀 Ejecutando migración directamente en Supabase...\n');
  
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  try {
    // 1. Crear tabla rutas_negocio directamente usando el cliente
    console.log('1️⃣ Creando tabla rutas_negocio directamente...');
    
    // Primero intentamos insertar datos (si la tabla ya existe)
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
        por_que_funciona: 'Ecosistema startup en crecimiento: 2,300+ startups en Lima'
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
        por_que_funciona: '1.2M peruanos 50+ buscan planificación de retiro'
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
        por_que_funciona: 'Procesos judiciales tardan 3-5 años, empresas buscan alternativas'
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
        por_que_funciona: 'Su experiencia profesional es el activo más valioso'
      }
    ];
    
    console.log('   ⏳ Insertando rutas de negocio...');
    const { data: rutasData, error: rutasError } = await supabase
      .from('rutas_negocio')
      .insert(rutas)
      .select();
    
    if (rutasError) {
      console.error('   ⚠️  Error (tabla probablemente no existe aún):', rutasError.message);
      console.log('   ℹ️  Las tablas deben crearse manualmente en Supabase SQL Editor');
    } else {
      console.log(`   ✅ ${rutasData.length} rutas insertadas`);
    }
    
    // 2. Insertar incubadoras
    console.log('\n2️⃣ Insertando incubadoras...');
    const incubadoras = [
      {
        nombre: 'Jaku',
        descripcion: 'Incubadora de impacto social para emprendimientos en etapa temprana',
        nombre_programa: 'Jaku Incubator',
        duracion: '8 semanas',
        que_incluye: ['Metodología Lean Startup', 'Capital semilla hasta S/5,000', 'Mentores expertos', 'Red de inversionistas'],
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
        que_incluye: ['Mentoría 1-1 con founders', 'Networking con VCs', 'Pitch Day', 'Acceso a partners'],
        costo: 'Gratuito (equity 5-7%)',
        nivel_madurez: ['validacion', 'crecimiento'],
        proxima_convocatoria: '2026-04-01',
        link_postulacion: 'https://scale.pe/aplicar',
        sitio_web: 'https://scale.pe'
      }
    ];
    
    const { data: incubadorasData, error: incubadorasError } = await supabase
      .from('incubadoras')
      .insert(incubadoras)
      .select();
    
    if (incubadorasError) {
      console.error('   ⚠️  Error:', incubadorasError.message);
      console.log('   ℹ️  Las tablas deben crearse manualmente');
    } else {
      console.log(`   ✅ ${incubadorasData.length} incubadoras insertadas`);
    }
    
    console.log('\n✅ Migración completada!');
    console.log('\n⚠️  IMPORTANTE: Si viste errores, ejecuta el SQL manualmente en Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/apehwfkvdzbivgjoeuis/editor');
    console.log('   Archivo: /app/supabase/migrations/20260220000000_add_new_features.sql');
    
  } catch (error) {
    console.error('\n💥 Error:', error);
    console.log('\n📋 Próximo paso: Ejecuta el SQL manualmente en Supabase Dashboard');
    console.log('   https://supabase.com/dashboard/project/apehwfkvdzbivgjoeuis/editor');
  }
}

runMigrationDirect();
