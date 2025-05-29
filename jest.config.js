import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// Create the Next.js Jest configuration function
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Define our comprehensive Jest configuration
const config: Config = {
  // Coverage configuration - using v8 for better performance with Next.js
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  
  // Dynamic test environment based on the UNIT environment variable
  // This preserves your existing dual-mode testing approach
  testEnvironment: (process.env.UNIT === 'TRUE') ? 'jsdom' : './test/puppeteer/vp-env.js',
  
  // Setup files - this runs after the test framework is set up but before tests run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Preset configuration - Next.js preset when doing unit tests, Puppeteer for integration tests
  preset: process.env.UNIT === 'TRUE' ? undefined : 'jest-puppeteer',
  
  // Global variables available in all test environments
  // The window object is particularly important for browser-like testing
  globals: {
    window: {}
  },

  // Module resolution configuration
  // This allows importing from 'src' directory using absolute paths
  moduleDirectories: [
    'node_modules',
    'src'
  ],

  // File extensions Jest should recognize
  // Extends defaults to include TypeScript declaration files
  moduleFileExtensions: [
    'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'
  ],

  // Module name mapping for handling non-JavaScript imports
  moduleNameMapper: {
    // Handle CSS imports by mocking them - essential for component testing
    '\\.(css|less|scss|sass)$': '<rootDir>/test/mocks/styleMock.js',
    
    // Handle static asset imports (images, fonts, etc.)
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/mocks/fileMock.js',
    
    // Preserve any existing Cloudinary mocking if needed
    // 'cloudinary-core': '<rootDir>/test/mocks/cloudinary-core-mock.js',
  },

  // Transform ignore patterns - handle ES modules that need transformation
  // This ensures modern npm packages work correctly in the Jest environment
  transformIgnorePatterns: [
    '/node_modules/(?!(@cloudinary/url-gen|other-es-modules-here)/)' 
  ],

  // Disable Watchman for more predictable file watching behavior
  watchman: false,

  // Test file detection patterns
  // Jest will look for files matching these patterns
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],

  // Additional helpful configurations for a robust testing environment
  
  // Clear mocks between tests to prevent test pollution
  clearMocks: true,
  
  // Restore mocks to their original implementation after each test
  restoreMocks: true,
  
  // Collect coverage from these file patterns (customize as needed)
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}', // Usually just re-exports
  ],

  // Coverage thresholds to maintain code quality (adjust percentages as needed)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Timeout for tests (helpful for Puppeteer tests which can take longer)
  testTimeout: process.env.UNIT === 'TRUE' ? 5000 : 30000,
};

// Export the configuration through Next.js's createJestConfig function
// This ensures Next.js can properly load its configuration and environment variables
export default createJestConfig(config);