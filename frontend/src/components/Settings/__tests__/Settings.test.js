import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../../Settings/Settings';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { PreferencesProvider } from '../../../contexts/PreferencesContext';

const renderWithProviders = (ui) =>
  render(
    <ThemeProvider>
      <PreferencesProvider>{ui}</PreferencesProvider>
    </ThemeProvider>
  );

describe('Settings Component', () => {
  test('renders settings page', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  test('updates font size preference', () => {
    renderWithProviders(<Settings />);
    const select = screen.getByLabelText(/font size/i);

    fireEvent.change(select, { target: { value: 'large' } });
    expect(select.value).toBe('large');
  });

  test('reset button restores preferences to default', () => {
    renderWithProviders(<Settings />);
    const resetButton = screen.getByText(/reset to defaults/i);

    fireEvent.click(resetButton);

    const fontSizeSelect = screen.getByLabelText(/font size/i);
    expect(fontSizeSelect.value).toBe('base'); // Default value
  });

  test('toggles dark mode', () => {
    renderWithProviders(<Settings />);
    const darkModeToggle = screen.getByLabelText(/dark mode/i);

    fireEvent.click(darkModeToggle);
    expect(darkModeToggle.checked).toBe(true); // Dark mode enabled

    fireEvent.click(darkModeToggle);
    expect(darkModeToggle.checked).toBe(false); // Dark mode disabled
  });
});
