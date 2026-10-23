import { readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
const base = dirname(fileURLToPath(import.meta.url));
const sources = folder => readdirSync(folder, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? sources(join(folder, e.name)) : e.name.endsWith('.java') ? [join(folder, e.name)] : []);
const out = mkdtempSync(join(tmpdir(), 'tm-s05-dynamic-'));
try {
  execFileSync('javac', ['-encoding', 'UTF-8', '--release', '17', '-d', out, ...sources(join(base, 'src'))], { stdio: 'inherit' });
  execFileSync('java', ['-cp', out, 'test.DynamicModelTest'], { stdio: 'inherit' });
} finally { rmSync(out, { recursive: true, force: true }); }
