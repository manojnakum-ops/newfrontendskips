'use strict';

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
require('react-scripts/config/env');

// Keep CRA's production pipeline while bounding work per optimization task.
const configPath = require.resolve('react-scripts/config/webpack.config');
const createConfig = require(configPath);
require.cache[configPath].exports = environment => {
  const config = createConfig(environment);
  if (environment !== 'production') return config;

  config.parallelism = 16;
  config.optimization.splitChunks = {
    ...config.optimization.splitChunks,
    chunks: 'all',
    maxSize: 512 * 1024,
    maxInitialRequests: Infinity,
    maxAsyncRequests: Infinity,
  };
  for (const minimizer of config.optimization.minimizer) {
    if (minimizer.options && 'parallel' in minimizer.options) {
      minimizer.options.parallel = 1;
    }
  }
  return config;
};
