'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Trophy,
  Users,
  Clock,
  Calendar,
  Upload,
  CheckCircle,
  Play,
  Pause,
  Search,
  Music,
  X,
  Share2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Home,
  Compass,
  Plus,
  User,
  RefreshCw,
  Receipt,
  HelpCircle,
  UserPlus,
  Check,
  Copy,
  Sparkles,
  Send,
  Radio,
  Volume2,
  VolumeX,
  MessageSquare,
  Megaphone,
  Star,
  Bell,
  Wallet,
  Settings,
  Flame,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Lock,
  Headphones
} from 'lucide-react';

// ── 1,000 Classical Dance & Music Songs Catalog Generator ──
const RAAGS = ['Yaman', 'Bhairav', 'Bhairavi', 'Darbaari', 'Malkauns', 'Bhimpalasi', 'Desh', 'Kafi', 'Bageshri', 'Todi', 'Khamaj', 'Bilawal', 'Marwa', 'Puriya Dhanashree', 'Chandrakauns'];
const TAALS = ['Teentaal (16 Beats)', 'Ektaal (12 Beats)', 'Jhaptaal (10 Beats)', 'Rupak (7 Beats)', 'Keherwa (8 Beats)', 'Dadra (6 Beats)', 'Dhamaar (14 Beats)'];
const ARTISTS = ['Pt. Birju Maharaj', 'Ustad Zakir Hussain', 'Vidushi Kaushiki Chakraborty', 'Pt. Ravi Shankar', 'Ustad Bismillah Khan', 'Begum Akhtar', 'Pt. Shivkumar Sharma', 'Vidushi Kishori Amonkar'];

const ALL_1000_SONGS = Array.from({ length: 1000 }, (_, i) => {
  const raag = RAAGS[i % RAAGS.length];
  const taal = TAALS[(i * 3) % TAALS.length];
  const artist = ARTISTS[(i * 7) % ARTISTS.length];
  const num = i + 1;

  const titles = [
    `Kathak Thaat & Tukra #${num} in Raag ${raag}`,
    `Tarana & Chakkardar Tihai #${num} (${taal})`,
    `Abhinaya Thumri: "Mohe Panghat Pe" Edition #${num}`,
    `Kavitt & Paran #${num} - Guru Vandana (${raag})`,
    `Dhamar Jugalbandi #${num} - ${artist} Special`,
    `Sargam & Tatkar Speed Drill #${num} (${taal})`,
    `Gat Nikas & Gat Bhaav #${num} in ${raag}`
  ];

  const title = titles[i % titles.length];
  const min = 2 + (i % 3);
  const sec = String(10 + ((i * 13) % 49)).padStart(2, '0');

  return {
    id: num,
    title,
    raag,
    taal,
    artist,
    duration: `${min}:${sec}`,
    category: i % 2 === 0 ? 'Kathak Solo' : 'Classical Jugalbandi',
    bpm: 80 + ((i * 17) % 100)
  };
});

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isRegistered: boolean;
  role: string;
  handle: string;
}

const HASSAN_RAZA_USER: UserProfile = {
  name: 'Hassan Raza',
  email: 'hassan.raza@feedants.com',
  phone: '+91 98345 67890',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  isRegistered: true,
  role: 'Professional Kathak Dancer & Artist',
  handle: '@hassanraza_dance'
};

const RAHUL_SHARMA: UserProfile = {
  name: 'Rahul Sharma',
  email: 'rahul@feedants.com',
  phone: '+91 98123 45678',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  isRegistered: false,
  role: 'Aspiring Classical Dancer',
  handle: '@rahul_classical'
};

const PRIYA_PATEL: UserProfile = {
  name: 'Priya Patel',
  email: 'priya@feedants.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  isRegistered: true,
  role: 'Kathak & Folk Performer',
  handle: '@priya_dance'
};

export default function FeedantsApp() {
  const router = useRouter();

  // Navigation: 'home' | 'competition' | 'explore' | 'profile'
  const [currentView, setCurrentView] = useState<'home' | 'competition' | 'explore' | 'profile'>('competition');
  const [lang, setLang] = useState<'ENG' | 'HI'>('ENG');

  // Active User state - defaulting to Hassan Raza as requested!
  const [currentUser, setCurrentUser] = useState<UserProfile>(HASSAN_RAZA_USER);
  const [isRegistered, setIsRegistered] = useState<boolean>(true);
  const [spotsLeft, setSpotsLeft] = useState<number>(19);
  const [referralBalance, setReferralBalance] = useState<number>(10.0);

  // Tabs & expand state
  const [activeTab, setActiveTab] = useState<'about' | 'judging' | 'rules'>('about');
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false);

  // 1,000 Songs Modal & Player state
  const [showSongModal, setShowSongModal] = useState<boolean>(false);
  const [songSearch, setSongSearch] = useState<string>('');
  const [selectedTaalFilter, setSelectedTaalFilter] = useState<string>('All');
  const [selectedSong, setSelectedSong] = useState<typeof ALL_1000_SONGS[0] | null>(null);
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);

  // Submission & Modals state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [showReviewsModal, setShowReviewsModal] = useState<boolean>(false);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);

  // Video Modal
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; title: string; subtitle?: string; url: string }>({
    isOpen: false,
    title: '',
    subtitle: '',
    url: ''
  });

  // Toast feedback
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 6,
    minutes: 28,
    seconds: 32
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio API Classical Drone Simulator for previewing songs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const togglePlaySong = (song: typeof ALL_1000_SONGS[0], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (playingSongId === song.id) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setPlayingSongId(null);
      return;
    }

    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create soothing Tanpura / Sitar harmonic chord
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const freqs = [146.83, 164.81, 196.00, 220.00, 246.94, 293.66]; // D3, E3, G3, A3, B3, D4
      osc.frequency.setValueAtTime(freqs[song.id % freqs.length], ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;

      setPlayingSongId(song.id);
      showToast('🎵 Playing Audio Preview', `${song.title} (${song.raag} - ${song.taal})`);
    } catch {
      setPlayingSongId(song.id);
      showToast('🎵 Track Preview', `Playing ${song.title}`);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch {}
      }
    };
  }, []);

  // Filter 1000 songs
  const filteredSongs = useMemo(() => {
    return ALL_1000_SONGS.filter((s) => {
      const matchesSearch =
        !songSearch.trim() ||
        s.title.toLowerCase().includes(songSearch.toLowerCase()) ||
        s.raag.toLowerCase().includes(songSearch.toLowerCase()) ||
        s.taal.toLowerCase().includes(songSearch.toLowerCase()) ||
        s.artist.toLowerCase().includes(songSearch.toLowerCase());

      const matchesTaal = selectedTaalFilter === 'All' || s.taal.includes(selectedTaalFilter);

      return matchesSearch && matchesTaal;
    }).slice(0, 100);
  }, [songSearch, selectedTaalFilter]);

  // Copy referral link
  const handleCopyReferral = () => {
    const shareUrl = 'https://feedants.com/r/referral123';
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    showToast('Link Copied! 📋', 'https://feedants.com/r/referral123 copied to clipboard.');
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Switch between Registered (Priya) and Unregistered (Rahul)
  const toggleRegisteredState = () => {
    if (isRegistered) {
      setCurrentUser(RAHUL_SHARMA);
      setIsRegistered(false);
      showToast('Switched to Unregistered User (Rahul Sharma)', 'Screen now shows "Register Now - ₹99" with 19 spots left.');
    } else {
      setCurrentUser(HASSAN_RAZA_USER);
      setIsRegistered(true);
      showToast('Switched to Registered User (Hassan Raza)', 'Screen now shows "Registered" badge and "Upload Submission" button.');
    }
  };

  // Live Register Now
  const handleRegisterNow = () => {
    setIsRegistered(true);
    setSpotsLeft((prev) => Math.max(0, prev - 1));
    showToast('Registration Confirmed! 🎉', 'You are now registered for Feedants Classical Dance! You can now upload your submission.');
  };

  // Translations
  const t = {
    ENG: {
      goBack: 'Go back',
      title: 'Feedants Classical Dance',
      danceTag: 'Dance',
      multiWinTag: 'Multi-Win',
      certTag: 'Winners get certificate',
      prizePool: 'Prize Pool',
      entryFee: 'Entry Fee',
      spotsLeft: `Only ${spotsLeft} spots left`,
      bookedText: `${20 - spotsLeft} / 20 Booked`,
      judgeLabel: 'Judge',
      judgeName: 'Hassan Raza',
      judgeRole: 'Professional Kathak Dancer',
      judgeExp: '12+ Years of Experience',
      introVideo: 'Intro Video',
      regCloses: 'Registration closes in',
      hurry: 'Hurry up!',
      importantDates: 'Important Dates',
      regBefore: 'Register Before',
      subStarts: 'Submission Starts',
      subEnds: 'Submission Ends',
      resDate: 'Result Date',
      prevWinners: 'Previous Winners',
      tabAbout: 'About Competition',
      tabJudging: 'Judging Parameters',
      tabRules: 'Rules & Eligibility',
      aboutLine1: 'This is an online classical dance competition open for all age groups.',
      aboutLine2: 'Participate from anywhere and showcase your talent.',
      aboutLine3: 'Express your passion through traditional dance.',
      aboutExpanded: 'Whether you specialize in Kathak, Bharatanatyam, Odissi, or folk fusion, this stage is designed for artists who want to elevate their craft. Receive direct evaluation and scoring feedback from Hassan Raza. Top performers receive cash rewards, verified digital certificates, and feature spotlights across Feedants platforms.',
      viewMore: 'View more',
      viewLess: 'View less',
      rewardsTitle: 'Rewards',
      rewardsSub: '(All Positions)',
      first: '1st Winner',
      second: '2nd Winner',
      third: '3rd Winner',
      fourth: '4th Winner',
      fifth: '5th Winner',
      sixth: '6th Winner',
      disclaimer: 'Disclaimer: Only contributions from paid participants will be considered for judging.',
      howReceive: 'How will you receive prize money?',
      watchVideo: 'Watch video to know more',
      refundPolicy: 'Refund policy',
      securePayments: 'Secure payments powered by',
      referTitle: 'Refer & Earn more discount',
      referNow: 'Refer Now',
      earnSignup: 'You earn ₹10 for every signup',
      hearFromUsers: 'Hear From Our Users',
      seeWhatSay: 'See what participants say about Feedants',
      adHere: 'Ad Here',
      uploadSubmission: 'Upload Submission',
      registered: 'Registered',
      submittedBadge: 'Submitted',
      registerNowBtn: 'Register Now - ₹99',
      choose1000: 'Choose from 1,000 Verified Classical Songs',
      home: 'Home',
      explore: 'Explore',
      competitions: 'Competitions',
      profile: 'Profile',
      evalControls: 'Evaluator & Testing Controls',
      evalDesc: 'Toggle user state below to test both Registered and Unregistered flows:',
      regUserBtn: 'Hassan Raza (Registered)',
      priyaUserBtn: 'Priya Patel (Registered)',
      newUserBtn: 'Rahul Sharma (New User)',
      resetDbBtn: 'Reset Competition Demo Data',
      refBalanceLabel: 'Referral Balance',
      withdrawBtn: 'Withdraw',
      myCompetitions: 'My Competitions',
      viewRegister: 'View / Register',
      certificates: 'Certificates & Achievements',
      transactions: 'Transaction History',
      support: 'Help & Support',
      guestBadge: 'Guest / New User (Unregistered)',
      registeredUserBadge: 'Registered Participant',
      helloGreeting: 'Namaste',
      exploreSub: 'Discover competitions, submit entries, and earn awards.',
      liveBadge: 'LIVE NOW',
      viewStage: 'Enter Stage'
    },
    HI: {
      goBack: 'वापस जाएं',
      title: 'फीडैंट्स शास्त्रीय नृत्य प्रतियोगिता',
      danceTag: 'शास्त्रीय नृत्य',
      multiWinTag: 'मल्टी-विन',
      certTag: 'विजेताओं को प्रमाणपत्र',
      prizePool: 'कुल पुरस्कार',
      entryFee: 'प्रवेश शुल्क',
      spotsLeft: `केवल ${spotsLeft} स्थान शेष`,
      bookedText: `${20 - spotsLeft} / 20 बुक किया गया`,
      judgeLabel: 'निर्णायक (जज)',
      judgeName: 'हसन रज़ा',
      judgeRole: 'पेशेवर कथक नर्तक',
      judgeExp: '12+ वर्षों का अनुभव',
      introVideo: 'परिचय वीडियो',
      regCloses: 'पंजीकरण समाप्त होने में समय',
      hurry: 'जल्दी करें!',
      importantDates: 'महत्वपूर्ण तिथियां',
      regBefore: 'पंजीकरण की अंतिम तिथि',
      subStarts: 'प्रस्तुति प्रारंभ',
      subEnds: 'प्रस्तुति समाप्ति',
      resDate: 'परिणाम तिथि',
      prevWinners: 'पिछले विजेता',
      tabAbout: 'प्रतियोगिता के बारे में',
      tabJudging: 'मूल्यांकन के नियम',
      tabRules: 'नियम और पात्रता',
      aboutLine1: 'यह सभी आयु वर्ग के लिए एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है।',
      aboutLine2: 'घर बैठे कथक, भरतनाट्यम या ओडिसी प्रस्तुत करें और अपनी प्रतिभा दिखाएं।',
      aboutLine3: 'पारंपरिक नृत्य के माध्यम से अपनी कला व्यक्त करें।',
      aboutExpanded: 'हसन रज़ा सर द्वारा प्रत्यक्ष समीक्षा और फीडबैक प्राप्त करें। शीर्ष कलाकारों को नकद पुरस्कार, डिजिटल प्रमाणपत्र और फीडैंट्स प्लेटफॉर्म पर फीचर किया जाएगा।',
      viewMore: 'और देखें',
      viewLess: 'कम देखें',
      rewardsTitle: 'पुरस्कार विवरण',
      rewardsSub: '(सभी स्थान)',
      first: 'प्रथम विजेता',
      second: 'द्वितीय विजेता',
      third: 'तृतीय विजेता',
      fourth: 'चतुर्थ विजेता',
      fifth: 'पंचम विजेता',
      sixth: 'छठा विजेता',
      disclaimer: 'अस्वीकरण: केवल पंजीकृत प्रतिभागियों की प्रस्तुतियों का ही मूल्यांकन किया जाएगा।',
      howReceive: 'पुरस्कार राशि कैसे प्राप्त होगी?',
      watchVideo: 'विस्तार से जानने के लिए वीडियो देखें',
      refundPolicy: 'रिफंड नीति',
      securePayments: 'सुरक्षित भुगतान माध्यम',
      referTitle: 'रेफर करें और छूट पाएं',
      referNow: 'रेफर करें',
      earnSignup: 'प्रत्येक साइनअप पर ₹10 प्राप्त करें',
      hearFromUsers: 'उपयोगकर्ताओं की राय',
      seeWhatSay: 'फीडैंट्स के बारे में प्रतिभागियों के अनुभव देखें',
      adHere: 'विज्ञापन स्थान',
      uploadSubmission: 'प्रस्तुति अपलोड करें',
      registered: 'पंजीकृत',
      submittedBadge: 'जमा हो गया',
      registerNowBtn: 'पंजीकरण करें - ₹99',
      choose1000: '1,000 प्रमाणित शास्त्रीय गीतों में से चुनें',
      home: 'होम',
      explore: 'खोजें',
      competitions: 'प्रतियोगिताएं',
      profile: 'प्रोफ़ाइल',
      evalControls: 'मूल्यांकन और परीक्षण नियंत्रण',
      evalDesc: 'पंजीकरण और सबमिशन दोनों प्रवाह का परीक्षण करने के लिए नीचे उपयोगकर्ता स्थिति टॉगल करें:',
      regUserBtn: 'हसन रज़ा (पंजीकृत)',
      priyaUserBtn: 'प्रिया पटेल (पंजीकृत)',
      newUserBtn: 'राहुल शर्मा (नया उपयोगकर्ता)',
      resetDbBtn: 'प्रतियोगिता डेमो डेटा रीसेट करें',
      refBalanceLabel: 'रेफरल शेष राशि',
      withdrawBtn: 'निकासी',
      myCompetitions: 'मेरी प्रतियोगिताएं',
      viewRegister: 'देखें / पंजीकरण करें',
      certificates: 'प्रमाणपत्र और उपलब्धियां',
      transactions: 'लेन-देन इतिहास',
      support: 'सहायता और समर्थन',
      guestBadge: 'अतिथि / नया उपयोगकर्ता',
      registeredUserBadge: 'पंजीकृत प्रतिभागी',
      helloGreeting: 'नमस्ते',
      exploreSub: 'प्रतियोगिताएं खोजें, प्रस्तुति दें और पुरस्कार जीतें।',
      liveBadge: 'लाइव प्रतियोगिता',
      viewStage: 'स्टेज में प्रवेश करें'
    }
  }[lang];

  return (
    <div className="w-full flex flex-col flex-1 bg-[#F8FAFC] font-sans antialiased text-slate-800 relative selection:bg-[#E6F5F4] selection:text-[#007A78]">
      
      {/* ── Realistic iPhone Status Bar ── */}
      <div className="w-full h-8 px-6 pt-2 pb-1 flex items-center justify-between text-slate-900 select-none bg-white z-40">
        <span className="text-xs font-semibold tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5">
          {/* Signal Bars */}
          <div className="flex items-end gap-[1.5px] h-3">
            <span className="w-[2.5px] h-1 bg-slate-900 rounded-[0.5px]"></span>
            <span className="w-[2.5px] h-1.5 bg-slate-900 rounded-[0.5px]"></span>
            <span className="w-[2.5px] h-2 bg-slate-900 rounded-[0.5px]"></span>
            <span className="w-[2.5px] h-2.5 bg-slate-900 rounded-[0.5px]"></span>
          </div>
          {/* WiFi Icon */}
          <svg className="w-3.5 h-3.5 fill-slate-900" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 2.2c3.98 0 7.6 1.55 10.3 4.1L12 18.5 1.7 10.3C4.4 7.75 8.02 6.2 12 6.2z"/>
          </svg>
          {/* Battery */}
          <div className="w-5 h-2.5 border border-slate-900 rounded-[3px] p-[1px] flex items-center relative">
            <div className="h-full bg-slate-900 rounded-[1px] w-[80%]"></div>
            <div className="w-[1.5px] h-1 bg-slate-900 rounded-r-[0.5px] absolute -right-[2.5px] top-[2px]"></div>
          </div>
        </div>
      </div>

      {/* ── Quick Evaluator Testing Switcher Banner ── */}
      <div className="w-full bg-[#007A78]/10 border-b border-[#007A78]/20 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#007A78]">
        <div className="flex items-center gap-1 font-semibold truncate mr-2">
          <span>Active User:</span>
          <span className="font-extrabold underline truncate">{currentUser.name}</span>
          <span className="hidden sm:inline">({isRegistered ? 'Registered' : 'Unregistered'})</span>
        </div>
        <button
          onClick={toggleRegisteredState}
          className="bg-[#007A78] hover:bg-[#005f5e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs transition active:scale-95 cursor-pointer flex-shrink-0"
        >
          Toggle: {isRegistered ? 'Switch to Rahul (New)' : 'Switch to Hassan (Reg)'}
        </button>
      </div>

      {/* ── Toast Notification Banner ── */}
      {toast && (
        <div className="fixed top-12 left-0 right-0 max-w-sm mx-auto z-50 px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#4fd1c5] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[#4fd1c5]">{toast.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: HOME PAGE (ENGAGING, COMPLETE & FULLY WORKING)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'home' && (
        <div className="flex flex-col flex-1 pb-36">
          {/* Home Top Header */}
          <header className="px-5 py-4 bg-white flex items-center justify-between border-b border-gray-100 z-30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#007A78] text-white flex items-center justify-center font-black text-sm shadow-sm">
                F
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-slate-900">Feedants</span>
                <span className="text-[10px] font-bold text-[#007A78] block -mt-1 tracking-wider uppercase">Live Arts Stage</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switch */}
              <div className="flex bg-slate-100 p-0.5 rounded-full border border-gray-200">
                <button
                  onClick={() => setLang('ENG')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    lang === 'ENG' ? 'bg-[#005f5e] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ENG
                </button>
                <button
                  onClick={() => setLang('HI')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    lang === 'HI' ? 'bg-[#005f5e] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => showToast('Notifications', 'You have 1 active competition registration in Feedants Classical Dance.')}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#007A78] absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              </button>
            </div>
          </header>

          {/* Home Scrollable Content */}
          <main className="flex-1 px-4.5 py-4 space-y-5 overflow-y-auto">
            {/* User Greeting Bar */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {t.helloGreeting}, {currentUser.name} 👋
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {t.exploreSub}
                </p>
              </div>
              <div
                onClick={() => setCurrentView('profile')}
                className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#007A78]/40 shadow-xs cursor-pointer active:scale-95 transition"
              >
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* ── HERO FEATURED CARD: Feedants Classical Dance (100% Connected) ── */}
            <div className="bg-gradient-to-br from-[#005F5E] via-[#007A78] to-[#014241] rounded-3xl p-5 text-white shadow-lg shadow-[#007A78]/25 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/20 text-[#A7F3D0] text-[10px] font-black uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
                  {t.liveBadge}
                </span>
                <span className="text-xs font-bold text-white/80">Kathak &amp; Classical</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                  {t.title}
                </h3>
                <p className="text-xs text-white/80 mt-1 leading-snug">
                  Judge: <span className="font-bold text-white">Hassan Raza</span> (Professional Kathak Dancer)
                </p>
              </div>

              {/* Stats Row inside Hero */}
              <div className="grid grid-cols-3 gap-2 bg-black/20 rounded-2xl p-3 backdrop-blur-xs text-center border border-white/10">
                <div>
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Prize Pool</span>
                  <span className="text-sm font-black text-white">₹ 1,500</span>
                </div>
                <div className="border-x border-white/10">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Entry Fee</span>
                  <span className="text-sm font-black text-white">₹ 99</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Seats Left</span>
                  <span className="text-sm font-black text-[#A7F3D0]">{spotsLeft} / 20</span>
                </div>
              </div>

              {/* Action Button: Opens the Competition Screen! */}
              <button
                onClick={() => {
                  setCurrentView('competition');
                  showToast('Entering Stage 🎭', 'Viewing Feedants Classical Dance details.');
                }}
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-[#005f5e] font-extrabold text-sm rounded-2xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.viewStage}</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* ── 1,000 SONGS SPOTLIGHT BANNER ── */}
            <div className="bg-[#E6F5F4] border border-[#BDE6DF] rounded-2xl p-4.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#007A78] text-white flex items-center justify-center shadow-xs">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    1,000 Classical Songs
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    Kathak, Teentaal, &amp; Raag Tracks
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSongModal(true)}
                className="bg-[#007A78] hover:bg-[#005f5e] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Explore</span>
              </button>
            </div>

            {/* ── CATEGORY PILLS ── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Popular Categories
                </h3>
                <span className="text-[11px] text-[#007A78] font-bold cursor-pointer" onClick={() => setCurrentView('explore')}>
                  View all
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {['All Stages', 'Kathak Solo', 'Bharatanatyam', 'Semi-Classical', 'Folk Dance', 'Sufi & Ghazal'].map((cat, idx) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (cat.includes('Kathak') || cat.includes('All')) {
                        setCurrentView('competition');
                      } else {
                        showToast(cat, 'Filtering upcoming stages in this category.');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                      idx === 0
                        ? 'bg-[#007A78] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── MORE STAGES & COMPETITIONS LIST ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Active Competitions
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">3 Stages</span>
              </div>

              {/* Stage Card 1: Feedants Classical Dance */}
              <div
                onClick={() => setCurrentView('competition')}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#007A78]/50 transition cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F5F4] border border-[#BDE6DF] flex items-center justify-center text-[#007A78] flex-shrink-0 group-hover:scale-105 transition">
                    <Trophy className="w-6 h-6 text-[#007A78]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-[#007A78] transition truncate">
                        Feedants Classical Dance
                      </h4>
                      <span className="px-2 py-0.5 bg-[#E6F5F4] text-[#007A78] rounded-md text-[10px] font-bold">
                        Live
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Judge: <span className="font-semibold text-slate-700">Hassan Raza</span> • Kathak
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1 font-bold">
                      <span className="text-[#007A78]">₹ 1,500 Prize</span>
                      <span>•</span>
                      <span>₹ 99 Fee</span>
                      <span>•</span>
                      <span className="text-amber-600">{spotsLeft} spots left</span>
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#007A78] group-hover:text-white transition flex-shrink-0">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>

              {/* Stage Card 2: Kathak Tarana Showcase */}
              <div
                onClick={() => setCurrentView('competition')}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#007A78]/50 transition cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:scale-105 transition">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-[#007A78] transition truncate">
                        Kathak Tarana &amp; Thumri
                      </h4>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold">
                        Filling Fast
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Judge: <span className="font-semibold text-slate-700">Hassan Raza</span> • Solo
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1 font-bold">
                      <span className="text-[#007A78]">₹ 2,200 Prize</span>
                      <span>•</span>
                      <span>₹ 119 Fee</span>
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#007A78] group-hover:text-white transition flex-shrink-0">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* ── WINNERS HIGHLIGHT (HALL OF FAME) ── */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Previous Winners Showcase
                </h3>
                <span className="text-[11px] text-[#007A78] font-bold cursor-pointer" onClick={() => setShowReviewsModal(true)}>
                  Reviews
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { name: 'Riya Shah', pos: '1st Winner', prize: '₹ 550', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400' },
                  { name: 'Aarav Mehta', pos: '1st Winner', prize: '₹ 550', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400' },
                  { name: 'Neha Verma', pos: '2nd Winner', prize: '₹ 300', img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400' }
                ].map((w, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setVideoModal({
                        isOpen: true,
                        title: `${w.name} — ${w.pos}`,
                        subtitle: `Prize Won: ${w.prize}`,
                        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                      })
                    }
                    className="w-36 flex-shrink-0 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs cursor-pointer group active:scale-95 transition"
                  >
                    <div className="h-28 relative bg-slate-100">
                      <img src={w.img} alt={w.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 text-[#007A78] flex items-center justify-center shadow-md">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 text-center">
                      <h5 className="text-xs font-black text-slate-900 truncate">{w.name}</h5>
                      <span className="text-[10px] text-[#007A78] font-bold block">{w.pos} • {w.prize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Trust Row */}
            <div className="grid grid-cols-3 gap-2 bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-xs">
              <div>
                <span className="text-base font-black text-[#007A78]">₹50K+</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Prizes Paid</span>
              </div>
              <div className="border-x border-slate-100">
                <span className="text-base font-black text-[#007A78]">1,200+</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Performers</span>
              </div>
              <div>
                <span className="text-base font-black text-[#007A78]">100%</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Verified</span>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: COMPETITION DETAILS (1:1 SCREENSHOT + GENEROUS SPACING)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'competition' && (
        <div className="flex flex-col flex-1">
          {/* Top Header: "← Go back" & "ENG / हिंदी" toggle */}
          <header className="px-5 py-3.5 bg-white flex items-center justify-between border-b border-gray-100 z-30">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#007A78] transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>{t.goBack}</span>
            </button>

            {/* Language toggle matching reference screenshot */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-gray-200">
              <button
                onClick={() => setLang('ENG')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  lang === 'ENG'
                    ? 'bg-[#005f5e] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ENG
              </button>
              <button
                onClick={() => setLang('HI')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  lang === 'HI'
                    ? 'bg-[#005f5e] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
            </div>
          </header>

          {/* Main Scrollable Content with generous mobile breathing space */}
          <main className="flex-1 px-4 py-4 space-y-4 pb-48 overflow-y-auto">

            {/* ── CARD 1: Competition Title, Badges & Price Pool ── */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
              {/* Title & Status */}
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                  {t.title}
                </h1>
                {isRegistered ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E6F5F4] text-[#007A78] border border-[#C6EAE8] text-xs font-bold flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-[#007A78] stroke-[2.5]" />
                    <span>{hasSubmitted ? t.submittedBadge : t.registered}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex-shrink-0">
                    <span>₹99 Entry</span>
                  </div>
                )}
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  {t.danceTag}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  {t.multiWinTag}
                </span>
                <span className="px-3 py-1 rounded-lg text-[#007A78] bg-[#E6F5F4] text-xs font-bold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#007A78]" />
                  <span>{t.certTag}</span>
                </span>
              </div>

              {/* Price Pool, Entry Fee & Spots Left */}
              <div className="pt-3 flex items-end justify-between border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">{t.prizePool}</span>
                  <span className="text-2xl font-black text-[#007A78] tracking-tight">₹ 1,500</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-semibold block">{t.entryFee}</span>
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">₹ 99</span>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#007A78] flex items-center justify-end gap-1">
                    <Users className="w-3.5 h-3.5 text-[#007A78]" />
                    <span>{t.spotsLeft}</span>
                  </div>
                  <div className="w-28 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[#007A78] rounded-full transition-all duration-500"
                      style={{ width: `${((20 - spotsLeft) / 20) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-1">{t.bookedText}</span>
                </div>
              </div>
            </div>

            {/* ── CARD 2: Judge Card (NAME: HASSAN RAZA) ── */}
            <div className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#007A78]/30 shadow-xs flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                    alt="Hassan Raza"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    {t.judgeLabel}
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {t.judgeName}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {t.judgeRole}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {t.judgeExp}
                  </p>
                </div>
              </div>

              {/* Intro Video button */}
              <button
                onClick={() =>
                  setVideoModal({
                    isOpen: true,
                    title: `${t.judgeName} — ${t.introVideo}`,
                    subtitle: `${t.judgeRole} • ${t.judgeExp}`,
                    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                  })
                }
                className="flex flex-col items-center gap-1 group active:scale-95 transition cursor-pointer flex-shrink-0"
              >
                <div className="w-11 h-11 rounded-full bg-[#E0F4F5] text-[#007A78] flex items-center justify-center shadow-xs group-hover:bg-[#C6EAE8] transition">
                  <Play className="w-4 h-4 fill-[#007A78] text-[#007A78] ml-0.5" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{t.introVideo}</span>
              </button>
            </div>

            {/* ── CARD 3: Live Countdown Timer ── */}
            <div className="bg-[#EDF9F8] border border-[#D2F0EE] rounded-2xl px-4 py-3 flex items-center justify-between text-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-[#007A78]" />
                <span className="text-xs font-bold">{t.regCloses}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-[#007A78] tracking-wider">
                  {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
                <span className="text-[10px] font-black uppercase text-[#007A78] bg-white px-2 py-0.5 rounded-md border border-[#D2F0EE]">
                  {t.hurry}
                </span>
              </div>
            </div>

            {/* ── CARD 4: Important Dates (2x2 Grid) ── */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {t.importantDates}
              </h3>
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                {/* 1. Register Before */}
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#007A78] border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{t.regBefore}</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">10 Aug 26</span>
                    <span className="text-[10px] text-slate-500 font-medium">11:50 PM</span>
                  </div>
                </div>

                {/* 2. Submission Starts */}
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#007A78] border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{t.subStarts}</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">6 Aug 26</span>
                    <span className="text-[10px] text-slate-500 font-medium">04:00 AM</span>
                  </div>
                </div>

                {/* 3. Submission Ends */}
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#007A78] border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{t.subEnds}</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">30 Aug 26</span>
                    <span className="text-[10px] text-slate-500 font-medium">11:55 PM</span>
                  </div>
                </div>

                {/* 4. Result Date */}
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#007A78] border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{t.resDate}</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">1 Sept 26</span>
                    <span className="text-[10px] text-slate-500 font-medium">11:50 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 5: Previous Winners (Carousel) ── */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {t.prevWinners}
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {[
                  { name: 'Riya Shah', pos: '1st Winner', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400' },
                  { name: 'Aarav Mehta', pos: '1st Winner', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400' },
                  { name: 'Neha Verma', pos: '2nd Winner', img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400' },
                  { name: 'Ishita Chouhan', pos: '3rd Winner', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400' }
                ].map((winner, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setVideoModal({
                        isOpen: true,
                        title: `${winner.name} — ${winner.pos}`,
                        subtitle: 'Previous Edition Performance Video',
                        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                      })
                    }
                    className="w-28 flex-shrink-0 cursor-pointer group active:scale-95 transition"
                  >
                    <div className="w-28 h-28 rounded-2xl overflow-hidden relative border border-slate-100 shadow-xs bg-slate-100">
                      <img
                        src={winner.img}
                        alt={winner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 text-[#007A78] flex items-center justify-center shadow-md">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{winner.name}</h4>
                      <span className="text-[10px] text-[#007A78] font-bold block">{winner.pos}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CARD 6: Tabs (About / Judging / Rules) + 1,000 Songs Button ── */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
              {/* Tab Selector */}
              <div className="flex border-b border-gray-100 pb-1 gap-2">
                {[
                  { key: 'about', label: t.tabAbout },
                  { key: 'judging', label: t.tabJudging },
                  { key: 'rules', label: t.tabRules }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`pb-2.5 px-2 text-xs font-bold transition border-b-2 cursor-pointer ${
                      activeTab === tab.key
                        ? 'border-[#007A78] text-[#007A78]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              {activeTab === 'about' && (
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>{t.aboutLine1}</p>
                  <p>{t.aboutLine2}</p>
                  <p>{t.aboutLine3}</p>
                  {isAboutExpanded && (
                    <p className="pt-2 text-slate-500 border-t border-slate-100 animate-in fade-in">
                      {t.aboutExpanded}
                    </p>
                  )}
                  <button
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="flex items-center gap-1 text-[#007A78] font-bold text-xs pt-1 cursor-pointer"
                  >
                    <span>{isAboutExpanded ? t.viewLess : t.viewMore}</span>
                    {isAboutExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {activeTab === 'judging' && (
                <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">1. Rhythm &amp; Timing (Taal) — 30%</span>
                    <span className="text-[11px] text-slate-500">Precision of footwork, beats, and synchronization.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">2. Choreography &amp; Abhinaya — 30%</span>
                    <span className="text-[11px] text-slate-500">Expressive emotiveness and storytelling mastery.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">3. Costume &amp; Presentation — 20%</span>
                    <span className="text-[11px] text-slate-500">Authentic classical attire and stage aura.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">4. Mudra &amp; Technical Precision — 20%</span>
                    <span className="text-[11px] text-slate-500">Accuracy of classical gestures and posture.</span>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>• Video duration must be between 1 to 3 minutes.</p>
                  <p>• Solo classical performance only (Kathak, Bharatanatyam, Odissi, or semi-classical).</p>
                  <p>• Continuous single-take recording without cuts or editing.</p>
                  <p>• Performer must remain clearly visible in frame throughout.</p>
                </div>
              )}

              {/* 1,000 Classical Songs Catalog Trigger Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowSongModal(true)}
                  className="w-full py-3 px-4 bg-[#E6F5F4] hover:bg-[#d6f0ee] border border-[#BDE6DF] text-[#007A78] rounded-2xl font-black text-xs flex items-center justify-between transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#007A78]" />
                    <span>{t.choose1000}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#007A78] text-white rounded-full text-[10px] font-bold">
                    1K Tracks
                  </span>
                </button>
              </div>
            </div>

            {/* ── CARD 7: Rewards (All Positions) ── */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5">
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t.rewardsTitle}
                </h3>
                <span className="text-[11px] text-slate-400 font-semibold">{t.rewardsSub}</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { rank: t.first, amount: '₹ 550', icon: '🏆' },
                  { rank: t.second, amount: '₹ 300', icon: '🥈' },
                  { rank: t.third, amount: '₹ 240', icon: '🥉' },
                  { rank: t.fourth, amount: '₹ 200', icon: '⭐' },
                  { rank: t.fifth, amount: '₹ 130', icon: '⭐' },
                  { rank: t.sixth, amount: '₹ 80', icon: '⭐' }
                ].map((rew, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{rew.icon}</span>
                      <span className="font-bold text-slate-800">{rew.rank}</span>
                    </div>
                    <span className="font-extrabold text-[#007A78]">{rew.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CARD 8: Disclaimer Banner ── */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-2.5 text-slate-600 text-xs shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#007A78] flex-shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px] font-medium">{t.disclaimer}</p>
            </div>

            {/* ── CARD 9: Trust, Prize Money Video & Refund Policy ── */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
              {/* Prize Money Question */}
              <div
                onClick={() =>
                  setVideoModal({
                    isOpen: true,
                    title: 'Prize Money Transfer Process',
                    subtitle: 'Direct UPI & Bank Transfer within 24 Hours',
                    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                  })
                }
                className="flex items-center justify-between cursor-pointer group active:scale-95 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6F5F4] text-[#007A78] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C6EAE8] transition">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007A78] transition">
                      {t.howReceive}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.watchVideo}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007A78]" />
              </div>

              {/* Refund Policy & Razorpay Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-[#007A78] font-bold cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#007A78]" />
                  <span>{t.refundPolicy}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span>{t.securePayments}</span>
                  <span className="font-black text-slate-900 italic tracking-tight">Razorpay</span>
                </div>
              </div>
            </div>

            {/* ── CARD 10: Refer & Earn More Discount ── */}
            <div className="bg-[#EDF9F8] border border-[#D2F0EE] rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#007A78]/15 text-[#007A78] flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">
                    {t.referTitle}
                  </h4>
                </div>

                <div className="text-right">
                  <button
                    onClick={handleCopyReferral}
                    className="bg-[#007A78] hover:bg-[#005f5e] text-white font-extrabold text-xs px-4 py-1.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    {t.referNow}
                  </button>
                  <span className="text-[10px] text-[#007A78] font-bold block mt-1">
                    {t.earnSignup}
                  </span>
                </div>
              </div>

              {/* Referral link box with Copy Link */}
              <div className="flex items-center gap-2 bg-white rounded-2xl border border-[#BFE6DE] p-1.5 pl-3 shadow-xs">
                <span className="text-[11px] font-mono text-slate-600 truncate flex-1">
                  https://feedants.com/r/referral123
                </span>
                <button
                  onClick={handleCopyReferral}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  {copySuccess ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* ── CARD 11: Hear From Our Users (Reviews Card) ── */}
            <div
              onClick={() => setShowReviewsModal(true)}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer hover:border-[#007A78]/40 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.hearFromUsers}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.seeWhatSay}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* ── CARD 12: Ad Here Banner ── */}
            <div className="border border-dashed border-slate-300 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
              <Megaphone className="w-4 h-4 text-slate-400" />
              <span>{t.adHere}</span>
            </div>

          </main>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 3: EXPLORE COMPETITIONS & SONGS VIEW
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'explore' && (
        <div className="flex flex-col flex-1 pb-36">
          <header className="px-5 py-4 bg-white flex items-center justify-between border-b border-gray-100 z-30">
            <div>
              <h2 className="text-base font-black text-slate-900">Explore Feedants</h2>
              <p className="text-[10px] text-slate-500">Discover classical dance competitions &amp; music</p>
            </div>
            <button
              onClick={() => setShowSongModal(true)}
              className="bg-[#007A78] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
            >
              1,000 Songs
            </button>
          </header>

          <main className="flex-1 p-4.5 space-y-4 overflow-y-auto">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search Kathak, Raags, Judges, Prizes..."
                onClick={() => setShowSongModal(true)}
                readOnly
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium cursor-pointer shadow-xs"
              />
            </div>

            {/* Featured Stage in Explore */}
            <div
              onClick={() => setCurrentView('competition')}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] cursor-pointer group active:scale-[0.99] transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E6F5F4] text-[#007A78] text-[10px] font-black uppercase">
                  Featured Classical Stage
                </span>
                <span className="text-xs font-bold text-[#007A78]">₹ 1,500 Prize</span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#007A78] transition">
                Feedants Classical Dance 2026
              </h3>
              <p className="text-xs text-slate-500">
                Judged by <span className="font-semibold text-slate-800">Hassan Raza</span> (Kathak Master)
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">Entry: ₹99</span>
                <span className="font-bold text-[#007A78] flex items-center gap-1">
                  View Competition <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* 1K Songs Banner */}
            <div
              onClick={() => setShowSongModal(true)}
              className="bg-gradient-to-r from-[#005f5e] to-[#007A78] rounded-3xl p-5 text-white shadow-md cursor-pointer space-y-2"
            >
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-[#A7F3D0]" />
                <h4 className="text-sm font-black uppercase tracking-wide">1,000 Verified Tracks</h4>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Full catalog with Teentaal, Ektaal, Jhaptaal and Raag audio drone preview.
              </p>
              <span className="inline-block mt-1 text-xs font-bold text-[#A7F3D0] underline">
                Browse Full Catalog →
              </span>
            </div>
          </main>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 4: REDESIGNED PREMIUM USER PROFILE & EVALUATOR SANDBOX
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'profile' && (
        <div className="flex flex-col flex-1 pb-36">
          {/* Profile Header */}
          <header className="px-5 py-3.5 bg-white flex items-center justify-between border-b border-gray-100 z-30">
            <button
              onClick={() => setCurrentView('competition')}
              className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#007A78] transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back to Competition</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-full border border-gray-200">
                <button
                  onClick={() => setLang('ENG')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    lang === 'ENG' ? 'bg-[#005f5e] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ENG
                </button>
                <button
                  onClick={() => setLang('HI')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    lang === 'HI' ? 'bg-[#005f5e] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </header>

          <main className="p-4.5 space-y-4.5 overflow-y-auto">
            {/* ── PROFILE HERO CARD (STUNNING MODERN DESIGN) ── */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-18 h-18 rounded-full overflow-hidden border-3 border-[#007A78] p-0.5 shadow-md flex-shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#007A78] text-white flex items-center justify-center absolute -bottom-1 -right-1 ring-2 ring-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-black text-slate-900 truncate">
                      {currentUser.name}
                    </h2>
                    <span className="text-amber-500">✨</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
                    {currentUser.handle}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {currentUser.email}
                  </p>
                  
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E6F5F4] border border-[#C6EAE8] text-[#007A78]">
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-[#007A78]" />
                        <span>{t.registeredUserBadge}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3 text-[#007A78]" />
                        <span>{t.guestBadge}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 3-Pillar Stats Counter */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="p-2 rounded-2xl bg-slate-50">
                  <span className="text-base font-black text-[#007A78]">1</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Active Stage</span>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50">
                  <span className="text-base font-black text-[#007A78]">₹ 10.00</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Wallet</span>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50">
                  <span className="text-base font-black text-[#007A78]">1,000</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Songs Catalog</span>
                </div>
              </div>
            </div>

            {/* ── REFERRAL WALLET CARD ── */}
            <div className="bg-gradient-to-br from-[#005f5e] to-[#007A78] rounded-3xl p-5 text-white shadow-md space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/70 font-extrabold uppercase tracking-wider block">
                    {t.refBalanceLabel}
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    ₹ {referralBalance.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="bg-white hover:bg-slate-100 text-[#005f5e] font-black text-xs px-4 py-2 rounded-2xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  {t.withdrawBtn}
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
                <span>Earn ₹10 for every artist you invite</span>
                <button
                  onClick={handleCopyReferral}
                  className="text-white font-bold underline cursor-pointer"
                >
                  Share Link
                </button>
              </div>
            </div>

            {/* ── MY ACTIVE COMPETITIONS SECTION ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t.myCompetitions}
                </h3>
                <span className="text-[10px] text-[#007A78] font-bold">1 Enrolled</span>
              </div>

              {/* Feedants Classical Dance Card */}
              <div
                onClick={() => setCurrentView('competition')}
                className="bg-white rounded-3xl p-4.5 border border-slate-100 hover:border-[#007A78] transition cursor-pointer flex items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F5F4] border border-[#BDE6DF] flex items-center justify-center text-[#007A78] flex-shrink-0 group-hover:scale-105 transition">
                    <Trophy className="w-6 h-6 text-[#007A78]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#007A78] transition truncate">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Judge: <span className="font-semibold text-slate-700">Hassan Raza</span> • ₹1,500 Prize
                    </p>
                    <p className="text-[10px] text-[#007A78] font-bold mt-0.5">
                      Deadline: 10 Aug 26, 11:50 PM
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isRegistered ? (
                    <span className="px-3 py-1.5 bg-[#E6F5F4] border border-[#C6EAE8] text-[#007A78] rounded-xl text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-[#007A78]" />
                      <span>{t.registered}</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView('competition');
                      }}
                      className="px-3.5 py-1.5 bg-[#007A78] hover:bg-[#005f5e] active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      {t.viewRegister}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── EVALUATOR & DEVELOPER CONTROLS SANDBOX ── */}
            <div className="bg-[#EBF8F5] border-2 border-[#BFE6DE] rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#007A78] text-white flex items-center justify-center shadow-xs">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-extrabold text-[#007A78] uppercase tracking-wider">
                  {t.evalControls}
                </h3>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {t.evalDesc}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* 1. Set Name as Hassan Raza */}
                <button
                  onClick={() => {
                    setCurrentUser(HASSAN_RAZA_USER);
                    setIsRegistered(true);
                    showToast('Profile: Hassan Raza 🌟', 'Name set to Hassan Raza (Professional Kathak Dancer & Registered Performer).');
                  }}
                  className="py-2.5 px-2 rounded-xl text-xs font-bold bg-[#007A78] text-white shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="truncate">Set Hassan Raza</span>
                </button>

                {/* 2. Switch to Priya Patel */}
                <button
                  onClick={() => {
                    setCurrentUser(PRIYA_PATEL);
                    setIsRegistered(true);
                    showToast('Switched to Priya Patel 🎉', 'Active User: Priya Patel (Registered). Displays "Upload Submission" button.');
                  }}
                  className="py-2.5 px-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">Priya (Registered)</span>
                </button>

                {/* 3. Switch to Rahul Sharma */}
                <button
                  onClick={() => {
                    setCurrentUser(RAHUL_SHARMA);
                    setIsRegistered(false);
                    showToast('Switched to Rahul Sharma 👤', 'Active User: Rahul Sharma (New User). Displays "Register Now - ₹99".');
                  }}
                  className="py-2.5 px-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">Rahul (New User)</span>
                </button>

                {/* 4. Reset All Demo Data */}
                <button
                  onClick={() => {
                    setCurrentUser(HASSAN_RAZA_USER);
                    setIsRegistered(true);
                    setSpotsLeft(19);
                    setHasSubmitted(false);
                    setSelectedSong(null);
                    showToast('Demo Data Reset ✨', 'Competition spots (19 left) and user state have been restored.');
                  }}
                  className="py-2.5 px-2 rounded-xl text-xs font-bold bg-white text-[#007A78] border border-[#BFE6DE] hover:bg-[#EBF8F5] transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#007A78]" />
                  <span className="truncate">Reset Demo</span>
                </button>
              </div>
            </div>

            {/* ── ACCOUNT SETTINGS & SHORTCUTS ── */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Account &amp; Support
              </h3>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-gray-100">
                <div
                  onClick={() => showToast('Certificates', 'Official digital certificates are issued after competition results declaration on 1 Sept 26.')}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-[#007A78]" />
                    <span className="text-xs font-bold text-slate-800">{t.certificates}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => showToast('Payment History', 'All transactions are secured via Razorpay PCI-DSS compliant payment gateway.')}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-[#007A78]" />
                    <span className="text-xs font-bold text-slate-800">{t.transactions}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => setShowRefundModal(true)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#007A78]" />
                    <span className="text-xs font-bold text-slate-800">{t.refundPolicy}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => showToast('Feedants Helpdesk', 'Reach our support team anytime at support@feedants.com')}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#007A78]" />
                    <span className="text-xs font-bold text-slate-800">{t.support}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FIXED BOTTOM ACTION BAR & 5-TAB BOTTOM NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-gray-200 shadow-2xl">
        
        {/* Primary CTA on Competition Details Screen */}
        {currentView === 'competition' && (
          <div className="p-3 pb-2 bg-white">
            {isRegistered ? (
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full py-3.5 bg-[#005f5e] hover:bg-[#004e4d] text-white rounded-2xl font-extrabold text-sm shadow-md shadow-[#005f5e]/25 flex flex-col items-center justify-center gap-0.5 transition active:scale-[0.98] cursor-pointer"
              >
                <span>{hasSubmitted ? 'Upload Another Video' : t.uploadSubmission}</span>
                <span className="text-[10px] font-semibold text-[#b2dfdb] tracking-wide">
                  {t.registered}
                </span>
              </button>
            ) : (
              <button
                onClick={handleRegisterNow}
                className="w-full py-3.5 bg-[#005f5e] hover:bg-[#004e4d] text-white rounded-2xl font-extrabold text-sm shadow-md shadow-[#005f5e]/25 flex flex-col items-center justify-center gap-0.5 transition active:scale-[0.98] cursor-pointer"
              >
                <span>{t.registerNowBtn}</span>
                <span className="text-[10px] font-semibold text-[#b2dfdb] tracking-wide">
                  {spotsLeft} spots left
                </span>
              </button>
            )}
          </div>
        )}

        {/* 5-Tab Bottom Navigation: Home, Explore, (+), Competitions, Profile */}
        <nav className="py-2.5 px-4 flex items-center justify-around bg-white border-t border-slate-100">
          {/* 1. Home Button (Now 100% Functional!) */}
          <button
            onClick={() => {
              setCurrentView('home');
              showToast('Feedants Home 🏠', 'Welcome to Feedants Home Feed.');
            }}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${
              currentView === 'home' ? 'text-[#007A78] font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-1">{t.home}</span>
          </button>

          {/* 2. Explore Button */}
          <button
            onClick={() => {
              setCurrentView('explore');
              showToast('Explore Feedants 🧭', 'Explore classical dance stages & 1,000 songs.');
            }}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${
              currentView === 'explore' ? 'text-[#007A78] font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <Compass className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-1">{t.explore}</span>
          </button>

          {/* 3. Center (+) Action Button */}
          <div className="flex items-center justify-center flex-1">
            <button
              onClick={() => {
                if (isRegistered) {
                  setShowUploadModal(true);
                } else {
                  handleRegisterNow();
                }
              }}
              className="w-11 h-11 rounded-full bg-[#007A78] hover:bg-[#005f5e] text-white flex items-center justify-center shadow-lg shadow-[#007A78]/30 transition active:scale-90 cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* 4. Competitions Button */}
          <button
            onClick={() => setCurrentView('competition')}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${
              currentView === 'competition' ? 'text-[#007A78] font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <Trophy className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-1">{t.competitions}</span>
          </button>

          {/* 5. Profile Button */}
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${
              currentView === 'profile' ? 'text-[#007A78] font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <div className={`w-5 h-5 rounded-full overflow-hidden border ${currentView === 'profile' ? 'border-[#007A78] ring-2 ring-[#007A78]/30' : 'border-slate-300'}`}>
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] mt-1">{t.profile}</span>
          </button>
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: 1,000 VERIFIED CLASSICAL SONGS & TRACKS SELECTOR
          (LIVE AUDIO DRONE SYNTH PREVIEW, SEARCH & SELECTION)
      ───────────────────────────────────────────────────────────── */}
      {showSongModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-4.5 max-h-[88vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#007A78] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  1K
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Classical Songs Catalog</h4>
                  <p className="text-[10px] text-slate-500 font-medium">1,000 Verified Kathak &amp; Raag Pieces</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSongModal(false);
                  if (oscillatorRef.current) {
                    oscillatorRef.current.stop();
                    oscillatorRef.current.disconnect();
                    setPlayingSongId(null);
                  }
                }}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-3.5 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search Raag, Taal, Artist, Track #..."
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-gray-200 rounded-2xl text-xs font-medium outline-none focus:border-[#007A78] focus:bg-white transition"
              />
            </div>

            {/* Quick Taal Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto py-2.5 scrollbar-hide text-[10px] font-bold">
              {['All', 'Teentaal', 'Ektaal', 'Jhaptaal', 'Keherwa', 'Rupak'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTaalFilter(t)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer active:scale-95 ${
                    selectedTaalFilter === t
                      ? 'bg-[#007A78] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Song List */}
            <div className="overflow-y-auto flex-1 mt-1 space-y-2 pr-1">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => {
                    setSelectedSong(song);
                    setShowSongModal(false);
                    if (oscillatorRef.current) {
                      oscillatorRef.current.stop();
                      oscillatorRef.current.disconnect();
                      setPlayingSongId(null);
                    }
                    showToast('Track Selected 🎵', `${song.title}`);
                  }}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between gap-2.5 ${
                    selectedSong?.id === song.id
                      ? 'border-[#007A78] bg-[#E6F5F4]'
                      : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="text-[10px] text-[#007A78] font-mono">#{song.id}</span>
                      <span className="truncate">{song.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Raag: {song.raag}</span>
                      <span>•</span>
                      <span>{song.taal}</span>
                      <span>•</span>
                      <span>{song.duration}</span>
                    </div>
                  </div>

                  {/* Play audio preview */}
                  <button
                    onClick={(e) => togglePlaySong(song, e)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-90 ${
                      playingSongId === song.id
                        ? 'bg-[#007A78] text-white'
                        : 'bg-white border border-slate-200 text-[#007A78] hover:bg-[#E6F5F4]'
                    }`}
                  >
                    {playingSongId === song.id ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom info */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Showing 100 of 1,000 tracks</span>
              <span>Tap track to select for competition</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: UPLOAD DANCE SUBMISSION MODAL
      ───────────────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-sm font-black text-slate-900">Upload Dance Submission</h4>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={() => setUploadFileName('kathak_performance_hassan_raza_comp.mp4')}
              className="border-2 border-dashed border-[#007A78]/40 rounded-2xl p-5 text-center bg-[#E6F5F4]/40 hover:bg-[#E6F5F4] cursor-pointer transition"
            >
              <Upload className="w-8 h-8 text-[#007A78] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {uploadFileName || 'Choose MP4 Video (Max 50MB)'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Continuous 1 to 3-minute performance</p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Selected Classical Track
              </label>
              <div
                onClick={() => setShowSongModal(true)}
                className="p-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 cursor-pointer flex items-center justify-between"
              >
                <span className="font-semibold text-slate-800 truncate">
                  {selectedSong ? selectedSong.title : 'Tap to pick from 1,000 Song Catalog'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            </div>

            <button
              onClick={() => {
                setHasSubmitted(true);
                setShowUploadModal(false);
                showToast('Submission Uploaded! 🚀', 'Your video has been submitted to Judge Hassan Raza.');
              }}
              className="w-full py-3.5 bg-[#007A78] hover:bg-[#005f5e] text-white rounded-2xl font-extrabold text-xs shadow-md transition cursor-pointer active:scale-95"
            >
              Confirm &amp; Submit Video
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: VIDEO PLAYER MODAL (INTRO & PREVIOUS WINNERS)
      ───────────────────────────────────────────────────────────── */}
      {videoModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-in zoom-in-95">
            <div className="p-3.5 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <div className="flex-1 truncate">
                <span className="text-xs font-bold text-white block truncate">{videoModal.title}</span>
                {videoModal.subtitle && (
                  <span className="text-[10px] text-slate-400 block truncate">{videoModal.subtitle}</span>
                )}
              </div>
              <button
                onClick={() => setVideoModal({ isOpen: false, title: '', url: '' })}
                className="text-slate-400 hover:text-white ml-2 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-52 bg-slate-950 flex flex-col items-center justify-center text-center p-4 relative">
              <div className="w-14 h-14 rounded-full bg-[#007A78]/30 border border-[#007A78] flex items-center justify-center mb-2 shadow-lg">
                <Play className="w-6 h-6 fill-[#4fd1c5] text-[#4fd1c5] ml-0.5" />
              </div>
              <p className="text-xs font-bold text-white">Kathak Masterclass &amp; Evaluation Guide</p>
              <p className="text-[10px] text-slate-400 mt-1">Judge: Hassan Raza • 12+ Years Experience</p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: HEAR FROM OUR USERS TESTIMONIALS
      ───────────────────────────────────────────────────────────── */}
      {showReviewsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Hear From Our Users ⭐
              </h4>
              <button onClick={() => setShowReviewsModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {[
                {
                  name: 'Ananya Sharma',
                  role: 'Classical Kathak Performer',
                  rating: '★★★★★',
                  comment: 'Participating in Feedants dance competition was an incredible experience! The judging feedback from Hassan sir was genuinely insightful and improved my taal accuracy.'
                },
                {
                  name: 'Rohan Gupta',
                  role: '1st Winner - Previous Edition',
                  rating: '★★★★★',
                  comment: 'Very smooth registration and prompt prize transfer directly via UPI within 24 hours of results. Highly recommended for aspiring classical dancers!'
                },
                {
                  name: 'Sneha Iyer',
                  role: 'Bharatanatyam Soloist',
                  rating: '★★★★★',
                  comment: 'The 1,000 song catalog made choosing the right rhythm track effortless. Verified digital certificate was received promptly.'
                }
              ].map((rev, i) => (
                <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.name}</span>
                    <span className="text-amber-500 text-xs font-bold">{rev.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{rev.role}</span>
                  <p className="text-[11px] text-slate-600 leading-snug pt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 5: REFUND POLICY MODAL
      ───────────────────────────────────────────────────────────── */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Feedants 100% Refund Policy 🛡️
              </h4>
              <button onClick={() => setShowRefundModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>• 100% full refund guaranteed if the competition is cancelled by Feedants.</p>
              <p>• Refunds are initiated within 3-5 business days directly to your original payment source via Razorpay.</p>
              <p>• For any assistance, reach our 24/7 helpdesk at support@feedants.com.</p>
            </div>
            <button
              onClick={() => setShowRefundModal(false)}
              className="w-full py-2.5 bg-[#007A78] hover:bg-[#005f5e] text-white rounded-2xl text-xs font-bold transition cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 6: WITHDRAWAL INFO MODAL
      ───────────────────────────────────────────────────────────── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Withdrawal Information 💳
              </h4>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#EDF9F8] border border-[#D2F0EE] rounded-2xl p-3.5 text-xs space-y-1">
              <p className="font-bold text-[#007A78]">Current Referral Balance: ₹ 10.00</p>
              <p className="text-slate-600 text-[11px]">Minimum withdrawal threshold is ₹ 50.00.</p>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Keep sharing your referral link with fellow dancers and creators. You will earn ₹10 for every verified registration!
            </p>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="w-full py-3 bg-[#007A78] hover:bg-[#005f5e] text-white rounded-2xl text-xs font-bold transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}