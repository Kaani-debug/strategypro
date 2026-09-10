import { b64urlEncode, b64urlDecode, strToBytes, bytesToStr, timingSafeEqualBytes } from './util'

export const TOKEN_SECRET = 'strategypro-hs256-signing-key-v1'
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

async function signBytes(data) {
  const key = await crypto.subtle.importKey('raw', strToBytes(TOKEN_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, data)
  return new Uint8Array(sig)
}

export async function signToken(payload) {
  const now = Date.now()
  const body = { ...payload, iat: now, exp: now + TOKEN_TTL_MS }
  const header = b64urlEncode(strToBytes(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const claims = b64urlEncode(strToBytes(JSON.stringify(body)))
  const signature = b64urlEncode(await signBytes(strToBytes(`${header}.${claims}`)))
  return `${header}.${claims}.${signature}`
}

export async function verifyToken(token) {
  if (typeof token !== 'string' || token.split('.').length !== 3) return null
  const [header, claims, signature] = token.split('.')
  const expected = b64urlEncode(await signBytes(strToBytes(`${header}.${claims}`)))
  if (!timingSafeEqualBytes(b64urlDecode(signature), b64urlDecode(expected))) return null
  let body
  try {
    body = JSON.parse(bytesToStr(b64urlDecode(claims)))
  } catch {
    return null
  }
  if (typeof body.exp !== 'number' || body.exp < Date.now()) return null
  if (typeof body.sub !== 'string' || !body.role) return null
  return body
}