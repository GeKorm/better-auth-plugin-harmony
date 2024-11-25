const extraneous = {
  devDependencies: [
    '**/.eslintrc.cjs', // eslint
    '**/eslint.config.js', // eslint
    '**/.d.ts', // typescript definitions
    'babel.config.cjs', // babel
    'config/**/*.{mjs,ts}', // webpack loaders etc
    'codegen.ts', // graphql code generator
    '.storybook/*.{js,ts,tsx}', // storybook
    '**/manager.ts',
    '**/*.stories.{mjs,js,jsx,ts,tsx}', // storybook
    'src/dev/**', // non-production utilities
    '**/*.test.{mjs,js,jsx,ts,tsx}', // tests
    'test/**', // tape, common npm pattern
    'tests/**', // also common npm pattern
    'src/tests/**', // in our packages
    'spec/**', // mocha, rspec-like pattern
    '**/__tests__/**/*', // jest pattern
    '**/__mocks__/**/*', // jest pattern
    '**/mocks/**/*', // msw and other mock data
    'test.{js,jsx}', // repos with a single test file
    'test-*.{js,jsx}', // repos with multiple top-level test files
    '**/*{.,_}{test,spec}.{mjs,js,jsx,ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
    '**/jest.config.{js,ts}', // jest config
    '**/jest.setup.{js,ts}', // jest setup
    '**/vue.config.js', // vue-cli config
    '**/webpack.config.{js,ts}', // webpack config
    '**/webpack.config.*.{js,ts}', // webpack config
    '**/rollup.config.js', // rollup config
    '**/rollup.config.*.js', // rollup config
    '**/gulpfile.js', // gulp config
    '**/gulpfile.*.js', // gulp config
    '**/Gruntfile{,.js}', // grunt config
    '**/protractor.conf.js', // protractor config
    '**/protractor.conf.*.js', // protractor config
    '**/karma.conf.js', // karma config
    '**/.eslintrc.js' // eslint config
  ],
  optionalDependencies: false
};

export default extraneous;
