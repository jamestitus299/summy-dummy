/* ============================================================
   MODULE-SCOPE CONSTANTS, HELPERS & ANALYTICS
   ============================================================ */

// Declare in module scope & attach to window to prevent ReferenceError across all execution contexts
const trackAnalyticsEvent = (eventName, action, data = {}, silent = false) => {
  try {
    if (typeof window !== "undefined") {
      if (typeof window.gtag === "function") {
        window.gtag("event", action || eventName, data);
      } else if (typeof window.fbq === "function") {
        window.fbq("track", eventName, data);
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: eventName, action, ...data });
      }
    }
  } catch (e) {
    // Fail silently in development or sandbox environments
  }
};

if (typeof window !== "undefined") {
  window.trackAnalyticsEvent = trackAnalyticsEvent;
}

const YEAR = new Date().getFullYear();

const cld = (url, w = 800) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${w}/`);
};

// BRANDING & ASSET URLS
const LOGO_ICON_URL = "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/e7060ec5-dfe9-47aa-3b9d-1afe5ff14500/public";
const HERO_BACKGROUND_ICON_URL = "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/6925fb42-97ee-4e23-6b7e-aub77fa55800/public";
const TEAM_PHOTO_URL = "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/f6af7456-3e61-4a44-c279-7bfa47cad400/public";
const NEW_STRAVA_LOGO = "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/3f62b5a5-6bf0-4c41-f462-5b90f10aa100/public";

// GLOBAL LIGHT APPLE-STYLE CSS
const GLOBAL_CSS = `
  :root {
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    -webkit-tap-highlight-color: transparent;
    background-color: #F5F5F7;
    color: #1D1D1F;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Inter", sans-serif;
  }

  section {
    scroll-margin-top: 80px;
  }

  .font-mono { font-family: 'JetBrains Mono', monospace; }
  .font-manrope { font-family: 'Manrope', sans-serif; }
  
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  .apple-card {
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    border-radius: 24px;
  }

  .apple-glass {
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .hero-mesh-bg {
    background-image: 
      radial-gradient(circle at 50% 20%, rgba(0, 113, 227, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 80% 80%, rgba(0, 113, 227, 0.04) 0%, transparent 50%),
      radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 0);
    background-size: 100% 100%, 100% 100%, 24px 24px;
  }
`;
const GLOBAL_CSS_HTML = { __html: GLOBAL_CSS };

// ECOSYSTEM PARTNER LOGOS
const PARTNER_LOGOS = [
  { name: "Strava", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/3f62b5a5-6bf0-4c41-f462-5b90f10aa100/public" },
  { name: "Garmin", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/2d62241d-5772-45b6-1d8b-e8d7824b9700/public" },
  { name: "Wahoo", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/5a377286-2b4f-44f4-7a5a-7d68d83acb00/public" },
  { name: "Intervals.icu", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/1a3df848-0e2e-4ee8-f085-2af1a3de3f00/public" },
  { name: "TrainingPeaks", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/62493290-aa25-4b4e-ebf2-85ecee52d700/public" },
  { name: "Join.cc", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/e2956a2c-bf20-4737-fd1b-4b74a225ee00/public" },
  { name: "Zwift", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/6a708b40-5084-4fa7-cdaf-6a9ace4de300/public" },
  { name: "TrainerRoad", logo: "https://imagedelivery.net/O-X2p33aPnIKIdnqc35LFA/3b457199-567a-4823-ab70-598116f24600/public" }
];

const APPAREL_SLIDES = [
  { title: "Domestique.live Cycling Jersey", img: cld("https://res.cloudinary.com/ddbxywpjr/image/upload/v1782984468/tshirt_salpoy.png", 600) },
  { title: "Domestique.live Cycling Short", img: cld("https://res.cloudinary.com/ddbxywpjr/image/upload/v1782984468/shorts_bygnkw.png", 600) },
  { title: "Domestique.live Leg Sleeves", img: cld("https://res.cloudinary.com/ddbxywpjr/image/upload/v1782984468/leg_sleves_zizrer.png", 600) },
  { title: "Domestique.live Ride Gloves", img: cld("https://res.cloudinary.com/ddbxywpjr/image/upload/v1782984467/gloves_jcexrx.png", 600) },
  { title: "Domestique.live Cap", img: cld("https://res.cloudinary.com/ddbxywpjr/image/upload/v1782984467/cap_tu2hvd.png", 600) },
];

const FEATURES = [
  { 
    id: "01", 
    title: "Adaptive Push", 
    video: "https://res.cloudinary.com/ddbxywpjr/video/upload/v1781515380/PERFORMANCE_RIDE_hiplyg.mp4", 
    quote: "Heart rate rising but power is dropping. Maintain effort.",
    whyItMatters: "Post-ride analysis only tells you that you faded. Real-time audio catches fatigue mid-interval, giving you the micro-adjustment needed to finish the set cleanly."
  },
  { 
    id: "02", 
    title: "Pacing & Group Rides", 
    video: "https://res.cloudinary.com/ddbxywpjr/video/upload/v1781515364/GROUP_RIDE_1_yxjgtb.mp4", 
    quote: "Pacing optimal for this break. Hold current output.",
    whyItMatters: "Stop getting baited into burning matches early on group rides. Your digital coach calculates your threshold headroom live so you stay fresh for the final sprint."
  },
  { 
    id: "03", 
    title: "Live Course Routing", 
    video: "https://res.cloudinary.com/ddbxywpjr/video/upload/v1781515350/SIGHTSEEING_1_wskvbo.mp4", 
    quote: "Climb starting in 200 meters. Shift gears and settle into Zone 3.",
    whyItMatters: "Eliminates surprise gradient shifts. You hear gear and cadence cues ahead of terrain changes so you hit climbs with optimal momentum."
  },
  { 
    id: "04", 
    title: "Threshold Protection", 
    video: "https://res.cloudinary.com/ddbxywpjr/video/upload/v1781515388/COMMUTE_RIDE_1_dys5hm.mp4", 
    quote: "Over-pacing detected on early slope. Ease off 15 watts to save legs.",
    whyItMatters: "Preventing a blowout beat-by-beat is 10x more valuable than reading a red graph on Strava 2 hours later."
  },
  { 
    id: "05", 
    title: "Active Recovery", 
    video: "https://res.cloudinary.com/ddbxywpjr/video/upload/v1781515384/coffee_ride_la0byt.mp4", 
    poster: "https://res.cloudinary.com/ddbxywpjr/video/upload/v1781515384/coffee_ride_la0byt.jpg", 
    quote: "Great interval block. Drop to Zone 2 and recover for 3 minutes.",
    whyItMatters: "Optimizes rest periods between efforts so you clear lactate efficiently and hit the next rep at maximum target wattage."
  },
  { 
    id: "06", 
    title: "Zone Control", 
    video: "https://res.cloudinary.com/ddbxywpjr/video/upload/v1782300028/full_video_1_wjqxd6.mp4", 
    quote: "You are drifting into Zone 4 prematurely. Dial back cadence.",
    whyItMatters: "Ensures Zone 2 rides actually stay in Zone 2. Protects your physiological adaptations from accidental over-exertion."
  }
];

const PRODUCT_IMAGES = [
  "https://res.cloudinary.com/ddbxywpjr/image/upload/v1779102005/Home_Pgae_img_nt6cwl.png",
  "https://res.cloudinary.com/ddbxywpjr/image/upload/v1779102372/card-2_whrzwh.png",
  "https://res.cloudinary.com/ddbxywpjr/image/upload/v1779102373/card-3_lnse1m.png",
  "https://res.cloudinary.com/ddbxywpjr/image/upload/v1779102372/card-4_n2g3e3.png"
];

const HERO_SLOGANS = [
  "LOOK AT THE ROAD. LISTEN TO THE COACH.",
  "STOP WAITING FOR POST-RIDE ANALYTICS.",
  "MID-RIDE GUIDANCE, NOT POST-MORTEMS.",
  "YOUR DIGITAL DOMESTIQUE IN YOUR EAR.",
  "MAKE THE MOST OF EVERY TRAINING RIDE."
];

const FLOW_STEPS = [
  { step: "01", icon: Compass, title: "Pre-Ride Target Sync", desc: "Open Domestique.live. It imports your planned workout or route, creating target zone parameters before you clip in." },
  { step: "02", icon: Gauge, title: "Live Sensor Feed", desc: "Your Bluetooth power meter, heart rate monitor, and cadence sensors stream telemetry directly into our edge engine." },
  { step: "03", icon: Volume2, title: "Open-Ear Bone Conduction", desc: "Lightweight audio sits cleanly on your cheekbones. You hear ambient traffic, your friends, and crisp voice coaching." },
  { step: "04", icon: Cpu, title: "Real-Time Adaptations", desc: "Our engine continuously compares live output against target wattage, adjusting coaching based on real-time fatigue." },
  { step: "05", icon: Zap, title: "In-Ride Execution", desc: "Immediate audio cues tell you when to push, when to recover, and how to complete intervals at maximum quality." }
];

const SETUP_ITEMS = ["Domestique Hardware Unit", "12-Month Intelligence License", "Magnetic Rapid-Charge Cable", "Ecosystem Integration Guide"];

const TABLE_ECOSYSTEM_DATA = [
  {
    tool: "Garmin & Wahoo",
    category: "GPS Bike Computers",
    icon: Smartphone,
    legacyApproach: "Shows numbers on glass screens that require you to constantly glance down at speed.",
    domestiqueApproach: "Reads Bluetooth streams live and delivers voice coaching without taking eyes off the road."
  },
  {
    tool: "Strava & Intervals.icu",
    category: "Post-Ride Analytics",
    icon: Activity,
    legacyApproach: "Provides post-mortem graphs telling you why you blew up 2 hours after your ride finishes.",
    domestiqueApproach: "Intervenes mid-effort before you hit the wall, calculating live threshold headroom."
  },
  {
    tool: "TrainingPeaks & Join.cc",
    category: "Training Calendars",
    icon: Award,
    legacyApproach: "Creates structured calendar workouts, but leaves real-world pacing execution up to memory.",
    domestiqueApproach: "Executes your workout step-by-step on open roads with precise voice-guided interval timing."
  },
  {
    tool: "Zwift & TrainerRoad",
    category: "Indoor ERG Simulators",
    icon: Repeat,
    legacyApproach: "Offers strict indoor ERG-mode control, but provides zero active pacing guidance outdoors.",
    domestiqueApproach: "Brings structured, adaptive workout execution directly onto dynamic real-world outdoor terrain."
  }
];

const RESEARCH_PAPERS = [
  {
    title: "The Cognitive, Physiological, and Technological Efficacy of AI-Driven Auditory Coaching in Cycling",
    url: "https://www.alphanome.ai/post/the-cognitive-physiological-and-technological-efficacy-of-ai-driven-auditory-coaching-in-cycling",
    tag: "Cognitive Load & Auditory Science",
    summary: "Examines how voice-based audio instruction significantly reduces cognitive friction and visual distraction compared to handlebar screens, lowering perceived exertion (RPE) during high-threshold intervals."
  },
  {
    title: "The Temporal Dynamics of AI in Endurance Cycling: A Comparative Analysis of Real-Time Auditory Coaching",
    url: "https://www.alphanome.ai/post/the-temporal-dynamics-of-ai-in-endurance-cycling-a-comparative-analysis-of-real-time-auditory-coach",
    tag: "Physiological Pacing & W' Bal",
    summary: "Analyzes the math and physiological benefits of sub-second mid-ride feedback over post-ride data analysis, detailing how real-time W' balance calculations prevent premature anaerobic exhaustion."
  },
  {
    title: "How Wearable ADAS for Cyclists (Advanced Driver Assistance Systems) Prevents Fatalities",
    url: "https://www.alphanome.ai/post/how-wearable-adas-for-cyclist-advanced-driver-assistance-systems-prevent-vulnerable-road-user-fata",
    tag: "Acoustic Safety & Open-Ear Hardware",
    summary: "Explores open-ear acoustic transparency, directional micro-audio cues, and the safety engineering behind keeping the ear canal completely unobstructed while training in dynamic traffic environments."
  }
];

const PREORDER_FAQS = [
  { q: "Will the audio interrupt me constantly during a ride?", a: "Silence is a primary feature. Domestique.live is not a radio DJ; it acts as an experienced digital domestique. It only speaks when a biometric threshold is crossed or an interval target demands adjustment. Otherwise, it leaves you in total peace." },
  { q: "Why use this instead of a traditional bike computer?", a: "A bike computer requires constant visual glances. Domestique.live works alongside your Garmin or Wahoo to deliver live audio interpretation so you never take your eyes off the road." },
  { q: "What sensors does the Domestique app support?", a: "It connects directly via Bluetooth to standard power meters, heart rate monitors, and cadence sensors parallel to your existing head unit." },
  { q: "How is bone-conduction audio better than standard earbuds?", a: "Traditional earbuds trap wind noise and seal off your ears. Open-ear bone conduction transmits acoustic vibrations through your cheekbones, keeping your ear canal 100% open for ambient awareness." },
  { q: "What happens if I lose cellular service on a remote climb?", a: "The system runs localized edge calculations. Your strategy and route parameters are cached pre-ride, ensuring full live coaching even without cellular signal." },
  { q: "Will this interfere with my Spotify music or podcasts?", a: "No. Domestique.live utilizes intelligent 'audio ducking'. When the coach speaks, music volume drops smoothly and returns to normal immediately afterward." },
  { q: "What occurs after the included 12-month license expires?", a: "The live intelligence platform transitions to a standard €15/month subscription. You retain full ownership of your hardware unit." },
  { q: "How does this differ from Strava or TrainingPeaks?", a: "Strava and TrainingPeaks analyze past workouts. Domestique.live works live during the effort, guiding your output in real time." }
];

const PRIMARY_PERKS = [
  {
    tier: "TIER 1", tag: "PRIORITY ACCESS", name: "THE DOMESTIQUE", price: "€290",
    featured: false, delivery: "Q1 2027 - First Batch", stripeBuyButtonId: "buy_btn_1Tp94sIVuCvdmBxBbTNIwUQf",
    includes: ["Domestique.live Hardware Unit", "12-Month Intelligence License", "Closed Beta App Access", "Domestique.live Performance T-Shirt"]
  },
  {
    tier: "TIER 2", tag: "COMPLETE SYSTEM", name: "THE PUNCHEUR", price: "€390",
    featured: true, delivery: "Q1 2027 - First Batch", stripeBuyButtonId: "buy_btn_1TjmdCIVuCvdmBxBOxo03kE8",
    includes: ["Everything in The Domestique plus:", "Domestique.live Cycling Jersey", "Domestique.live Cycling Short", "Domestique.live Leg Sleeves"]
  },
  {
    tier: "TIER 3", tag: "LIFETIME VIP", name: "THE DIRECTEUR SPORTIF", price: "€520",
    featured: false, delivery: "Q1 2027 - First Batch", stripeBuyButtonId: "buy_btn_1TjmkEIVuCvdmBxBiLAtFvU6",
    includes: ["Everything in The Puncheur plus:", "Domestique.live Ride Gloves", "Domestique.live Cap", "24-Month Extended License", "Lifetime 30% Vanguard Discount"]
  }
];

const BATCH_2_PERK = {
  tier: "BATCH 2 RESERVATION", tag: "SECOND DELIVERY RUN", name: "RESERVE BATCH 2 SPOT", price: "€10",
  delivery: "Q2 2027 - Second Batch", stripeBuyButtonId: "buy_btn_1TyImOIVuCvdmBxB9SdcXtOw",
  includes: [
    "Priority Spot in Q2 2027 Delivery Batch",
    "Locks in Early Founder Discount Price",
    "Fully Refundable Deposit Option",
    "€10 Deposit Credited Toward Final Order"
  ]
};

const PERKS_WITH_APPAREL = PRIMARY_PERKS.map((perk) => ({
  ...perk,
  apparel: perk.includes
    .map((title) => {
      const index = APPAREL_SLIDES.findIndex((s) => s.title === title);
      return index >= 0 ? { ...APPAREL_SLIDES[index], index } : null;
    })
    .filter(Boolean)
}));

const MAILERLITE_SUBSCRIBE_URL = "https://assets.mailerlite.com/jsonp/2507589/forms/192902572178146649/subscribe";

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const TwitterXIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

/* Helper Component: Order Card Trust Bar */
const CardTrustBadges = React.memo(function CardTrustBadges() {
  return (
    <div className="mt-4 pt-3 border-t border-black/5 space-y-2">
      <div className="flex items-center justify-between text-[11px] text-[#515154] font-medium">
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[#0071E3]" /> Free Express Shipping
        </span>
        <span className="flex items-center gap-1">
          <RotateCcw className="w-3.5 h-3.5 text-[#0071E3]" /> 100% Guaranteed
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-[#86868B]">
        <Lock className="w-3 h-3 text-[#0071E3]" />
        <span>256-Bit Encrypted Stripe Checkout</span>
      </div>
    </div>
  );
});

/* Helper Component: Large D Logo Background Watermark */
const BackgroundLogoWatermark = React.memo(function BackgroundLogoWatermark() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07] z-0 overflow-hidden">
      <img src={LOGO_ICON_URL} alt="" className="w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] object-contain" />
    </div>
  );
});

/* Helper function for strictly ref-based smooth scrolling */
const scrollToRef = (ref) => {
  if (ref && ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/* ============================================================
   NAVIGATION
   ============================================================ */
const SiteNavigation = React.memo(function SiteNavigation({ isMobileMenuOpen, setIsMobileMenuOpen, sectionRefs }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] apple-glass border-b border-black/5" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="max-w-6xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
        <button 
          id="nav-logo-btn"
          type="button"
          className="cursor-pointer flex items-center gap-2.5 group touch-manipulation border-none bg-transparent p-0 text-left" 
          onClick={() => scrollToRef(sectionRefs.hero)}
        >
          <img src={LOGO_ICON_URL} alt="Domestique.live Icon" className="h-8 w-8 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-semibold tracking-tight text-lg text-[#1D1D1F] font-manrope">Domestique<span className="text-[#0071E3]">.live</span></span>
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#515154]">
          <button id="nav-btn-coach" type="button" onClick={() => scrollToRef(sectionRefs.coach)} className="hover:text-[#0071E3] transition-colors">Real-Time Coach</button>
          <button id="nav-btn-flow" type="button" onClick={() => scrollToRef(sectionRefs.flow)} className="hover:text-[#0071E3] transition-colors">How It Works</button>
          <button id="nav-btn-ecosystem" type="button" onClick={() => scrollToRef(sectionRefs.ecosystem)} className="hover:text-[#0071E3] transition-colors">Ecosystem</button>
          <button id="nav-btn-hardware" type="button" onClick={() => scrollToRef(sectionRefs.hardware)} className="hover:text-[#0071E3] transition-colors">Hardware</button>
          <button id="nav-btn-team" type="button" onClick={() => scrollToRef(sectionRefs.team)} className="hover:text-[#0071E3] transition-colors">Our Story</button>
          <button id="nav-btn-faq" type="button" onClick={() => scrollToRef(sectionRefs.faq)} className="hover:text-[#0071E3] transition-colors">FAQ</button>
          <button id="nav-btn-community" type="button" onClick={() => scrollToRef(sectionRefs.instagram)} className="hover:text-[#0071E3] transition-colors">Community</button>
          <button 
            id="nav-btn-preorder"
            type="button"
            onClick={() => {
              trackAnalyticsEvent('InitiateCheckout', 'begin_checkout', { content_name: 'Nav Pre-Order Button' });
              scrollToRef(sectionRefs.pricing);
            }} 
            className="bg-[#0071E3] text-white hover:bg-[#0077ED] px-5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow"
          >
            Pre-Order Now
          </button>
        </div>

        <button id="nav-toggle-mobile" type="button" className="md:hidden p-2 text-[#1D1D1F] touch-manipulation" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden apple-glass border-b border-black/10 px-6 py-6 flex flex-col gap-4 font-medium text-lg text-[#1D1D1F] animate-in slide-in-from-top-2">
          <button id="mobile-nav-coach" type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToRef(sectionRefs.coach); }} className="text-left py-2 border-b border-black/5 touch-manipulation">Real-Time Coach</button>
          <button id="mobile-nav-flow" type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToRef(sectionRefs.flow); }} className="text-left py-2 border-b border-black/5 touch-manipulation">How It Works</button>
          <button id="mobile-nav-ecosystem" type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToRef(sectionRefs.ecosystem); }} className="text-left py-2 border-b border-black/5 touch-manipulation">Ecosystem Comparison</button>
          <button id="mobile-nav-hardware" type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToRef(sectionRefs.hardware); }} className="text-left py-2 border-b border-black/5 touch-manipulation">Hardware</button>
          <button id="mobile-nav-team" type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToRef(sectionRefs.team); }} className="text-left py-2 border-b border-black/5 touch-manipulation">Our Story & Team</button>
          <button id="mobile-nav-faq" type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToRef(sectionRefs.faq); }} className="text-left py-2 border-b border-black/5 touch-manipulation">FAQ & Questions</button>
          <button id="mobile-nav-community" type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToRef(sectionRefs.instagram); }} className="text-left py-2 border-b border-black/5 touch-manipulation">Community & Reels</button>
          <button 
            id="mobile-nav-preorder"
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              trackAnalyticsEvent('InitiateCheckout', 'begin_checkout', { content_name: 'Mobile Nav Pre-Order Button' });
              scrollToRef(sectionRefs.pricing);
            }} 
            className="bg-[#0071E3] text-white text-center py-3 rounded-xl font-semibold mt-2 touch-manipulation"
          >
            Pre-Order Now
          </button>
        </div>
      )}
    </nav>
  );
});

/* ============================================================
   MAIN SINGLE-PAGE COMPONENT
   ============================================================ */
export default function DomestiqueWebsite() {
  const topRef = useRef(null);
  
  /* STRICT SECTION REFS FOR ALL SCROLLING */
  const heroRef = useRef(null);
  const coachRef = useRef(null);
  const flowRef = useRef(null);
  const ecosystemRef = useRef(null);
  const hardwareRef = useRef(null);
  const pricingRef = useRef(null);
  const teamRef = useRef(null);
  const faqRef = useRef(null);
  const instagramRef = useRef(null);

  const sectionRefs = {
    hero: heroRef,
    coach: coachRef,
    flow: flowRef,
    ecosystem: ecosystemRef,
    hardware: hardwareRef,
    pricing: pricingRef,
    team: teamRef,
    faq: faqRef,
    instagram: instagramRef
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [apparelSliderOpen, setApparelSliderOpen] = useState(false);
  const [apparelSliderIndex, setApparelSliderIndex] = useState(0);

  // POLICY MODAL STATES ('return' | 'shipping' | 'privacy' | null)
  const [activePolicy, setActivePolicy] = useState(null);

  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [discountCopied, setDiscountCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [newsletterError, setNewsletterError] = useState('');
  const [sloganIndex, setSloganIndex] = useState(0);

  // TECHNICAL ARCHITECTURE & SCIENCE MODAL STATES
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [showScienceModal, setShowScienceModal] = useState(false);

  const [questionSent, setQuestionSent] = useState(false);
  const [userQuestion, setUserQuestion] = useState({ name: '', email: '', message: '' });

  const featuresScrollRef = useRef(null);
  const productsScrollRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById('stripe-buy-button-script')) {
      const script = document.createElement('script');
      script.id = 'stripe-buy-button-script';
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const sloganTimer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % HERO_SLOGANS.length);
    }, 3500);
    return () => clearInterval(sloganTimer);
  }, []);

  useEffect(() => {
    trackAnalyticsEvent('PageView', 'page_view');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowDiscountPopup(true), 30000);
    return () => clearInterval(timer);
  }, []);

  /* RELIABLE CROSS-PLATFORM CAROUSEL SCROLL MECHANISM */
  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = window.innerWidth < 768 ? Math.round(window.innerWidth * 0.8) : 400;
      const delta = direction === 'left' ? -scrollAmount : scrollAmount;
      ref.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    if (newsletterStatus === 'loading') return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, String(value)));
    params.set('ajax', '1');

    setNewsletterStatus('loading');
    setNewsletterError('');

    try {
      const response = await fetch(`${MAILERLITE_SUBSCRIBE_URL}?${params.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Could not subscribe. Please try again.');

      const result = await response.json();
      if (!result.success) {
        const emailErrors = result.errors?.fields?.email;
        throw new Error(Array.isArray(emailErrors) && emailErrors[0] ? emailErrors[0] : 'Could not subscribe.');
      }

      form.reset();
      setNewsletterStatus('success');
      trackAnalyticsEvent('Lead', 'generate_lead', { content_name: 'Newsletter Subscription' });
    } catch (error) {
      setNewsletterError(error instanceof Error ? error.message : 'Could not subscribe.');
      setNewsletterStatus('error');
    }
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    setQuestionSent(true);
    trackAnalyticsEvent('Contact', 'submit_question', { email: userQuestion.email });
    setTimeout(() => {
      setQuestionSent(false);
      setUserQuestion({ name: '', email: '', message: '' });
    }, 4000);
  };

  const handleCopyDiscount = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText("25OFF");
    }
    setDiscountCopied(true);
    trackAnalyticsEvent('Lead', 'generate_lead', { content_name: 'Discount Copied' });
    setTimeout(() => setDiscountCopied(false), 2000);
  };

  return (
    <HelmetProvider>
      <div ref={topRef} className="bg-[#F5F5F7] text-[#1D1D1F] min-h-screen selection:bg-[#0071E3] selection:text-white">
        <Helmet>
          <title>Domestique.live - Real-Time AI Cycling Coach</title>
          <meta name="description" content="Domestique.live delivers live audio coaching and open-ear bone conduction performance guidance while you ride." />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" />
        </Helmet>
        
        <style dangerouslySetInnerHTML={GLOBAL_CSS_HTML} />

        <SiteNavigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} sectionRefs={sectionRefs} />

        {/* HERO SECTION WITH NEW HEADER BACKGROUND IMAGE */}
        <section ref={heroRef} id="hero" className="hero-mesh-bg relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center overflow-hidden border-b border-black/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08] z-0 overflow-hidden">
            <img src={HERO_BACKGROUND_ICON_URL} alt="" loading="lazy" decoding="async" className="w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] object-contain" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-black/10 px-4 py-1.5 rounded-full text-xs font-semibold text-[#0071E3] shadow-sm mb-6">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#0071E3]" /> Q1 2027 Founder's Series Open
            </div>

            <div className="relative h-20 sm:h-28 md:h-32 mb-4 flex items-center justify-center max-w-4xl mx-auto">
              {HERO_SLOGANS.map((slogan, i) => (
                <h1
                  key={slogan}
                  className={`absolute inset-0 flex items-center justify-center font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#1D1D1F] transition-all duration-700 ease-in-out ${
                    i === sloganIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  {slogan}
                </h1>
              ))}
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-[#86868B] max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
              Post-ride charts show where you failed. <strong className="text-[#1D1D1F] font-semibold">Domestique.live</strong> guides you in real-time. Our open-ear bone conduction headset and AI Digital Domestique deliver voice pacing, interval timing, and recovery cues <span className="underline decoration-[#0071E3] underline-offset-4 font-semibold text-[#1D1D1F]">while you are still pedaling</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
              <button
                id="hero-cta-preorder"
                type="button"
                onClick={() => {
                  trackAnalyticsEvent('InitiateCheckout', 'begin_checkout', { content_name: 'Hero Primary CTA' });
                  scrollToRef(pricingRef);
                }}
                className="w-full sm:w-auto bg-[#0071E3] text-white hover:bg-[#0077ED] font-semibold text-base px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 touch-manipulation"
              >
                Pre-Order Your Advantage <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-cta-how-it-works"
                type="button"
                onClick={() => scrollToRef(coachRef)}
                className="w-full sm:w-auto bg-white border border-black/10 hover:border-black/20 text-[#1D1D1F] font-semibold text-base px-8 py-4 rounded-full transition-all touch-manipulation"
              >
                How It Works
              </button>
            </div>

            {/* HIGH-VISIBILITY CORE PILLARS BANNER */}
            <div className="max-w-4xl mx-auto apple-card p-6 md:p-8 bg-gradient-to-br from-white via-white to-[#F5F5F7] border-2 border-[#0071E3]/20 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F5F5F7]/80 border border-black/5 hover:border-[#0071E3]/30 transition-all">
                  <div className="p-3 bg-[#0071E3] text-white rounded-2xl mb-3 shadow-sm">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#1D1D1F] mb-1">Bone Conduction</h3>
                  <span className="inline-block text-xs font-bold text-[#0071E3] bg-[#0071E3]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    100% Open Ears
                  </span>
                  <p className="text-xs text-[#86868B] mt-2 leading-relaxed">
                    Acoustic transducers transmit cues directly through cheekbones, keeping your ear canal totally open for traffic and group chats.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F5F5F7]/80 border border-black/5 hover:border-[#0071E3]/30 transition-all">
                  <div className="p-3 bg-[#0071E3] text-white rounded-2xl mb-3 shadow-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#1D1D1F] mb-1">Real-Time Pacing</h3>
                  <span className="inline-block text-xs font-bold text-[#0071E3] bg-[#0071E3]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Zero Screen Distraction
                  </span>
                  <p className="text-xs text-[#86868B] mt-2 leading-relaxed">
                    Spoken target wattages and cadence adjustments mean you keep your eyes strictly on the road, not down at handlebars.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F5F5F7]/80 border border-black/5 hover:border-[#0071E3]/30 transition-all">
                  <div className="p-3 bg-[#0071E3] text-white rounded-2xl mb-3 shadow-sm">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#1D1D1F] mb-1">In-Ride Execution</h3>
                  <span className="inline-block text-xs font-bold text-[#0071E3] bg-[#0071E3]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Digital Domestique
                  </span>
                  <p className="text-xs text-[#86868B] mt-2 leading-relaxed">
                    Adaptive AI algorithms calculate fatigue and threshold headroom live to guide interval timing and pacing beat-by-beat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUE PROP: REAL-TIME COACH */}
        <section ref={coachRef} id="coach" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm md:text-base font-extrabold text-[#0071E3] uppercase tracking-wider block mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0071E3]" /> Real-Time Vs. Post-Ride Analysis
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">Why Active Cyclists Need In-Ride Coaching</h2>
            <p className="text-lg text-[#86868B] max-w-2xl mx-auto mt-3">Post-training software provides a post-mortem. Real-time audio coaching intervenes when it actually counts: during the effort.</p>
          </div>

          <div ref={featuresScrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 hide-scrollbar pb-6">
            {FEATURES.map((feature) => (
              <div key={feature.id} className="w-[85vw] sm:w-[380px] shrink-0 snap-center apple-card p-6 flex flex-col justify-between">
                <div>
                  <div className="rounded-xl overflow-hidden mb-4 border border-black/5 bg-black">
                    <video 
                      controls 
                      playsInline 
                      preload="metadata" 
                      poster={feature.poster} 
                      className="w-full aspect-[4/3] object-cover"
                      onPlay={() => trackAnalyticsEvent('WatchVideo', 'video_start', { video_title: feature.title }, true)}
                    >
                      <source src={feature.video} type="video/mp4" />
                    </video>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#0071E3]" />
                    <h3 className="font-bold text-lg text-[#1D1D1F]">{feature.title}</h3>
                  </div>

                  <div className="bg-[#F5F5F7] p-3.5 rounded-xl border border-black/5 mb-4">
                    <p className="text-xs text-[#515154] italic font-semibold">"{feature.quote}"</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5">
                  <span className="text-xs font-bold text-[#0071E3] uppercase tracking-wider block mb-1">Why This Beats Post-Ride Data</span>
                  <p className="text-xs text-[#515154] leading-relaxed">{feature.whyItMatters}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button id="carousel-btn-features-left" type="button" onClick={() => scrollCarousel(featuresScrollRef, 'left')} className="p-3 apple-card hover:bg-black/5 touch-manipulation"><ChevronLeft className="w-5 h-5"/></button>
            <button id="carousel-btn-features-right" type="button" onClick={() => scrollCarousel(featuresScrollRef, 'right')} className="p-3 apple-card hover:bg-black/5 touch-manipulation"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </section>

        {/* STEP-BY-STEP FLOW & EMBEDDED YOUTUBE DEMO VIDEO */}
        <section ref={flowRef} id="flow" className="relative py-16 md:py-24 px-4 sm:px-6 bg-[#EBEBEF] border-y border-black/5 overflow-hidden">
          <BackgroundLogoWatermark />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="text-sm md:text-base font-extrabold text-[#0071E3] uppercase tracking-wider block mb-2 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#0071E3]" /> How It Works
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">The In-Ride Coaching Loop</h2>
              <p className="text-lg text-[#86868B] max-w-2xl mx-auto mt-3">From pre-ride targets to real-time audio execution on open roads.</p>
            </div>

            {/* EMBEDDED YOUTUBE DEMO VIDEO */}
            <div className="max-w-4xl mx-auto mb-16 apple-card overflow-hidden shadow-lg border border-black/10 bg-black">
              <div className="relative w-full aspect-video">
                <iframe 
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  loading="lazy"
                  src="https://www.youtube.com/embed/VyHThpEzqhI?si=O7ehuVv3CwypiaMy" 
                  title="Domestique.live How It Works Video Player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {FLOW_STEPS.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.step} className="apple-card p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#0071E3] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-[#0071E3]">{step.step}</span>
                        <StepIcon className="w-4 h-4 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
                      </div>
                      <h4 className="font-bold text-base text-[#1D1D1F] mb-2">{step.title}</h4>
                      <p className="text-xs text-[#86868B] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MOBILE-OPTIMIZED ECOSYSTEM COMPARISON & LOGO GRID */}
        <section ref={ecosystemRef} id="ecosystem" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm md:text-base font-extrabold text-[#0071E3] uppercase tracking-wider block mb-2 flex items-center justify-center gap-2">
              <Sliders className="w-4 h-4 text-[#0071E3]" /> Complementary Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">How Domestique.live Enhances Your Tools</h2>
            <p className="text-lg text-[#86868B] max-w-2xl mx-auto mt-3">Domestique.live does not replace your current tools. It connects parallel to your existing sensors and head unit, adding an active voice layer.</p>
          </div>

          {/* Mobile View (< 768px) */}
          <div className="block md:hidden space-y-4 mb-12">
            {TABLE_ECOSYSTEM_DATA.map((row) => {
              const RowIcon = row.icon;
              return (
                <div key={row.tool} className="apple-card p-5 border border-black/10">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/5">
                    <div className="p-2.5 bg-[#0071E3]/10 text-[#0071E3] rounded-xl shrink-0">
                      <RowIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#1D1D1F]">{row.tool}</h3>
                      <span className="text-[10px] text-[#86868B] uppercase font-mono">{row.category}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-black/5">
                      <span className="text-[10px] font-bold text-[#86868B] uppercase block mb-1">Legacy Approach</span>
                      <p className="text-xs text-[#515154] leading-relaxed">{row.legacyApproach}</p>
                    </div>

                    <div className="p-3.5 bg-[#0071E3]/5 rounded-xl border border-[#0071E3]/20">
                      <span className="text-[10px] font-bold text-[#0071E3] uppercase block mb-1">Domestique.live Real-Time Advantage</span>
                      <p className="text-xs font-medium text-[#1D1D1F] leading-relaxed flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                        <span>{row.domestiqueApproach}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View (>= 768px) */}
          <div className="hidden md:block apple-card overflow-hidden shadow-md border border-black/10 mb-16">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1D1D1F] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 border-r border-white/10 w-1/3">Cyclist Tool & Category</th>
                    <th className="py-4 px-6 border-r border-white/10 w-1/3">Standard Legacy Function</th>
                    <th className="py-4 px-6 bg-[#0071E3] w-1/3 text-white">Domestique.live Real-Time Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 text-xs">
                  {TABLE_ECOSYSTEM_DATA.map((row) => {
                    const RowIcon = row.icon;
                    return (
                      <tr key={row.tool} className="hover:bg-black/[0.02] transition-colors">
                        <td className="py-5 px-6 font-semibold border-r border-black/5 bg-[#F5F5F7]/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#0071E3]/10 text-[#0071E3] rounded-lg shrink-0">
                              <RowIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-sm text-[#1D1D1F] block">{row.tool}</span>
                              <span className="text-[10px] text-[#86868B] uppercase font-mono">{row.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 border-r border-black/5 text-[#515154] leading-relaxed">
                          {row.legacyApproach}
                        </td>
                        <td className="py-5 px-6 font-medium text-[#1D1D1F] bg-[#0071E3]/5 leading-relaxed">
                          <div className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
                            <span>{row.domestiqueApproach}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* LOGO SECTION UNDER THE TABLE */}
          <div className="apple-card p-8 bg-gradient-to-br from-white via-[#F5F5F7] to-white border border-black/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#0071E3]">
              <Layers className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Seamless Integration</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] mb-2">
              We Connect With All The Tools You Already Use & Love
            </h3>
            <p className="text-xs sm:text-sm text-[#86868B] max-w-xl mx-auto mb-8">
              Domestique.live hooks into your existing sensor network and favorite cycling apps in parallel—no lock-in, no ecosystem changes required.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center justify-center mb-6">
              {PARTNER_LOGOS.map((partner) => (
                <div key={partner.name} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-black/5 hover:border-[#0071E3]/30 transition-all shadow-sm">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    loading="lazy"
                    decoding="async"
                    className="h-8 w-auto max-w-[80px] object-contain mb-2 filter grayscale hover:grayscale-0 transition-all"
                  />
                  <span className="text-[11px] font-bold text-[#1D1D1F]">{partner.name}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#86868B] font-medium italic">
              ...and many more standard Bluetooth, ANT+, and REST API training platforms.
            </p>
          </div>
        </section>

        {/* HARDWARE & OPEN-EAR TECH */}
        <section ref={hardwareRef} id="hardware" className="relative py-16 md:py-24 px-4 sm:px-6 bg-[#EBEBEF] border-y border-black/5 overflow-hidden">
          <BackgroundLogoWatermark />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="text-sm md:text-base font-extrabold text-[#0071E3] uppercase tracking-wider block mb-2 flex items-center justify-center gap-2">
                <Cpu className="w-4 h-4 text-[#0071E3]" /> Ergonomic Precision
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">Bone-Conduction Architecture</h2>
              <p className="text-lg text-[#86868B] max-w-2xl mx-auto mt-3">Weighted at 26 grams. Bypasses the eardrum so your situational awareness and group conversations remain intact.</p>
            </div>

            {/* YOUTUBE VIDEO EMBEDDED ON TOP OF PRODUCT IMAGES */}
            <div className="max-w-4xl mx-auto mb-12 apple-card overflow-hidden shadow-lg border border-black/10 bg-black">
              <div className="relative w-full aspect-video">
                <iframe 
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  loading="lazy"
                  src="https://www.youtube.com/embed/k9lesOKGIvM?si=Rg2DKO9m3bCyAFR-" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div ref={productsScrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 hide-scrollbar pb-6 mb-8">
              {PRODUCT_IMAGES.map((img, idx) => (
                <button 
                  key={img} 
                  id={`product-img-btn-${idx}`}
                  type="button"
                  className="w-[80vw] sm:w-[320px] shrink-0 snap-center apple-card p-6 text-left hover:shadow-md transition-all touch-manipulation border border-black/5 cursor-pointer"
                  onClick={() => {
                    trackAnalyticsEvent('InspectProduct', 'view_item', { image_url: img }, true);
                    setSelectedImage(img);
                  }}
                >
                  <img src={cld(img, 800)} alt={`Hardware ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-48 object-contain mb-4" />
                  <span className="text-xs font-semibold text-[#0071E3] block text-center">Tap to inspect hardware detail</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-3 mb-12">
              <button id="carousel-btn-products-left" type="button" onClick={() => scrollCarousel(productsScrollRef, 'left')} className="p-3 apple-card hover:bg-black/5 touch-manipulation"><ChevronLeft className="w-5 h-5"/></button>
              <button id="carousel-btn-products-right" type="button" onClick={() => scrollCarousel(productsScrollRef, 'right')} className="p-3 apple-card hover:bg-black/5 touch-manipulation"><ChevronRight className="w-5 h-5"/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="apple-card p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-5 h-5 text-[#0071E3]" />
                    <h3 className="font-bold text-xl text-[#1D1D1F]">What's Included in the Box</h3>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {SETUP_ITEMS.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-[#515154]">
                        <Check className="w-4 h-4 text-[#0071E3] shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-black/5 text-xs text-[#86868B]">
                  Includes 12-month license, rapid charger, and ecosystem setup documentation.
                </div>
              </div>

              <div className="apple-card p-8 bg-white border border-black/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Volume2 className="w-5 h-5 text-[#0071E3]" />
                    <h3 className="font-bold text-xl text-[#1D1D1F]">Why Bone-Conduction Audio?</h3>
                  </div>
                  <p className="text-sm text-[#515154] leading-relaxed mb-4">
                    Standard earbuds block external noise and create wind turbulence. Bone-conduction transducers transmit acoustic vibrations directly through your cheekbones, leaving your ear canal 100% open for ambient sounds and riding buddies.
                  </p>
                </div>
                <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs font-semibold text-[#0071E3]">
                  <span>26 Grams Ultra-Light</span>
                  <span>10-Hour Battery Life</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & TIER PRE-ORDERS */}
        <section ref={pricingRef} id="pricing" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm md:text-base font-extrabold text-[#0071E3] uppercase tracking-wider block mb-2 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-[#0071E3]" /> Pre-Order Allocation
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">Reserve Your System</h2>
            <p className="text-lg text-[#86868B] max-w-2xl mx-auto mt-3">Select your batch preference. Includes free worldwide shipping and a 100% money-back guarantee prior to shipment.</p>
          </div>

          {/* HIGH VISIBILITY GUARANTEE BOX (MOVED ABOVE TIERS) */}
          <div className="apple-card p-8 bg-gradient-to-br from-[#0071E3]/5 via-white to-white border-2 border-[#0071E3]/30 shadow-md max-w-3xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="p-4 bg-[#0071E3] text-white rounded-2xl shrink-0 shadow-sm">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0071E3] uppercase tracking-wider mb-1">
                  <Check className="w-4 h-4 text-[#0071E3]" /> Risk-Free Commitment
                </div>
                <h3 className="text-2xl font-extrabold text-[#1D1D1F] mb-2">
                  100% Pre-Order Confidence Guarantee
                </h3>
                <p className="text-sm text-[#515154] leading-relaxed">
                  Plans change? All pre-orders and reservations can be fully refunded anytime prior to batch dispatch—no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Main Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {PERKS_WITH_APPAREL.map((perk, i) => (
              <div key={perk.tier} className={`apple-card p-8 flex flex-col justify-between relative ${perk.featured ? 'border-2 border-[#0071E3] shadow-lg' : ''}`}>
                {perk.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0071E3] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <div className="flex justify-between text-xs text-[#86868B] font-semibold mb-2">
                    <span>{perk.tier}</span>
                    <span className="text-[#0071E3]">{perk.tag}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1D1D1F] mb-2">{perk.name}</h3>
                  <div className="text-4xl font-extrabold text-[#1D1D1F] mb-6">{perk.price}</div>

                  {perk.apparel.length > 0 && (
                    <div className="mb-6">
                      <span className="text-xs font-semibold text-[#86868B] block mb-2">Founder Gear Included:</span>
                      <div className="flex gap-2">
                        {perk.apparel.map((slide) => (
                          <button
                            key={slide.title}
                            id={`apparel-thumb-${slide.index}`}
                            type="button"
                            className="p-0 border-none bg-transparent cursor-pointer touch-manipulation"
                            onClick={() => {
                              setApparelSliderIndex(slide.index);
                              setApparelSliderOpen(true);
                            }}
                          >
                            <img 
                              src={slide.img} 
                              alt={slide.title} 
                              loading="lazy"
                              decoding="async"
                              className="w-10 h-10 object-contain apple-card p-1" 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <ul className="space-y-3 text-sm text-[#515154] mb-8">
                    {perk.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div 
                    onClickCapture={() => {
                      trackAnalyticsEvent('InitiateCheckout', 'begin_checkout', { 
                        content_name: perk.name, 
                        value: parseFloat(perk.price.replace('€', '')), 
                        currency: 'EUR' 
                      });
                    }}
                  >
                    <stripe-buy-button 
                      id={`stripe-buy-btn-${i}`} 
                      buy-button-id={perk.stripeBuyButtonId} 
                      publishable-key="pk_live_51IdtRfIVuCvdmBxBUsmabzHvOXTFcGtZtEqntzEL3250bwSyUPtjAdz3DYb19hkLrjjGVtw5bQXUiI7wFgSbNSA6005OSynoUX"
                    ></stripe-buy-button>
                  </div>
                  <CardTrustBadges />
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated Full-Width Banner for Batch 2 Reservation (€10 Deposit) */}
          <div className="apple-card p-6 md:p-8 bg-gradient-to-r from-white via-[#F5F5F7] to-white border border-[#0071E3]/20 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#0071E3]/10 text-[#0071E3] rounded-2xl shrink-0">
                <BookmarkPlus className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#0071E3] uppercase">{BATCH_2_PERK.tier}</span>
                  <span className="text-[10px] bg-[#0071E3]/10 text-[#0071E3] font-semibold px-2 py-0.5 rounded-full">{BATCH_2_PERK.delivery}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">{BATCH_2_PERK.name} — {BATCH_2_PERK.price} Deposit</h3>
                <p className="text-xs text-[#86868B] mt-1 max-w-xl">
                  Reserve your spot in the second production run for €10. Locks in your early pricing and holds your place in line.
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto shrink-0 flex flex-col items-center">
              <div 
                className="w-full md:w-auto"
                onClickCapture={() => {
                  trackAnalyticsEvent('InitiateCheckout', 'begin_checkout', { content_name: 'Batch 2 Reservation Deposit', value: 10, currency: 'EUR' });
                }}
              >
                <stripe-buy-button 
                  id="stripe-buy-btn-batch2" 
                  buy-button-id={BATCH_2_PERK.stripeBuyButtonId} 
                  publishable-key="pk_live_51IdtRfIVuCvdmBxBUsmabzHvOXTFcGtZtEqntzEL3250bwSyUPtjAdz3DYb19hkLrjjGVtw5bQXUiI7wFgSbNSA6005OSynoUX"
                ></stripe-buy-button>
              </div>
              <span className="text-[10px] text-[#86868B] mt-2 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#0071E3]" /> Fully Refundable €10 Deposit
              </span>
            </div>
          </div>
        </section>

        {/* TEAM & FOUNDING STORY SECTION */}
        <section ref={teamRef} id="team" className="relative py-16 md:py-24 px-4 sm:px-6 bg-[#EBEBEF] border-y border-black/5 overflow-hidden">
          <BackgroundLogoWatermark />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="text-sm md:text-base font-extrabold text-[#0071E3] uppercase tracking-wider block mb-2 flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-[#0071E3]" /> Built by Cyclists
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">Our Story</h2>
            </div>

            {/* FOUNDING STORY CARD WITH INTEGRATED GROUP PHOTO */}
            <div className="apple-card p-8 md:p-12 bg-white border border-black/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4 text-[#0071E3]">
                  <Lightbulb className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest">Why We Built Domestique.live</span>
                </div>
                
                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mb-6 leading-tight">
                  The Missing Piece in Modern Cycling Tech
                </h3>

                <div className="space-y-4 text-sm text-[#515154] leading-relaxed">
                  <p>
                    As active road cyclists, we noticed a glaring gap in the market. On one hand, we had incredible tools for pre-ride workout planning (TrainingPeaks, Join, Zwift). On the other, we had endless post-ride post-mortem platforms (Strava, Intervals.icu) telling us exactly why we blew up two hours after the ride was already finished.
                  </p>
                  <p className="font-semibold text-[#1D1D1F]">
                    What was completely missing was something actively helping you mid-ride, when it actually matters.
                  </p>
                  <p>
                    Glancing down at glass computer screens while traveling at 40 km/h is distracting and inefficient. We wanted the experience that pro peloton riders have: a digital domestique in the car radio, giving precise audio cues on pacing, cadence, and interval timing.
                  </p>
                  <p>
                    That's why we engineered <strong className="text-[#0071E3]">Domestique.live</strong>—pairing open-ear bone conduction audio with real-time biometric AI to give every passionate cyclist an active in-ride advantage.
                  </p>

                  <a 
                    id="link-linkedin-story"
                    href="https://www.linkedin.com/company/domestiquelive" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#0071E3] font-bold mt-6 hover:underline touch-manipulation"
                  >
                    Follow our journey on LinkedIn <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <img 
                  src={TEAM_PHOTO_URL} 
                  alt="Domestique.live Founding Team" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto rounded-2xl shadow-sm border border-black/5 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ & SEND A QUESTION SECTION */}
        <section ref={faqRef} id="faq" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-b border-black/5">
          <div className="text-center mb-12">
            <span className="text-sm md:text-base font-extrabold text-[#0071E3] uppercase tracking-wider block mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0071E3]" /> Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-3">
              {PREORDER_FAQS.map((faq, index) => (
                <button 
                  key={faq.q} 
                  id={`faq-toggle-btn-${index}`}
                  type="button"
                  className="w-full text-left apple-card p-5 cursor-pointer hover:shadow-sm transition-all touch-manipulation border border-black/5"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <div className="font-semibold text-sm text-[#1D1D1F] flex justify-between items-center gap-4">
                    <span>{faq.q}</span>
                    <span className="text-[#0071E3] text-lg font-bold">{openFaq === index ? '−' : '+'}</span>
                  </div>
                  {openFaq === index && (
                    <p className="text-xs text-[#86868B] mt-3 leading-relaxed pt-3 border-t border-black/5">{faq.a}</p>
                  )}
                </button>
              ))}
            </div>

            <div className="lg:col-span-5 apple-card p-8 bg-white border border-black/10">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-[#0071E3]" />
                <h3 className="font-bold text-xl text-[#1D1D1F]">Have a Question?</h3>
              </div>
              <p className="text-xs text-[#86868B] mb-6">Can't find the answer you're looking for? Ask our product team directly.</p>

              {questionSent ? (
                <div className="bg-[#F5F5F7] p-6 rounded-xl border border-black/5 text-center">
                  <Check className="w-8 h-8 text-[#0071E3] mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-[#1D1D1F] mb-1">Question Received!</h4>
                  <p className="text-xs text-[#86868B]">We will reply to your email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="user-question-name" className="block text-xs font-semibold text-[#515154] mb-1">Your Name</label>
                    <input 
                      id="user-question-name"
                      type="text" 
                      required 
                      value={userQuestion.name}
                      onChange={(e) => setUserQuestion({ ...userQuestion, name: e.target.value })}
                      placeholder="e.g. Alex" 
                      className="w-full text-xs p-3 rounded-xl bg-[#F5F5F7] border border-black/5 focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                  <div>
                    <label htmlFor="user-question-email" className="block text-xs font-semibold text-[#515154] mb-1">Email Address</label>
                    <input 
                      id="user-question-email"
                      type="email" 
                      required 
                      value={userQuestion.email}
                      onChange={(e) => setUserQuestion({ ...userQuestion, email: e.target.value })}
                      placeholder="alex@peloton.com" 
                      className="w-full text-xs p-3 rounded-xl bg-[#F5F5F7] border border-black/5 focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                  <div>
                    <label htmlFor="user-question-message" className="block text-xs font-semibold text-[#515154] mb-1">Question</label>
                    <textarea 
                      id="user-question-message"
                      rows={4} 
                      required 
                      value={userQuestion.message}
                      onChange={(e) => setUserQuestion({ ...userQuestion, message: e.target.value })}
                      placeholder="Ask us anything about sensor compatibility, audio clarity, or shipping..." 
                      className="w-full text-xs p-3 rounded-xl bg-[#F5F5F7] border border-black/5 focus:outline-none focus:border-[#0071E3]"
                    ></textarea>
                  </div>
                  <button id="btn-submit-question" type="submit" className="w-full bg-[#0071E3] text-white font-semibold text-xs py-3 rounded-xl hover:bg-[#0077ED] transition-colors flex items-center justify-center gap-2 touch-manipulation">
                    <Send className="w-3.5 h-3.5" /> Send Question
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* COMMUNITY & STRAVA CLUB SECTION (UPDATED LOGO) */}
        <section ref={instagramRef} id="instagram-feed" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
          {/* CENTERED STRAVA CALL TO ACTION */}
          <div className="apple-card p-8 md:p-12 bg-gradient-to-br from-white via-[#F5F5F7] to-white border border-[#FC4C02]/20 shadow-sm mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <img src={NEW_STRAVA_LOGO} alt="Strava" loading="lazy" decoding="async" className="h-8 w-auto object-contain" />
              <span className="text-sm font-bold text-[#FC4C02] uppercase tracking-wider">Official Strava Club</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mb-4">Ride With Domestique.live</h3>
            <p className="text-sm sm:text-base text-[#86868B] leading-relaxed mb-8 max-w-lg mx-auto">
              Track peloton training rides, compare leaderboard efforts, and connect with early adopters testing our real-time coaching system on open roads.
            </p>
            <a 
              id="link-strava-club"
              href="https://www.strava.com/clubs/2143975?oq=domestiqu" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#FC4C02] text-white text-sm font-bold px-8 py-4 rounded-full hover:bg-[#e04300] transition-colors flex items-center gap-2 shadow-sm touch-manipulation"
            >
              Join Strava Club <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#1D1D1F] text-white py-16 px-4 sm:px-6 border-t border-black/10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="font-bold text-lg block mb-3">Domestique.live</span>
              <p className="text-xs text-[#86868B] leading-relaxed mb-3">
                Real-time AI audio coaching and open-ear bone conduction intelligence for active cyclists.
              </p>
              
              <div className="pt-2 space-y-2">
                <span className="text-[11px] text-[#86868B] block">
                  Powered by <a id="link-alphanome-home" href="https://www.alphanome.ai/" target="_blank" rel="noreferrer" className="text-[#0071E3] font-semibold hover:underline">Alphanome.AI</a>
                </span>
                <span className="text-[11px] text-[#86868B] block mt-1">
                  Genève, Switzerland
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-[#86868B] mb-3">Navigation</h5>
              <div className="flex flex-col gap-2 text-xs text-[#86868B]">
                <button id="footer-btn-coach" type="button" onClick={() => scrollToRef(coachRef)} className="text-left hover:text-white touch-manipulation">Real-Time Coach</button>
                <button id="footer-btn-flow" type="button" onClick={() => scrollToRef(flowRef)} className="text-left hover:text-white touch-manipulation">How It Works</button>
                <button id="footer-btn-ecosystem" type="button" onClick={() => scrollToRef(ecosystemRef)} className="text-left hover:text-white touch-manipulation">Ecosystem</button>
                <button id="footer-btn-hardware" type="button" onClick={() => scrollToRef(hardwareRef)} className="text-left hover:text-white touch-manipulation">Hardware</button>
                <button id="footer-btn-team" type="button" onClick={() => scrollToRef(teamRef)} className="text-left hover:text-white touch-manipulation">Our Story</button>
                <button id="footer-btn-pricing" type="button" onClick={() => scrollToRef(pricingRef)} className="text-left hover:text-white touch-manipulation">Pre-Order</button>
                <button id="footer-btn-community" type="button" onClick={() => scrollToRef(instagramRef)} className="text-left hover:text-white touch-manipulation">Community</button>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-[#86868B] mb-3">Legal & Research</h5>
              <div className="flex flex-col gap-2 text-xs text-[#86868B]">
                <button id="footer-policy-return" type="button" onClick={() => setActivePolicy('return')} className="text-left hover:text-white touch-manipulation">Return & Refund Policy</button>
                <button id="footer-policy-shipping" type="button" onClick={() => setActivePolicy('shipping')} className="text-left hover:text-white touch-manipulation">Shipping Policy</button>
                <button id="footer-policy-privacy" type="button" onClick={() => setActivePolicy('privacy')} className="text-left hover:text-white touch-manipulation">Privacy Policy</button>
                
                {/* SYSTEM ARCHITECTURE LINK */}
                <button 
                  id="footer-modal-architecture"
                  type="button"
                  onClick={() => setShowArchitectureModal(true)} 
                  className="text-left text-[#0071E3] font-semibold hover:underline flex items-center gap-1.5 pt-1 touch-manipulation"
                >
                  <Server className="w-3.5 h-3.5" /> System Architecture
                </button>

                {/* SCIENCE & RESEARCH LINK */}
                <button 
                  id="footer-modal-science"
                  type="button"
                  onClick={() => setShowScienceModal(true)} 
                  className="text-left text-[#0071E3] font-semibold hover:underline flex items-center gap-1.5 touch-manipulation"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Science & Research
                </button>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-[#86868B] mb-3">Newsletter</h5>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input 
                  type="email" 
                  name="fields[email]" 
                  placeholder="Enter email address" 
                  required 
                  className="bg-white/10 text-white placeholder-white/40 border border-white/10 text-xs px-3 py-2 rounded-lg focus:outline-none"
                />
                <button id="newsletter-submit-btn" type="submit" className="bg-[#0071E3] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#0077ED] touch-manipulation">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="max-w-6xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#86868B] gap-4">
            <span>&copy; {YEAR} Domestique.live. All rights reserved.</span>
            <div className="flex flex-wrap gap-4 items-center">
              <a id="link-facebook" href="https://www.facebook.com/domestiquelive" target="_blank" rel="noreferrer" className="hover:text-white transition-colors touch-manipulation" title="Facebook"><Facebook className="w-4 h-4"/></a>
              <a id="link-tiktok" href="https://www.tiktok.com/@domestiquelive" target="_blank" rel="noreferrer" className="hover:text-white transition-colors touch-manipulation" title="TikTok"><TikTokIcon className="w-4 h-4"/></a>
              <a id="link-instagram" href="https://www.instagram.com/domestique.live/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors touch-manipulation" title="Instagram"><Instagram className="w-4 h-4"/></a>
              <a id="link-linkedin" href="https://www.linkedin.com/company/domestiquelive/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors touch-manipulation" title="LinkedIn"><Linkedin className="w-4 h-4"/></a>
              <a id="link-twitter" href="https://x.com/domestiquelive" target="_blank" rel="noreferrer" className="hover:text-white transition-colors touch-manipulation" title="X"><TwitterXIcon className="w-4 h-4"/></a>
              <a id="link-strava-footer" href="https://www.strava.com/clubs/2143975" target="_blank" rel="noreferrer" className="hover:text-white transition-colors touch-manipulation" title="Strava">
                <img src={NEW_STRAVA_LOGO} alt="Strava" loading="lazy" decoding="async" className="h-3.5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </footer>

        {/* DETAILED TECHNICAL ARCHITECTURE MODAL */}
        {showArchitectureModal && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[88vh] overflow-y-auto relative text-[#1D1D1F] border border-black/10 shadow-2xl">
              <button 
                id="close-architecture-modal"
                type="button"
                onClick={() => setShowArchitectureModal(false)} 
                className="absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full bg-white border border-black/5 touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#0071E3] text-white rounded-xl">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1D1D1F]">System Architecture Specification</h3>
                  <span className="text-xs font-mono font-bold text-[#0071E3] uppercase tracking-wider">Domestique.live Engine v2.4</span>
                </div>
              </div>

              <p className="text-xs text-[#86868B] mb-8 leading-relaxed max-w-2xl">
                Domestique.live operates a decoupled, hybrid edge-cloud ecosystem engineered to execute sub-second physiological feedback loops in offline environments while syncing to post-ride training platforms.
              </p>

              <div className="space-y-6">
                {/* Architecture Block 1 */}
                <div className="apple-card p-6 bg-white border border-black/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 text-[#0071E3]">
                      <Gauge className="w-5 h-5" />
                      <h4 className="font-bold text-base text-[#1D1D1F]">1. Multi-Channel BLE Intercept & Concurrent Multiplexing</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3]">50Hz Sampling Pipeline</span>
                  </div>
                  <p className="text-xs text-[#515154] leading-relaxed mb-3">
                    The client application maintains secondary passive GATT profile connections (Cycling Power <code className="font-mono bg-[#F5F5F7] px-1.5 py-0.5 rounded text-[#0071E3]">0x1818</code>, Heart Rate <code className="font-mono bg-[#F5F5F7] px-1.5 py-0.5 rounded text-[#0071E3]">0x180D</code>, Cadence <code className="font-mono bg-[#F5F5F7] px-1.5 py-0.5 rounded text-[#0071E3]">0x1816</code>) alongside primary bike computers (Garmin, Wahoo). This multiplexed topology captures uncompressed raw telemetry streams without locking peripheral channels or interrupting FIT file logging.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-black/5 text-[11px] font-mono text-[#86868B]">
                    <div className="p-2 bg-[#F5F5F7] rounded-lg">
                      <span className="font-bold text-[#1D1D1F] block">Power GATT (0x1818)</span>
                      Instantaneous Wattage & L/R balance
                    </div>
                    <div className="p-2 bg-[#F5F5F7] rounded-lg">
                      <span className="font-bold text-[#1D1D1F] block">HR Profile (0x180D)</span>
                      R-R intervals & BPM dynamics
                    </div>
                    <div className="p-2 bg-[#F5F5F7] rounded-lg">
                      <span className="font-bold text-[#1D1D1F] block">Cadence (0x1816)</span>
                      Pedal velocity & torque effectiveness
                    </div>
                  </div>
                </div>

                {/* Architecture Block 2 */}
                <div className="apple-card p-6 bg-white border border-black/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 text-[#0071E3]">
                      <Cpu className="w-5 h-5" />
                      <h4 className="font-bold text-base text-[#1D1D1F]">2. Local Biometric Edge AI Engine</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3]">&lt;20ms Execution Latency</span>
                  </div>
                  <p className="text-xs text-[#515154] leading-relaxed mb-3">
                    All physiological calculations run on-device via a compiled local C++ math core. The engine evaluates real-time effort against pre-cached FTP parameters, target interval profiles, and 3D elevation topology maps.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#515154] pl-2 border-l-2 border-[#0071E3]">
                    <li>• <strong>Anaerobic Work Capacity ($W'$ Bal):</strong> Continuous differential modeling of $W'$ depletion and recharge rates during VO2Max and anaerobic efforts.</li>
                    <li>• <strong>Aerobic Decoupling & Cardiac Drift:</strong> Evaluates internal physiological strain by cross-correlating HR escalation against steady-state power output.</li>
                    <li>• <strong>Terrain Gradient Anticipation:</strong> Cross-references GPS velocity vectors with cached GPX altitude matrices to prompt optimal gear shifts before gradients increase.</li>
                  </ul>
                </div>

                {/* Architecture Block 3 */}
                <div className="apple-card p-6 bg-white border border-black/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 text-[#0071E3]">
                      <Volume2 className="w-5 h-5" />
                      <h4 className="font-bold text-base text-[#1D1D1F]">3. Low-Latency DSP & Audio Ducking Subsystem</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3]">CoreAudio / AudioTrack API</span>
                  </div>
                  <p className="text-xs text-[#515154] leading-relaxed mb-3">
                    Delivers concise, non-intrusive voice directives through open-ear bone-conduction transducers. The audio pipeline intercepts native media sessions to duck background music dynamically during coaching events.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#515154]">
                    <div className="p-3 bg-[#F5F5F7] rounded-xl">
                      <span className="font-bold text-[#1D1D1F] block mb-1">Acoustic Transducer Drivers</span>
                      26-gram ear-canal-free body designed for aerodynamic helmet strap alignment and zero ear occlusion.
                    </div>
                    <div className="p-3 bg-[#F5F5F7] rounded-xl">
                      <span className="font-bold text-[#1D1D1F] block mb-1">Dynamic Audio Ducking</span>
                      Smoothly attenuates ambient media volume (Spotify/Podcasts) by 12dB prior to coaching transmission.
                    </div>
                  </div>
                </div>

                {/* Architecture Block 4 */}
                <div className="apple-card p-6 bg-white border border-black/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 text-[#0071E3]">
                      <Database className="w-5 h-5" />
                      <h4 className="font-bold text-base text-[#1D1D1F]">4. Resilient Offline Caching & Cloud Synchronization</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3]">TLS 1.3 REST / OAuth2</span>
                  </div>
                  <p className="text-xs text-[#515154] leading-relaxed mb-3">
                    When a ride concludes, encrypted SQLite telemetry logs sync to Alphanome.AI cloud infrastructure to update chronic training load (CTL) models and trigger direct webhooks to connected platforms.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-[#1D1D1F]">
                    <span className="px-3 py-1 bg-[#F5F5F7] rounded-lg border border-black/5">Strava v3 API</span>
                    <span className="px-3 py-1 bg-[#F5F5F7] rounded-lg border border-black/5">Intervals.icu REST</span>
                    <span className="px-3 py-1 bg-[#F5F5F7] rounded-lg border border-black/5">TrainingPeaks Connect</span>
                    <span className="px-3 py-1 bg-[#F5F5F7] rounded-lg border border-black/5">Garmin Health API</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#86868B]">Alphanome.AI Proprietary Architecture &copy; {YEAR}</span>
                <button 
                  id="btn-close-arch-spec"
                  type="button"
                  onClick={() => setShowArchitectureModal(false)}
                  className="bg-[#0071E3] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#0077ED] transition-colors touch-manipulation"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCIENTIFIC RESEARCH & PAPERS OVERVIEW MODAL */}
        {showScienceModal && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[88vh] overflow-y-auto relative text-[#1D1D1F] border border-black/10 shadow-2xl">
              <button 
                id="close-science-modal"
                type="button"
                onClick={() => setShowScienceModal(false)} 
                className="absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full bg-white border border-black/5 touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#0071E3] text-white rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1D1D1F]">Scientific Research & Whitepapers</h3>
                  <span className="text-xs font-mono font-bold text-[#0071E3] uppercase tracking-wider">Alphanome.AI Endurance Publications</span>
                </div>
              </div>

              <p className="text-xs text-[#86868B] mb-8 leading-relaxed max-w-2xl">
                Discover the physiological research, cognitive load studies, and acoustic safety frameworks that power the Domestique.live real-time AI coaching engine.
              </p>

              <div className="space-y-6">
                {RESEARCH_PAPERS.map((paper, idx) => (
                  <div key={paper.title} className="apple-card p-6 bg-white border border-black/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3]">
                          Paper 0{idx + 1} — {paper.tag}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-[#1D1D1F] mb-3 leading-snug">
                        {paper.title}
                      </h4>

                      <p className="text-xs text-[#515154] leading-relaxed mb-4">
                        {paper.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-black/5 flex justify-end">
                      <a 
                        id={`link-research-paper-${idx}`}
                        href={paper.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#0071E3] hover:underline touch-manipulation"
                      >
                        Read Full Article on Alphanome.AI <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#86868B]">Alphanome.AI Research Series &copy; {YEAR}</span>
                <button 
                  id="btn-close-science-modal"
                  type="button"
                  onClick={() => setShowScienceModal(false)}
                  className="bg-[#0071E3] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#0077ED] transition-colors touch-manipulation"
                >
                  Close Research
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FULL DETAILED POLICY MODAL */}
        {activePolicy && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-10 max-w-4xl w-full max-h-[88vh] overflow-y-auto relative text-[#1D1D1F] border border-black/10 shadow-2xl">
              <button 
                id="close-policy-modal"
                type="button"
                onClick={() => setActivePolicy(null)} 
                className="absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full bg-white border border-black/5 touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>

              {/* RETURN & REFUND POLICY CONTENT */}
              {activePolicy === 'return' && (
                <div className="space-y-6 text-xs text-[#515154] leading-relaxed">
                  <div className="border-b border-black/10 pb-4 mb-6">
                    <span className="text-xs font-mono font-bold text-[#0071E3] uppercase tracking-wider block mb-1">Consumer Protection</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">RETURN & REFUND POLICY</h2>
                    <p className="text-[11px] font-mono text-[#86868B] mt-1">Effective Date: July 22, 2026</p>
                  </div>

                  <p className="text-sm text-[#1D1D1F]">
                    At Domestique.live (a project of Alphanome.AI, Geneva, Switzerland), we want you to support our vision with total peace of mind. We stand behind our hardware, intelligence layer, and gear, which is why we offer a risk-free pre-order experience and standard post-delivery consumer protections.
                  </p>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">1. Pre-Order Guarantee: No-Questions-Asked Refunds</h3>
                    <p>We understand that development timelines and personal circumstances change.</p>
                    <p><strong className="text-[#1D1D1F]">100% Refundable:</strong> All purchases, tier pre-orders, and reservations made during the pre-order stage can be canceled and refunded in full, no questions asked, at any time until the official product release and dispatch date (Q1 2027).</p>
                    <p><strong className="text-[#1D1D1F]">How to Cancel:</strong> Simply send an email to <a href="mailto:info@domestique.live" className="text-[#0071E3] font-semibold">info@domestique.live</a> with your order number or confirmation details.</p>
                    <p><strong className="text-[#1D1D1F]">Processing:</strong> Refunds will be credited back to your original payment method (via Stripe) within 3–5 business days. No processing or cancellation fees apply.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">2. Post-Release Returns (After Dispatch)</h3>
                    <p>Once your hardware unit or merchandise has been delivered following official release, standard return rights apply:</p>
                    <p><strong className="text-[#1D1D1F]">30-Day Evaluation Period:</strong> You have 30 calendar days from the date of delivery to initiate a return.</p>
                    <p><strong className="text-[#1D1D1F]">Condition of Goods:</strong> To be eligible for a post-delivery refund:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Hardware units, accessories, and bone-conduction headsets must be in their original packaging, complete with all cables, user guides, and components.</li>
                      <li>Founder's apparel (jerseys, bib shorts, caps, gloves) must be unworn, unwashed, and returned with original tags intact.</li>
                    </ul>
                    <p><strong className="text-[#1D1D1F]">Return Authorization:</strong> Before shipping items back, please email <a href="mailto:info@domestique.live" className="text-[#0071E3] font-semibold">info@domestique.live</a> to receive a Return Merchandise Authorization (RMA) label and designated return address.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">3. Refunds & Payment Processing</h3>
                    <p><strong className="text-[#1D1D1F]">Pre-Order Stage:</strong> 100% of the transaction amount (including taxes/fees) is refunded directly to the payment card used at checkout.</p>
                    <p><strong className="text-[#1D1D1F]">Post-Delivery Stage:</strong> Once your returned item is received and inspected at our fulfillment facility, a refund will be issued to your original payment method within 5–7 business days.</p>
                    <p><strong className="text-[#1D1D1F]">Return Shipping Fees:</strong> For post-delivery returns driven by personal preference, customers are responsible for return freight costs unless the item is defective or shipped in error.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">4. Warranty & Defective Products</h3>
                    <p>All Domestique.live hardware units come with a 2-Year Limited Manufacturer Warranty covering electronic, acoustic, and structural defects.</p>
                    <p>If your hardware fails to perform, encounters technical faults, or arrives damaged, we will repair or replace your unit at zero cost to you. Contact <a href="mailto:info@domestique.live" className="text-[#0071E3] font-semibold">info@domestique.live</a> for immediate troubleshooting and warranty replacements.</p>
                  </div>

                  <div className="pt-2 text-[11px] text-[#86868B]">
                    <strong>Contact Us:</strong> <a href="mailto:info@domestique.live" className="text-[#0071E3]">info@domestique.live</a> | Parent Company: Alphanome.AI, Geneva, Switzerland
                  </div>
                </div>
              )}

              {/* SHIPPING POLICY CONTENT */}
              {activePolicy === 'shipping' && (
                <div className="space-y-6 text-xs text-[#515154] leading-relaxed">
                  <div className="border-b border-black/10 pb-4 mb-6">
                    <span className="text-xs font-mono font-bold text-[#0071E3] uppercase tracking-wider block mb-1">Global Logistics</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">SHIPPING POLICY</h2>
                    <p className="text-[11px] font-mono text-[#86868B] mt-1">Effective Date: July 22, 2026</p>
                  </div>

                  <p className="text-sm text-[#1D1D1F]">
                    At Domestique.live (a brand under Alphanome.AI, Geneva, Switzerland), we are committed to providing a seamless experience for cyclists worldwide. This Shipping Policy outlines our fulfillment terms, delivery expectations, and shipping protocols for all hardware units and physical merchandise.
                  </p>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">1. Free Global Shipping</h3>
                    <p>We believe premium cycling technology should be accessible everywhere. We are proud to offer 100% Free Standard Global Shipping on all orders, including:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Domestique.live Hardware Units (standalone or tier packages)</li>
                      <li>Pre-order Founder’s Apparel & Gear</li>
                      <li>Replacement hardware accessories</li>
                    </ul>
                    <p>There are no hidden freight charges or delivery fees applied at checkout.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">2. Pre-Orders & Production Timeline (Q1 2027 Series)</h3>
                    <p>Because Domestique.live hardware is produced in dedicated limited-run batches, please note the following fulfillment details for pre-orders:</p>
                    <p><strong className="text-[#1D1D1F]">Estimated Fulfillment Window:</strong> Orders placed under the Q1 2027 Founder's Series are scheduled for dispatch during Q1 2027.</p>
                    <p><strong className="text-[#1D1D1F]">Batch Tracking:</strong> Once your unit enters final assembly and packaging, you will receive email updates regarding your specific batch dispatch schedule.</p>
                    <p><strong className="text-[#1D1D1F]">Address Updates:</strong> You may update your shipping destination anytime prior to final dispatch by contacting our support team at <a href="mailto:info@domestique.live" className="text-[#0071E3] font-semibold">info@domestique.live</a>.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">3. Shipping Methods & Estimated Delivery Times</h3>
                    <p>Once your package is processed and handed to our international carrier partners (e.g., DHL Express, FedEx, or national postal services), estimated transit times are as follows:</p>
                    
                    <div className="overflow-x-auto rounded-xl border border-black/10 my-3">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#1D1D1F] text-white text-[11px] uppercase font-bold">
                            <th className="p-3 border-r border-white/10">Destination / Region</th>
                            <th className="p-3">Estimated Transit Time (After Dispatch)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10 bg-[#F5F5F7]">
                          <tr>
                            <td className="p-3 font-semibold border-r border-black/5">Switzerland & European Union (EU)</td>
                            <td className="p-3">3 – 5 Business Days</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold border-r border-black/5">United Kingdom & North America</td>
                            <td className="p-3">5 – 8 Business Days</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold border-r border-black/5">Asia-Pacific & Rest of World</td>
                            <td className="p-3">7 – 12 Business Days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-[#86868B]">Note: Delivery estimates do not account for potential customs processing delays at destination borders.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">4. Order Tracking</h3>
                    <p>As soon as your order is dispatched, a Shipment Confirmation Email will be sent containing your unique tracking code and a direct link to the carrier’s portal. Please allow up to 24–48 hours for tracking activity to register in the carrier’s system.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">5. Customs, Duties & Import Taxes</h3>
                    <p><strong className="text-[#1D1D1F]">European Union, Switzerland & UK:</strong> Applicable local Value Added Tax (VAT) is calculated and disclosed in accordance with regional consumer laws.</p>
                    <p><strong className="text-[#1D1D1F]">International Destinations (Rest of World):</strong> Packages are shipped DDU (Delivered Duty Unpaid) unless otherwise explicitly stated. Any local import duties, tariffs, or governmental customs fees levied upon entry into your country remain the responsibility of the recipient.</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">6. Damaged, Lost, or Delayed Shipments</h3>
                    <p>We take full responsibility for ensuring your hardware arrives safely.</p>
                    <p><strong className="text-[#1D1D1F]">Damaged in Transit:</strong> If your package arrives visibly damaged or tampered with, please take photos immediately and contact <a href="mailto:info@domestique.live" className="text-[#0071E3] font-semibold">info@domestique.live</a> within 7 days of delivery. We will arrange a replacement unit at no cost.</p>
                    <p><strong className="text-[#1D1D1F]">Lost Packages:</strong> If your tracking status shows no movement for more than 14 business days, please report it to us. We will initiate an official carrier investigation and replace lost units accordingly.</p>
                  </div>

                  <div className="pt-2 text-[11px] text-[#86868B]">
                    <strong>Contact Us:</strong> <a href="mailto:info@domestique.live" className="text-[#0071E3]">info@domestique.live</a> | Parent Company: Alphanome.AI, Geneva, Switzerland
                  </div>
                </div>
              )}

              {/* PRIVACY POLICY CONTENT */}
              {activePolicy === 'privacy' && (
                <div className="space-y-6 text-xs text-[#515154] leading-relaxed">
                  <div className="border-b border-black/10 pb-4 mb-6">
                    <span className="text-xs font-mono font-bold text-[#0071E3] uppercase tracking-wider block mb-1">Data Governance</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">PRIVACY POLICY</h2>
                    <p className="text-[11px] font-mono text-[#86868B] mt-1">Last Updated: July 22, 2026</p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">1. Introduction & Data Controller</h3>
                    <p>Welcome to Domestique.live. Domestique.live is a project and brand operated by Alphanome.AI, a company registered in Geneva, Switzerland (referred to as "Alphanome.AI", "we", "us", or "our").</p>
                    <p>We are committed to protecting your privacy and handling your personal data with transparency and care. This Privacy Policy explains how we collect, use, process, and safeguard your information when you visit <a href="https://domestique.live" target="_blank" rel="noreferrer" className="text-[#0071E3]">https://domestique.live</a>, purchase our products, or use our hardware, application, and real-time audio coaching services (collectively, the "Services").</p>
                    <p><strong className="text-[#1D1D1F]">Contact Information / Data Controller:</strong><br />
                    Company Name: Alphanome.AI<br />
                    Registered Location: Geneva, Switzerland<br />
                    General Privacy Inquiries: <a href="mailto:info@domestique.live" className="text-[#0071E3]">info@domestique.live</a><br />
                    Partnerships & Business Data: <a href="mailto:partners@domestique.live" className="text-[#0071E3]">partners@domestique.live</a></p>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">2. Information We Collect</h3>
                    <p>We collect information to provide, personalize, and improve our performance intelligence layer for cycling.</p>
                    
                    <p><strong className="text-[#1D1D1F]">A. Information You Provide Directly:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Account & Identity Data:</strong> Name, email address, physical address, and communication preferences provided during newsletter subscription, pre-orders, or account creation.</li>
                      <li><strong>Payment & Financial Data:</strong> Payment card details, billing address, and transaction histories. Payment processing is handled securely by Stripe; we do not directly store full credit card numbers.</li>
                      <li><strong>Support & Feedback Data:</strong> Information submitted during customer support inquiries.</li>
                    </ul>

                    <p><strong className="text-[#1D1D1F]">B. Fitness, Sensor & Telemetry Data (App & Hardware Users):</strong></p>
                    <p>When you connect your cycling sensors or head unit to the Domestique.live application, we process:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Real-Time Biometrics:</strong> Heart rate, power output (watts), cadence, speed, and real-time effort zones.</li>
                      <li><strong>Location & Routing Data:</strong> GPS coordinates, elevation, route maps, and velocity.</li>
                      <li><strong>Third-Party Integrations:</strong> Data synced via Bluetooth or connected platforms (Strava, Garmin Connect) with explicit authorization.</li>
                    </ul>

                    <p><strong className="text-[#1D1D1F]">C. Technical & Automated Collection:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Usage & Analytics Data:</strong> IP address, browser type, operating system, and timestamp logs.</li>
                      <li><strong>Cookies & Tracking:</strong> Essential cookies ensuring platform functionality and web traffic analysis.</li>
                    </ul>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">3. How We Use Your Information</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Service Delivery & Execution:</strong> Processing pre-orders, delivering hardware, and executing real-time AI audio coaching algorithms.</li>
                      <li><strong>Personalization:</strong> Tailoring voice instructions, pacing strategies, and recovery prompts based on biometric threshold zones.</li>
                      <li><strong>Communication:</strong> Transaction confirmations, product delivery updates, and technical alerts.</li>
                      <li><strong>Marketing (Opt-in):</strong> Delivering newsletter insights regarding upcoming production batches or apparel releases.</li>
                      <li><strong>Security & Integrity:</strong> Monitoring and preventing fraudulent activities under Swiss law.</li>
                    </ul>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">4. Legal Basis for Processing</h3>
                    <p>We process personal data in accordance with the Swiss Federal Act on Data Protection (FADP) and Article 6 of the EU GDPR:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Contractual Necessity:</strong> Required to fulfill pre-order contracts and operate real-time AI services.</li>
                      <li><strong>Consent:</strong> Explicit opt-ins for marketing newsletters and third-party integrations.</li>
                      <li><strong>Legitimate Interests:</strong> Maintaining platform security, preventing fraud, and optimizing algorithms.</li>
                    </ul>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">5. Information Sharing & Third-Party Service Providers</h3>
                    <p>We do not sell, rent, or trade your personal data. Data is shared strictly with authorized infrastructure providers:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Payment Processors:</strong> Stripe (secure payment gateway).</li>
                      <li><strong>Email Providers:</strong> MailerLite (newsletter distribution).</li>
                      <li><strong>Hosting & Cloud:</strong> Amazon Web Services (AWS) / Cloudflare / Cloudinary.</li>
                    </ul>
                  </div>

                  <div className="apple-card p-5 bg-white border border-black/5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1D1D1F]">6. Your Rights & Regulatory Authorities</h3>
                    <p>Under Swiss FADP and EU GDPR, you hold rights to access, rectify, erase ("Right to be Forgotten"), restrict, or export your data. Contact <a href="mailto:info@domestique.live" className="text-[#0071E3] font-semibold">info@domestique.live</a> to exercise your rights.</p>
                    <p>You also have the right to lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC):<br />
                    Feldeggweg 1, CH-3003 Berne, Switzerland | Website: <a href="https://www.edoeb.admin.ch" target="_blank" rel="noreferrer" className="text-[#0071E3]">https://www.edoeb.admin.ch</a></p>
                  </div>

                  <div className="pt-2 text-[11px] text-[#86868B]">
                    <strong>Contact Us:</strong> <a href="mailto:info@domestique.live" className="text-[#0071E3]">info@domestique.live</a> | Parent Company: Alphanome.AI, Geneva, Switzerland
                  </div>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-black/10 flex justify-end">
                <button 
                  id="btn-close-active-policy"
                  type="button"
                  onClick={() => setActivePolicy(null)}
                  className="bg-[#0071E3] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#0077ED] transition-colors touch-manipulation"
                >
                  Close Policy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DISCOUNT MODAL */}
        {showDiscountPopup && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl">
              <button id="close-discount-popup" type="button" onClick={() => setShowDiscountPopup(false)} className="absolute top-3 right-3 text-gray-400 touch-manipulation">×</button>
              <span className="text-xs font-bold text-[#0071E3] uppercase block mb-1">Exclusive Offer</span>
              <h3 className="text-2xl font-bold mb-2">Claim 25% Off</h3>
              <p className="text-xs text-[#86868B] mb-4">Use discount code at checkout for your pre-order.</p>
              <div className="bg-[#F5F5F7] border border-black/10 rounded-xl p-3 mb-4 flex items-center justify-between">
                <span className="font-mono font-bold text-lg">25OFF</span>
                <button id="btn-copy-discount-code" type="button" onClick={handleCopyDiscount} className="bg-[#0071E3] text-white text-xs font-semibold px-3 py-1.5 rounded-lg touch-manipulation">
                  {discountCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <button id="btn-discount-preorder-now" type="button" onClick={() => { setShowDiscountPopup(false); scrollToRef(pricingRef); }} className="w-full bg-[#0071E3] text-white text-xs font-semibold py-3 rounded-xl touch-manipulation">Pre-Order Now</button>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
}