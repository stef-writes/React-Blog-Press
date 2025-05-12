import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

// Mock localStorage
beforeEach(() => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.style = '';
});

describe('ThemeContext', () => {
  let result;

  const TestComponent = () => {
    result = useTheme();
    return null;
  };

  test('default theme is light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(result.theme).toBe('light');
  });

  test('toggleTheme switches between light and dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      result.toggleTheme();
    });

    expect(result.theme).toBe('dark');

    act(() => {
      result.toggleTheme();
    });

    expect(result.theme).toBe('light');
  });

  test('theme persists to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      result.toggleTheme();
    });

    const storedTheme = window.localStorage.getItem('theme');
    expect(storedTheme).toBe('dark');
  });

  test('CSS variables are applied to document', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      result.toggleTheme();
    });

    const backgroundColor = document.documentElement.style.getPropertyValue('--background-color');
    expect(backgroundColor).toBe('#121212'); // Dark mode background
  });
});
