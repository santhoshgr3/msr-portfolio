'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Sunny Anna changed my life. I was unemployed for 2 years. Through his vocational training program, I now run my own business and employ 3 people from my village.",
    name: "Ramesh Kumar",
    location: "Warangal, Telangana",
    role: "Entrepreneur & Member #0047",
    initials: "RK",
    color: "#FF6F00",
  },
  {
    quote: "The free health camp in our village detected my mother's condition early. We could never afford a private hospital. Sunny Anna and his team are truly god-sent.",
    name: "Lakshmi Devi",
    location: "Bhupalpally, Telangana",
    role: "Healthcare Beneficiary",
    initials: "LD",
    color: "#E53935",
  },
  {
    quote: "I am a first-generation graduate in my family. Sunny Anna's education initiative provided me a scholarship that made it possible. I want to give back to this movement.",
    name: "Arjun Reddy",
    location: "Karimnagar, Telangana",
    role: "Scholarship Recipient & Volunteer",
    initials: "AR",
    color: "#1A237E",
  },
  {
    quote: "As a woman from a rural background, I felt invisible. The women's self-help group under this movement gave me confidence, a business, and a voice in my community.",
    name: "Sridevi Goud",
    location: "Peddapalli, Telangana",
    role: "Self-Help Group Leader",
    initials: "SG",
    color: "#2E7D32",
  },
];

export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === testimonials.length - 1 ? 0 : c + 1));

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#E8EAF6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#FF6F00] font-semibold text-sm uppercase tracking-widest mb-3">Voices of Change</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E]">What Our Members Say</h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-6 left-8 opacity-10">
            <Quote size={80} className="text-[#1A237E]" />
          </div>

          <div className="relative z-10">
            <p className="text-lg md:text-xl text-[#222] leading-relaxed mb-8 italic">
              "{t.quote}"
            </p>

            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <div className="font-bold text-[#111]">{t.name}</div>
                <div className="text-sm text-[#555]">{t.location}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: t.color }}>{t.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-[#1A237E] text-white flex items-center justify-center hover:bg-[#FF6F00] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-[#FF6F00]' : 'w-2 bg-[#1A237E]/30'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-[#1A237E] text-white flex items-center justify-center hover:bg-[#FF6F00] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
