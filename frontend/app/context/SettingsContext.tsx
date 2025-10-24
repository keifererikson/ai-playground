'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSettings, updateSettings, Settings, UpdateSettingsPayload } from '@/app/lib/api';


interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  saveSettings: (payload: UpdateSettingsPayload) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialSettings();
  }, []);

  const saveSettings = async (payload: UpdateSettingsPayload) => {
    if (!settings) return;
    try {
      const updatedSettings = await updateSettings(payload);
      setSettings(updatedSettings);
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  };

  const value = { settings, isLoading, error, saveSettings };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

