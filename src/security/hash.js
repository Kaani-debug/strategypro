import { b64urlEncode, b64urlDecode, strToBytes, timingSafeEqualBytes, randomBytes } from './util'

const ITERATIONS = 120000
const KEY_LENGTH = 256
const HASH = 'SHA-256'

async function derive(password, salt) {
  const keyMaterial = await crypto.subtle.importKey('raw', strToBytes(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: HASH },
    keyMaterial,
    KEY_LENGTH,
  )
  return new Uint8Array(bits)
}

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const derived = await derive(password, salt)
  return `${b64urlEncode(salt)}:${b64urlEncode(derived)}`
}

export async function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false
  const [saltB64, hashB64] = stored.split(':')
  try {
    const salt = b64urlDecode(saltB64)
    const expected = b64urlDecode(hashB64)
    const actual = await derive(password, salt)
    return timingSafeEqualBytes(actual, expected)
  } catch {
    return false
  }
}