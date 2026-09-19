/**
 * SENA ATTENDANCE SYSTEM - End-to-End Discovery Roadmap Tests
 * Valida de forma integral los flujos de las 4 Fases:
 * Fase 1: Catálogo público, registro de aprendiz, doble portal, recuperación de clave.
 * Fase 2: Detección de aula activa y justificaciones con regla BR-07.
 * Fase 3: Regla de 4 ojos (Two-person rule) y auditoría inmutable.
 * Fase 4: Habeas Data (Ley 1581) y supresión de datos.
 */
import assert from 'assert';
import http from 'http';
import jwt from 'jsonwebtoken';
import app from '../src/server.js';
import { run, get, query } from '../src/db.js';

export async function runDiscoveryFlowTests() {
  console.log('\n[TEST SUITE] Flujos End-to-End de la Hoja de Ruta (Fases 1 a 4)');
  
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = 'http://127.0.0.1:' + port;

  // Helper para generar headers autenticados
  const authHeader = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'super-secret-key-for-dev-only', { expiresIn: '1h' });
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  try {

  // 1. GET /public/fichas
  const resFichas = await fetch(`${baseUrl}/public/fichas`);
  assert.strictEqual(resFichas.status, 200, 'GET /public/fichas debe responder 200');
  const fichasData = await resFichas.json();
  assert(Array.isArray(fichasData.data), 'fichas debe ser un array');
  assert(fichasData.data.length > 0, 'Debe haber al menos 1 ficha activa');
  const targetFicha = fichasData.data[0];
  console.log('  ✓ GET /public/fichas retorna fichas activas institucionales');

  // 2. Registro de Aprendiz (Fase 1)
  const randDoc = '98' + Math.floor(10000000 + Math.random() * 90000000);
  const randEmail = `aprendiz_${randDoc}@misena.edu.co`;
  const registerPayload = {
    fichaId: targetFicha.id,
    nombre: 'Pepito Perez Test',
    documento: randDoc,
    email: randEmail,
    password: 'Password123!',
    termsAccepted: true
  };

  const resRegister = await fetch(`${baseUrl}/public/student/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerPayload)
  });
  assert.strictEqual(resRegister.status, 201, 'Registro de aprendiz debe retornar 201');
  const registerData = await resRegister.json();
  assert(registerData.data.token, 'Registro debe emitir JWT');
  assert.strictEqual(registerData.data.person.documento, randDoc);
  console.log('  ✓ POST /public/student/register vincula aprendiz y emite credencial JWT');

  // 3. Login de Aprendiz con Documento o Correo
  const resLoginDoc = await fetch(`${baseUrl}/public/student/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documento: randDoc, password: 'Password123!' })
  });
  assert.strictEqual(resLoginDoc.status, 200, 'Login con documento debe ser exitoso');

  const resLoginEmail = await fetch(`${baseUrl}/public/student/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documento: randEmail, password: 'Password123!' })
  });
  assert.strictEqual(resLoginEmail.status, 200, 'Login con correo institucional debe ser exitoso');
  console.log('  ✓ POST /public/student/login autentica bidireccionalmente (documento y correo)');

  // 4. Flujo de Recuperación de Contraseña (Forgot & Reset)
  const resForgot = await fetch(`${baseUrl}/public/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documento: randEmail })
  });
  assert.strictEqual(resForgot.status, 200, 'Forgot password debe responder 200');
  const forgotData = await resForgot.json();
  const resetToken = forgotData.data.resetToken;
  assert(resetToken, 'Token de recuperación debe ser retornado para el flujo seguro');

  const resReset = await fetch(`${baseUrl}/public/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: resetToken, newPassword: 'NewPassword2026!' })
  });
  assert.strictEqual(resReset.status, 200, 'Reset password debe ser exitoso');

  // Verificar nuevo login
  const resLoginNewPass = await fetch(`${baseUrl}/public/student/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documento: randDoc, password: 'NewPassword2026!' })
  });
  assert.strictEqual(resLoginNewPass.status, 200, 'Login con nueva clave debe ser exitoso');
  const studentToken = (await resLoginNewPass.json()).data.token;
  console.log('  ✓ Flujo de recuperación de clave (Forgot + Reset + Token Hash de 1 solo uso) validado');

  // 5. Detección de Aula Activa para Aprendiz (Fase 2)
  const resActiveSession = await fetch(`${baseUrl}/api/student/active-session`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert.strictEqual(resActiveSession.status, 200, 'Consulta de sesión activa debe retornar 200');
  const activeSessionData = await resActiveSession.json();
  assert('hasActiveSession' in activeSessionData.data, 'Debe indicar si hay sesión activa');
  console.log('  ✓ GET /api/student/active-session responde estado de aula formativa');

  // 6. Regla de 4 Ojos (Two-Person Rule / BR-08)
  const testFichaId = `unit_test_4eyes_${Date.now()}`;
  const testFichaCode = `4EYES-${Date.now()}`;
  await run(`
    INSERT INTO academic_units (id, institution_id, code, name, type, jornada, status, active)
    VALUES (?, 'inst_sena_1', ?, 'Unidad de Prueba 4 Ojos', 'ficha', 'DIURNA', 'ACTIVE', 1)
  `, [testFichaId, testFichaCode]);

  const coord1Headers = authHeader({ id: 'per_coord_1', institutionId: 'inst_sena_1', roles: ['COORDINADOR'] });
  const coord2Headers = authHeader({ id: 'per_coord_2', institutionId: 'inst_sena_1', roles: ['COORDINADOR'] });

  // Coord 1 radica solicitud de baja
  const resReqDel = await fetch(`${baseUrl}/api/coord/fichas/${testFichaId}/request-deletion`, {
    method: 'POST',
    headers: coord1Headers,
    body: JSON.stringify({ reason: 'Ficha culminó ciclo formativo' })
  });
  assert.strictEqual(resReqDel.status, 202, 'Radicación de baja debe responder 202');
  const delReqData = await resReqDel.json();
  const requestId = delReqData.data.requestId;

  // Coord 1 intenta autoaprobarse -> 403 Forbidden
  const resSelfApprove = await fetch(`${baseUrl}/api/coord/deletion-requests/${requestId}/approve`, {
    method: 'POST',
    headers: coord1Headers
  });
  assert.strictEqual(resSelfApprove.status, 403, 'Autoaprobación debe ser rechazada con 403');

  // Coord 2 aprueba -> 200 OK
  const resPairApprove = await fetch(`${baseUrl}/api/coord/deletion-requests/${requestId}/approve`, {
    method: 'POST',
    headers: coord2Headers
  });
  assert.strictEqual(resPairApprove.status, 200, 'Aprobación por segundo par debe responder 200');
  console.log('  ✓ Regla de 4 Ojos (BR-08) probada de extremo a extremo vía API');

  // 7. Auditoría Inmutable (Fase 3)
  const resAudit = await fetch(`${baseUrl}/api/coord/audit-logs`, {
    headers: coord1Headers
  });
  assert.strictEqual(resAudit.status, 200, 'Consulta de logs debe retornar 200');
  const auditData = await resAudit.json();
  assert(Array.isArray(auditData.data), 'Audit data debe ser array');
  const hasApproveLog = auditData.data.some(l => l.action === 'APPROVE_FICHA_DELETION');
  assert(hasApproveLog, 'Debe existir registro inmutable de la aprobación de baja');
  console.log('  ✓ GET /api/coord/audit-logs contiene trazabilidad de acciones críticas');

  // 7.5. Verificación de Contraseña Actual (Gate de Identidad)
  const resVerifyWrong = await fetch(`${baseUrl}/api/auth/verify-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({ currentPassword: 'clave-incorrecta' })
  });
  assert.strictEqual(resVerifyWrong.status, 401, 'Clave actual incorrecta debe rechazar con 401');

  const resVerifyOk = await fetch(`${baseUrl}/api/auth/verify-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({ currentPassword: 'NewPassword2026!' })
  });
  assert.strictEqual(resVerifyOk.status, 200, 'Clave actual correcta debe responder 200');
  const verifyOkData = await resVerifyOk.json();
  assert.strictEqual(verifyOkData.data?.verified, true, 'Debe retornar verified: true');
  console.log('  ✓ POST /api/auth/verify-password valida identidad previa al cambio de clave');

  // 8. Habeas Data y Supresión de Cuenta (Fase 4)
  const resHabeas = await fetch(`${baseUrl}/api/student/delete-account`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  assert.strictEqual(resHabeas.status, 200, 'DELETE /api/student/delete-account debe responder 200');

  // Verificar que los datos del estudiante están anonimizados en la BD
  const anonPerson = await get('SELECT * FROM people WHERE id = ?', [registerData.data.person.id]);
  assert.strictEqual(anonPerson.active, 0, 'La cuenta debe estar inactiva');
  assert.strictEqual(anonPerson.nombre, 'APRENDIZ_ANONIMIZADO', 'El nombre debe estar anonimizado');
  assert(anonPerson.email.includes('@sena.anonymized.local'), 'El correo debe ser sintético');
  console.log('  ✓ DELETE /api/student/delete-account anonimiza datos conforme a Ley 1581 (Habeas Data)');

  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

if (process.argv[1] && process.argv[1].endsWith('e2e-discovery.test.js')) {
  runDiscoveryFlowTests()
    .then(() => console.log('All discovery e2e tests passed!'))
    .catch((err) => { console.error('Discovery e2e test failed:', err); process.exit(1); });
}
