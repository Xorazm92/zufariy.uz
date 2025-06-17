import React, { createContext, useState, useEffect } from 'react';

// Context yaratamiz
export const ThemeContext = createContext();

// Provider komponentini yaratamiz
export const ThemeProvider = ({ children }) => {
  // Mavzuni saqlash uchun state. Brauzer xotirasidan olingan yoki standart 'light' mavzu
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Mavzu o'zgarganda ishlaydigan effekt
  useEffect(() => {
    // body elementiga 'data-theme' atributini o'rnatamiz
    document.body.setAttribute('data-theme', theme);
    // Tanlangan mavzuni brauzer xotirasiga saqlaymiz
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Mavzuni o'zgartiruvchi funksiya
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
