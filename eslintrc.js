module.exports = {
  // Environment configuration tells ESLint what global variables and APIs are available
  // This is crucial for preventing false positives when using browser APIs or Node.js features
  env: {
    browser: true, // Enables browser globals like window, document, localStorage
    node: true, // Enables Node.js globals like process, Buffer, __dirname
    commonjs: true, // Enables CommonJS module syntax (require, module.exports)
    es6: true, // Enables ES6+ features like const, let, arrow functions
    jest: true // Enables Jest testing globals like describe, it, expect
  },

  // Extended configurations provide pre-built rule sets
  // Order matters here - later configurations can override earlier ones
  extends: [
    'eslint:recommended', // Basic ESLint recommended rules for general JavaScript
    'next/core-web-vitals' // Next.js rules including React, performance, and accessibility
  ],

  // Parser configuration for modern JavaScript
  parser: '@babel/eslint-parser',
  
  // Parser options control how ESLint interprets your code
  // These settings ensure ESLint can understand modern JavaScript and JSX syntax
  parserOptions: {
    ecmaVersion: 'latest', // Use the latest ECMAScript features
    sourceType: 'module', // Enable ES6 module syntax (import/export)
    requireConfigFile: false, // Don't require a separate Babel config for ESLint
    babelOptions: {
      presets: ['@babel/preset-env', '@babel/preset-react']
    },
    ecmaFeatures: {
      jsx: true // Enable JSX parsing for React components
    }
  },

  // Global variables that should be available throughout your codebase
  // This prevents ESLint from flagging these as undefined variables
  globals: {
    VERSION: true, // Build-time version variable
    page: true, // Puppeteer page object for e2e tests
    browser: true // Puppeteer browser object for e2e tests
  },

  // Custom rules that override or supplement the extended configurations
  // These rules enforce your specific coding standards and preferences
  rules: {
    // Code formatting and style rules
    indent: ['error', 2, { SwitchCase: 1 }], // Enforce 2-space indentation with switch case handling
    'linebreak-style': ['error', 'unix'], // Enforce Unix line endings (LF) for consistency
    quotes: ['error', 'single'], // Enforce single quotes for string literals
    semi: ['warn', 'always'], // Warn when semicolons are missing (auto-fixable)

    // Code quality and debugging rules
    'no-console': 'off', // Allow console.log statements (helpful for debugging)
    'no-unused-vars': 'warn', // Warn about unused variables (helps catch dead code)
    'no-useless-escape': 'off', // Allow potentially unnecessary escapes (sometimes needed for readability)

    // Next.js and React specific rule adjustments
    // These fine-tune the behavior of rules from next/core-web-vitals
    'react/no-unescaped-entities': 'warn', // Warn instead of error for unescaped entities in JSX
    '@next/next/no-img-element': 'warn', // Warn when using <img> instead of Next.js Image component
    'react/react-in-jsx-scope': 'off', // Add this line to disable the rule for React 17+ JSX transform

    // Performance and best practices
    'prefer-const': 'error', // Enforce const for variables that are never reassigned
    'no-var': 'error', // Disallow var declarations (use let/const instead)
    'object-shorthand': 'warn', // Encourage object method and property shorthand

    // Import/export rules for better module organization
    'import/order': [
      'warn',
      {
        groups: [
          'builtin', // Node.js built-in modules
          'external', // npm packages
          'internal', // Your own modules
          'parent', // ../
          'sibling', // ./
          'index' // ./index
        ],
        'newlines-between': 'always' // Require blank lines between import groups
      }
    ]
  },

  // Override rules for specific file patterns
  // This allows different rules for different types of files
  overrides: [
    {
      // More relaxed rules for test files since they often need different patterns
      files: [
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__/**/*'
      ],
      rules: {
        'no-unused-vars': 'off', // Test files often have intentionally unused variables
        '@typescript-eslint/no-unused-vars': 'off' // Same for TypeScript test files
      }
    },
    {
      // Configuration files often need require() and have different structure
      files: ['*.config.js', '*.config.ts', '.eslintrc.js'],
      rules: {
        'import/order': 'off', // Config files don't need strict import ordering
        '@typescript-eslint/no-var-requires': 'off' // Allow require() in config files
      }
    }
  ]
};
