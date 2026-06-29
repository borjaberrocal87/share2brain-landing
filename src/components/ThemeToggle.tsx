import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  initialTheme?: 'light' | 'dark';
}

export function ThemeToggle({ initialTheme = 'light' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const ariaLabel = theme === 'dark' 
    ? 'Switch to light mode' 
    : 'Switch to dark mode';

  return (
    <button
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className="w-[38px] h-[38px] rounded-[10px] border flex items-center justify-center cursor-pointer transition-colors"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
      }}
    >
      {theme === 'dark' ? (
        <Sun size={18} strokeWidth={1.9} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={1.9} aria-hidden="true" />
      )}
    </button>
  );
}
