import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import resolve from  '@rollup/plugin-node-resolve'

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/pinia-persisted-state.js',
      format: 'cjs',
    },
    {
      file: 'dist/pinia-persisted-state.min.js',
      format: 'iife',
      name: 'Persist',
      plugins: [terser()],
    },
    {
      file: 'dist/pinia-persisted-state.esm.js',
      format: 'esm',
    },
  ],
  plugins: [resolve(), json(), typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: '.',
    rootDir: './src',
  })],
})
