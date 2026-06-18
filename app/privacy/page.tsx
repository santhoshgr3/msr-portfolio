export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-32 pb-16 px-4 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
          <line x1="0" y1="300" x2="1440" y2="0" stroke="#FF6F00" strokeWidth="2"/>
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">DPDP Act 2023 Compliant</span>
            <span className="rising-accent" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-white/30 text-sm">Last updated: June 2025</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 text-[#6B6B6B] text-sm leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">1</span>
                Who We Are
              </h2>
              <div className="pl-8">
                <p>Sunny Anna Yuvasena & Helping Hands Organization, operated by Dr. Madhiraj Sairathan, Bhupalpally, Telangana, India.</p>
                <p className="mt-1">Contact: <a href="mailto:teamsairathansunny@gmail.com" className="text-[#FF6F00]">teamsairathansunny@gmail.com</a> | +91 8886388264</p>
              </div>
            </div>

            <div className="h-px bg-[#E8E8E8]" />

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">2</span>
                Data We Collect
              </h2>
              <div className="pl-8">
                <p className="mb-2">When you register as a movement member, we collect:</p>
                <ul className="space-y-1.5">
                  {['Full Name', 'Phone Number (for OTP verification and communication)', 'City / District', 'Area of Interest', 'How you found us', 'Consent record and date of registration'].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#FF6F00]/15 flex items-center justify-center text-[#FF6F00] text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="h-px bg-[#E8E8E8]" />

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">3</span>
                How We Use Your Data
              </h2>
              <div className="pl-8">
                <ul className="space-y-1.5">
                  {[
                    'To assign and maintain your Member ID',
                    'To display your first name and city on the Member Wall (only if you consented)',
                    'To notify you about events and campaigns in your district',
                    'To send movement updates via WhatsApp or SMS',
                    'We do NOT sell, rent, or share your data with third parties for commercial purposes.',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#FF6F00]/15 flex items-center justify-center text-[#FF6F00] text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="h-px bg-[#E8E8E8]" />

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">4</span>
                Your Rights (India DPDP Act 2023)
              </h2>
              <div className="pl-8">
                <ul className="space-y-2">
                  {[
                    { right: 'Right to Access', desc: 'Request a copy of your stored data anytime.' },
                    { right: 'Right to Correct', desc: 'Update incorrect information.' },
                    { right: 'Right to Erase', desc: 'Request full deletion of your account and data.' },
                    { right: 'Right to Withdraw Consent', desc: 'Stop appearing on the Member Wall.' },
                  ].map(r => (
                    <li key={r.right} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#0D0D0D]/10 flex items-center justify-center text-[#0D0D0D] text-[9px] font-bold shrink-0 mt-0.5">→</span>
                      <span><strong className="text-[#0D0D0D]">{r.right}:</strong> {r.desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3">To exercise any right: email <a href="mailto:teamsairathansunny@gmail.com" className="text-[#FF6F00]">teamsairathansunny@gmail.com</a> with subject "Data Request".</p>
              </div>
            </div>

            <div className="h-px bg-[#E8E8E8]" />

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">5</span>
                Data Security
              </h2>
              <p className="pl-8">Your data is stored securely on Supabase (PostgreSQL) with encryption in transit (HTTPS/TLS) and at rest. Phone numbers are used only for OTP and movement communications. We do not store passwords.</p>
            </div>

            <div className="h-px bg-[#E8E8E8]" />

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">6</span>
                OTP & Phone Usage
              </h2>
              <p className="pl-8">We use your phone number solely to send a one-time verification code (OTP) and for movement notifications. We will not call you for sales or advertising. You can opt out of messages anytime by contacting us.</p>
            </div>

            <div className="h-px bg-[#E8E8E8]" />

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">7</span>
                Member Wall Consent
              </h2>
              <p className="pl-8">Appearing on the public Member Wall ("Ravi from Warangal just joined") is opt-in. You can request removal at any time.</p>
            </div>

            <div className="h-px bg-[#E8E8E8]" />

            <div>
              <h2 className="text-lg font-bold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FF6F00] text-white rounded-md flex items-center justify-center text-xs font-black shrink-0">8</span>
                Changes to This Policy
              </h2>
              <p className="pl-8">We may update this policy. Material changes will be communicated via WhatsApp or email to registered members.</p>
            </div>

            {/* Contact box */}
            <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-2xl p-6">
              <p className="font-bold text-[#0D0D0D] mb-2 text-sm">Contact for Data Requests</p>
              <p className="text-xs leading-relaxed">
                <a href="mailto:teamsairathansunny@gmail.com" className="text-[#FF6F00]">teamsairathansunny@gmail.com</a> | +91 8886388264<br />
                Subject line: <span className="font-mono bg-white border border-[#E8E8E8] px-1.5 py-0.5 rounded text-[#0D0D0D]">"Data Request — [Your Name]"</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
