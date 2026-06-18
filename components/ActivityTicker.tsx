'use client';
import { useEffect, useState } from 'react';

const defaultTickers = [
  '✅ Ravi from Karimnagar just joined the movement',
  '🎉 500+ members milestone reached in Warangal district!',
  '📚 New education drive launched in Bhupalpally',
  '🏥 Free health camp conducted for 200 families in Peddapalli',
  '👩 Women\'s self-help group formed in Nalgonda',
  '🌊 Clean water project completed in Mahabubabad',
  '🎓 10 students received scholarships this month',
  '🤝 New volunteer signed up from Hyderabad',
];

export default function ActivityTicker() {
  const [messages, setMessages] = useState(defaultTickers);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch('/api/members/recent');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const newMessages = data.map((m: { full_name: string; city: string }) =>
              `✅ ${m.full_name.split(' ')[0]} from ${m.city} just joined the movement`
            );
            setMessages([...newMessages, ...defaultTickers]);
          }
        }
      } catch {}
    }
    fetchRecent();
    const interval = setInterval(fetchRecent, 60000);
    return () => clearInterval(interval);
  }, []);

  const text = messages.join('   •   ');

  return (
    <div className="bg-[#FF6F00] py-2.5 overflow-hidden">
      <div className="ticker-inner flex">
        <span className="text-white text-sm font-medium px-4 whitespace-nowrap">
          {text}{'   •   '}{text}
        </span>
      </div>
    </div>
  );
}
