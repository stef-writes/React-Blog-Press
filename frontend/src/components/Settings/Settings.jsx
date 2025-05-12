// Import necessary hooks from React library
import { useTheme } from "../../contexts/ThemeContext"; // Import useTheme hook for theme settings
import { usePreferences } from "../../contexts/PreferencesContext"; // Import usePreferences hook for user preferences
import styles from "./Settings.module.css"; // Import CSS styles for the component

// Define the Settings functional component
function Settings() {
  // Access the theme context using the useTheme hook
  const { theme, toggleTheme } = useTheme();
  // Access the preferences context using the usePreferences hook
  const { preferences, updatePreference, resetPreferences } = usePreferences();

    // Render the component JSX
  return (
    <div className={styles.settings}>
      <h2 className={styles.settingsTitle}>Settings</h2>{/* Settings title */}

      <section className={styles.settingsSection}> {/* Theme settings section */}
        <h3 className={styles.settingsSubtitle}>Theme</h3> {/* Theme subtitle */}
        <label className={styles.settingItem}> {/* Dark mode setting */}
          <span>Dark Mode</span> {/* Label for dark mode */}
          <input
            type="checkbox" // Use a checkbox input for toggling dark mode
            checked={theme === "dark"} // Check the box if the current theme is dark
            onChange={toggleTheme} // Call the toggleTheme function when the checkbox value changes
          />
        </label>
      </section>

      <section className={styles.settingsSection}> {/* Preferences settings section */}
        <h3 className={styles.settingsSubtitle}>Preferences</h3> {/* Preferences subtitle */}

        {/* Font Size Preference */}
        <label className={styles.settingItem}> {/* Font size setting */}
          <span>Font Size</span> {/* Label for font size */}
          <select // Use a select input for choosing font size
            value={preferences.fontSize} // Set the current font size from preferences
            onChange={(e) => // Update font size preference when the select value changes
              updatePreference("fontSize", e.target.value)
            }
          >
                        {/* Font size options */}
            <option value="small">Small</option>
            <option value="base">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>

        {/* Reduced Motion Preference */}
        <label className={styles.settingItem}> {/* Reduced motion setting */}
          <span>Reduced Motion</span> {/* Label for reduced motion */}
          <input
            type="checkbox" // Use a checkbox input for toggling reduced motion
            checked={preferences.reducedMotion} // Check the box if reduced motion is enabled in preferences
            onChange={(e) => // Update reduced motion preference when the checkbox value changes
              updatePreference("reducedMotion", e.target.checked)
            }
          />
        </label>

        {/* Language Preference */}
        <label className={styles.settingItem}>
          <span>Language</span> {/* Label for Language */}
          <select // Use a select input for choosing Language
            value={preferences.language} // Set the current Language from preferences
            onChange={(e) => // Update Language preference when the select value changes
              updatePreference("language", e.target.value)
            }
          >
                        {/* Language options */}
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>

        {/* Layout Density Preference */}
        <label className={styles.settingItem}> {/* Layout Density setting */}
          <span>Layout Density</span> {/* Label for layout density */}
          <select // Use a select input for choosing layout density
            value={preferences.layoutDensity} // Set the current layout density from preferences
            onChange={(e) => // Update layout density preference when the select value changes
              updatePreference("layoutDensity", e.target.value)
            }
          >
                        {/* Layout Density options */}
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </label>
      </section>

      {/* Button to reset preferences to default values */}
      <button
        onClick={resetPreferences} // Call the resetPreferences function when clicked
        className={styles.resetButton}
      >
        Reset to Defaults {/* Button Label */}
      </button>
    </div>
  );
}

// Export the Settings component as the default export
export default Settings;
