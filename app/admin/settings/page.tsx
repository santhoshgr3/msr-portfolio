'use client';
import { useState, useEffect } from 'react';
import { Save, Phone, Mail, Globe, MapPin, Camera, Play, Share2, AtSign, Send, MessageCircle, Briefcase } from 'lucide-react';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/lib/supabase';

const TOKEN = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025';

type FieldDef = { key: keyof SiteSettings; label: string; placeholder: string; icon: React.ReactNode };

const CONTACT_FIELDS: FieldDef[] = [
  { key: 'phone',           label: 'Phone (display)',      placeholder: '+91 8886388264',              icon: <Phone size={15} /> },
  { key: 'whatsapp_number', label: 'WhatsApp number',      placeholder: '918886388264 (digits only)',  icon: <MessageCircle size={15} /> },
  { key: 'email',           label: 'Email',                placeholder: 'team@example.com',            icon: <Mail size={15} /> },
  { key: 'website',         label: 'Website',              placeholder: 'https://…',                   icon: <Globe size={15} /> },
  { key: 'address',         label: 'Address / Location',   placeholder: 'Bhupalpally, Telangana',      icon: <MapPin size={15} /> },
];

const SOCIAL_FIELDS: FieldDef[] = [
  { key: 'instagram_url',         label: 'Instagram URL',         placeholder: 'https://instagram.com/…',     icon: <Camera size={15} /> },
  { key: 'instagram_handle',      label: 'Instagram handle',      placeholder: '@handle',                     icon: <AtSign size={15} /> },
  { key: 'youtube_url',           label: 'YouTube URL',           placeholder: 'https://youtube.com/@…',      icon: <Play size={15} /> },
  { key: 'youtube_handle',        label: 'YouTube handle',        placeholder: '@handle',                     icon: <AtSign size={15} /> },
  { key: 'facebook_url',          label: 'Facebook URL',          placeholder: 'https://facebook.com/…',      icon: <Share2 size={15} /> },
  { key: 'twitter_url',           label: 'X / Twitter URL',       placeholder: 'https://x.com/…',             icon: <AtSign size={15} /> },
  { key: 'telegram_url',          label: 'Telegram URL',          placeholder: 'https://t.me/…',              icon: <Send size={15} /> },
  { key: 'linkedin_url',          label: 'LinkedIn URL',          placeholder: 'https://linkedin.com/in/…',   icon: <Briefcase size={15} /> },
  { key: 'whatsapp_community_url', label: 'WhatsApp Community link', placeholder: 'https://chat.whatsapp.com/…', icon: <MessageCircle size={15} /> },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((d: SiteSettings) => { if (d) setSettings(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: keyof SiteSettings, value: string) =>
    setSettings(s => ({ ...s, [key]: value }));

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': TOKEN },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSettings(data);
      setMsg({ type: 'success', text: 'Settings saved ✓ Changes are live across the site.' });
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : 'Save failed' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const inputCls = 'w-full border border-[#E8E8E8] rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors';

  const renderField = (f: FieldDef) => (
    <div key={f.key}>
      <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{f.label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">{f.icon}</span>
        <input
          value={(settings[f.key] as string) ?? ''}
          onChange={e => set(f.key, e.target.value)}
          placeholder={f.placeholder}
          className={inputCls}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0D0D0D]">Site Settings</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          Contact details &amp; social links shown in the footer, contact page, and media page. Changes go live instantly.
        </p>
      </div>

      {msg && (
        <div className={`mb-5 text-sm px-4 py-3 rounded-xl font-semibold ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 sm:p-6 mb-5">
        <h2 className="font-bold text-[#0D0D0D] mb-4">Contact Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {CONTACT_FIELDS.map(renderField)}
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 sm:p-6 mb-5">
        <h2 className="font-bold text-[#0D0D0D] mb-1">Social Media</h2>
        <p className="text-xs text-[#6B6B6B] mb-4">Leave a field blank to hide that icon across the site.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map(renderField)}
        </div>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#FF6F00]/25"
        >
          <Save size={16} /> {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
