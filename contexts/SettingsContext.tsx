'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/lib/supabase';

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((d: SiteSettings) => { if (d && d.id) setSettings(d); })
      .catch(() => {});
  }, []);

  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);

/** Build a wa.me link from a stored whatsapp number (digits only). */
export const waLink = (num: string, text?: string) => {
  const digits = (num || '').replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};
