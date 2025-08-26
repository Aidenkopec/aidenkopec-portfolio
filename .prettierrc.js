/** @type {import("prettier").Config} */
module.exports = {
  // Formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',

  // JSX
  jsxSingleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Plugins for Next.js/React/Tailwind
  plugins: ['prettier-plugin-tailwindcss'],

  // Tailwind CSS class sorting
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'cva'],

  // File patterns
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.{json,md}',
      options: {
        tabWidth: 2,
      },
    },
  ],
};
