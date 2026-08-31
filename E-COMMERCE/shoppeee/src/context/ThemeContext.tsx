import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_STORAGE_KEY = "nova_dark_mode_enabled";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    return false;
  });

  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(value));
    }
  };

  const value = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};