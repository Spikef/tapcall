const rootDir = __dirname;

const source = process.env.NODE_ENV === 'production' ? 'lib' : 'src';

module.exports = {
  rootDir,
  preset: 'ts-jest',
  testRegex: ['test/(.+)\\.spec\\.ts$'],
  moduleNameMapper: {
    '^common$': `<rootDir>/test/__common__`,
    '^tapcall(.*)$': `<rootDir>/${source}$1`,
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['src/**/*'],
};
