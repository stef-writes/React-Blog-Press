module.exports = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  coverageDirectory: "coverage",
  moduleDirectories: ["node_modules", "src"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  testTimeout: 10000, // Optional: Increase test timeout
};
