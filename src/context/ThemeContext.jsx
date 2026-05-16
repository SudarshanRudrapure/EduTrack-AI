import { createContext, useContext, useState, useEffect } from "react";
import { DARK, LIGHT } from "../constants/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("ams_theme");
    return saved ? saved === "dark" : true; // default dark
  });

  const theme = isDark ? DARK : LIGHT;

  useEffect(() => {
    localStorage.setItem("ams_theme", isDark ? "dark" : "light");
    // Apply to body background
    document.body.style.background = theme.BG;
    document.body.style.color      = theme.TX1;
  }, [isDark, theme]);

  const toggleTheme = () => setIsDark(p => !p);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);