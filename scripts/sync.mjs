import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (!existsSync('.git')) throw new Error('Run this command from a clone of the kyc001 profile repository.');

execFileSync('git', ['pull', '--rebase'], { stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/collect-usage.mjs'], { stdio: 'inherit' });
execFileSync('git', ['add', 'data/devices'], { stdio: 'inherit' });

try {
  execFileSync('git', ['diff', '--cached', '--quiet'], { stdio: 'inherit' });
  console.log('AI workbench data is already current.');
} catch {
  execFileSync('git', ['commit', '-m', 'chore: sync AI workbench usage'], { stdio: 'inherit' });
  execFileSync('git', ['push'], { stdio: 'inherit' });
}
