'use strict';

const { spawnSync } = require('node:child_process');

// Use environment variables so the heap limit also reaches minifier workers.
const env = {
  ...process.env,
  GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP || 'false',
  DISABLE_ESLINT_PLUGIN: process.env.DISABLE_ESLINT_PLUGIN || 'true',
};
if (!/--max[-_]old[-_]space[-_]size(?:=|\s)/.test(env.NODE_OPTIONS || '')) {
  env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --max-old-space-size=4096`.trim();
}

const result = spawnSync(process.execPath, [
  '--no-experimental-webstorage',
  '--require', require.resolve('./production-webpack.cjs'),
  require.resolve('react-scripts/scripts/build'),
  ...process.argv.slice(2),
], { env, stdio: 'inherit' });

if (result.error) console.error(result.error.message);
if (result.signal) console.error(`Production build stopped by ${result.signal}.`);
process.exit(result.status === null ? 1 : result.status);
