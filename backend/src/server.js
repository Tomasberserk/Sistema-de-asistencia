process.env.TZ = 'America/Bogota';
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import { login, studentLogin, authenticate, requireRole, changePassword, verifyPassword, forgotPassword, resetPassword } from './auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getInstitutions,
  getUnits,
  getPeople,
  createRoom,
  createSessionDraft,
  activateSession,
  closeSession,
  reopenRoom,
  getSession,
  getSessionQrToken,
  getSessionsHistory,
  getPresent,
  getAbsent,
  getRejections,
  checkin,
  manualOverride,
  manualLateCheckin,
  getSessionReport,
  getStudentHistory,
  submitExcuse,
  getInstructorExcuses,
  resolveExcuse,
  selfRegisterCheckin,
  submitLateRequest,
  getInstructorLateRequests,
  resolveLateRequest,
  checkDocument,
  getCoordInstructors,
  createInstructor,
  updateInstructor,
  getCoordFichas,
  createFicha,
  updateFicha,
  studentLateCheckin,
  submitSessionEvidence,
  getCoordEvidences,
  deleteStudentAccount,
  acceptStudentTerms,
  getPendingBiometrics,
  resolveBiometricException,
  requestFichaDeletion,
  approveFichaDeletion,
  rejectFichaDeletion,
  getPendingDeletionRequests,
  getPublicFichas,
  registerStudent,
  getStudentActiveSession,
  getAuditLogs
} from './controllers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const frontendCandidates = [
  path.resolve(__dirname, '../../frontend'),
  path.resolve(process.cwd(), 'frontend'),
  path.resolve(__dirname, '../frontend'),
  path.resolve(__dirname, 'frontend')
];
const frontendPath = frontendCandidates.find(p => fs.existsSync(p)) || frontendCandidates[0];
app.use(express.static(frontendPath));

app.get('/', (req, res, next) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.status(200).send('ok'));
app.get('/ready',  (req, res) => res.status(200).send('ready'));

// ── Public Auth & Registration ───────────────────────────────────────────────
app.post('/api/auth/login', login);
app.post('/public/student/login', studentLogin);
app.post('/public/student/register', registerStudent);
app.get('/public/fichas', getPublicFichas);
app.post('/public/auth/forgot-password', forgotPassword);
app.post('/public/auth/reset-password', resetPassword);
app.post('/api/auth/verify-password', authenticate, verifyPassword);
app.post('/api/auth/change-password', authenticate, changePassword);

// ── Public Check-in endpoints ─────────────────────────────────────────────────
app.post('/attendance/checkin',                      checkin);
app.post('/public/attendance/:token/register',        checkin);
app.post('/public/attendance/:token/self-register',   selfRegisterCheckin);
app.post('/public/attendance/:token/late-request',    submitLateRequest);
app.post('/public/attendance/:token/check-document',  checkDocument);
app.post('/public/attendance/:token/late-checkin',     studentLateCheckin);

// ── QR Student Redirection (Redirects directly to main application panel) ──
app.get('/attendance/:token', (req, res) => {
  const { token } = req.params;
  return res.redirect(`/?token=${encodeURIComponent(token)}`);
});

// ── Protected routes (Instructor catalog & control) ───────────────────────────
app.get('/api/institutions',                           authenticate, getInstitutions);
app.get('/api/institutions/:institutionId/units',      authenticate, getUnits);
app.get('/api/units/:unitId/people',                   authenticate, getPeople);

app.post('/api/sessions',                              authenticate, createSessionDraft);
app.post('/api/sessions/:sessionId/activate',          authenticate, activateSession);
app.post('/api/sessions/:sessionId/close',             authenticate, closeSession);
app.get('/api/sessions/:sessionId',                    authenticate, getSession);
app.get('/api/sessions/:sessionId/qr-token',           authenticate, getSessionQrToken);
app.get('/api/sessions',                               authenticate, getSessionsHistory);

app.get('/api/sessions/:sessionId/present',            authenticate, getPresent);
app.get('/api/sessions/:sessionId/absent',             authenticate, getAbsent);
app.get('/api/sessions/:sessionId/rejections',         authenticate, getRejections);

// Room & Manual Override
app.post('/room/create',                               createRoom);
app.post('/room/reopen',                               reopenRoom);
app.post('/attendance/manual-override',                authenticate, manualOverride);
app.post('/attendance/manual-checkin',                 authenticate, manualLateCheckin);
app.get('/reports/session/:sessionId',                 authenticate, getSessionReport);

// Student Portal
app.get('/api/student/history',                        authenticate, getStudentHistory);
app.get('/api/student/active-session',                 authenticate, getStudentActiveSession);
app.post('/api/student/excuses',                       authenticate, submitExcuse);
app.post('/api/excuses/submit',                        authenticate, submitExcuse);
app.delete('/api/student/delete-account',              authenticate, deleteStudentAccount);
app.post('/api/student/accept-terms',                  authenticate, acceptStudentTerms);

// Instructor Excuses
app.get('/api/instructor/excuses',                     authenticate, getInstructorExcuses);
app.post('/api/instructor/excuses/:id/resolve',        authenticate, resolveExcuse);

// Instructor Late Requests
app.get('/api/instructor/late-requests',               authenticate, getInstructorLateRequests);
app.post('/api/instructor/late-requests/:id/resolve',  authenticate, resolveLateRequest);
app.post('/api/sessions/:sessionId/evidence',          authenticate, submitSessionEvidence);

// Biometric Exceptions
app.get('/api/sessions/:sessionId/pending-biometrics', authenticate, getPendingBiometrics);
app.post('/api/attendance/resolve-biometric/:recordId', authenticate, resolveBiometricException);

// ── Coordinator Endpoints ──────────────────────────────────────────────────────
app.get('/api/coord/instructors',                      authenticate, requireRole('COORDINADOR'), getCoordInstructors);
app.post('/api/coord/instructors',                     authenticate, requireRole('COORDINADOR'), createInstructor);
app.put('/api/coord/instructors/:id',                  authenticate, requireRole('COORDINADOR'), updateInstructor);
app.get('/api/coord/fichas',                           authenticate, requireRole('COORDINADOR'), getCoordFichas);
app.post('/api/coord/fichas',                          authenticate, requireRole('COORDINADOR'), createFicha);
app.put('/api/coord/fichas/:id',                       authenticate, requireRole('COORDINADOR'), updateFicha);
app.post('/api/coord/fichas/:id/request-deletion',     authenticate, requireRole('COORDINADOR'), requestFichaDeletion);
app.get('/api/coord/deletion-requests',                authenticate, requireRole('COORDINADOR'), getPendingDeletionRequests);
app.post('/api/coord/deletion-requests/:requestId/approve', authenticate, requireRole('COORDINADOR'), approveFichaDeletion);
app.post('/api/coord/deletion-requests/:requestId/reject',  authenticate, requireRole('COORDINADOR'), rejectFichaDeletion);
app.get('/api/coord/evidences',                        authenticate, requireRole('COORDINADOR'), getCoordEvidences);
app.get('/api/coord/audit-logs',                        authenticate, requireRole('COORDINADOR'), getAuditLogs);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Ocurrió un error inesperado en el servidor.' } });
});

// ── Start ─────────────────────────────────────────────────────────────────────
try {
  await initDb();
  console.log('Database initialized successfully');
} catch (err) {
  console.error('Database initialization warning (non-fatal for server startup):', err);
}

const isRunningTests = process.env.NODE_ENV === 'test' || process.argv.some(a => a.includes('test'));
if (process.env.VERCEL !== '1' && !isRunningTests) {
  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
}

export default app;
