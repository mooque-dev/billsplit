#!/usr/bin/env node
// Encrypts a roster chart (text) into roster.enc.json using a password.
//   node tools/encrypt-roster.mjs [input.txt] [output.json]
// Defaults: roster.local.txt -> roster.enc.json. The password is typed (hidden)
// or taken from the ROSTER_PASSWORD env var. AES-256-GCM, key from PBKDF2-SHA256.
// The output is safe to commit, but anyone can try passwords offline:
// use a LONG passphrase (4+ random words).
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as c } from 'node:crypto';
import readline from 'node:readline';

const [input = 'roster.local.txt', output = 'roster.enc.json'] = process.argv.slice(2);
const ITER = 600000;

function askHidden(q) {
  return new Promise(res => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = () => {};
    process.stdout.write(q);
    rl.question('', a => { rl.close(); process.stdout.write('\n'); res(a); });
  });
}
const b64 = u8 => Buffer.from(u8).toString('base64');

let pw = process.env.ROSTER_PASSWORD;
if (!pw) {
  pw = await askHidden('Password: ');
  if (pw !== await askHidden('Repeat password: ')) { console.error('Passwords do not match.'); process.exit(1); }
}
if (pw.length < 12) console.warn('Warning: short password. Use a long passphrase; the encrypted file is public.');

const salt = c.getRandomValues(new Uint8Array(16)), iv = c.getRandomValues(new Uint8Array(12));
const base = await c.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
const key = await c.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const data = new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv }, key, readFileSync(input)));
writeFileSync(output, JSON.stringify({ v: 1, kdf: 'PBKDF2-SHA256', iter: ITER, salt: b64(salt), iv: b64(iv), data: b64(data) }) + '\n');
console.log(`Wrote ${output} (${data.length} bytes). Commit it; keep ${input} private.`);
