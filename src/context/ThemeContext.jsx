import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  DARK,
  LIGHT,
} from "../constants/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [isDark, setIsDark] = useState(() => {
    const saved =
      localStorage.getItem("ams_theme");

    return saved
      ? saved === "dark"
      : true;
  });

  // Active Theme
  const theme = isDark ? DARK : LIGHT;

  // Apply theme globally
  useEffect(() => {

    // Save theme preference
    localStorage.setItem(
      "ams_theme",
      isDark ? "dark" : "light"
    );

    // Body styles
    document.body.style.background =
      theme.BG;

    document.body.style.color =
      theme.TX1;

    document.body.style.transition =
      "background 0.25s ease, color 0.25s ease";

    // CSS Variables
    const root =
      document.documentElement;

    root.style.setProperty(
      "--bg",
      theme.BG
    );

    root.style.setProperty(
      "--srf",
      theme.SRF
    );

    root.style.setProperty(
      "--crd",
      theme.CRD
    );

    root.style.setProperty(
      "--crd2",
      theme.CRD2
    );

    root.style.setProperty(
      "--bd",
      theme.BD
    );

    root.style.setProperty(
      "--bd2",
      theme.BD2
    );

    root.style.setProperty(
      "--tx1",
      theme.TX1
    );

    root.style.setProperty(
      "--tx2",
      theme.TX2
    );

    root.style.setProperty(
      "--tx3",
      theme.TX3
    );

  }, [isDark, theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  return useContext(ThemeContext);
};