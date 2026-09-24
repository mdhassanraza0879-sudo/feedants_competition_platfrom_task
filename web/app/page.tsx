'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  Music,
  X,
  Share2,
  ChevronRight,
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
  Sparkles
} from 'lucide-react';

const GENERATED_SONGS = Array.from({ length: 1000 }, (_, i) => {
  const raags = ['Yaman', 'Bhairav', 'Bhairavi', 'Darbaari', 'Malkauns', 'Bhimpalasi', 'Desh', 'Kafi', 'Bageshri', 'Todi'];
  const taals = ['Teentaal (16 Beats)', 'Ektaal (12 Beats)', 'Jhaptaal (10 Beats)', 'Rupak (7 Beats)', 'Keherwa (8 Beats)'];
  const artists = ['Pt. Birju Maharaj', 'Ustad Zakir Hussain', 'Vidushi Kaushiki', 'Pt. Ravi Shankar', 'Ustad Bismillah Khan'];

  const raag = raags[i % raags.length];
  const taal = taals[i % taals.length];
  const artist = artists[i % artists.length];

  return {
    id: i + 1,
    title: 'Kathak Thaat & Tukra #' + (i + 1) + ' - Raag ' + raag,
    raag: raag,
    taal: taal,
    duration: String(Math.floor(2 + (i % 3))) + ':' + String(10 + ((i * 7) % 50)).padStart(2, '0'),
    artist: artist
  };
});

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isRegistered: boolean;
}

const RAHUL_SHARMA: UserProfile = {
  name: 'Rahul Sharma',
  email: 'rahul@feedants.com',
  phone: '+91 98123 45678',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  isRegistered: false
};

const PRIYA_PATEL: UserProfile = {
  name: 'Priya Patel',
  email: 'priya@feedants.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  isRegistered: true
};

export default function FeedantsApp() {
  const router = useRouter();

  // Navigation: default view is 'profile' per user requirement
  const [currentView, setCurrentView] = useState<'profile' | 'competition' | 'home' | 'explore'>('profile');
  const [lang, setLang] = useState<'ENG' | 'HI'>('ENG');

  // User & Evaluator testing state: default user is Rahul Sharma (Unregistered)
  const [currentUser, setCurrentUser] = useState<UserProfile>(RAHUL_SHARMA);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [spotsLeft, setSpotsLeft] = useState<number>(19);
  const [referralBalance, setReferralBalance] = useState<number>(10.0);

  // Competition details tab & modals
  const [activeTab, setActiveTab] = useState<'about' | 'judging' | 'rules'>('about');
  const [showSongModal, setShowSongModal] = useState<boolean>(false);
  const [songSearch, setSongSearch] = useState<string>('');
  const [selectedSong, setSelectedSong] = useState<typeof GENERATED_SONGS[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

  // Toast notification
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; title: string; url: string }>({
    isOpen: false,
    title: '',
    url: ''
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 6,
    minutes: 28,
    seconds: 11
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

  const filteredSongs = useMemo(() => {
    if (!songSearch.trim()) return GENERATED_SONGS.slice(0, 50);
    const q = songSearch.toLowerCase();
    return GENERATED_SONGS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.raag.toLowerCase().includes(q) ||
        s.taal.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
    ).slice(0, 80);
  }, [songSearch]);

  const handleCopyReferral = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://feedants.com';
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    showToast('Link Copied! 📋', 'Referral link copied to clipboard. Share with fellow dancers!');
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleSwitchToRegistered = () => {
    setCurrentUser(PRIYA_PATEL);
    setIsRegistered(true);
    showToast('Switched to Registered User 🎉', 'Active User: Priya Patel. Displays "Registered" badge and "Upload Submission" button.');
  };

  const handleSwitchToUnregistered = () => {
    setCurrentUser(RAHUL_SHARMA);
    setIsRegistered(false);
    showToast('Switched to Unregistered User 👤', 'Active User: Rahul Sharma. Displays "Register Now - ₹99" to test live registration.');
  };

  const handleResetDemoData = () => {
    setCurrentUser(RAHUL_SHARMA);
    setIsRegistered(false);
    setSpotsLeft(19);
    setHasSubmitted(false);
    setSelectedSong(null);
    showToast('Demo Data Reset ✨', 'Competition spots (19 left) and user state have been restored to initial seed state.');
  };

  const handleRegisterFromCompetition = () => {
    setIsRegistered(true);
    setSpotsLeft((prev) => Math.max(0, prev - 1));
    showToast('Registration Confirmed! 🎉', 'You are now registered for Feedants Classical Dance! You can now upload your submission.');
  };

  // Smooth navigation to competition view
  const navigateToCompetition = () => {
    setCurrentView('competition');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'competition' }, '', '/?view=competition');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToProfile = () => {
    setCurrentView('profile');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'profile' }, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const checkUrlView = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'competition') {
          setCurrentView('competition');
        } else {
          setCurrentView('profile');
        }
      }
    };
    checkUrlView();
    window.addEventListener('popstate', checkUrlView);
    return () => window.removeEventListener('popstate', checkUrlView);
  }, []);

  // Translations
  const t = {
    ENG: {
      appName: 'Feedants',
      goBack: 'Go back',
      profileTitle: 'User Profile & Testing',
      evalControls: 'Evaluation & Testing Controls',
      evalDesc: 'Toggle user state below to test both the registration flow and the submission flow:',
      regUserBtn: 'Registered User (Priya Patel)',
      newUserBtn: 'New User (Rahul Sharma)',
      resetDbBtn: 'Reset Competition Demo Data',
      refBalanceLabel: 'Referral Balance',
      withdrawBtn: 'Withdraw',
      myCompetitions: 'My Competitions',
      viewRegister: 'View / Register',
      registeredBadge: 'Registered',
      submittedBadge: 'Submitted',
      guestBadge: 'Guest / New User (Unregistered)',
      registeredUserBadge: 'Registered Participant',
      title: 'Feedants Classical Dance',
      danceTag: 'Dance',
      multiWinTag: 'Multi-Win',
      certTag: 'Winners get certificate',
      prizePool: 'Prize Pool',
      entryFee: 'Entry Fee',
      spotsLeft: 'Only ' + spotsLeft + ' spots left',
      bookedText: (20 - spotsLeft) + ' / 20 Booked',
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
      aboutDesc: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your Kathak, Bharatanatyam, Odissi, or folk skills. Upload a 1 to 3-minute performance video.',
      judgingDesc: 'Evaluation parameters: 30% Rhythm & Taal accuracy, 25% Abhinaya & Facial Expressions (Bhava), 25% Hand gestures (Mudra), and 20% Costume & Choreography.',
      rulesDesc: '1. Video length: 60 to 180 seconds. 2. Must use an authorized classical piece or pick from our 1000+ classical song catalog. 3. Solo performances only.',
      catalogBtn: 'Choose from 1,000 Verified Classical Songs',
      rewardsTitle: 'Rewards',
      rewardsSub: '(Top 6 Positions)',
      howReceive: 'How will you receive prize money?',
      howReceiveDesc: 'Direct transfer to Bank Account or UPI within 24 hours of result declaration.',
      policy: '100% Refund policy • Secured by Razorpay',
      referTitle: 'Refer & Earn discount',
      referDesc: 'Earn ₹10 credit for every dancer who registers via your link.',
      referBtn: 'Refer Now',
      copied: 'Link Copied!',
      uploadCta: 'Upload Submission',
      registerNow: 'Register Now - ₹99',
      certificates: 'Certificates & Achievements',
      transactions: 'Transaction History',
      support: 'Help & Support',
      navHome: 'Home',
      navExplore: 'Explore',
      navCompetitions: 'Competitions',
      navProfile: 'Profile'
    },
    HI: {
      appName: 'फीडैंट्स',
      goBack: 'वापस जाएं',
      profileTitle: 'उपयोगकर्ता प्रोफ़ाइल और परीक्षण',
      evalControls: 'मूल्यांकन और परीक्षण नियंत्रण',
      evalDesc: 'पंजीकरण और सबमिशन दोनों प्रवाह का परीक्षण करने के लिए नीचे उपयोगकर्ता स्थिति टॉगल करें:',
      regUserBtn: 'पंजीकृत उपयोगकर्ता (प्रिया पटेल)',
      newUserBtn: 'नया उपयोगकर्ता (राहुल शर्मा)',
      resetDbBtn: 'प्रतियोगिता डेमो डेटा रीसेट करें',
      refBalanceLabel: 'रेफरल शेष राशि',
      withdrawBtn: 'निकासी',
      myCompetitions: 'मेरी प्रतियोगिताएं',
      viewRegister: 'देखें / पंजीकरण करें',
      registeredBadge: 'पंजीकृत',
      submittedBadge: 'जमा हो गया',
      guestBadge: 'अतिथि / नया उपयोगकर्ता',
      registeredUserBadge: 'पंजीकृत प्रतिभागी',
      title: 'फीडैंट्स शास्त्रीय नृत्य प्रतियोगिता',
      danceTag: 'शास्त्रीय नृत्य',
      multiWinTag: 'मल्टी-विन',
      certTag: 'विजेताओं को प्रमाणपत्र',
      prizePool: 'कुल पुरस्कार राशि',
      entryFee: 'प्रवेश शुल्क',
      spotsLeft: 'केवल ' + spotsLeft + ' स्थान शेष',
      bookedText: (20 - spotsLeft) + ' / 20 बुक किया गया',
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
      aboutDesc: 'यह सभी आयु वर्ग के लिए एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। घर बैठे कथक, भरतनाट्यम या ओडिसी प्रस्तुत करें और 1 से 3 मिनट का वीडियो अपलोड करें।',
      judgingDesc: 'मूल्यांकन आधार: 30% ताल और लय, 25% भाव और चेहरे के भाव, 25% मुद्राएं, और 20% वेशभूषा और मंच सज्जा।',
      rulesDesc: '1. वीडियो 1 से 3 मिनट का होना चाहिए। 2. हमारे 1000+ शास्त्रीय गीतों की सूची से गीत चुन सकते हैं। 3. केवल एकल प्रस्तुति मान्य है।',
      catalogBtn: '1,000 प्रमाणित शास्त्रीय गीतों की सूची देखें',
      rewardsTitle: 'पुरस्कार विवरण',
      rewardsSub: '(शीर्ष 6 विजेता)',
      howReceive: 'पुरस्कार राशि कैसे प्राप्त होगी?',
      howReceiveDesc: 'परिणाम घोषित होने के 24 घंटे के भीतर बैंक खाते या UPI में सीधी राशि भेजी जाएगी।',
      policy: '100% रिफंड गारंटी • रेज़रपे द्वारा सुरक्षित',
      referTitle: 'रेफर करें और छूट पाएं',
      referDesc: 'अपने रेफरल लिंक से जुड़ने वाले प्रत्येक प्रतिभागी पर ₹10 प्राप्त करें।',
      referBtn: 'रेफर करें',
      copied: 'लिंक कॉपी हो गया!',
      uploadCta: 'प्रस्तुति अपलोड करें',
      registerNow: 'पंजीकरण करें - ₹99',
      certificates: 'प्रमाणपत्र और उपलब्धियां',
      transactions: 'लेन-देन इतिहास',
      support: 'सहायता और समर्थन',
      navHome: 'होम',
      navExplore: 'खोजें',
      navCompetitions: 'प्रतियोगिताएं',
      navProfile: 'प्रोफ़ाइल'
    }
  }[lang];

  return (
    <div className="w-full flex flex-col flex-1 bg-white font-sans antialiased text-slate-800 relative selection:bg-teal-100 selection:text-teal-900">

      {/* ── Toast Feedback Notification ── */}
      {toast && (
        <div className="fixed top-3 left-0 right-0 max-w-sm mx-auto z-50 px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="text-xs font-bold text-teal-300">{toast.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: USER PROFILE / TESTING CONTROLS (ROOT ROUTE /)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'profile' && (
        <div className="flex flex-col flex-1 pb-24">
          {/* Top Header */}
          <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-14 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 flex items-center justify-between z-40 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center text-white font-black text-sm shadow-xs">
                F
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                {t.appName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold border border-slate-200">
                <button
                  onClick={() => setLang('ENG')}
                  className={lang === 'ENG' ? 'px-2 py-1 rounded-md transition bg-teal-700 text-white shadow-xs' : 'px-2 py-1 rounded-md transition text-slate-600 hover:text-slate-900'}
                >
                  ENG
                </button>
                <button
                  onClick={() => setLang('HI')}
                  className={lang === 'HI' ? 'px-2 py-1 rounded-md transition bg-teal-700 text-white shadow-xs' : 'px-2 py-1 rounded-md transition text-slate-600 hover:text-slate-900'}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </header>

          {/* Profile Main Content */}
          <main className="space-y-4 px-4 pt-16">

            {/* User Card: Rahul Sharma (default) / Priya Patel */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-600/40 p-0.5 shadow-xs flex-shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-extrabold text-slate-900 truncate">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {currentUser.email}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 border border-teal-200 text-teal-800">
                  {isRegistered ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-teal-600" />
                      <span>{t.registeredUserBadge}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 text-teal-600" />
                      <span>{t.guestBadge}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Evaluator & Testing Controls Card */}
            <div className="bg-teal-50/60 border-2 border-teal-200/90 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-extrabold text-teal-950 uppercase tracking-wider">
                  {t.evalControls}
                </h3>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {t.evalDesc}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleSwitchToRegistered}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${isRegistered
                      ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/30'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <CheckCircle className={`w-3.5 h-3.5 ${isRegistered ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">Registered User</span>
                </button>

                <button
                  onClick={handleSwitchToUnregistered}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${!isRegistered
                      ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/30'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <UserPlus className={`w-3.5 h-3.5 ${!isRegistered ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">New User (Rahul)</span>
                </button>
              </div>

              <button
                onClick={handleResetDemoData}
                className="w-full mt-2 pt-2 border-t border-teal-200/60 flex items-center justify-center gap-1.5 text-[11px] font-bold text-teal-800 hover:text-teal-950 transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3 h-3 text-teal-700" />
                <span>{t.resetDbBtn}</span>
              </button>
            </div>

            {/* Wallet & Referral Balance */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  {t.refBalanceLabel}
                </span>
                <span className="text-2xl font-black text-emerald-950 tracking-tight">
                  ₹ {referralBalance.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                {t.withdrawBtn}
              </button>
            </div>

            {/* Registered Competitions Section */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  {t.myCompetitions}
                </h3>
                <span className="text-[10px] text-teal-700 font-bold">1 Active</span>
              </div>

              {/* Feedants Classical Dance Card */}
              <div
                onClick={navigateToCompetition}
                className="bg-white rounded-2xl p-3.5 border border-gray-200 hover:border-teal-500 hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 shadow-sm group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0 group-hover:scale-105 transition">
                    <Trophy className="w-6 h-6 text-teal-700" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition truncate">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Deadline: 10 Aug 26, 11:50 PM
                    </p>
                    <p className="text-[10px] text-teal-700 font-bold mt-0.5">
                      Prize Pool: ₹1,500 • Entry: ₹99
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isRegistered ? (
                    <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.registeredBadge}</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToCompetition();
                      }}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      {t.viewRegister}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Account Options */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Account
              </h3>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                <div
                  onClick={() => showToast('Certificates', 'Official digital certificates are issued after competition results declaration on 1 Sept 26.')}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-slate-800">{t.certificates}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => showToast('Payment History', 'All transactions are secured via Razorpay PCI-DSS compliant payment gateway.')}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-slate-800">{t.transactions}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => showToast('Feedants Helpdesk', 'Reach our support team anytime at support@feedants.com')}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-teal-700" />
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
          VIEW 2: COMPETITION DETAILS VIEW (SMOOTH NAVIGATION VIEW)
      ───────────────────────────────────────────────────────────── */}
      {currentView === 'competition' && (
        <div className="flex flex-col flex-1">
          {/* Top Header Bar: Cleanly separated from Title and Price */}
          <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-14 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 flex items-center justify-between z-40 shadow-xs">
            <button
              onClick={navigateToProfile}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition active:scale-95 cursor-pointer py-1.5 pr-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-800" />
              <span>{t.goBack}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold border border-slate-200">
                <button
                  onClick={() => setLang('ENG')}
                  className={lang === 'ENG' ? 'px-2 py-1 rounded-md transition bg-teal-700 text-white shadow-xs' : 'px-2 py-1 rounded-md transition text-slate-600 hover:text-slate-900'}
                >
                  ENG
                </button>
                <button
                  onClick={() => setLang('HI')}
                  className={lang === 'HI' ? 'px-2 py-1 rounded-md transition bg-teal-700 text-white shadow-xs' : 'px-2 py-1 rounded-md transition text-slate-600 hover:text-slate-900'}
                >
                  हिंदी
                </button>
              </div>

              {isRegistered ? (
                <div className="flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 text-teal-600" />
                  <span>{hasSubmitted ? t.submittedBadge : t.registeredBadge}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                  <span>₹99 Entry</span>
                </div>
              )}
            </div>
          </header>

          {/* Main Container with vertical space-y-5, top padding pt-16 and bottom padding pb-36 */}
          <main className="space-y-5 px-4 pt-16 pb-36 font-sans">

            {/* 1. Competition Title & Badges */}
            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                {t.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {t.danceTag}
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {t.multiWinTag}
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  {t.certTag}
                </span>
              </div>
            </div>

            {/* 2. Pricing & Spots Progress Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-baseline gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t.prizePool}</span>
                  <span className="text-2xl font-black text-slate-900">₹ 1,500</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t.entryFee}</span>
                  <span className="text-xl font-bold text-slate-800">₹ 99</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-teal-800 flex items-center justify-end gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.spotsLeft}</span>
                </div>
                <div className="w-24 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-500"
                    style={{ width: `${((20 - spotsLeft) / 20) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">{t.bookedText}</span>
              </div>
            </div>

            {/* 3. Judge Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-600 shadow-xs flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    alt={t.judgeName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{t.judgeLabel}</span>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{t.judgeName}</h4>
                  <p className="text-[11px] text-slate-600 font-medium">{t.judgeRole}</p>
                  <p className="text-[10px] text-slate-400">{t.judgeExp}</p>
                </div>
              </div>

              <button
                onClick={() =>
                  setVideoModal({
                    isOpen: true,
                    title: t.judgeName + ' - ' + t.introVideo,
                    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                  })
                }
                className="flex flex-col items-center gap-1 group active:scale-95 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shadow-xs group-hover:bg-teal-200 transition">
                  <Play className="w-4 h-4 fill-teal-800 text-teal-800 ml-0.5" />
                </div>
                <span className="text-[10px] text-slate-600 font-bold">{t.introVideo}</span>
              </button>
            </div>

            {/* 4. Live Countdown Timer */}
            <div className="py-2.5 px-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 shadow-xs">
              <div className="flex items-center gap-1.5 text-amber-900">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[11px]">{t.regCloses}:</span>
              </div>
              <div className="font-mono text-xs font-extrabold text-slate-900">
                {String(timeLeft.days).padStart(2, '0') + 'd : ' + String(timeLeft.hours).padStart(2, '0') + 'h : ' + String(timeLeft.minutes).padStart(2, '0') + 'm : ' + String(timeLeft.seconds).padStart(2, '0') + 's'}
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md">
                {t.hurry}
              </span>
            </div>

            {/* 5. Important Dates Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                {t.importantDates}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {t.regBefore}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">10 Aug 26</p>
                  <p className="text-[10px] text-slate-500">11:50 PM</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {t.subStarts}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">6 Aug 26</p>
                  <p className="text-[10px] text-slate-500">04:00 AM</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {t.subEnds}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">30 Aug 26</p>
                  <p className="text-[10px] text-slate-500">11:55 PM</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-500" /> {t.resDate}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">1 Sept 26</p>
                  <p className="text-[10px] text-slate-500">11:50 PM</p>
                </div>
              </div>
            </div>

            {/* 6. Previous Winners Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                {t.prevWinners}
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-1.5 scrollbar-hide">
                {[
                  { name: 'Riya Shah', rank: '1st Winner', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                  { name: 'Aarav Mehta', rank: '1st Winner', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
                  { name: 'Neha Verma', rank: '2nd Winner', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
                  { name: 'Ishita Chouhan', rank: '3rd Winner', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
                ].map((winner, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setVideoModal({
                        isOpen: true,
                        title: winner.name + ' - Winning Performance',
                        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                      })
                    }
                    className="flex flex-col items-center flex-shrink-0 w-16 group active:scale-95 transition cursor-pointer"
                  >
                    <div className="relative w-14 h-14 rounded-full border-2 border-teal-600 p-0.5 overflow-hidden shadow-xs group-hover:border-teal-800">
                      <img src={winner.img} alt={winner.name} className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-1 truncate w-full text-center">{winner.name}</p>
                    <p className="text-[9px] font-semibold text-teal-700 truncate w-full text-center">{winner.rank}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Tabs Spacing & Song Catalog Selection */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
              {/* Tabs Row with flex items-center gap-4 overflow-x-auto border-b border-gray-200 pb-2 */}
              <div className="flex items-center gap-4 overflow-x-auto border-b border-gray-200 pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveTab('about')}
                  className={
                    activeTab === 'about'
                      ? 'whitespace-nowrap pb-2 text-xs font-bold border-b-2 border-teal-700 text-teal-800 transition cursor-pointer'
                      : 'whitespace-nowrap pb-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer'
                  }
                >
                  {t.tabAbout}
                </button>
                <button
                  onClick={() => setActiveTab('judging')}
                  className={
                    activeTab === 'judging'
                      ? 'whitespace-nowrap pb-2 text-xs font-bold border-b-2 border-teal-700 text-teal-800 transition cursor-pointer'
                      : 'whitespace-nowrap pb-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer'
                  }
                >
                  {t.tabJudging}
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={
                    activeTab === 'rules'
                      ? 'whitespace-nowrap pb-2 text-xs font-bold border-b-2 border-teal-700 text-teal-800 transition cursor-pointer'
                      : 'whitespace-nowrap pb-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer'
                  }
                >
                  {t.tabRules}
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed min-h-[44px]">
                {activeTab === 'about' && t.aboutDesc}
                {activeTab === 'judging' && t.judgingDesc}
                {activeTab === 'rules' && t.rulesDesc}
              </p>

              {/* 1,000 Songs Selector Action Button */}
              <button
                onClick={() => setShowSongModal(true)}
                className="w-full py-2.5 px-3.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-xs font-bold text-teal-800 flex items-center justify-between transition shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <span className="flex items-center gap-2 truncate">
                  <Music className="w-4 h-4 text-teal-700 flex-shrink-0" />
                  <span className="truncate">{selectedSong ? selectedSong.title : 'Explore 1,000 Classical Songs & Tracks'}</span>
                </span>
                <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2">
                  1,000 Songs
                </span>
              </button>
            </div>

            {/* 8. Rewards Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.rewardsTitle}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{t.rewardsSub}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {[
                  { rank: '1st Winner', amount: '₹ 550', color: 'text-amber-500' },
                  { rank: '2nd Winner', amount: '₹ 300', color: 'text-slate-400' },
                  { rank: '3rd Winner', amount: '₹ 240', color: 'text-amber-700' },
                  { rank: '4th Winner', amount: '₹ 200', color: 'text-slate-400' },
                  { rank: '5th Winner', amount: '₹ 130', color: 'text-slate-400' },
                  { rank: '6th Winner', amount: '₹ 80', color: 'text-slate-400' }
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3.5 text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <Trophy className={`w-3.5 h-3.5 ${r.color}`} />
                      {r.rank}
                    </span>
                    <span className="font-black text-slate-900">{r.amount}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-blue-50/80 border border-blue-200/70 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p><span className="font-bold text-blue-900">Disclaimer:</span> Only entries from verified registered participants will be judged.</p>
              </div>
            </div>

            {/* 9. Prize Transfer & Security Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 fill-teal-800 text-teal-800 ml-0.5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{t.howReceive}</p>
                  <button
                    onClick={() =>
                      setVideoModal({
                        isOpen: true,
                        title: 'Prize Money Transfer Process',
                        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                      })
                    }
                    className="mt-1 px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition cursor-pointer active:scale-95 inline-flex items-center gap-1"
                  >
                    <span>Watch video to know more</span>
                  </button>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>{t.policy}</span>
                <span>Secured by Razorpay</span>
              </div>
            </div>

            {/* 10. Refer & Earn Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-950">{t.referTitle}</span>
                <button
                  onClick={handleCopyReferral}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs rounded-lg transition shadow-sm cursor-pointer"
                >
                  {copySuccess ? t.copied : t.referBtn}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-600 font-mono truncate">
                  https://feedants.com/c/hassan-raza
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="px-3 py-1.5 text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition cursor-pointer"
                >
                  {copySuccess ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{t.referDesc}</p>
            </div>

            {/* 11. Hear From Our Users (Reviews) Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hear From Our Users
              </h3>
              <div className="space-y-2.5">
                {[
                  {
                    name: 'Ananya Sharma',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                    comment: 'Participating in Feedants dance competition was an incredible experience! The judging feedback from Hassan sir was genuinely insightful.'
                  },
                  {
                    name: 'Rohan Gupta',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                    comment: 'Very smooth registration and prompt prize transfer directly via UPI. Highly recommended for aspiring classical dancers!'
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <img src={rev.avatar} alt={rev.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-slate-800 text-[11px]">{rev.name}</span>
                      <span className="text-[10px] text-amber-500 font-bold">★★★★★</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FIXED BOTTOM BAR & FIXED BOTTOM NAVIGATION
          Fixed at bottom of mobile frame (max-w-md mx-auto)
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-gray-200 shadow-lg">

        {/* On Competition Details View: Render Action Button */}
        {currentView === 'competition' && (
          <div className="p-3 pb-2 bg-white border-b border-gray-100">
            {isRegistered ? (
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{hasSubmitted ? 'Upload Another Video' : t.uploadCta}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  {t.registeredBadge}
                </span>
              </button>
            ) : (
              <button
                onClick={handleRegisterFromCompetition}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{t.registerNow}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  {spotsLeft} spots left
                </span>
              </button>
            )}
          </div>
        )}

        {/* Global Bottom Navigation: Home, Explore, (+), Competitions, Profile */}
        <nav className="py-2 px-3 flex items-center justify-around bg-white">
          {/* Home */}
          <button
            onClick={navigateToProfile}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${currentView === 'home' ? 'text-teal-800 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1">{t.navHome}</span>
          </button>

          {/* Explore */}
          <button
            onClick={() => {
              setCurrentView('explore');
              showToast('Explore Feedants', 'Discover upcoming classical music and dance competitions across India.');
            }}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${currentView === 'explore' ? 'text-teal-800 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-1">{t.navExplore}</span>
          </button>

          {/* Center (+) Action Button */}
          <div className="flex items-center justify-center flex-1">
            <button
              onClick={() => {
                if (isRegistered) {
                  setShowUploadModal(true);
                } else {
                  navigateToCompetition();
                }
              }}
              className="w-10 h-10 rounded-full bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-700/30 transition active:scale-90 cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Competitions */}
          <button
            onClick={navigateToCompetition}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${currentView === 'competition' ? 'text-teal-800 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] mt-1">{t.navCompetitions}</span>
          </button>

          {/* Profile */}
          <button
            onClick={navigateToProfile}
            className={`flex flex-col items-center justify-center py-1 flex-1 cursor-pointer transition active:scale-95 ${currentView === 'profile' ? 'text-teal-800 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
          >
            <div className={`w-5 h-5 rounded-full overflow-hidden border ${currentView === 'profile' ? 'border-teal-700 ring-1 ring-teal-700' : 'border-slate-300'}`}>
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] mt-1">{t.navProfile}</span>
          </button>
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: 1,000 SONGS SELECTOR
      ───────────────────────────────────────────────────────────── */}
      {showSongModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Select Song (1,000 Tracks)</h4>
                <p className="text-[10px] text-slate-500">Pick authorized track for your performance</p>
              </div>
              <button onClick={() => setShowSongModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search raag, taal, artist (e.g. Yaman)..."
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-teal-600 focus:bg-white transition"
              />
            </div>

            <div className="overflow-y-auto flex-1 mt-3 space-y-2 pr-1">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => {
                    setSelectedSong(song);
                    setShowSongModal(false);
                    showToast('Track Selected 🎵', `Selected track: ${song.title}`);
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${selectedSong?.id === song.id
                      ? 'border-teal-700 bg-teal-50/70'
                      : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="truncate flex-1">{song.title}</span>
                    <span className="text-[10px] text-teal-700 ml-2 font-mono">{song.duration}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Raag: {song.raag}</span>
                    <span>•</span>
                    <span>Taal: {song.taal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: UPLOAD SUBMISSION MODAL
      ───────────────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-900">Upload Dance Submission</h4>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3.5 space-y-3">
              <div
                onClick={() => setUploadFileName('kathak_classical_performance_final.mp4')}
                className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center bg-teal-50/40 hover:bg-teal-50 cursor-pointer transition"
              >
                <Upload className="w-6 h-6 text-teal-700 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-800">
                  {uploadFileName || 'Choose MP4 Video (Max 50MB)'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Recorded performance in Kathak costume</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Selected Song Track
                </label>
                <div
                  onClick={() => setShowSongModal(true)}
                  className="p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 truncate">
                    {selectedSong ? selectedSong.title : 'Tap to select from 1,000 tracks'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>
              </div>

              <button
                onClick={() => {
                  setHasSubmitted(true);
                  setShowUploadModal(false);
                  showToast('Submission Uploaded! 🚀', 'Your classical dance entry has been submitted to Judge Hassan Raza.');
                }}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                Confirm &amp; Submit Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: VIDEO PLAYER MODAL
      ───────────────────────────────────────────────────────────── */}
      {videoModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-700 animate-in zoom-in-95">
            <div className="p-3 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <span className="text-xs font-bold text-white truncate flex-1">{videoModal.title}</span>
              <button
                onClick={() => setVideoModal({ isOpen: false, title: '', url: '' })}
                className="text-slate-400 hover:text-white ml-2 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-44 bg-slate-950 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-teal-600/30 border border-teal-500 flex items-center justify-center mb-2">
                <Play className="w-5 h-5 fill-teal-400 text-teal-400 ml-0.5" />
              </div>
              <p className="text-xs font-bold text-white">Kathak Masterclass &amp; Evaluation Guide</p>
              <p className="text-[10px] text-slate-400 mt-1">Judge: Hassan Raza • 12+ Years Experience</p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: WITHDRAWAL INFO MODAL
      ───────────────────────────────────────────────────────────── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Withdrawal Information 💳
              </h4>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs space-y-1">
              <p className="font-bold text-teal-900">Current Referral Balance: ₹ 10.00</p>
              <p className="text-slate-600 text-[11px]">Minimum withdrawal threshold is ₹ 50.00.</p>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Keep sharing your referral link with fellow dancers and creators. You will earn ₹10 for every verified registration!
            </p>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}