import '@testing-library/jest-dom';

// Clean up after each test to prevent memory leaks
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  localStorage.clear();
});
