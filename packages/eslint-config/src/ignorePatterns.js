const ignorePatterns = [
  '!.eslintrc.cjs',
  '!eslint.config.js',
  'node_modules',
  '.pnp',
  '.pnp.js',
  'coverage',
  '.next/',
  'out/',
  'build',
  'dist/',
  '**/CHANGELOG.md',
  'packages/', // Prevent linting from workspace roots
  '.turbo',
  '.vercel',
  '.pnp.*',
  '.yarn/*'
];

export default ignorePatterns;
