import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { get, run, createAuditLog } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev-only';

export const login = async (req, res) => {
  try {
    const rawIdentifier = req.body.identifier || req.body.documento || req.body.email;
    const password = req.body.password;

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Documento/Correo y contraseña son requeridos.' }
      });
    }

    const cleanIdentifier = rawIdentifier.toString().trim();
    let person = null;

    if (cleanIdentifier.includes('@')) {
      person = await get('SELECT * FROM people WHERE LOWER(email) = LOWER(?) AND active = 1', [cleanIdentifier]);
    } else {
      const cleanDoc = cleanIdentifier.replace(/\D/g, '');
      person = await get('SELECT * FROM people WHERE (documento = ? OR LOWER(email) = LOWER(?)) AND active = 1', [cleanDoc, cleanIdentifier]);
    }

    if (!person) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas o usuario inactivo.' }
      });
    }

    // Check if roles contains INSTRUCTOR or COORDINADOR
    const roles = JSON.parse(person.roles);
    
    // Check password
    let isMatch = false;
    if (person.password.startsWith('$2b$') || person.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, person.password);
    } else {
      isMatch = (password === person.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas.' }
      });
    }

    // Generate JWT (24h)
    const tokenPayload = {
      id: person.id,
      institutionId: person.institution_id,
      documento: person.documento,
      nombre: person.nombre,
      roles
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      data: {
        token,
        person: {
          id: person.id,
          institutionId: person.institution_id,
          nombre: person.nombre,
          documento: person.documento,
          roles,
          must_change_password: person.must_change_password === 1
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno del servidor.' }
    });
  }
};

// Student Login (Habeas Data & Biometrics flow)
export const studentLogin = async (req, res) => {
  try {
    const rawIdentifier = req.body.identifier || req.body.documento || req.body.email;
    const password = req.body.password;

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Documento/Correo y contraseña son requeridos.' }
      });
    }

    const cleanIdentifier = rawIdentifier.toString().trim();
    let person = null;

    if (cleanIdentifier.includes('@')) {
      person = await get('SELECT * FROM people WHERE LOWER(email) = LOWER(?) AND active = 1', [cleanIdentifier]);
    } else {
      const cleanDoc = cleanIdentifier.replace(/\D/g, '');
      person = await get('SELECT * FROM people WHERE (documento = ? OR LOWER(email) = LOWER(?)) AND active = 1', [cleanDoc, cleanIdentifier]);
    }

    if (!person) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas o usuario inactivo.' }
      });
    }

    // Verify student role
    const roles = JSON.parse(person.roles);
    if (!roles.includes('APRENDIZ')) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Acceso exclusivo para aprendices.' }
      });
    }

    // Check password
    let isMatch = false;
    if (person.password.startsWith('$2b$') || person.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, person.password);
    } else {
      isMatch = (password === person.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Contraseña incorrecta.' }
      });
    }

    // Generate JWT
    const tokenPayload = {
      id: person.id,
      institutionId: person.institution_id,
      documento: person.documento,
      nombre: person.nombre,
      roles
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      data: {
        token,
        person: {
          id: person.id,
          nombre: person.nombre,
          documento: person.documento,
          photo_reference: person.photo_reference || '',
          terms_accepted: person.terms_accepted || 0,
          must_change_password: person.must_change_password === 1
        }
      }
    });
  } catch (err) {
    console.error('Student login error:', err);
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno en el inicio de sesión.' }
    });
  }
};

// Password Recovery: Request Reset Link / Token (Neutral anti-enumeration)
export const forgotPassword = async (req, res) => {
  try {
    const rawIdentifier = (req.body.identifier || req.body.email || req.body.documento || '').toString().trim();
    if (!rawIdentifier) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Debe ingresar un correo o documento.' }
      });
    }

    let person = null;
    if (rawIdentifier.includes('@')) {
      person = await get('SELECT * FROM people WHERE LOWER(email) = LOWER(?) AND active = 1', [rawIdentifier]);
    } else {
      const cleanDoc = rawIdentifier.replace(/\D/g, '');
      person = await get('SELECT * FROM people WHERE (documento = ? OR LOWER(email) = LOWER(?)) AND active = 1', [cleanDoc, rawIdentifier]);
    }

    const neutralMessage = 'Si las credenciales corresponden a un usuario activo, se ha generado el enlace de recuperación.';

    if (!person) {
      return res.status(200).json({ data: { message: neutralMessage } });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour validity

    const resetId = 'reset_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    await run(
      'INSERT INTO password_resets (id, person_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
      [resetId, person.id, tokenHash, expiresAt, new Date().toISOString()]
    );

    await createAuditLog(person.id, 'PASSWORD_RESET_REQUESTED', 'people', person.id, null, null, {
      ip: req.ip || req.socket.remoteAddress
    });

    return res.status(200).json({
      data: {
        message: neutralMessage,
        resetToken: rawToken
      }
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Error interno del servidor.' } });
  }
};

// Password Recovery: Consume Token and Set New Password (Atomic single-use)
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Token y nueva contraseña son requeridos.' }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'La nueva contraseña debe tener al menos 6 caracteres.' }
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const nowIso = new Date().toISOString();

    const updateResult = await run(
      'UPDATE password_resets SET used_at = ? WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?',
      [nowIso, tokenHash, nowIso]
    );

    const affected = updateResult?.changes ?? updateResult?.rowCount ?? 0;
    if (affected === 0) {
      return res.status(400).json({
        error: { code: 'INVALID_OR_EXPIRED_TOKEN', message: 'El enlace de recuperación es inválido, ya fue utilizado o ha expirado.' }
      });
    }

    const resetRow = await get('SELECT person_id FROM password_resets WHERE token_hash = ?', [tokenHash]);
    if (!resetRow) {
      return res.status(400).json({ error: { code: 'NOT_FOUND', message: 'Registro de reinicio no encontrado.' } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await run(
      'UPDATE people SET password = ?, must_change_password = 0 WHERE id = ?',
      [hashedPassword, resetRow.person_id]
    );

    await createAuditLog(resetRow.person_id, 'PASSWORD_RESET_COMPLETED', 'people', resetRow.person_id, null, null, {
      ip: req.ip || req.socket.remoteAddress
    });

    return res.status(200).json({
      data: { message: 'Contraseña restablecida exitosamente. Ahora puede iniciar sesión con su nueva credencial.' }
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Error interno del servidor.' } });
  }
};

// Verify Current Password Endpoint (Step 1 identity gate before password change)
export const verifyPassword = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Debes ingresar tu contraseña actual.' }
      });
    }

    const person = await get('SELECT * FROM people WHERE id = ?', [userId]);
    if (!person) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Usuario no encontrado.' }
      });
    }

    let isMatch = false;
    if (person.password && (person.password.startsWith('$2b$') || person.password.startsWith('$2a$'))) {
      isMatch = await bcrypt.compare(currentPassword, person.password);
    } else {
      isMatch = (currentPassword === person.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'La contraseña actual ingresada es incorrecta.' }
      });
    }

    return res.status(200).json({
      data: { verified: true, message: 'Identidad confirmada exitosamente.' }
    });
  } catch (err) {
    console.error('Verify password error:', err);
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno al verificar la contraseña.' }
    });
  }
};

// Change Password Endpoint (Mandatory first-time or user request)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'La contraseña actual y la nueva contraseña son requeridas.' }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'La nueva contraseña debe tener al menos 6 caracteres.' }
      });
    }

    const person = await get('SELECT * FROM people WHERE id = ?', [userId]);
    if (!person) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Usuario no encontrado.' }
      });
    }

    // Verify current password
    let isMatch = false;
    if (person.password.startsWith('$2b$') || person.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(currentPassword, person.password);
    } else {
      isMatch = (currentPassword === person.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'La contraseña actual es incorrecta.' }
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'La nueva contraseña no puede ser idéntica a la anterior.' }
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await run('UPDATE people SET password = ?, must_change_password = 0 WHERE id = ?', [hashed, userId]);

    return res.status(200).json({
      data: { message: 'Contraseña actualizada exitosamente.', must_change_password: false }
    });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno al cambiar la contraseña.' }
    });
  }
};


export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token de autenticación no proporcionado.' }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token de autenticación inválido o expirado.' }
    });
  }
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  const userRoles = req.user.roles || [];
  const hasRole = allowedRoles.some(r => userRoles.includes(r));
  if (!hasRole) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'No tienes permisos para realizar esta acción.' }
    });
  }
  next();
};
