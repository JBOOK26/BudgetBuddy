import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

type AppThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemTheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const resolvedTheme: ResolvedTheme =
    preference === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<AppThemeContextValue>(
    () => ({
      preference,
      resolvedTheme,
      toggleTheme: () => {
        setPreference((current) => {
          if (current === 'system') return resolvedTheme === 'dark' ? 'light' : 'dark';
          return current === 'dark' ? 'light' : 'dark';
        });
      },
    }),
    [preference, resolvedTheme]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
}
