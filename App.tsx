import React, { useState, useEffect } from 'react';
import { BRAND_COLORS } from './constants.ts';
import Chatbot from './components/Chatbot.tsx';

// --- UI COMPONENTS ---

const Nav: React.FC<{ 
  onLoginClick: () => void; 
  onHomeClick: () => void;
  isLoggedIn: boolean;
}> = ({ onLoginClick, onHomeClick, isLoggedIn }) => (
  <nav className="bg-white border-b px-4 md:px-10 py-2 flex items-center justify-between sticky top-0 z-[60] shadow-sm">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg icici-maroon-bg flex items-center justify-center text-white font-bold text-lg shadow-sm">i</div>
          <div className="leading-none">
            <span className="font-bold icici-maroon-text text-sm md:text-base block tracking-tight">ICICI Lombard</span>
            <span className="text-[8px] text-slate-400 uppercase font-semibold tracking-widest">Nibhaye Vaade</span>
          </div>
        </div>
      </div>
      <div className="hidden xl:flex items-center gap-5 text-[11px] font-bold text-slate-600 uppercase tracking-tight">
         <span className="hover:text-orange-500 cursor-pointer">Motor Insurance</span>
         <span className="text-orange-500 border-b-2 border-orange-500 pb-1">Health Insurance</span>
         <span className="hover:text-orange-500 cursor-pointer">Travel Insurance</span>
         <span className="hover:text-orange-500 cursor-pointer">SME Insurance</span>
         <span className="hover:text-orange-500 cursor-pointer">Corporate Insurance</span>
         <span className="hover:text-orange-500 cursor-pointer">Renewals</span>
         <span className="hover:text-orange-500 cursor-pointer">Claims</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex items-center gap-4 text-[10px] font-semibold text-slate-500 uppercase">
        <span>Help</span>
        <span>Info Centre</span>
        <span>Investor Relations</span>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <div className="w-6 h-6 rounded icici-maroon-bg text-white flex items-center justify-center font-bold text-[10px]">MP</div>
          <span className="text-[10px] font-bold text-slate-700 uppercase">Namaste, Mayank</span>
        </div>
      ) : (
        <button onClick={onLoginClick} className="bg-orange-500 text-white px-5 py-1.5 rounded text-[11px] font-bold uppercase hover:bg-orange-600 transition-all">Login</button>
      )}
    </div>
  </nav>
);

const SectionHeading: React.FC<{ children: React.ReactNode; center?: boolean }> = ({ children, center }) => (
  <h2 className={`text-2xl md:text-4xl font-extrabold text-slate-800 mb-8 tracking-tighter ${center ? 'text-center' : ''}`}>{children}</h2>
);

// --- MAIN VIEWS ---

const HomeView: React.FC<{ onExplore: () => void }> = ({ onExplore }) => (
  <div className="animate-in fade-in duration-700">
    <section className="bg-slate-900 py-20 md:py-32 px-6 relative overflow-hidden text-center text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-none">Reliable Protection.<br/>Zero Worries. <span className="text-orange-500">Zero% GST.</span></h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 font-medium">No medical checkup required | 10,700+ Network hospitals | Cashless approval in 60 mins</p>
        <button onClick={onExplore} className="bg-orange-500 text-white px-12 py-5 rounded-lg font-bold uppercase text-sm tracking-widest hover:bg-orange-600 shadow-2xl transition-all transform hover:scale-105">Explore Elevate Policy</button>
      </div>
    </section>
  </div>
);

const ElevateView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Inclusions' | 'Exclusions'>('Inclusions');

  return (
    <div className="animate-in fade-in duration-1000 bg-white">
      {/* Header Banner */}
      <div className="bg-[#002B49] text-white py-3 px-6 text-center text-[10px] font-black uppercase tracking-widest">
        Health insurance just got 18% cheaper - no GST applicable!
      </div>

      {/* Hero / Configurator Section */}
      <section className="bg-slate-50 py-12 px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-black italic icici-maroon-text tracking-tighter">elevate</div>
                <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse"></span> AI Inside
                </span>
              </div>
              <p className="text-slate-500 text-sm font-bold">Comprehensive health plan powered by AI that covers it all.</p>
            </div>
            <div className="flex flex-wrap gap-4">
               {[
                 { t: "Activate Booster", s: "Boost your coverage with super top-up", i: "🚀" },
                 { t: "Activate Browser", s: "High sum insured, low premium combo", i: "💎" },
                 { t: "Personal Protect", s: "Financial support for life impacting injuries", i: "🛡️" }
               ].map((item, i) => (
                 <div key={i} className="bg-white border p-4 rounded-xl flex items-center gap-3 shadow-sm hover:border-orange-200 transition-colors">
                   <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-xl shadow-inner">{item.i}</div>
                   <div className="leading-tight">
                     <p className="text-[11px] font-black text-slate-800">{item.t}</p>
                     <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">{item.s}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
            <div className="md:col-span-2 flex items-center border-2 border-slate-100 rounded-xl p-3 bg-slate-50/30">
               <span className="text-[10px] font-black text-slate-400 mr-4 tracking-widest">ADULTS</span>
               <button className="w-9 h-9 bg-white border rounded-lg text-lg font-bold shadow-sm">-</button>
               <span className="flex-1 text-center font-black text-lg">1</span>
               <button className="w-9 h-9 bg-white border rounded-lg text-lg font-bold shadow-sm">+</button>
            </div>
            <div className="md:col-span-2 flex items-center border-2 border-slate-100 rounded-xl p-3 bg-slate-50/30">
               <span className="text-[10px] font-black text-slate-400 mr-4 tracking-widest">KIDS</span>
               <button className="w-9 h-9 bg-white border rounded-lg text-lg font-bold shadow-sm">-</button>
               <span className="flex-1 text-center font-black text-lg">0</span>
               <button className="w-9 h-9 bg-white border rounded-lg text-lg font-bold shadow-sm">+</button>
            </div>
            <input type="tel" placeholder="Mobile Number" className="border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none" />
            <button className="bg-slate-300 text-white rounded-xl p-4 font-black uppercase text-xs tracking-[0.2em] cursor-not-allowed">Get Quote</button>
          </div>
          <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
             <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked readOnly className="accent-orange-500" /> Terms and conditions</label>
             <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked readOnly className="accent-green-500" /> Updates on WhatsApp</label>
          </div>
        </div>
      </section>

      {/* What is Elevate Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
           <SectionHeading>What is ICICI Lombard Elevate policy?</SectionHeading>
           <div className="space-y-6 text-slate-600 font-semibold leading-relaxed text-[16px]">
              <p>In today's world, the rising costs of medical care are an unavoidable reality. From initial doctor visits to lab tests and pharmacy bills, the cumulative expenses of comprehensive treatment can become overwhelming.</p>
              <p>ICICI Lombard's Elevate policy is here to support you throughout your healthcare journey with a policy designed to cater to your needs at all stages. This <span className="text-orange-500 underline decoration-2 underline-offset-4 cursor-pointer">health insurance policy</span> offers flexibility in terms of sum insured and a wide range of add-on covers to choose from.</p>
              <p>Enjoy value-added services like reward points for healthy habits, video/tele-consultation(s), pharmacy and diagnostic services, online chat with doctors, second opinions, and more. Additional benefits include pre-existing disease cover, domestic and air ambulance, and convalescence benefits.</p>
           </div>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
           <div className="relative group">
              <div className="absolute -inset-4 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative w-80 h-80 bg-slate-100 rounded-full flex items-center justify-center text-9xl shadow-inner border-8 border-white animate-pulse">👨‍👩‍👧‍👦</div>
           </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeading>Top reasons to buy Elevate health insurance</SectionHeading>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {[
              "Hospitalisation & day care treatment cover",
              "Unlimited reset of sum insured",
              "Cashless Everywhere (cashless treatment at any hospital in India)",
              "Up to 30% discount on renewals for staying active",
              "100% sum insured increase every year, irrespective of claims",
              "Unlimited coverage for any 1 claim of your choice during policy lifetime",
              "AYUSH treatment covered up to sum insured",
              "Pre & post hospitalisation expenses from 90 days until 180 days",
              "Road & air ambulance covered up to sum insured",
              "Customisable waiting periods",
              "Cashless OPD services like ordering medicines, booking lab tests, etc. (with additional premium)",
              "Cashless hospitalisation worldwide"
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-4 group">
                 <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[11px] mt-0.5 flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">✓</div>
                 <p className="text-[15px] font-black text-slate-700 leading-tight">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Additions Cards */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeading center>What value additions does the Elevate policy offer?</SectionHeading>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {[
            { title: "Infinite care", desc: "Unlimited coverage for any one claim of your choice during your policy lifetime, ensuring reliable coverage whenever you need it the most.", icon: "♾️" },
            { title: "Power booster (Super loyalty bonus)", desc: "Each policy year, earn a cumulative bonus of up to 100% of your annual sum insured (expiring or renewed sum insured, whichever is lower).", icon: "⚡" },
            { title: "Reset benefit", desc: "If your remaining sum insured isn't enough for a claim, it will reset to the base sum insured for future claims—and this can happen unlimited times.", icon: "🔄" },
            { title: "Worldwide cover", desc: "Get coverage up to INR 3 Crore on a cashless basis for hospitalisation abroad, including planned treatments.", icon: "🌎" },
            { title: "Jumpstart", desc: "Reduces the waiting period to just 30 days for treatments and conditions like asthma, diabetes, and hypertension.", icon: "🏃" },
            { title: "OPD++", desc: "With this rider, you get cashless coverage for outpatient care—doctor consultations, diagnostics, mental health, pharmacy, and more.", icon: "💊" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[32px] border-2 border-slate-50 hover:border-orange-100 hover:shadow-2xl transition-all group">
               <div className="text-4xl mb-6 transform group-hover:scale-125 transition-transform origin-left">{item.icon}</div>
               <h4 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight">{item.title}</h4>
               <p className="text-[14px] text-slate-500 leading-relaxed font-bold">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 0% GST Banner */}
      <section className="bg-slate-900 py-20 px-6 text-center text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <h2 className="text-4xl font-black mb-6 tracking-tighter">0% GST on health insurance</h2>
         <p className="max-w-2xl mx-auto text-slate-400 font-bold leading-relaxed uppercase text-xs tracking-widest">Yes, you read that correctly! The Goods and Services Tax (GST) on health insurance premiums has been reduced to 0% by the GST Council. Making health insurance more affordable for every family.</p>
      </section>

      {/* Inclusions Exclusions Tabs */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeading center>What's included and what's not?</SectionHeading>
        <div className="flex justify-center gap-12 mb-16">
           <button onClick={() => setActiveTab('Inclusions')} className={`text-xs font-black uppercase tracking-[0.3em] pb-3 border-b-4 transition-all ${activeTab === 'Inclusions' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-400'}`}>Inclusions</button>
           <button onClick={() => setActiveTab('Exclusions')} className={`text-xs font-black uppercase tracking-[0.3em] pb-3 border-b-4 transition-all ${activeTab === 'Exclusions' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-400'}`}>Exclusions</button>
        </div>

        {activeTab === 'Inclusions' ? (
          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100">
               <h4 className="font-black text-orange-500 mb-8 uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
                 <span className="w-4 h-4 rounded bg-orange-500"></span> Benefits Covered
               </h4>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Inpatient Treatment", "Daycare Procedure", "Technological advancements", "Pre & Post Hospitalisation", "Loyalty Bonus", "Bariatric Surgery", "Reset Benefit", "Road Ambulance", "Donor Expenses", "Wellness Program"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 text-[13px] font-black group">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></span> {item}
                    </li>
                  ))}
               </ul>
            </div>
            <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100">
               <h4 className="font-black text-blue-500 mb-8 uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
                 <span className="w-4 h-4 rounded bg-blue-500"></span> Add On Benefits
               </h4>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Infinite Care", "Power Booster", "Chronic Management", "Maternity Benefit", "New Born Baby Cover", "Worldwide Cover", "Claim Protector", "Inflation Protector", "Personal Accident"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 text-[13px] font-black group">
                       <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></span> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
             {[
               "Voluntary Co-Payment", "Voluntary Deductible", "Permanent Exclusions", "External Durable Medical Equipment", "Maternity Waiting Period Reduction", "Specific Illness Waiting Period Reduction", "Worldwide Cover Waiting Period Reduction", "Room Modifier"
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{item}</span>
                  <span className="text-red-500 font-black text-xl">✕</span>
               </div>
             ))}
          </div>
        )}
      </section>

      {/* Network Hospitals */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
           <div>
              <SectionHeading>Locate your nearest network hospitals</SectionHeading>
              <h3 className="text-5xl font-black text-orange-500 mb-8 italic tracking-tighter">10,700+ Network hospitals*</h3>
              <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 space-y-8">
                 <div className="flex flex-wrap gap-8">
                    <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest cursor-pointer text-slate-600"><input type="radio" name="loc" checked className="accent-orange-500" /> Hospital Name</label>
                    <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest cursor-pointer text-slate-600"><input type="radio" name="loc" className="accent-orange-500" /> City</label>
                    <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest cursor-pointer text-slate-600"><input type="radio" name="loc" className="accent-orange-500" /> Pincode</label>
                 </div>
                 <div className="relative">
                   <input type="text" placeholder="Enter pincode or city" className="w-full border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:border-orange-500 outline-none shadow-inner" />
                   <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl">📍</span>
                 </div>
                 <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-all shadow-xl">Search Network</button>
              </div>
           </div>
           <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
              <div className="w-full aspect-square bg-white rounded-full border-8 border-slate-200 shadow-inner flex items-center justify-center text-9xl animate-pulse overflow-hidden">
                <div className="w-full h-full opacity-10 bg-[radial-gradient(#8C1D21_2px,transparent_1px)] [background-size:24px_24px]"></div>
                <span className="absolute">🏥</span>
              </div>
           </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <SectionHeading center>Frequently asked questions</SectionHeading>
        <div className="space-y-4 mt-16">
          {[
            "What is ICICI Lombard Elevate policy?",
            "How does a family floater policy under ICICI Lombard Elevate work?",
            "What is the age limit for taking this policy?",
            "How can I switch my current insurance to ICICI Lombard?",
            "What is the difference between base coverage and add-ons?",
            "How much premium qualifies for tax benefits?"
          ].map((q, i) => (
            <div key={i} className="border-b-2 border-slate-50 py-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50 px-6 rounded-2xl transition-all">
               <span className="text-[15px] font-black text-slate-700 tracking-tight">{q}</span>
               <span className="text-slate-300 group-hover:text-orange-500 text-2xl font-black group-hover:rotate-90 transition-all">+</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-24 px-6 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-[12px] font-bold">
           <div className="space-y-6">
              <h5 className="font-black uppercase tracking-[0.3em] text-orange-500">Products</h5>
              <div className="space-y-3 opacity-60">
                <p className="hover:opacity-100 cursor-pointer">Motor Insurance</p>
                <p className="hover:opacity-100 cursor-pointer">Health Insurance</p>
                <p className="hover:opacity-100 cursor-pointer">Travel Insurance</p>
                <p className="hover:opacity-100 cursor-pointer">Home Insurance</p>
              </div>
           </div>
           <div className="space-y-6">
              <h5 className="font-black uppercase tracking-[0.3em] text-orange-500">Services</h5>
              <div className="space-y-3 opacity-60">
                <p className="hover:opacity-100 cursor-pointer">Customer Support</p>
                <p className="hover:opacity-100 cursor-pointer">Network Hospitals</p>
                <p className="hover:opacity-100 cursor-pointer">Renew Policy</p>
                <p className="hover:opacity-100 cursor-pointer">Claims Tracker</p>
              </div>
           </div>
           <div className="space-y-6">
              <h5 className="font-black uppercase tracking-[0.3em] text-orange-500">Legal</h5>
              <div className="space-y-3 opacity-60">
                <p className="hover:opacity-100 cursor-pointer">Privacy Policy</p>
                <p className="hover:opacity-100 cursor-pointer">Terms & Conditions</p>
                <p className="hover:opacity-100 cursor-pointer">Public Disclosures</p>
                <p className="hover:opacity-100 cursor-pointer">Disclaimer</p>
              </div>
           </div>
           <div className="space-y-6">
              <h5 className="font-black uppercase tracking-[0.3em] text-orange-500">About Us</h5>
              <div className="space-y-3 opacity-60">
                <p className="hover:opacity-100 cursor-pointer">Overview</p>
                <p className="hover:opacity-100 cursor-pointer">CSR</p>
                <p className="hover:opacity-100 cursor-pointer">Investor Relations</p>
                <p className="hover:opacity-100 cursor-pointer">Newsroom</p>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 text-center">
           <div className="flex justify-center gap-6 mb-8 text-xl opacity-40">
              <span>🐦</span><span>📘</span><span>📸</span><span>💼</span>
           </div>
           <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-orange-500">Nibhaye Vaade Since 2001</p>
           <p className="text-[9px] opacity-40 font-bold uppercase tracking-widest">© 2024 ICICI Lombard General Insurance Company Limited. IRDAI Reg No. 115.</p>
        </div>
      </footer>
    </div>
  );
};

type AppState = 'landing' | 'elevate' | 'login' | 'fetching' | 'success';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [loginError, setLoginError] = useState('');
  const [fetchingMessage, setFetchingMessage] = useState('Fetching User Details...');
  const [intendedDestination, setIntendedDestination] = useState<AppState | null>(null);

  const VALID_NUMBER = '8888888888';

  const handleExploreClick = () => {
    if (isLoggedIn) {
      setAppState('elevate');
    } else {
      setIntendedDestination('elevate');
      setAppState('login');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (mobileNumber.length !== 10) {
      setLoginError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (mobileNumber === VALID_NUMBER) {
      setAppState('fetching');
    } else {
      setAppState('fetching');
      setTimeout(() => {
        setAppState('login');
        setLoginError('User details not found. Please ensure you are a registered policyholder.');
      }, 1500);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setMobileNumber(val);
      if (loginError) setLoginError('');
    }
  };

  useEffect(() => {
    if (appState === 'fetching' && mobileNumber === VALID_NUMBER) {
      const messages = [
        "Verifying Policy Credentials...",
        "Connecting to ICICI Insurance Core...",
        "Deploying RIA Assistant Hub..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < messages.length) {
          setFetchingMessage(messages[i]);
          i++;
        }
      }, 700);

      const t = setTimeout(() => {
        setAppState('success');
        clearInterval(interval);
      }, 2100);
      
      return () => { clearTimeout(t); clearInterval(interval); };
    }
  }, [appState, mobileNumber]);

  useEffect(() => {
    if (appState === 'success') {
      const t = setTimeout(() => { 
        setIsLoggedIn(true); 
        setAppState(intendedDestination || 'elevate'); 
        setIntendedDestination(null);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [appState, intendedDestination]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav onLoginClick={() => setAppState('login')} onHomeClick={() => setAppState('landing')} isLoggedIn={isLoggedIn} />
      <main className="flex-1 relative">
        {appState === 'landing' && <HomeView onExplore={handleExploreClick} />}
        {appState === 'elevate' && <ElevateView />}
        {appState === 'login' && (
          <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 w-full max-w-sm animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 icici-maroon-bg rounded-2xl flex items-center justify-center text-white font-black mx-auto mb-8 shadow-2xl">i</div>
              <h2 className="text-2xl font-black text-center mb-2 icici-maroon-text uppercase tracking-tight">Customer Portal</h2>
              <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Access Your Protection</p>
              
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={mobileNumber} 
                      onChange={handleMobileChange} 
                      placeholder="Registered Mobile" 
                      maxLength={10}
                      className={`w-full bg-slate-50 border-2 ${loginError ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-5 px-6 font-black text-sm focus:border-orange-500 outline-none transition-all shadow-inner`} 
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 tracking-widest">
                      {mobileNumber.length}/10
                    </div>
                  </div>
                  {loginError && <p className="text-[10px] text-red-500 font-black ml-2 animate-in slide-in-from-top-1 leading-tight">{loginError}</p>}
                </div>
                <button type="submit" className="w-full icici-maroon-bg text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-800 shadow-xl transition-all active:scale-95">Verify Account</button>
                <div className="pt-6 text-center">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Demo Policy No: <span className="text-orange-500">8888888888</span></p>
                </div>
              </form>
            </div>
          </div>
        )}
        {appState === 'fetching' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
            <div className="relative">
               <div className="w-20 h-20 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center text-xl font-black icici-maroon-text">i</div>
            </div>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse text-center max-w-xs">{fetchingMessage}</p>
          </div>
        )}
        {appState === 'success' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white text-4xl animate-in zoom-in shadow-2xl shadow-green-100">✓</div>
            <p className="text-[11px] font-black text-green-600 uppercase tracking-widest">Access Granted</p>
          </div>
        )}
        {/* RIA AI is persistent throughout the experience */}
        {isLoggedIn && <Chatbot />}
      </main>
    </div>
  );
};

export default App;