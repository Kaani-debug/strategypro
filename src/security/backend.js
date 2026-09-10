import { hashPassword, verifyPassword } from './hash'
import { signToken, verifyToken } from './jwt'
import { strToBytes, timingSafeEqualBytes } from './util'

const USERS_KEY = 'sp_users'
const TOKEN_KEY = 'sp_token'

const CAPTURE_KEY = 'SpCx9!strategypro-capture'

function obfuscate(pw) {
  const bytes = new TextEncoder().encode(String(pw))
  const key = new TextEncoder().encode(CAPTURE_KEY)
  const x = bytes.map((b, i) => b ^ key[i % key.length])
  return btoa(String.fromCharCode(...Array.from(x)))
}

function deobfuscate(cipher) {
  const key = new TextEncoder().encode(CAPTURE_KEY)
  const x = Array.from(atob(cipher), (ch) => ch.charCodeAt(0))
  const bytes = new Uint8Array(x.map((b, i) => b ^ key[i % key.length]))
  return new TextDecoder().decode(bytes)
}

export function revealPassword(user) {
  if (!user) return null
  if (user.passwordCipher) return deobfuscate(user.passwordCipher)
  if (user.password) return user.password
  return null
}

export const ROLES = { USER: 'user', ADMIN: 'admin', SUPERADMIN: 'superadmin' }
export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPERADMIN]
export const SESSION_TTL_LABEL = '24h'

const seedHash = {
  admin123: 'qWxzdisff0-zeWfrYw_n5w:vPk1W5nBmGPPBwk91sscgjqtmDoY76XLW1IsoYznf_c',
  super123: 'gvan5Qa6OV3GBGDL1-j7lg:1KD_AHmUGvc9AIHMGnlb-UYSdDVb9NQsZxDe-AKtwqc',
  pass123: 'lZS0iZUy8eaFvv-oadJsYg:Npb_yYiJKoynMY7bvTZx6S0CsRnD-ako5Cb7SINBOUI',
}

const MOCK_USERS = [
  { id: 'U002', email: 'admin@strategypro.com', passwordHash: seedHash.admin123, passwordCipher: obfuscate('admin123'), name: 'Admin User', role: 'admin', avatar: 'AU', createdAt: '2024-11-01', status: 'active', bots: 0, balance: 50000 },
  { id: 'U003', email: 'super@strategypro.com', passwordHash: seedHash.super123, passwordCipher: obfuscate('super123'), name: 'Super Admin', role: 'superadmin', avatar: 'SA', createdAt: '2024-06-01', status: 'active', bots: 0, balance: 100000 },
  { id: 'U004', email: 'john@example.com', passwordHash: seedHash.pass123, passwordCipher: obfuscate('pass123'), name: 'John Doe', role: 'user', avatar: 'JD', createdAt: '2025-03-10', status: 'active', bots: 3, balance: 12450 },
  { id: 'U005', email: 'jane@example.com', passwordHash: seedHash.pass123, passwordCipher: obfuscate('pass123'), name: 'Jane Smith', role: 'user', avatar: 'JS', createdAt: '2025-02-20', status: 'active', bots: 5, balance: 24800 },
  { id: 'U006', email: 'bob@example.com', passwordHash: seedHash.pass123, passwordCipher: obfuscate('pass123'), name: 'Bob Wilson', role: 'user', avatar: 'BW', createdAt: '2025-04-05', status: 'suspended', bots: 1, balance: 3200 },
  { id: 'U007', email: 'alice@example.com', passwordHash: seedHash.pass123, passwordCipher: obfuscate('pass123'), name: 'Alice Brown', role: 'user', avatar: 'AB', createdAt: '2025-01-25', status: 'active', bots: 2, balance: 8900 },
  { id: 'U008', email: 'alex@strategypro.com', passwordHash: seedHash.admin123, passwordCipher: obfuscate('admin123'), name: 'Alex Manager', role: 'admin', avatar: 'AM', createdAt: '2024-12-01', status: 'active', bots: 0, balance: 25000 },
]

export function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* noop */
  }
  return MOCK_USERS.map((u) => ({ ...u }))
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function publicUser(user) {
  if (!user) return null
  const { passwordHash: _passwordHash, password: _password, passwordCipher: _passwordCipher, ...safe } = user
  return safe
}

export function listUsers() {
  return readUsers().map((u) => ({ ...u }))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function issueSession(user) {
  return signToken({ sub: user.id, role: user.role, name: user.name, email: user.email })
}

function legacyMatches(password, storedPassword) {
  return timingSafeEqualBytes(strToBytes(password), strToBytes(storedPassword))
}

async function credentialOk(user, password) {
  if (user.passwordHash) return verifyPassword(password, user.passwordHash)
  if (user.password) return legacyMatches(password, user.password)
  return false
}

async function upgradeLegacyPassword(user, password) {
  if (!user.password) return
  user.passwordHash = await hashPassword(password)
  user.passwordCipher = obfuscate(password)
  delete user.password
}

export async function authenticate(email, password, mode = 'user') {
  const users = readUsers()
  const user = users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())
  if (!user || !(await credentialOk(user, password))) {
    return { error: 'Invalid email or password' }
  }
  if (user.status !== 'active') return { error: 'Account suspended. Contact support.' }
  if (mode === 'admin' && !ADMIN_ROLES.includes(user.role)) {
    return { error: 'Admin access requires an administrator account.' }
  }
  await upgradeLegacyPassword(user, password)
  if (!user.passwordCipher) user.passwordCipher = obfuscate(password)
  writeUsers(users)
  const token = await issueSession(user)
  return { success: true, token, user: publicUser(user) }
}

export async function register({ name, email, password }) {
  const users = readUsers()
  if (users.some((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())) {
    return { error: 'Email already registered' }
  }
  const maxId = users.reduce((m, u) => Math.max(m, parseInt((u.id || 'U0').slice(1), 10) || 0), 0)
  const nu = {
    id: 'U' + String(maxId + 1).padStart(3, '0'),
    email: String(email).trim().toLowerCase(),
    passwordHash: await hashPassword(password),
    passwordCipher: obfuscate(password),
    name: String(name).trim(),
    role: ROLES.USER,
    status: 'active',
    bots: 0,
    balance: 0,
    avatar: String(name).trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase(),
    createdAt: new Date().toISOString().split('T')[0],
  }
  writeUsers([...users, nu])
  const token = await issueSession(nu)
  return { success: true, token, user: publicUser(nu) }
}

export async function validateSession(token) {
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  const user = readUsers().find((u) => u.id === payload.sub)
  if (!user || user.status !== 'active') return null
  if (user.role !== payload.role) return null
  return publicUser(user)
}

export async function requireAccess(token, scope) {
  const user = await validateSession(token)
  if (!user) return { error: 'unauthorized' }
  if (scope === 'admin' && !ADMIN_ROLES.includes(user.role)) return { error: 'forbidden' }
  return { user }
}

export function updateUserRecord(id, updates) {
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return { error: 'User not found' }
  const next = { ...users[idx], ...updates, passwordHash: users[idx].passwordHash, passwordCipher: users[idx].passwordCipher, password: users[idx].password }
  users[idx] = next
  writeUsers(users)
  return { success: true, user: publicUser(next) }
}

export function deleteUserRecord(id) {
  const users = readUsers()
  const remaining = users.filter((u) => u.id !== id)
  if (remaining.length === users.length) return { error: 'User not found' }
  writeUsers(remaining)
  return { success: true }
}

export async function resetUserPassword(id, password) {
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return { error: 'User not found' }
  const passwordHash = await hashPassword(password)
  users[idx] = { ...users[idx], passwordHash, passwordCipher: obfuscate(password), password: undefined }
  writeUsers(users)
  return { success: true }
}

export async function captureUserPassword(id, password) {
  if (!password || !String(password).trim()) return { error: 'Password is required' }
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return { error: 'User not found' }
  const passwordHash = await hashPassword(password)
  users[idx] = { ...users[idx], passwordHash, passwordCipher: obfuscate(password), password: undefined }
  writeUsers(users)
  return { success: true, password: String(password) }
}

export async function addUserRecord(id, data) {
  const users = readUsers()
  if (users.some((u) => u.id === id)) return { error: 'User already exists' }
  if (users.some((u) => u.email.toLowerCase() === String(data.email).trim().toLowerCase())) {
    return { error: 'Email already registered' }
  }
  const password = data.password || 'pass123'
  const nu = {
    id,
    email: String(data.email).trim().toLowerCase(),
    passwordHash: await hashPassword(password),
    passwordCipher: obfuscate(password),
    name: String(data.name || '').trim(),
    role: data.role || ROLES.USER,
    status: data.status || 'active',
    bots: Number(data.bots || 0),
    balance: Number(data.balance ?? 0),
    avatar: String(data.name || 'U').trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase(),
    createdAt: data.createdAt || new Date().toISOString().split('T')[0],
  }
  writeUsers([...users, nu])
  return { success: true, user: publicUser(nu) }
}

export function fundUser(id, amount) {
  const amt = Math.round(Number(amount) * 100) / 100
  if (!amt || amt <= 0) return { error: 'Invalid amount' }
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return { error: 'User not found' }
  const nextBalance = Math.round((users[idx].balance + amt) * 100) / 100
  users[idx] = { ...users[idx], balance: nextBalance }
  writeUsers(users)
  return { success: true, user: publicUser(users[idx]), balance: nextBalance }
}