import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Setiap fitur baru di src/features/ harus didaftarkan di sini agar larangan
// impor antar-fitur berlaku (docs/ARCHITECTURE.md bagian 2).
const FEATURES = ['contact', 'blog', 'admin', 'portfolio'];

const featurePaths = (names) =>
  names.flatMap((name) => [`@/features/${name}`, `@/features/${name}/**`]);

const noCrossFeatureImports = FEATURES.map((feature) => ({
  files: [`src/features/${feature}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: featurePaths(FEATURES.filter((other) => other !== feature)),
            message:
              'Fitur tidak boleh mengimpor fitur lain. Naikkan kode bersama ke components/shared atau lib/.',
          },
        ],
      },
    ],
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...noCrossFeatureImports,
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/lib/**/*.{ts,tsx}', 'src/i18n/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/features/**'],
              message: 'Kode global tidak boleh bergantung pada fitur.',
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'docs/**',
    'drizzle/**',
  ]),
]);

export default eslintConfig;
