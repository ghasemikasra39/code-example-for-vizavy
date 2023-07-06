const { defaults } = require('jest-config');

const expoPreset = require('jest-expo/jest-preset');
// const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = Object.assign(expoPreset, {
  /**
   *   A preset that is used as a base for Jest's configuration.
   *   A preset should point to an npm module that has a jest-preset.json
   *   or jest-preset.js file at the root.
   */
  preset: 'react-native',
  /**
   * The pattern or patterns Jest uses to detect test files.
   * By default it looks for .js, .jsx, .ts and .tsx files inside of
   * __tests__ folders, as well as any files with a suffix of .test or .spec
   */
  testRegex: '(/__tests__/.*(\\.|/)(test|spec))\\.[jt]sx?$',
  /**
   * A list of paths to modules that run some code to configure or set up
   * the testing environment. Each setupFile will be run once per test file.
   * Since every test runs in its own environment, these scripts will be
   * executed in the testing environment immediately before executing
   * the test code itself.
   */
  setupFiles: [
    ...expoPreset.setupFiles,
    './setup-tests.js',
  ],
  /**
   * An array of regexp pattern strings that are matched against all source
   * file paths before transformation. If the test path matches any of the
   * patterns, it will not be transformed.
   */
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@sentry/react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|unimodules-permissions-interface|@mollie/.*)',
  ],
  /**
   * Indicates whether the coverage information should be collected while
   * executing the test. Because these retrofits all executed files with
   * coverage collection statements, it may significantly slow down your
   * tests.
   */
  collectCoverage: false,
  /**
   * An array of glob patterns indicating a set of files for which coverage
   * information should be collected. If a file matches the specified glob
   * pattern, coverage information will be collected for it even if no tests
   * exist for this file and it's never required in the test suite.
   */
  collectCoverageFrom: ['App.tsx', 'src/**/*.{tsx}', '!node_modules/**/*'],
  /**
   * An array of file extensions your modules use. If you require modules
   * without specifying a file extension, these are the extensions Jest will
   * look for, in left-to-right order.
   */
  moduleFileExtensions: ['ts', 'tsx', ...defaults.moduleFileExtensions],
  /**
   * An array of regexp pattern strings that are matched against all module
   * paths before those paths are to be considered 'visible' to the module
   * loader. If a given module's path matches any of the patterns, it will
   * not be require()-able in the test environment.
   */
  modulePathIgnorePatterns: ['.yarn_cache'],
  /**
   * A list of paths to modules that run some code to configure or set up
   * the testing framework before each test file in the suite is executed.
   * Since setupFiles executes before the test framework is installed in the
   * environment, this script file presents you the opportunity of running
   * some code immediately after the test framework has been installed in
   * the environment.
   */
  setupFilesAfterEnv: ['./__tests__/bootstrapTests.ts'],
});
