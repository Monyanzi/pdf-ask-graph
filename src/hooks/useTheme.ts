import { useState, useEffect } from 'react';

export type Theme = 'theme-dark' | 'theme-light';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('theme-dark');

  useEffect(() => {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('runwai-theme') as Theme;
    const initialTheme = savedTheme || 'theme-dark';
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('runwai-theme', newTheme);
  };

  return { theme, toggleTheme, isDark: theme === 'theme-dark' };
};