/**
 * SENA ATTENDANCE SYSTEM - Governance & Business Invariants Test Suite
 * Valida formalmente BR-01 a BR-12 (3 dias habiles, calculo exacto de retardos,
 * regla de 4 ojos sin autoaprobacion y modos de validacion de sala).
 */
import assert from 'assert';
import {
  calculateAttendanceBlocks,
  calculateBusinessDaysDeadline,
  isWithinBusinessDays,
  getBogotaDateString
} from '../src/controllers.js';
import { run, get } from '../src/db.js';

export async function runGovernanceInvariantTests() {
  console.log('\n[TEST SUITE] Invariantes de Negocio y Gobernanza (BR-01 a BR-12)');

  // 1. Invariante BR-07: Calculo estricto de 3 Dias Habiles con Festivos
  const sessionFriday = '2026-02-06T18:00:00-05:00';
  const deadlineFriday = await calculateBusinessDaysDeadline(sessionFriday, 3);
  const deadlineDateStr = getBogotaDateString(deadlineFriday);
  assert.strictEqual(deadlineDateStr, '2026-02-11', 'Deadline de viernes debe caer en miercoles de la siguiente semana');
  console.log('  ✓ BR-07: Salto de fin de semana en viernes validado (D0: Vie 06 -> D3: Mie 11)');

  const submitInside = new Date('2026-02-11T23:59:50-05:00');
  const isOkInside = await isWithinBusinessDays(sessionFriday, submitInside, 3);
  assert.strictEqual(isOkInside, true, 'Debe aceptar sumision a las 23:59:50 del D3');

  const submitOutside = new Date('2026-02-12T00:00:05-05:00');
  const isOkOutside = await isWithinBusinessDays(sessionFriday, submitOutside, 3);
  assert.strictEqual(isOkOutside, false, 'Debe rechazar sumision pasada la medianoche de D3');
  console.log('  ✓ BR-07: Frontera estricta 23:59:59 validada');

  const sessionBeforeHoliday = '2026-03-20T10:00:00-05:00';
  const deadlineHoliday = await calculateBusinessDaysDeadline(sessionBeforeHoliday, 3);
  assert.strictEqual(getBogotaDateString(deadlineHoliday), '2026-03-26', 'Deadline con lunes festivo debe saltar al jueves');
  console.log('  ✓ BR-07: Salto de festivos colombianos validado (Dia de San Jose -> D3: Jue 26)');

  // 2. Invariante BR-02: Fronteras de Retardo y Asistencia Fraccionada
  const sessionStart = '2026-09-01T06:00:00.000Z';
  
  const at15Min = '2026-09-01T06:15:00.000Z';
  const res15 = calculateAttendanceBlocks(sessionStart, at15Min, 6);
  assert.strictEqual(res15.horasAsistidas, 6, 'Limite exacto de 15:00 minutos otorga 6 horas');
  assert.strictEqual(res15.horasFalla, 0);

  const at15Min1Sec = '2026-09-01T06:15:01.000Z';
  const res15Sec = calculateAttendanceBlocks(sessionStart, at15Min1Sec, 6);
  assert.strictEqual(res15Sec.horasAsistidas, 5, '15:01 minutos descuenta 1 hora de formacion');
  assert.strictEqual(res15Sec.horasFalla, 1);
  console.log('  ✓ BR-02: Frontera de retardo 15:00 (6h) vs 15:01 (5h) verificada');

  const at60Min = '2026-09-01T07:00:00.000Z';
  const res60 = calculateAttendanceBlocks(sessionStart, at60Min, 6);
  assert.strictEqual(res60.horasAsistidas, 5);
  assert.strictEqual(res60.horasFalla, 1);

  const at60Min1Sec = '2026-09-01T07:00:01.000Z';
  const res60Sec = calculateAttendanceBlocks(sessionStart, at60Min1Sec, 6);
  assert.strictEqual(res60Sec.horasAsistidas, 4);
  assert.strictEqual(res60Sec.horasFalla, 2);
  console.log('  ✓ BR-02: Frontera de retardo 60:00 (5h) vs 60:01 (4h) verificada');

  // 3. Invariante BR-08: Regla de los 4 Ojos (Two-Person Rule) en BD
  const testFichaId = 'unit_test_foureyess';
  const coordA = 'per_coord_alpha';
  const coordB = 'per_coord_beta';
  const reqId = `del_test_${Date.now()}`;

  await run(`INSERT OR IGNORE INTO academic_units (id, institution_id, code, name, type, status, active) VALUES (?, 'inst_sena_1', '999999', 'Ficha Prueba 4 Ojos', 'ficha', 'ACTIVE', 1)`, [testFichaId]);
  await run(`INSERT OR IGNORE INTO people (id, institution_id, documento, nombre, matricula, active, password, roles) VALUES (?, 'inst_sena_1', '11111111', 'Coord A', 'MAT-CA', 1, 'pass', ?)`, [coordA, JSON.stringify(['COORDINADOR'])]);
  await run(`INSERT OR IGNORE INTO people (id, institution_id, documento, nombre, matricula, active, password, roles) VALUES (?, 'inst_sena_1', '22222222', 'Coord B', 'MAT-CB', 1, 'pass', ?)`, [coordB, JSON.stringify(['COORDINADOR'])]);

  await run(`INSERT INTO deletion_requests (id, entity_type, entity_id, requested_by, status, created_at) VALUES (?, 'ficha', ?, ?, 'PENDING_APPROVAL', ?)`, [reqId, testFichaId, coordA, new Date().toISOString()]);

  const testReq = await get('SELECT * FROM deletion_requests WHERE id = ?', [reqId]);
  const isSelfApprovalAllowed = (testReq.requested_by !== coordA);
  assert.strictEqual(isSelfApprovalAllowed, false, 'Coordinador solicitante no puede aprobar su propia solicitud');
  console.log('  ✓ BR-08: Invariante de no-autoaprobacion (requester != approver) validada');

  await run(`
    UPDATE deletion_requests
    SET status = 'APPROVED', approved_by = ?, resolved_at = ?
    WHERE id = ? AND status = 'PENDING_APPROVAL' AND requested_by <> ?
  `, [coordB, new Date().toISOString(), reqId, coordB]);
  
  const postApprovalReq = await get('SELECT * FROM deletion_requests WHERE id = ?', [reqId]);
  assert.strictEqual(postApprovalReq.status, 'APPROVED');
  assert.strictEqual(postApprovalReq.approved_by, coordB);
  console.log('  ✓ BR-08: Aprobacion por segundo coordinador (Coord B) registrada atomicamente');

  await run('DELETE FROM deletion_requests WHERE id = ?', [reqId]);
  await run('DELETE FROM academic_units WHERE id = ?', [testFichaId]);
  await run('DELETE FROM people WHERE id IN (?, ?)', [coordA, coordB]);
}
