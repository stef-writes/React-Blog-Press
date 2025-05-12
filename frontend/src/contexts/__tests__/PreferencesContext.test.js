import { render, act } from '@testing-library/react';
import { PreferencesProvider, usePreferences } from '../PreferencesContext';

describe('PreferencesContext', () => {
  let result;

  const TestComponent = () => {
    result = usePreferences();
    return null;
  };

  test('default preferences are loaded', () => {
    render(
      <PreferencesProvider>
        <TestComponent />
      </PreferencesProvider>
    );

    expect(result.preferences.fontSize).toBe('base');
    expect(result.preferences.language).toBe('en');
  });

  test('updatePreference updates a single preference', () => {
    render(
      <PreferencesProvider>
        <TestComponent />
      </PreferencesProvider>
    );

    act(() => {
      result.updatePreference('fontSize', 'large');
    });

    expect(result.preferences.fontSize).toBe('large');
  });

  test('resetPreferences restores defaults', () => {
    render(
      <PreferencesProvider>
        <TestComponent />
      </PreferencesProvider>
    );

    act(() => {
      result.updatePreference('fontSize', 'small');
      result.resetPreferences();
    });

    expect(result.preferences.fontSize).toBe('base');
  });

  test('preferences persist to localStorage', () => {
    render(
      <PreferencesProvider>
        <TestComponent />
      </PreferencesProvider>
    );

    act(() => {
      result.updatePreference('language', 'es');
    });

    const storedPreferences = JSON.parse(localStorage.getItem('blog_preferences'));
    expect(storedPreferences.language).toBe('es');
  });
});
