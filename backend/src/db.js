import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isPostgres = !!process.env.DATABASE_URL;

let pool;
let sqliteDb;

if (isPostgres) {
  const { Pool } = pg;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
  });
  console.log('Database type: PostgreSQL');
} else {
  const isVercel = process.env.VERCEL === '1';
  const dbPath = isVercel 
    ? '/tmp/database.sqlite' 
    : path.resolve(__dirname, '../database.sqlite');
  
  try {
    const sqlite3Module = await import('sqlite3');
    const sqlite3 = sqlite3Module.default || sqlite3Module;
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening SQLite database:', err.message);
      } else {
        console.log('Database type: SQLite (Local) at:', dbPath);
      }
    });
  } catch (err) {
    console.error('Failed to load SQLite module:', err.message);
  }
}

// ── Placeholder converter: SQLite ? → PostgreSQL $1, $2, ... ─────────────────
function toPg(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// ── Query helpers (same API as the old sqlite3 wrappers) ──────────────────────

/** Execute a SELECT-like query, returns array of rows */
export const query = async (rawSql, params = []) => {
  if (isPostgres) {
    const { rows } = await pool.query(toPg(rawSql), params);
    return rows;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.all(rawSql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

/** Execute an INSERT / UPDATE / DELETE, returns { id, changes } */
export const run = async (rawSql, params = []) => {
  if (isPostgres) {
    const result = await pool.query(toPg(rawSql), params);
    return { id: null, changes: result.rowCount };
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.run(rawSql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

/** Execute a query and return ONLY the first row (or null) */
export const get = async (rawSql, params = []) => {
  if (isPostgres) {
    const { rows } = await pool.query(toPg(rawSql), params);
    return rows[0] || null;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.get(rawSql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

// ── Schema initialization ─────────────────────────────────────────────────────
export async function initDb() {
  // SQLite schema migration fallback: DROP late_requests table if it lacks created_at column
  try {
    if (!isPostgres) {
      const tableCheck = await get(`SELECT name FROM sqlite_master WHERE type='table' AND name='late_requests'`);
      if (tableCheck) {
        const cols = await query(`PRAGMA table_info(late_requests)`);
        const hasCreatedAt = cols.some(c => c.name === 'created_at');
        if (!hasCreatedAt) {
          await run(`DROP TABLE late_requests`);
          console.log('Migration Cleanup: Dropped outdated late_requests table in SQLite');
        }
      }
    }
  } catch (err) {
    console.error('Pre-init migration cleanup error:', err.message);
  }

  // Create tables
  await run(`
    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE,
      name TEXT,
      context TEXT,
      labels TEXT,
      theme TEXT,
      qr_ttl_minutes INTEGER,
      active INTEGER
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS academic_units (
      id TEXT PRIMARY KEY,
      institution_id TEXT,
      code TEXT UNIQUE,
      name TEXT,
      type TEXT,
      active INTEGER,
      FOREIGN KEY(institution_id) REFERENCES institutions(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY,
      institution_id TEXT,
      documento TEXT,
      nombre TEXT,
      matricula TEXT,
      active INTEGER,
      password TEXT,
      roles TEXT,
      photo_reference TEXT,
      terms_accepted INTEGER DEFAULT 0,
      must_change_password INTEGER DEFAULT 0,
      FOREIGN KEY(institution_id) REFERENCES institutions(id),
      UNIQUE(institution_id, documento)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      institution_id TEXT,
      unit_id TEXT,
      person_id TEXT,
      active INTEGER,
      FOREIGN KEY(institution_id) REFERENCES institutions(id),
      FOREIGN KEY(unit_id) REFERENCES academic_units(id),
      FOREIGN KEY(person_id) REFERENCES people(id),
      UNIQUE(unit_id, person_id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id TEXT PRIMARY KEY,
      institution_id TEXT,
      unit_id TEXT,
      status TEXT,
      qr_token TEXT,
      qr_expires_at TEXT,
      qr_ttl_minutes INTEGER,
      activated_at TEXT,
      closed_at TEXT,
      room_created_at TEXT,
      room_expires_at TEXT,
      is_reopened INTEGER,
      creator_ip TEXT,
      ip_check_enabled INTEGER DEFAULT 1,
      evidence_submitted INTEGER DEFAULT 0,
      evidence_submitted_at TEXT,
      created_by TEXT,
      FOREIGN KEY(institution_id) REFERENCES institutions(id),
      FOREIGN KEY(unit_id) REFERENCES academic_units(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      institution_id TEXT,
      unit_id TEXT,
      person_id TEXT,
      documento TEXT,
      status TEXT,
      reject_reason TEXT,
      message TEXT,
      hora_ingreso_real TEXT,
      hora_salida_real TEXT,
      horas_programadas_sesion INTEGER,
      horas_validadas_asistencia INTEGER,
      horas_inasistencia_acumulada INTEGER,
      tipo_registro TEXT,
      created_at TEXT,
      client_ip TEXT,
      photo_evidence TEXT,
      biometric_match_score REAL,
      verification_method TEXT,
      FOREIGN KEY(session_id) REFERENCES attendance_sessions(id),
      FOREIGN KEY(institution_id) REFERENCES institutions(id),
      FOREIGN KEY(unit_id) REFERENCES academic_units(id),
      FOREIGN KEY(person_id) REFERENCES people(id)
    )
  `);

  try {
    if (!isPostgres) {
      await run(`
        DELETE FROM attendance_records 
        WHERE rowid NOT IN (
          SELECT MIN(rowid) FROM attendance_records GROUP BY session_id, person_id
        )
      `);
    } else {
      await run(`
        DELETE FROM attendance_records a
        USING attendance_records b
        WHERE a.ctid < b.ctid
          AND a.session_id = b.session_id
          AND a.person_id = b.person_id
      `);
    }
  } catch (e) {
    // Ignore cleanup error if table empty or dialect difference
  }

  try {
    await run(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_session_person 
      ON attendance_records(session_id, person_id)
    `);
  } catch (idxErr) {
    console.warn('Notice: unique index on attendance_records:', idxErr.message);
  }

  await run(`
    CREATE TABLE IF NOT EXISTS excuses (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      person_id TEXT,
      text TEXT,
      file_name TEXT,
      file_data TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT,
      FOREIGN KEY(session_id) REFERENCES attendance_sessions(id),
      FOREIGN KEY(person_id) REFERENCES people(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS late_requests (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      institution_id TEXT,
      unit_id TEXT,
      documento TEXT,
      nombre TEXT,
      justification TEXT,
      status TEXT DEFAULT 'pending',
      horas_descontar INTEGER DEFAULT 1,
      created_at TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS holidays (
      date TEXT PRIMARY KEY,
      name TEXT,
      active INTEGER DEFAULT 1
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      action TEXT,
      entity_type TEXT,
      entity_id TEXT,
      before_json TEXT,
      after_json TEXT,
      metadata_json TEXT,
      created_at TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS deletion_requests (
      id TEXT PRIMARY KEY,
      entity_type TEXT,
      entity_id TEXT,
      requested_by TEXT,
      approved_by TEXT,
      status TEXT DEFAULT 'PENDING_APPROVAL',
      reason TEXT,
      created_at TEXT,
      resolved_at TEXT,
      FOREIGN KEY(requested_by) REFERENCES people(id),
      FOREIGN KEY(approved_by) REFERENCES people(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      person_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(person_id) REFERENCES people(id)
    )
  `);

  // Migration: Add created_at column to late_requests if not exists
  try {
    if (isPostgres) {
      try {
        await run(`ALTER TABLE late_requests ADD COLUMN created_at TEXT`);
        console.log('Migration: Added created_at column to late_requests in Postgres');
      } catch (err) {
        if (err.code !== '42701') throw err; // Ignore 'column already exists'
      }
    } else {
      const columns = await query(`PRAGMA table_info(late_requests)`);
      const hasCreatedAt = columns.some(col => col.name === 'created_at');
      if (!hasCreatedAt) {
        await run(`ALTER TABLE late_requests ADD COLUMN created_at TEXT`);
        console.log('Migration: Added created_at column to late_requests in SQLite');
      }
    }
  } catch (migErr) {
    console.error('Migration error (non-fatal) late_requests:', migErr.message);
  }

  // Migration: Add ip_check_enabled column to attendance_sessions if not exists
  try {
    if (isPostgres) {
      try {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN ip_check_enabled INTEGER DEFAULT 1`);
        console.log('Migration: Added ip_check_enabled column to attendance_sessions in Postgres');
      } catch (err) {
        if (err.code !== '42701') throw err; // Ignore 'column already exists'
      }
    } else {
      const columns = await query(`PRAGMA table_info(attendance_sessions)`);
      const hasIpCheck = columns.some(col => col.name === 'ip_check_enabled');
      if (!hasIpCheck) {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN ip_check_enabled INTEGER DEFAULT 1`);
        console.log('Migration: Added ip_check_enabled column to attendance_sessions in SQLite');
      }
    }
  } catch (migErr) {
    console.error('Migration error (non-fatal) attendance_sessions.ip_check_enabled:', migErr.message);
  }

  // Migration: Add evidence columns to attendance_sessions
  try {
    if (isPostgres) {
      try {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN evidence_submitted INTEGER DEFAULT 0`);
      } catch (err) {
        if (err.code !== '42701') throw err;
      }
      try {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN evidence_submitted_at TEXT`);
      } catch (err) {
        if (err.code !== '42701') throw err;
      }
      console.log('Migration: Added evidence columns to attendance_sessions in Postgres');
    } else {
      const columns = await query(`PRAGMA table_info(attendance_sessions)`);
      const hasEvidence = columns.some(col => col.name === 'evidence_submitted');
      if (!hasEvidence) {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN evidence_submitted INTEGER DEFAULT 0`);
        await run(`ALTER TABLE attendance_sessions ADD COLUMN evidence_submitted_at TEXT`);
        console.log('Migration: Added evidence columns to attendance_sessions in SQLite');
      }
    }
  } catch (migErr) {
    console.error('Migration error (non-fatal) attendance_sessions.evidence:', migErr.message);
  }

  // Migration Phase v3: Add columns for Biometrics, terms and Session creators
  try {
    if (isPostgres) {
      // 1. Add photo_reference to people
      try {
        await run(`ALTER TABLE people ADD COLUMN photo_reference TEXT`);
      } catch (e) { if (e.code !== '42701') throw e; }

      // terms_accepted & must_change_password
      try {
        await run(`ALTER TABLE people ADD COLUMN terms_accepted INTEGER DEFAULT 0`);
      } catch (e) { if (e.code !== '42701') throw e; }
      try {
        await run(`ALTER TABLE people ADD COLUMN must_change_password INTEGER DEFAULT 0`);
      } catch (e) { if (e.code !== '42701') throw e; }

      // 2. Add photo_evidence, biometric_match_score, verification_method to attendance_records
      try {
        await run(`ALTER TABLE attendance_records ADD COLUMN photo_evidence TEXT`);
      } catch (e) { if (e.code !== '42701') throw e; }
      try {
        await run(`ALTER TABLE attendance_records ADD COLUMN biometric_match_score REAL`);
      } catch (e) { if (e.code !== '42701') throw e; }
      try {
        await run(`ALTER TABLE attendance_records ADD COLUMN verification_method TEXT`);
      } catch (e) { if (e.code !== '42701') throw e; }

      // 3. Add created_by to attendance_sessions
      try {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN created_by TEXT`);
      } catch (e) { if (e.code !== '42701') throw e; }

      console.log('Migration Phase v3: Columns verified in Postgres');
    } else {
      // SQLite
      const peopleCols = await query(`PRAGMA table_info(people)`);
      if (!peopleCols.some(col => col.name === 'photo_reference')) {
        await run(`ALTER TABLE people ADD COLUMN photo_reference TEXT`);
      }
      if (!peopleCols.some(col => col.name === 'terms_accepted')) {
        await run(`ALTER TABLE people ADD COLUMN terms_accepted INTEGER DEFAULT 0`);
      }
      if (!peopleCols.some(col => col.name === 'must_change_password')) {
        await run(`ALTER TABLE people ADD COLUMN must_change_password INTEGER DEFAULT 0`);
      }

      const recCols = await query(`PRAGMA table_info(attendance_records)`);
      if (!recCols.some(col => col.name === 'photo_evidence')) {
        await run(`ALTER TABLE attendance_records ADD COLUMN photo_evidence TEXT`);
      }
      if (!recCols.some(col => col.name === 'biometric_match_score')) {
        await run(`ALTER TABLE attendance_records ADD COLUMN biometric_match_score REAL`);
      }
      if (!recCols.some(col => col.name === 'verification_method')) {
        await run(`ALTER TABLE attendance_records ADD COLUMN verification_method TEXT`);
      }

      const sessCols = await query(`PRAGMA table_info(attendance_sessions)`);
      if (!sessCols.some(col => col.name === 'created_by')) {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN created_by TEXT`);
      }

      console.log('Migration Phase v3: Columns verified in SQLite');
    }
  } catch (migv3Err) {
    console.error('Migration error (non-fatal) Phase v3:', migv3Err.message);
  }

  // Migration Phase v4: Governance, Holidays, Validation Modes & Audit
  try {
    if (isPostgres) {
      try { await run(`ALTER TABLE academic_units ADD COLUMN status TEXT DEFAULT 'ACTIVE'`); } catch (e) { if (e.code !== '42701') throw e; }
      try { await run(`ALTER TABLE academic_units ADD COLUMN jornada TEXT DEFAULT 'DIURNA'`); } catch (e) { if (e.code !== '42701') throw e; }
      try { await run(`ALTER TABLE academic_units ADD COLUMN modalidad TEXT DEFAULT 'PRESENCIAL'`); } catch (e) { if (e.code !== '42701') throw e; }
      try { await run(`ALTER TABLE people ADD COLUMN email TEXT`); } catch (e) { if (e.code !== '42701') throw e; }
      try { await run(`ALTER TABLE attendance_sessions ADD COLUMN validation_mode TEXT DEFAULT 'IP_AND_QR'`); } catch (e) { if (e.code !== '42701') throw e; }
      console.log('Migration Phase v4: Columns verified in Postgres');
    } else {
      const unitCols = await query(`PRAGMA table_info(academic_units)`);
      if (!unitCols.some(col => col.name === 'status')) {
        await run(`ALTER TABLE academic_units ADD COLUMN status TEXT DEFAULT 'ACTIVE'`);
      }
      if (!unitCols.some(col => col.name === 'jornada')) {
        await run(`ALTER TABLE academic_units ADD COLUMN jornada TEXT DEFAULT 'DIURNA'`);
      }
      if (!unitCols.some(col => col.name === 'modalidad')) {
        await run(`ALTER TABLE academic_units ADD COLUMN modalidad TEXT DEFAULT 'PRESENCIAL'`);
      }

      const peopleCols = await query(`PRAGMA table_info(people)`);
      if (!peopleCols.some(col => col.name === 'email')) {
        await run(`ALTER TABLE people ADD COLUMN email TEXT`);
      }

      const sessCols = await query(`PRAGMA table_info(attendance_sessions)`);
      if (!sessCols.some(col => col.name === 'validation_mode')) {
        await run(`ALTER TABLE attendance_sessions ADD COLUMN validation_mode TEXT DEFAULT 'IP_AND_QR'`);
      }
      console.log('Migration Phase v4: Columns verified in SQLite');
    }
  } catch (migv4Err) {
    console.error('Migration error (non-fatal) Phase v4:', migv4Err.message);
  }

  // Seed Colombian holidays (2026/2027) for business days calculation
  try {
    const holidayCount = await get('SELECT COUNT(*) as count FROM holidays');
    if (Number(holidayCount.count) === 0) {
      const holidaysList = [
        ['2026-01-01', 'Año Nuevo'],
        ['2026-01-12', 'Día de los Reyes Magos'],
        ['2026-03-23', 'Día de San José'],
        ['2026-04-02', 'Jueves Santo'],
        ['2026-04-03', 'Viernes Santo'],
        ['2026-05-01', 'Día del Trabajo'],
        ['2026-05-18', 'Día de la Ascensión'],
        ['2026-06-08', 'Corpus Christi'],
        ['2026-06-15', 'Sagrado Corazón'],
        ['2026-06-29', 'San Pedro y San Pablo'],
        ['2026-07-20', 'Día de la Independencia'],
        ['2026-08-07', 'Batalla de Boyacá'],
        ['2026-08-17', 'La Asunción de la Virgen'],
        ['2026-10-12', 'Día de la Raza'],
        ['2026-11-02', 'Todos los Santos'],
        ['2026-11-16', 'Independencia de Cartagena'],
        ['2026-12-08', 'Inmaculada Concepción'],
        ['2026-12-25', 'Navidad']
      ];
      for (const [d, n] of holidaysList) {
        if (isPostgres) {
          await run(`INSERT INTO holidays (date, name, active) VALUES (?, ?, 1) ON CONFLICT (date) DO NOTHING`, [d, n]);
        } else {
          await run(`INSERT OR IGNORE INTO holidays (date, name, active) VALUES (?, ?, 1)`, [d, n]);
        }
      }
      console.log('Database Init: Seeded Colombian holidays successfully.');
    }
  } catch (holErr) {
    console.error('Database Init: Error seeding holidays:', holErr.message);
  }

  // Seed data if institutions is empty
  // NOTE: PostgreSQL returns COUNT(*) as string (bigint), use Number() to compare
  const instCount = await get('SELECT COUNT(*) as count FROM institutions');
  if (Number(instCount.count) === 0) {
    console.log('Seeding database with SENA data...');

    // Seed institution (SENA)
    const instId = 'inst_sena_1';
    await run(`
      INSERT INTO institutions (id, code, name, context, labels, theme, qr_ttl_minutes, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      instId,
      'SENA',
      'Servicio Nacional de Aprendizaje',
      'sena',
      JSON.stringify({ role: 'Instructor', unit: 'Ficha', person: 'Aprendiz' }),
      JSON.stringify({ primary: '#39A900', secondary: '#003049' }),
      10,
      1
    ]);

    // Seed academic units (fichas)
    const unit1Id = 'unit_ficha_3413974';
    const unit2Id = 'unit_ficha_2503400';
    await run(`
      INSERT INTO academic_units (id, institution_id, code, name, type, active)
      VALUES 
      (?, ?, ?, ?, ?, 1),
      (?, ?, ?, ?, ?, 1)
    `, [
      unit1Id, instId, '3413974', 'Análisis y Desarrollo de Software (ADSO)', 'ficha',
      unit2Id, instId, '2503400', 'Gestión de Redes de Datos', 'ficha'
    ]);

    // Seed people (Instructores & Aprendices)
    const passJesus = await bcrypt.hash('qwerty.2026', 10);
    const passInstructor = '1079606375';

    const pJesusId = 'per_jesus_1';
    const pInstId = 'per_inst_1';

    await run(`
      INSERT INTO people (id, institution_id, documento, nombre, matricula, active, password, roles)
      VALUES 
      (?, ?, ?, ?, ?, 1, ?, ?),
      (?, ?, ?, ?, ?, 1, ?, ?)
    `, [
      pJesusId, instId, '0000000001', 'Jesus Gonzalez', 'MAT-001', passJesus, JSON.stringify(['INSTRUCTOR']),
      pInstId, instId, '1079606375', 'Instructor SENA', 'MAT-002', passInstructor, JSON.stringify(['INSTRUCTOR'])
    ]);

    // Seed Aprendices (documento as password)
    const learners = [
      { id: 'per_apr_7', doc: '1077228780', name: 'Tomas Berserk',    mat: 'MAT-AV2', units: [unit1Id] }
    ];

    for (const l of learners) {
      await run(`
        INSERT INTO people (id, institution_id, documento, nombre, matricula, active, password, roles)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?)
      `, [l.id, instId, l.doc, l.name, l.mat, l.doc, JSON.stringify(['APRENDIZ'])]);

      for (const unitId of l.units) {
        await run(`
          INSERT INTO enrollments (id, institution_id, unit_id, person_id, active)
          VALUES (?, ?, ?, ?, 1)
        `, [`enr_${l.id}_${unitId}`, instId, unitId, l.id]);
      }
    }

    console.log('Database seeded successfully!');
  }

  // Incondicional: Asegurar que el Coordinador exista en la BD (local o Vercel)
  try {
    const existingCoord = await get("SELECT id FROM people WHERE documento = '9999999999'");
    if (!existingCoord) {
      const instId = 'inst_sena_1';
      // Ensure institution SENA exists first (just in case)
      const inst = await get("SELECT id FROM institutions WHERE id = ?", [instId]);
      if (!inst) {
        await run(`
          INSERT INTO institutions (id, code, name, context, labels, theme, qr_ttl_minutes, active)
          VALUES (?, 'SENA', 'Servicio Nacional de Aprendizaje', 'sena', ?, ?, 10, 1)
        `, [instId, JSON.stringify({ role: 'Instructor', unit: 'Ficha', person: 'Aprendiz' }), JSON.stringify({ primary: '#39A900', secondary: '#003049' })]);
      }

      const passCoord = await bcrypt.hash('coord.2026', 10);
      await run(`
        INSERT INTO people (id, institution_id, documento, nombre, matricula, active, password, roles)
        VALUES (?, ?, '9999999999', 'Coordinador SENA', 'MAT-COORD', 1, ?, ?)
      `, ['per_coord_1', instId, passCoord, JSON.stringify(['COORDINADOR'])]);
      console.log('Database Init: Seeded Coordinator 9999999999 successfully!');
    }
  } catch (err) {
    console.error('Error ensuring Coordinator seed:', err.message);
  }

  // Incondicional: Limpiar la BD para dejar únicamente a Tomas Berserk
  try {
    // Delete enrollments for other people who are APRENDIZ
    await run(`
      DELETE FROM enrollments 
      WHERE person_id NOT IN (
        SELECT id FROM people 
        WHERE documento = '1077228780' OR roles LIKE '%INSTRUCTOR%' OR roles LIKE '%COORDINADOR%'
      )
    `);
    
    // Delete people who are APRENDIZ and not Tomas
    await run(`
      DELETE FROM people 
      WHERE documento NOT IN ('1077228780', '9999999999', '1079606375', '0000000001')
      AND roles LIKE '%APRENDIZ%'
    `);
    console.log('Database Init: Student list cleaned successfully (Tomas Berserk kept).');
  } catch (err) {
    console.error('Database Init: Error cleaning students:', err.message);
  }
}

export const createAuditLog = async (actorId, action, entityType, entityId, beforeObj = null, afterObj = null, metadataObj = null) => {
  try {
    const id = `aud_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    await run(`
      INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, before_json, after_json, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      actorId || 'SYSTEM',
      action,
      entityType,
      entityId,
      beforeObj ? JSON.stringify(beforeObj) : null,
      afterObj ? JSON.stringify(afterObj) : null,
      metadataObj ? JSON.stringify(metadataObj) : null,
      now
    ]);
    return id;
  } catch (err) {
    console.error('Failed to create audit log:', err.message);
    return null;
  }
};
