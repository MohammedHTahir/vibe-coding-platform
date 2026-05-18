#!/usr/bin/env node
// Pushes each line of .env.production.tmp to Vercel as an environment
// variable for production, preview, and development.
//
// Usage:  node scripts/push-vercel-env.mjs
//
// Re-running is safe — `vercel env add --force` overwrites existing values.

import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'

const ENV_FILE = process.argv[2] ?? '.env.production.tmp'
const TARGETS = ['production', 'preview', 'development']

function runVercel(name, target, value) {
  return new Promise((resolve) => {
    const child = spawn(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      [
        '-y',
        'vercel',
        'env',
        'add',
        name,
        target,
        '--value',
        value,
        '--force',
        '--yes',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'], shell: true }
    )
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (b) => (stdout += b.toString()))
    child.stderr.on('data', (b) => (stderr += b.toString()))
    child.on('close', (code) => {
      resolve({
        ok: code === 0,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      })
    })
  })
}

const raw = await readFile(ENV_FILE, 'utf8')
const entries = raw
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => {
    const i = l.indexOf('=')
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })

console.log(`Pushing ${entries.length} env vars × ${TARGETS.length} targets…\n`)

let failures = 0
for (const [name, value] of entries) {
  const results = await Promise.all(
    TARGETS.map((t) => runVercel(name, t, value).then((r) => ({ ...r, t })))
  )
  for (const r of results) {
    const status = r.ok ? '✓' : '✗'
    console.log(`  ${status} ${name} [${r.t}]`)
    if (!r.ok) {
      failures++
      const msg = (r.stderr || r.stdout).split(/\r?\n/).slice(-3).join(' | ')
      console.log(`      ${msg}`)
    }
  }
}

console.log()
if (failures === 0) {
  console.log('✅ All env vars pushed.')
} else {
  console.log(`⚠️  ${failures} failures. Run \`vercel env ls\` to verify.`)
  process.exit(1)
}
