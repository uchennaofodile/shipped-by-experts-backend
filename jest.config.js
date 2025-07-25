module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/frontend/src/$1"
  },
  testMatch: [
    "<rootDir>/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/**/*.{spec,test}.[jt]s?(x)"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "backend/**/*.{js,jsx}",
    "frontend/src/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
