'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HorizontalPillars from '@/components/HorizontalPillars';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const pillarsEn = [
  {
    emoji: '⚡', title: 'Youth Empowerment', color: '#FF6F00',
    intro: 'Young people are the backbone of any lasting transformation. The movement invests in their leadership, education, and social mobility.',
    sections: [
      { name: 'Education & Skill Development', items: ['Scholarships and academic support for students from underserved families across Telangana', 'Digital literacy programs equipping youth with job-ready technology skills', 'Vocational training camps and skill certification for school dropouts and rural youth'] },
      { name: 'Leadership Development', items: ['Youth leadership summits bringing together young change-makers from all 33 districts', 'Mentorship programs pairing students with professionals from relevant fields', 'Civic awareness workshops training young people to participate in community governance'] },
      { name: 'Social Mobility', items: ['Career counselling and higher education guidance for first-generation learners', 'Sports and cultural programs nurturing talent beyond academics', 'Inter-district youth networks creating opportunities for collaboration and growth'] },
    ],
  },
  {
    emoji: '👩', title: 'Women Empowerment', color: '#E65100',
    intro: 'Gender equality is not a footnote — it is a cornerstone. The movement works to ensure women have economic independence, safety, and a voice in every sphere.',
    sections: [
      { name: 'Economic Empowerment', items: ['Microfinance and self-help group (SHG) support for women entrepreneurs in rural Telangana', 'Tailoring, weaving, and agri-based livelihood training giving women sustainable income sources', 'Market linkage programs connecting women-led businesses with buyers and distributors'] },
      { name: 'Social Justice & Equality', items: ["Legal awareness camps on rights, domestic violence protections, and property inheritance", 'Campaigns challenging gender discrimination in education, employment, and community spaces', "Collaboration with panchayati raj institutions to ensure women's representation in local governance"] },
      { name: 'Safe Spaces & Networking', items: ["Women's circles and peer support networks across districts for shared learning and solidarity", 'Mental health awareness sessions specifically designed for women facing social pressures', 'Safe houses and emergency support coordination for women in crisis situations'] },
    ],
  },
  {
    emoji: '🏥', title: 'Healthcare', color: '#0D0D0D',
    intro: 'Access to healthcare should not depend on location, income, or social status. Free medical camps, awareness programs, and community initiatives bring health services to those who need them most.',
    sections: [
      { name: 'Accessible Healthcare', items: ['Free medical camps in villages and tribal areas providing consultations, medicines, and diagnostics', 'Blood donation drives building local reserves to support critical care needs', 'Wheelchair and mobility aid distribution for persons with disabilities through partner NGOs'] },
      { name: 'Health Education & Awareness', items: ['Maternal and child health workshops for pregnant women and new mothers in rural communities', 'Nutrition campaigns combating malnutrition and anaemia in children and adolescent girls', 'Mental health destigmatisation programs through community conversations and youth outreach'] },
      { name: 'Community-Driven Health Initiatives', items: ['Clean drinking water projects including borewell restoration and filtration unit installations', 'Sanitation and hygiene education in underserved schools and settlements', 'Coordination with government health departments to extend the reach of public health schemes'] },
    ],
  },
  {
    emoji: '📚', title: 'Education', color: '#2D2D2D',
    intro: '"Education is the cornerstone of my vision." Every initiative traces back to a belief that an educated community is a powerful community.',
    sections: [
      { name: 'Access to Quality Education', items: ['School infrastructure support: benches, fans, water facilities for government schools in Bhupalpally and beyond', 'Distribution of books, stationery, and school kits to children from BPL families', 'Bridge course programs for children who have fallen behind due to poverty or family migration'] },
      { name: 'Higher Education Support', items: ['Scholarships and fee assistance for students pursuing higher education from marginalised communities', 'Awareness drives on government scholarships (SC/ST/BC/Minority) and how to access them', 'Coaching support for competitive exams — EAMCET, Group 1/2, banking, and railway examinations'] },
      { name: 'Lifelong Learning', items: ['Adult literacy camps targeting women and elders who missed formal schooling', 'Digital education kiosks and e-learning access points in village community centres', 'Library and reading room sponsorships fostering a culture of continuous learning'] },
    ],
  },
];

const pillarsTe = [
  {
    emoji: '⚡', title: 'యువత సాధికారత', color: '#FF6F00',
    intro: 'యువత ఏదైనా శాశ్వత మార్పుకు వెన్నెముక. ఉద్యమం వారి నాయకత్వం, విద్య మరియు సామాజిక చలనశీలతలో పెట్టుబడి పెడుతుంది.',
    sections: [
      { name: 'విద్య & నైపుణ్య అభివృద్ధి', items: ['తెలంగాణ అంతటా వెనుకబడిన కుటుంబాల విద్యార్థులకు స్కాలర్‌షిప్‌లు', 'డిజిటల్ అక్షరాస్యత కార్యక్రమాలు', 'వృత్తి శిక్షణ శిబిరాలు'] },
      { name: 'నాయకత్వ అభివృద్ధి', items: ['యువత నాయకత్వ సదస్సులు', 'మెంటార్‌షిప్ కార్యక్రమాలు', 'పౌర అవగాహన వర్క్‌షాప్‌లు'] },
      { name: 'సామాజిక చలనశీలత', items: ['కెరీర్ కౌన్సెలింగ్', 'క్రీడలు మరియు సాంస్కృతిక కార్యక్రమాలు', 'అంతర్-జిల్లా యువత నెట్‌వర్క్‌లు'] },
    ],
  },
  {
    emoji: '👩', title: 'మహిళా సాధికారత', color: '#E65100',
    intro: 'లింగ సమానత్వం పాద సూచిక కాదు — ఇది మూలస్తంభం. మహిళలకు ఆర్థిక స్వాతంత్ర్యం, భద్రత మరియు గొంతు ఉండేలా ఉద్యమం పని చేస్తుంది.',
    sections: [
      { name: 'ఆర్థిక సాధికారత', items: ['మైక్రోఫైనాన్స్ మరియు SHG మద్దతు', 'వృత్తి శిక్షణ', 'మార్కెట్ అనుసంధాన కార్యక్రమాలు'] },
      { name: 'సామాజిక న్యాయం & సమానత్వం', items: ['చట్టపరమైన అవగాహన శిబిరాలు', 'లింగ వివక్ష వ్యతిరేక ప్రచారాలు', 'మహిళా ప్రాతినిధ్యం'] },
      { name: 'సురక్షిత స్థలాలు & నెట్‌వర్కింగ్', items: ['మహిళా సర్కిల్‌లు', 'మానసిక ఆరోగ్య అవగాహన', 'అత్యవసర మద్దతు'] },
    ],
  },
  {
    emoji: '🏥', title: 'ఆరోగ్య సేవలు', color: '#0D0D0D',
    intro: 'ఆరోగ్య సంరక్షణ స్థానం, ఆదాయం లేదా సామాజిక హోదాపై ఆధారపడకూడదు. ఉచిత వైద్య శిబిరాలు అవసరమైన వారికి చేరుతాయి.',
    sections: [
      { name: 'అందుబాటులో ఆరోగ్య సంరక్షణ', items: ['ఉచిత వైద్య శిబిరాలు', 'రక్తదాన కార్యక్రమాలు', 'వికలాంగులకు సహాయం'] },
      { name: 'ఆరోగ్య విద్య & అవగాహన', items: ['మాతా శిశు ఆరోగ్య వర్క్‌షాప్‌లు', 'పోషకాహార ప్రచారాలు', 'మానసిక ఆరోగ్య కార్యక్రమాలు'] },
      { name: 'సమాజ ఆరోగ్య చొరవలు', items: ['స్వచ్ఛ నీటి ప్రాజెక్టులు', 'పారిశుద్ధ్య విద్య', 'ప్రభుత్వ ఆరోగ్య విభాగాలతో సమన్వయం'] },
    ],
  },
  {
    emoji: '📚', title: 'విద్య', color: '#2D2D2D',
    intro: '"విద్య నా దర్శనానికి మూలస్తంభం." ప్రతి చొరవ విద్యావంతమైన సమాజం శక్తివంతమైనదని నమ్మకంతో ముడిపడి ఉంటుంది.',
    sections: [
      { name: 'నాణ్యమైన విద్యకు ప్రాప్తి', items: ['పాఠశాల మౌలిక సదుపాయాలు', 'పుస్తకాలు మరియు స్టేషనరీ పంపిణీ', 'బ్రిడ్జ్ కోర్స్ కార్యక్రమాలు'] },
      { name: 'ఉన్నత విద్యా మద్దతు', items: ['స్కాలర్‌షిప్‌లు', 'ప్రభుత్వ స్కాలర్‌షిప్ అవగాహన', 'పోటీ పరీక్షల కోచింగ్'] },
      { name: 'జీవితకాల అభ్యాసం', items: ['వయోజన అక్షరాస్యత శిబిరాలు', 'డిజిటల్ విద్యా కేంద్రాలు', 'లైబ్రరీ మరియు రీడింగ్ రూమ్‌లు'] },
    ],
  },
];

const commonGoalsEn = [
  { emoji: '🤝', title: 'Community Engagement', desc: "We believe lasting change is community-led, not top-down. Every program is built with local participation, ensuring solutions fit the real context of people's lives." },
  { emoji: '🌐', title: 'Collaboration & Partnerships', desc: 'The movement actively partners with NGOs, government bodies, corporate CSR teams, academic institutions, and diaspora networks to amplify impact and avoid duplication.' },
  { emoji: '⚖️', title: 'Advocacy & Policy Change', desc: 'Beyond ground-level programs, the movement advocates for systemic policy reforms that remove structural barriers to equality in education, healthcare, and economic opportunity.' },
];

const commonGoalsTe = [
  { emoji: '🤝', title: 'సమాజ నిమగ్నత', desc: 'శాశ్వత మార్పు పైనుండి కాదు, సమాజం నుండే వస్తుందని మేము నమ్ముతాం. ప్రతి కార్యక్రమం స్థానిక భాగస్వామ్యంతో నిర్మించబడింది.' },
  { emoji: '🌐', title: 'సహకారం & భాగస్వామ్యాలు', desc: 'ఉద్యమం NGOలు, ప్రభుత్వ సంస్థలు, కార్పొరేట్ CSR బృందాలు మరియు విద్యా సంస్థలతో చురుకుగా భాగస్వామ్యం చేసుకుంటుంది.' },
  { emoji: '⚖️', title: 'వకాల్తా & విధాన మార్పు', desc: 'భూమి స్థాయి కార్యక్రమాలకు మించి, విద్య, ఆరోగ్యం మరియు ఆర్థిక అవకాశాలలో సమానత్వానికి అడ్డంపడే నిర్మాణాత్మక అడ్డంకులను తొలగించే విధాన సంస్కరణలకు ఉద్యమం వకాల్తా పుచ్చుకుంటుంది.' },
];

export default function MissionPage() {
  const { lang } = useLanguage();
  const t = i18n[lang].mission;
  const pillars = lang === 'te' ? pillarsTe : pillarsEn;
  const commonGoals = lang === 'te' ? commonGoalsTe : commonGoalsEn;
  const [pillarImages, setPillarImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/pillars')
      .then(r => r.json())
      .then((rows: { slug: string; image_url: string }[]) => {
        const map: Record<string, string> = {};
        rows.forEach(r => { if (r.image_url) map[r.slug] = r.image_url; });
        setPillarImages(map);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-36 pb-28 px-4 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
          <circle cx="1200" cy="300" r="400" stroke="#FF6F00" strokeWidth="2" fill="none" />
          <circle cx="200" cy="200" r="200" stroke="white" strokeWidth="1" fill="none" />
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.heroBadge}</span>
            <span className="rising-accent" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* Pillar nav */}
      <section className="py-10 px-4 bg-white border-b border-[#E8E8E8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pillars.map((p, i) => (
              <div key={i} className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1.5">{p.emoji}</div>
                <div className="font-bold text-[#0D0D0D] text-xs leading-tight">{p.title}</div>
                <div className="w-5 h-0.5 mx-auto mt-2" style={{ backgroundColor: p.color }} />
              </div>
            ))}
          </div>
          <p className="text-center text-[#6B6B6B] text-xs mt-5 tracking-wide">
            {lang === 'te' ? 'క్రిందికి స్క్రోల్ చేయండి ↓' : 'Scroll through each pillar below ↓'}
          </p>
        </div>
      </section>

      {/* GSAP horizontal scroll pillars */}
      <HorizontalPillars pillars={pillars} images={pillarImages} />

      {/* Common Goals */}
      <section className="py-24 px-4 bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">
                {lang === 'te' ? 'భాగస్వామ్య సూత్రాలు' : 'Shared Principles'}
              </span>
              <span className="rising-accent" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {lang === 'te' ? 'సాధారణ లక్ష్యాలు' : 'Common Goals'}
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm">
              {lang === 'te' ? 'నాలుగు స్తంభాలలో, ఈ సూత్రాలు మనం ఏమి పని చేస్తామో కాదు, ఎలా పని చేస్తామో మార్గదర్శనం చేస్తాయి.' : "Across all four pillars, these principles guide how we work — not just what we work on."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {commonGoals.map((g, i) => (
              <div key={i} className="border border-white/10 rounded-2xl p-7 hover:border-[#FF6F00] transition-all duration-300">
                <div className="text-4xl mb-4">{g.emoji}</div>
                <h3 className="font-bold text-white mb-2">{g.title}</h3>
                <div className="w-6 h-0.5 bg-[#FF6F00] mb-4" style={{ transform: 'skewX(-12deg)' }} />
                <p className="text-white/40 text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">
              {lang === 'te' ? 'చేరండి' : 'Get Involved'}
            </span>
            <span className="rising-accent" />
          </div>
          <h2 className="text-3xl font-bold text-[#0D0D0D] mb-4">{t.ctaHeading}</h2>
          <p className="text-[#6B6B6B] mb-8">{t.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/community/join" className="inline-flex items-center justify-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105">
              {t.ctaBtn} <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white font-bold px-8 py-4 rounded-full text-base transition-all">
              {lang === 'te' ? 'మమ్మల్ని సంప్రదించండి' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
