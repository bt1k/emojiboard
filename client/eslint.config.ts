import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // The `recommended-latest` rules have rules for the React Compiler, which is
  // enabled in this project.
  reactHooks.configs.flat['recommended-latest'],
]);
