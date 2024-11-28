import { defineConfig } from 'tsup';

export default defineConfig(() => ({
  entry: {
    index: './index.ts',
    email: './src/email/index.ts',
    phone: './src/phone/index.ts'
  },
  format: ['esm', 'cjs'],
  bundle: true,
  splitting: false,
  cjsInterop: true,
  skipNodeModulesBundle: true
}));
