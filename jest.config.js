const rootDir = __dirname;

const source = process.env.NODE_ENV === 'production' ? 'lib' : 'src';

module.exports = {
  rootDir,
  preset: 'ts-jest',
  testRegex: ['test/(.+)\\.spec\\.ts$'],
  moduleNameMapper: {
    '^tapcall(.*)$': `<rootDir>/${source}$1`,
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['src/**/*'],
};
