import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Next.js essentials
      '@next/next/no-img-element': 'warn',

      // TypeScript essentials (relaxed)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      // The regression guard for Phase 5. This was 'off', which is why 32
      // explicit `any` accumulated without the lint ever failing.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'warn',

      // React essentials
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'warn',

      // Accessibility. These are the rules that would have caught the Phase 4
      // findings: icon only buttons with no name, and a clickable div with no
      // keyboard path.
      // Form fields are covered by label-has-associated-control below. This
      // rule only looks inside the control's own subtree, so it cannot see a
      // label attached with htmlFor and flags every correct input.
      'jsx-a11y/control-has-associated-label': [
        'error',
        { ignoreElements: ['input', 'textarea', 'select', 'audio', 'video'] },
      ],
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/anchor-is-valid': 'error',

      // General
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',

      // Import order (auto-fixable)
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always-and-inside-groups',
        },
      ],
    },
  },
];

export default eslintConfig;
