'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, RefreshCw } from 'lucide-react';

type Submission = {
  id: number; name: string; email: string; phone: string; message: string; created_at: string;
};

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/contact', { headers: adminHeaders() })
      .then(r => r.json())
      .then(d => { setSubmissions(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(load, []);

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">Contact Inbox</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{submissions.length} submission{submissions.length !== 1 ? 's' : ''} from the contact form</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] transition-all" title="Refresh">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-16 text-center">
          <Mail size={32} className="mx-auto mb-3 text-[#E8E8E8]" />
          <p className="text-[#6B6B6B] text-sm">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F5F5F5]/50 transition-colors"
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#FF6F00]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#FF6F00] font-black text-sm">{s.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[#0D0D0D] text-sm">{s.name}</div>
                    <div className="text-[#6B6B6B] text-xs truncate mt-0.5">{s.message.slice(0, 80)}…</div>
                  </div>
                </div>
                <div className="text-[#6B6B6B] text-xs shrink-0 ml-4">
                  {new Date(s.created_at).toLocaleDateString('en-IN')}
                </div>
              </button>

              {expanded === s.id && (
                <div className="px-5 pb-5 border-t border-[#E8E8E8] pt-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {s.email && (
                      <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 text-xs text-[#0369A1] hover:underline">
                        <Mail size={11} /> {s.email}
                      </a>
                    )}
                    {s.phone && (
                      <a href={`tel:${s.phone}`} className="flex items-center gap-1.5 text-xs text-[#0369A1] hover:underline">
                        <Phone size={11} /> {s.phone}
                      </a>
                    )}
                    <span className="text-xs text-[#6B6B6B]">
                      {new Date(s.created_at).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-xl p-4 text-sm text-[#3D3D3D] leading-relaxed whitespace-pre-wrap">
                    {s.message}
                  </div>
                  {s.email && (
                    <a href={`mailto:${s.email}?subject=Re: Your message to Sunny Anna Yuvasena`}
                      className="mt-3 inline-flex items-center gap-2 bg-[#0D0D0D] hover:bg-[#FF6F00] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      <Mail size={11} /> Reply by Email
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
