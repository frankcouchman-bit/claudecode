#!/usr/bin/env node

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const outputZip = path.join(publicDir, 'seoscribe-fixed.zip');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const includedPaths = [
  'app',
  'components',
  'contexts',
  'lib',
  'public',
  'styles',
  'tailwind.config.ts',
  'postcss.config.js',
  'next.config.mjs',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'README.md',
  'netlify.toml',
];

const exclusions = [
  'public/seoscribe-fixed.zip',
  'node_modules/*',
  '.next/*',
  '.git/*',
  '*.log',
];

const checkZip = spawnSync('zip', ['-v'], { cwd: projectRoot, stdio: 'ignore' });
if (checkZip.error) {
  console.error('The `zip` command is required but was not found in your PATH.');
  process.exit(1);
}

const args = ['-r', outputZip, ...includedPaths, '-x', ...exclusions];
const result = spawnSync('zip', args, { cwd: projectRoot, stdio: 'inherit' });

if (result.status !== 0) {
  console.error('\nFailed to create the packaged frontend archive.');
  process.exit(result.status ?? 1);
}

console.log(`\nCreated ${path.relative(projectRoot, outputZip)}`);
