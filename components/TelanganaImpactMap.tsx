'use client';
import { useState } from 'react';

/*
  Image: public/telangana-map.png  (227 × 222 px)
  viewBox: 0 0 500 490  (maps ≈ 2.2× the raw image)

  Coordinate formula (calibrated to Telangana's actual bounds):
    lon range: 76.8°E → 81.4°E  (4.6°  → 460 px at scale 100 px/°)
    lat range: 15.8°N → 19.9°N  (4.1°  → 451 px at scale 110 px/°)
    x = 20 + (lon − 76.8) × 100
    y = 20 + (19.9 − lat) × 110
*/

type Pillar = 'youth' | 'women' | 'health' | 'education' | 'all';

const PILLAR_META: Record<Pillar, { color: string; label: string; emoji: string }> = {
  youth:     { color: '#FF6F00', label: 'Youth Empowerment', emoji: '⚡' },
  women:     { color: '#E65100', label: 'Women Empowerment', emoji: '👩' },
  health:    { color: '#0D9488', label: 'Healthcare',         emoji: '🏥' },
  education: { color: '#3B82F6', label: 'Education',          emoji: '📚' },
  all:       { color: '#FF6F00', label: 'All 4 Pillars',      emoji: '🌟' },
};

type District = {
  id:        number;
  name:      string;
  x:         number;
  y:         number;
  impact?:   { pillar: Pillar; label: string; programs: string[] };
  isHQ?:     boolean;
  isCapital?: boolean;
};

/*
  x = 20 + (lon − 76.8) × 100
  y = 20 + (19.9 − lat) × 110
*/
const DISTRICTS: District[] = [
  { id:  1, name: 'Adilabad',               x:  67, y:  45,
    impact: { pillar: 'youth', label: 'Tribal Youth Programs',
      programs: ['Vocational skill certification', 'Scholarship support for ST/SC students', 'Career counselling drives'] } },
  { id:  2, name: 'Komaram Bheem Asifabad', x: 300, y:  57 },
  { id:  3, name: 'Mancherial',             x: 287, y: 133 },
  { id:  4, name: 'Nirmal',                 x: 175, y: 140 },
  { id:  5, name: 'Nizamabad',              x: 150, y: 155,
    impact: { pillar: 'women', label: 'Women SHG Programs',
      programs: ['Self-Help Group formation', 'Microfinance & livelihood training', 'Legal awareness camps'] } },
  { id:  6, name: 'Jagtial',               x: 232, y: 141 },
  { id:  7, name: 'Peddapalli',            x: 276, y: 163 },
  { id:  8, name: 'Karimnagar',            x: 255, y: 182,
    impact: { pillar: 'education', label: 'Scholarship & Education Drives',
      programs: ['EAMCET coaching camps', 'School infrastructure support', 'Book & stationery kit distribution'] } },
  { id:  9, name: 'Rajanna Sircilla',      x: 224, y: 185 },
  { id: 10, name: 'Kamareddy',             x: 175, y: 194 },
  { id: 11, name: 'Siddipet',              x: 225, y: 218 },
  { id: 12, name: 'Medak',                 x: 167, y: 224 },
  { id: 13, name: 'Jayashankar Bhupalpally', x: 330, y: 182, isHQ: true,
    impact: { pillar: 'all', label: 'Movement HQ — All 4 Pillars',
      programs: ['Youth leadership summits', 'Women SHG programs', 'Free medical camps', 'School support drives'] } },
  { id: 14, name: 'Mulugu',               x: 365, y: 208 },
  { id: 15, name: 'Hanamkonda',           x: 293, y: 228 },
  { id: 16, name: 'Warangal',             x: 307, y: 240,
    impact: { pillar: 'youth', label: 'Youth Sports & Cultural Programs',
      programs: ['Inter-district sports meets', 'Youth leadership workshops', 'Cultural festival participation'] } },
  { id: 17, name: 'Jangaon',              x: 256, y: 260 },
  { id: 18, name: 'Sangareddy',           x: 135, y: 271 },
  { id: 19, name: 'Medchal-Malkajgiri',  x: 196, y: 268 },
  { id: 20, name: 'Hyderabad',            x: 188, y: 297, isCapital: true,
    impact: { pillar: 'all', label: 'Cultural Events & Medical Camps',
      programs: ['Silver Show India 2025', 'Ganesha Mantapas cultural work', 'Bonalu celebrations & camps', 'Free health screening camps'] } },
  { id: 21, name: 'Rangareddy',           x: 140, y: 317,
    impact: { pillar: 'health', label: 'Healthcare & Social Programs',
      programs: ['Wheelchair distribution drives', 'Blood donation camps', 'Community health awareness'] } },
  { id: 22, name: 'Vikarabad',            x: 130, y: 303 },
  { id: 23, name: 'Yadadri Bhuvanagiri', x: 241, y: 273 },
  { id: 24, name: 'Nalgonda',             x: 267, y: 334,
    impact: { pillar: 'health', label: 'Free Medical Camps',
      programs: ['Village health consultations', 'Maternal & child health workshops', 'Nutrition awareness campaigns'] } },
  { id: 25, name: 'Suryapet',             x: 302, y: 323 },
  { id: 26, name: 'Mahabubabad',          x: 339, y: 273 },
  { id: 27, name: 'Khammam',              x: 355, y: 312,
    impact: { pillar: 'youth', label: 'Community Sports & Education',
      programs: ['Sports talent development', 'Bridge courses for dropouts', 'Civic awareness workshops'] } },
  { id: 28, name: 'Bhadradri Kothagudem', x: 402, y: 279 },
  { id: 29, name: 'Narayanpet',           x:  90, y: 369 },
  { id: 30, name: 'Mahabubnagar',         x: 138, y: 369,
    impact: { pillar: 'education', label: 'Girl Education Programs',
      programs: ['Girl scholarship support', 'Adult literacy camps', 'Digital education access kiosks'] } },
  { id: 31, name: 'Nagarkurnool',         x: 172, y: 396 },
  { id: 32, name: 'Wanaparthy',           x: 126, y: 409 },
  { id: 33, name: 'Jogulamba Gadwal',     x: 120, y: 424 },
];

const IMPACT = DISTRICTS.filter((d) => !!d.impact);
const PILLAR_KEYS = (['youth', 'women', 'health', 'education'] as Pillar[]);

export default function TelanganaImpactMap() {
  const [active, setActive] = useState<District | null>(null);

  return (
    <section className="py-20 px-4 bg-[#0D0D0D] relative overflow-hidden">
      <style>{`
        @keyframes tsP1 {
          0%   { transform:scale(1);   opacity:0.75; }
          100% { transform:scale(3.4); opacity:0;    }
        }
        @keyframes tsP2 {
          0%   { transform:scale(1);   opacity:0.45; }
          100% { transform:scale(4.5); opacity:0;    }
        }
        @keyframes tsHQ1 {
          0%   { transform:scale(1);   opacity:0.9; }
          100% { transform:scale(4);   opacity:0;   }
        }
        @keyframes tsHQ2 {
          0%   { transform:scale(1);   opacity:0.55; }
          100% { transform:scale(6);   opacity:0;    }
        }
        @keyframes tsScan {
          0%   { transform:translateX(-100%); }
          100% { transform:translateX(700%);  }
        }
        .ts-p1  { animation: tsP1  2.4s ease-out infinite;       transform-box:fill-box; transform-origin:center; }
        .ts-p2  { animation: tsP2  2.4s ease-out 0.9s infinite;  transform-box:fill-box; transform-origin:center; }
        .ts-hq1 { animation: tsHQ1 2.8s ease-out infinite;       transform-box:fill-box; transform-origin:center; }
        .ts-hq2 { animation: tsHQ2 2.8s ease-out 1.0s infinite;  transform-box:fill-box; transform-origin:center; }
        .ts-scan{ animation: tsScan 9s linear infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">Geographic Reach</span>
            <span className="rising-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Impact Across <span className="text-amber-gradient">Telangana</span>
          </h2>
          <p className="text-white/35 text-sm max-w-md mx-auto">
            33 districts · {IMPACT.length} active impact zones · Real programs on the ground.
            <span className="hidden md:inline"> Hover any district to explore.</span>
          </p>
        </div>

        {/* Layout: map + side panel */}
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">

          {/* ── Map ── */}
          <div className="relative w-full max-w-[520px] mx-auto lg:mx-0 flex-1">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0A0F1A]">
              {/* Scan-line sweep */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div
                  className="ts-scan absolute top-0 bottom-0 w-10"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(255,111,0,0.06), transparent)' }}
                />
              </div>

              <svg
                viewBox="0 0 500 490"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto block p-2"
              >
                <defs>
                  {/* dot grid background */}
                  <pattern id="ts-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="0.8" cy="0.8" r="0.8" fill="rgba(255,255,255,0.04)" />
                  </pattern>
                  {/* invert white bg → dark; tint lines amber */}
                  <filter id="map-img-filter" colorInterpolationFilters="sRGB">
                    <feColorMatrix
                      type="matrix"
                      values="-1  0  0  0  1
                               0 -0.44  0  0  0.44
                               0  0  0  0  0
                               0  0  0  1  0"
                    />
                  </filter>
                  <filter id="ts-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="ts-hq-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Dot grid */}
                <rect width="500" height="490" fill="url(#ts-grid)" />

                {/* Real Telangana district map (inverted + amber-tinted) */}
                <image
                  href="/telangana-map.png"
                  x="0" y="0"
                  width="500" height="490"
                  preserveAspectRatio="xMidYMid meet"
                  filter="url(#map-img-filter)"
                  opacity="0.42"
                />

                {/* ── Non-impact district dots ── */}
                {DISTRICTS.filter((d) => !d.impact).map((d) => (
                  <circle
                    key={d.id}
                    cx={d.x} cy={d.y}
                    r={active?.id === d.id ? 3.5 : 2.2}
                    fill={active?.id === d.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)'}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setActive(d)}
                    onMouseLeave={() => setActive(null)}
                    onTouchStart={() => setActive(d)}
                  />
                ))}

                {/* ── Impact district dots with pulse ── */}
                {IMPACT.map((d) => {
                  const meta = PILLAR_META[d.impact!.pillar];
                  const color = meta.color;
                  const isActive = active?.id === d.id;
                  const hq = d.isHQ;

                  return (
                    <g
                      key={d.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setActive(d)}
                      onMouseLeave={() => setActive(null)}
                      onTouchStart={() => setActive(d)}
                    >
                      <circle cx={d.x} cy={d.y} r={hq ? 9 : 5} fill="none"
                        stroke={color} strokeWidth={hq ? 2 : 1.5}
                        className={hq ? 'ts-hq1' : 'ts-p1'} />
                      <circle cx={d.x} cy={d.y} r={hq ? 9 : 5} fill="none"
                        stroke={color} strokeWidth="1"
                        className={hq ? 'ts-hq2' : 'ts-p2'} />
                      <circle cx={d.x} cy={d.y}
                        r={hq ? (isActive ? 10 : 9) : (isActive ? 6.5 : 5.5)}
                        fill={color}
                        filter={`url(#${hq ? 'ts-hq-glow' : 'ts-glow'})`}
                        className="transition-all duration-150"
                        opacity={isActive ? 1 : 0.85} />
                      <circle cx={d.x} cy={d.y} r={hq ? 3.5 : 2} fill="white" opacity="0.95" />
                      {hq && (
                        <circle cx={d.x} cy={d.y} r="12" fill="none"
                          stroke="#FF6F00" strokeWidth="1"
                          strokeDasharray="3 2" opacity="0.4" />
                      )}
                    </g>
                  );
                })}

                {/* HQ label */}
                {DISTRICTS.filter((d) => d.isHQ).map((d) => (
                  <text key={`lbl-hq-${d.id}`}
                    x={d.x + 15} y={d.y + 4}
                    fontSize="8.5" fontWeight="800"
                    fill="#FF6F00" fontFamily="monospace" letterSpacing="0.08em" opacity="0.95">
                    HQ
                  </text>
                ))}

                {/* Capital label */}
                {DISTRICTS.filter((d) => d.isCapital).map((d) => (
                  <text key={`lbl-cap-${d.id}`}
                    x={d.x + 11} y={d.y + 4}
                    fontSize="7.5" fontWeight="700"
                    fill="rgba(255,255,255,0.5)" fontFamily="system-ui, sans-serif" letterSpacing="0.06em">
                    HYD ★
                  </text>
                ))}

                {/* SVG tooltip on hover */}
                {active && (() => {
                  const lx = active.x > 390
                    ? active.x - active.name.length * 5.2 - 12
                    : active.x + 13;
                  const ly = active.y > 460 ? active.y - 14 : active.y - 10;
                  const w  = active.name.length * 5.3 + 14;
                  return (
                    <g>
                      <rect x={lx - 4} y={ly - 11} width={w} height={18} rx={4}
                        fill="rgba(0,0,0,0.85)" stroke="rgba(255,111,0,0.5)" strokeWidth="0.5" />
                      <text x={lx} y={ly + 2}
                        fontSize="7.5" fontWeight="600"
                        fill="rgba(255,255,255,0.92)" fontFamily="system-ui,sans-serif">
                        {active.name}
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* District counter badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6F00] pulse-live" />
              <span className="text-white/45 text-[10px] font-mono tracking-wider">
                {IMPACT.length} / 33 districts active
              </span>
            </div>
          </div>

          {/* ── Side Panel ── */}
          <div className="w-full lg:w-[268px] shrink-0 space-y-4">

            {/* Active district card */}
            <div className="min-h-[160px]">
              {active ? (
                <div
                  className="bg-white/5 border rounded-2xl p-5 transition-all duration-200"
                  style={{
                    borderColor: active.impact
                      ? PILLAR_META[active.impact.pillar].color + '55'
                      : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl shrink-0 mt-0.5">
                      {active.impact ? PILLAR_META[active.impact.pillar].emoji : '📍'}
                    </span>
                    <div>
                      <div className="text-white font-bold text-sm leading-snug">{active.name}</div>
                      {active.isHQ && (
                        <div className="text-[#FF6F00] text-[10px] font-black tracking-widest mt-0.5">MOVEMENT HQ</div>
                      )}
                      {active.isCapital && !active.isHQ && (
                        <div className="text-white/40 text-[10px] font-semibold tracking-wider mt-0.5">STATE CAPITAL</div>
                      )}
                      {active.impact && (
                        <div className="text-white/45 text-[11px] mt-1 leading-snug">{active.impact.label}</div>
                      )}
                    </div>
                  </div>
                  {active.impact ? (
                    <ul className="space-y-2">
                      {active.impact.programs.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full mt-[5px] shrink-0"
                            style={{ backgroundColor: PILLAR_META[active.impact!.pillar].color }} />
                          <span className="text-white/40 text-[11px] leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/20 text-[11px] mt-2 italic">
                      Outreach expansion planned for this district.
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 min-h-[160px] flex flex-col items-center justify-center text-center gap-2">
                  <div className="text-3xl mb-1 opacity-50">🗺️</div>
                  <p className="text-white/20 text-xs leading-relaxed">
                    Hover or tap a district on the map to see impact details
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#FF6F00] pulse-live" />
                    <span className="text-white/20 text-[10px]">Pulsing dots = active impact zones</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-white font-mono">33</div>
                <div className="text-white/30 text-[10px] mt-1 uppercase tracking-wider">Districts</div>
              </div>
              <div className="bg-white/[0.04] border border-[#FF6F00]/25 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-[#FF6F00] font-mono">{IMPACT.length}</div>
                <div className="text-white/30 text-[10px] mt-1 uppercase tracking-wider">Impact Zones</div>
              </div>
            </div>

            {/* Pillar legend */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <div className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-3">Pillar Key</div>
              <div className="space-y-2.5">
                {PILLAR_KEYS.map((k) => {
                  const m = PILLAR_META[k];
                  const cnt = IMPACT.filter((d) => d.impact?.pillar === k).length;
                  if (cnt === 0) return null;
                  return (
                    <div key={k} className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-[#0D0D0D]"
                        style={{ backgroundColor: m.color }} />
                      <span className="text-[11px] text-white/45 flex-1">{m.emoji} {m.label}</span>
                      <span className="text-[10px] font-bold font-mono" style={{ color: m.color + 'CC' }}>{cnt}</span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2.5 pt-2 border-t border-white/[0.07]">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-[#FF6F00]/50 bg-[#FF6F00]" />
                  <span className="text-[11px] text-[#FF6F00]/70 flex-1">🌟 All 4 Pillars (HQ)</span>
                  <span className="text-[10px] font-bold font-mono text-[#FF6F00]/70">
                    {IMPACT.filter((d) => d.impact?.pillar === 'all').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Coverage bars */}
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Coverage by Pillar</div>
              {(['all', ...PILLAR_KEYS] as Pillar[]).map((k) => {
                const m = PILLAR_META[k];
                const cnt = IMPACT.filter((d) => d.impact?.pillar === k).length;
                if (cnt === 0) return null;
                const pct = (cnt / IMPACT.length) * 100;
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span className="text-[10px] text-white/30 w-4 text-right tabular-nums shrink-0">{cnt}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ backgroundColor: m.color, width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-white/25 w-[60px] truncate shrink-0">
                      {k === 'all' ? 'Multi' : m.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
