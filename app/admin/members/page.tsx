'use client';
import { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';

type Member = {
  id: number; member_number: number; full_name: string; phone: string;
  city: string; district: string; interest_area: string; created_at: string;
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  useEffect(() => {
    fetch('/api/members/recent?limit=1000')
      .then(r => r.json())
      .then(d => { setMembers(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const exportCSV = () => {
    const headers = ['Member #', 'Name', 'Phone', 'City', 'District', 'Interest', 'Joined'];
    const rows = filtered.map(m => [
      m.member_number, m.full_name, m.phone, m.city, m.district, m.interest_area,
      new Date(m.created_at).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const districts = [...new Set(members.map(m => m.district))].sort();

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.full_name.toLowerCase().includes(q) || m.phone.includes(q) || m.city.toLowerCase().includes(q);
    const matchDistrict = !districtFilter || m.district === districtFilter;
    return matchSearch && matchDistrict;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">Members</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{members.length} total members · {filtered.length} shown</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 bg-[#0D0D0D] hover:bg-[#FF6F00] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, city..."
            className="w-full border border-[#E8E8E8] rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors" />
        </div>
        <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}
          className="border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors">
          <option value="">All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F5F5] border-b border-[#E8E8E8]">
                <tr>
                  {['#', 'Name', 'Phone', 'City', 'District', 'Interest', 'Joined'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b border-[#E8E8E8] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#F5F5F5]/40'}`}>
                    <td className="px-4 py-3 font-mono text-[#FF6F00] font-bold text-xs">#{m.member_number}</td>
                    <td className="px-4 py-3 font-medium text-[#0D0D0D] whitespace-nowrap">{m.full_name}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{m.phone}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{m.city}</td>
                    <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{m.district}</td>
                    <td className="px-4 py-3">
                      <span className="bg-[#F5F5F5] text-[#0D0D0D] text-xs px-2 py-0.5 rounded-full border border-[#E8E8E8] whitespace-nowrap">
                        {m.interest_area}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6B6B6B] text-xs whitespace-nowrap">
                      {new Date(m.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#6B6B6B] text-sm">No members match your search.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
