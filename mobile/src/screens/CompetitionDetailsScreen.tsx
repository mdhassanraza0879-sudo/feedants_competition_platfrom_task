import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Language } from '../constants/translations';
import { ICompetition, IWinner, IReward, IReview, ISubmission, IUser } from '../types';
import { competitionService } from '../services/api';
import { showAppAlert } from '../utils/alert';

import { Header } from '../components/Header';
import { CompetitionHeader } from '../components/CompetitionHeader';
import { CompetitionStats } from '../components/CompetitionStats';
import { JudgeCard } from '../components/JudgeCard';
import { CountdownTimer } from '../components/CountdownTimer';
import { ImportantDates } from '../components/ImportantDates';
import { WinnersSection } from '../components/WinnersSection';
import { CompetitionTabs } from '../components/CompetitionTabs';
import { RewardsSection } from '../components/RewardsSection';
import { TrustAndInfoCards } from '../components/TrustAndInfoCards';
import { ReferralCard } from '../components/ReferralCard';
import { ReviewsSection } from '../components/ReviewsSection';
import { BottomActionBar } from '../components/BottomActionBar';
import { BottomNav } from '../components/BottomNav';
import { SubmissionModal } from '../components/SubmissionModal';
import { VideoModal } from '../components/VideoModal';
import { InfoModal } from '../components/InfoModal';
import { CreateModal } from '../components/CreateModal';

import { HomeView } from './HomeView';
import { ExploreView } from './ExploreView';
import { ProfileView } from './ProfileView';

// Initial state matching assignment data
const DEFAULT_COMPETITION: ICompetition = {
  _id: 'default-comp-1',
  title: 'Feedants Classical Dance',
  category: 'Dance',
  type: 'Multi-Win',
  certificateProvided: true,
  prizePool: 1500,
  entryFee: 99,
  maxParticipants: 20,
  registeredParticipants: 1,
  registrationStart: new Date(Date.now() - 4 * 86400000).toISOString(),
  registrationDeadline: new Date(Date.now() + (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000).toISOString(),
  submissionStart: new Date(Date.now() - 1 * 86400000).toISOString(),
  submissionEnd: new Date(Date.now() + 8 * 86400000).toISOString(),
  resultDate: new Date(Date.now() + 10 * 86400000).toISOString(),
  judge: {
    name: 'Hassan Raza',
    role: 'Professional Kathak Dancer',
    experience: '12+ Years of Experience',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  about:
    'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.\n\nWhether you specialize in Kathak, Bharatanatyam, Odissi, or Kuchipudi, this stage is designed for performers who want to elevate their craft and receive direct feedback from industry masters. Top performers receive cash prizes, verified digital certificates, and feature spotlights across Feedants platforms.',
  judgingParameters: [
    { parameter: 'Rhythm & Timing (Taal)', weightage: 30, description: 'Precision of footwork and synchronization with the rhythm.' },
    { parameter: 'Choreography & Abhinaya', weightage: 30, description: 'Facial expressions, emotive depth, and storytelling through classical movements.' },
    { parameter: 'Costume & Presentation', weightage: 20, description: 'Traditional authenticity of attire, makeup, and stage presence.' },
    { parameter: 'Technical Precision (Mudra)', weightage: 20, description: 'Accuracy of hand gestures, postures, and balance.' }
  ],
  rules: [
    'Video duration must be between 2 to 5 minutes.',
    'Solo performances only. No group entries allowed.',
    'Original classical or semi-classical music must be used without copyright infringements.',
    'Continuous one-shot video recording without cuts or post-production video effects.',
    'Full body must remain visible in frame throughout the performance.',
    'Only contributions from paid participants will be considered for judging.'
  ],
  eligibility: [
    'Open to participants of all age groups worldwide.',
    'Both beginner and experienced classical dancers are welcome.',
    'Must register before the registration deadline.'
  ],
  status: 'REGISTRATION_OPEN',
  disclaimer: 'Only contributions from paid participants will be considered for judging.',
  referralLink: 'https://feedants.com/r/referral123',
  referralReward: 10,
  computed: {
    computedStatus: 'REGISTRATION_OPEN',
    spotsLeft: 19,
    isFull: false,
    isRegistrationOpen: true,
    isSubmissionOpen: true,
    hasRegistrationStarted: true,
    hasRegistrationEnded: false,
    hasSubmissionStarted: true,
    hasSubmissionEnded: false,
    isCompleted: false,
    registrationCountdownSeconds: 109643
  }
};

const DEFAULT_WINNERS: IWinner[] = [
  {
    _id: 'w1',
    competitionId: 'default-comp-1',
    userName: 'Riya Shah',
    position: '1st Winner',
    prizeAmount: 550,
    videoThumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    _id: 'w2',
    competitionId: 'default-comp-1',
    userName: 'Aarav Mehta',
    position: '1st Winner',
    prizeAmount: 550,
    videoThumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    _id: 'w3',
    competitionId: 'default-comp-1',
    userName: 'Neha Verma',
    position: '2nd Winner',
    prizeAmount: 300,
    videoThumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    _id: 'w4',
    competitionId: 'default-comp-1',
    userName: 'Ishita Chouhan',
    position: '3rd Winner',
    prizeAmount: 240,
    videoThumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
  }
];

const DEFAULT_REWARDS: IReward[] = [
  { _id: 'r1', competitionId: 'default-comp-1', rank: 1, title: '1st Winner', amount: 550, icon: '🏆' },
  { _id: 'r2', competitionId: 'default-comp-1', rank: 2, title: '2nd Winner', amount: 300, icon: '🥈' },
  { _id: 'r3', competitionId: 'default-comp-1', rank: 3, title: '3rd Winner', amount: 240, icon: '🥉' },
  { _id: 'r4', competitionId: 'default-comp-1', rank: 4, title: '4th Winner', amount: 200, icon: '⭐' },
  { _id: 'r5', competitionId: 'default-comp-1', rank: 5, title: '5th Winner', amount: 130, icon: '⭐' },
  { _id: 'r6', competitionId: 'default-comp-1', rank: 6, title: '6th Winner', amount: 80, icon: '⭐' }
];

const DEFAULT_REVIEWS: IReview[] = [
  {
    _id: 'rev1',
    userName: 'Ananya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    comment: 'Participating in Feedants dance competition was an incredible experience! The judging feedback from Hassan sir was genuinely insightful.',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'rev2',
    userName: 'Rohan Gupta',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 5,
    comment: 'Very smooth registration and prompt prize transfer directly via UPI. Highly recommended for aspiring artists!',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'rev3',
    userName: 'Sneha Iyer',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4,
    comment: 'Great platform for classical dancers. The community is very supportive and the digital certificate is verifiable.',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_USER_PRIYA: IUser = {
  _id: '6ab36414198c36baab8f60b9',
  name: 'Priya Patel',
  email: 'priya@feedants.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  phone: '+91 98765 43210'
};

const DEFAULT_USER_RAHUL: IUser = {
  _id: '6ab36414198c36baab8f60c0',
  name: 'Rahul Sharma',
  email: 'rahul@feedants.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  phone: '+91 98123 45678'
};

const DEFAULT_USER: IUser = DEFAULT_USER_RAHUL;

export const CompetitionDetailsScreen: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ENG');
  const [activeTab, setActiveTab] = useState<string>('Profile');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [competition, setCompetition] = useState<ICompetition>(DEFAULT_COMPETITION);
  const [winners, setWinners] = useState<IWinner[]>(DEFAULT_WINNERS);
  const [rewards, setRewards] = useState<IReward[]>(DEFAULT_REWARDS);
  const [reviews, setReviews] = useState<IReview[]>(DEFAULT_REVIEWS);
  const [currentUser, setCurrentUser] = useState<IUser | null>(DEFAULT_USER_RAHUL);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userSubmission, setUserSubmission] = useState<ISubmission | null>(null);

  // Modals state
  const [submissionModalVisible, setSubmissionModalVisible] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [videoModalData, setVideoModalData] = useState<{ visible: boolean; title: string; subtitle?: string; videoUrl?: string }>({
    visible: false,
    title: '',
    videoUrl: ''
  });
  const [infoModalData, setInfoModalData] = useState<{ visible: boolean; title: string; content: string[]; iconName?: any }>({
    visible: false,
    title: '',
    content: []
  });
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // 1. Initial Load: Fetch live data from backend API
  const loadInitialData = useCallback(async () => {
    try {
      const fetchedUsers = await competitionService.getUsers().catch(() => []);
      let activeUser: IUser | null = DEFAULT_USER_RAHUL;

      if (fetchedUsers && fetchedUsers.length > 0) {
        activeUser = fetchedUsers.find((u) => u.name.includes('Rahul')) || DEFAULT_USER_RAHUL;
      }
      setCurrentUser(activeUser);
      setIsRegistered(false);

      const competitionsList = await competitionService.getCompetitions().catch(() => []);
      if (competitionsList && competitionsList.length > 0) {
        const targetComp = competitionsList[0];
        await loadCompetitionDetails(targetComp._id, activeUser?._id);
      }
    } catch (err: any) {
      console.warn('⚠️ API connection notice:', err.message);
    }
  }, []);

  // 2. Load single competition details
  const loadCompetitionDetails = async (competitionId: string, userId?: string) => {
    try {
      const details = await competitionService.getCompetitionById(competitionId, userId);
      if (details && details.competition) {
        setCompetition(details.competition);
        setIsRegistered(details.isRegistered);
        setUserSubmission(details.userSubmission || null);
      }

      const [fetchedWinners, fetchedRewards, fetchedReviews] = await Promise.all([
        competitionService.getWinners(competitionId).catch(() => DEFAULT_WINNERS),
        competitionService.getRewards(competitionId).catch(() => DEFAULT_REWARDS),
        competitionService.getReviews(competitionId).catch(() => DEFAULT_REVIEWS)
      ]);

      if (fetchedWinners && fetchedWinners.length > 0) setWinners(fetchedWinners);
      if (fetchedRewards && fetchedRewards.length > 0) setRewards(fetchedRewards);
      if (fetchedReviews && fetchedReviews.length > 0) setReviews(fetchedReviews);
    } catch (err: any) {
      console.warn('⚠️ Supplementary fetch error:', err.message);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 3. Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (competition && competition._id !== 'default-comp-1') {
        await loadCompetitionDetails(competition._id, currentUser?._id);
      } else {
        await loadInitialData();
      }
    } finally {
      setRefreshing(false);
    }
  };

  // 4. Real Concurrency-Safe Registration Handler
  const handleRegister = async () => {
    try {
      setActionLoading(true);

      if (competition && competition._id !== 'default-comp-1' && currentUser) {
        const res = await competitionService.register(competition._id, currentUser._id);
        setIsRegistered(true);
        await loadCompetitionDetails(competition._id, currentUser._id);
        showAppAlert('Registration Confirmed! 🎉', res.message || 'You are now officially registered for Feedants Classical Dance!');
      } else {
        setIsRegistered(true);
        setCompetition((prev) => ({
          ...prev,
          registeredParticipants: prev.registeredParticipants + 1,
          computed: prev.computed
            ? {
                ...prev.computed,
                spotsLeft: Math.max(0, prev.computed.spotsLeft - 1)
              }
            : undefined
        }));
        showAppAlert('Registration Confirmed! 🎉', 'You are now officially registered for Feedants Classical Dance! You can now upload your performance video.');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      showAppAlert('Registration Error', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Submission Handler
  const handleSubmitEntry = async (title: string, videoUrl: string, description: string) => {
    try {
      if (competition && competition._id !== 'default-comp-1' && currentUser) {
        const submission = await competitionService.submitEntry(competition._id, {
          userId: currentUser._id,
          title,
          videoUrl,
          description
        });
        setUserSubmission(submission);
      } else {
        setUserSubmission({
          _id: `sub_${Date.now()}`,
          competitionId: competition._id,
          userId: currentUser?._id || 'user_1',
          title,
          videoUrl,
          description,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString()
        });
      }

      showAppAlert(
        'Submission Uploaded! 🚀',
        'Your classical dance entry has been submitted to the judging panel. Good luck!'
      );
    } catch (err: any) {
      showAppAlert('Submission Error', err.response?.data?.message || err.message || 'Failed to upload submission');
      throw err;
    }
  };

  // 6. Video Modals
  const handlePlayJudgeIntro = () => {
    setVideoModalData({
      visible: true,
      title: `${competition.judge.name} — Intro Video`,
      subtitle: `${competition.judge.role} (${competition.judge.experience})`,
      videoUrl: competition.judge.introVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    });
  };

  const handleSelectWinner = (winner: IWinner) => {
    setVideoModalData({
      visible: true,
      title: `${winner.userName} — ${winner.position}`,
      subtitle: `Prize Won: ₹${winner.prizeAmount?.toLocaleString('en-IN') || 550}`,
      videoUrl: winner.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    });
  };

  // 7. Info Modals
  const handleOpenPrizeInfo = () => {
    setInfoModalData({
      visible: true,
      title: 'Prize Money Distribution',
      iconName: 'cash-outline',
      content: [
        'Prize money is transferred directly to your verified UPI ID or Bank Account within 24-48 hours of result announcement.',
        'All winners are required to submit standard identity verification prior to fund disbursement.',
        'Official digital certificates will be sent directly to your registered email address.'
      ]
    });
  };

  const handleOpenRefundInfo = () => {
    setInfoModalData({
      visible: true,
      title: 'Feedants Refund Policy',
      iconName: 'shield-checkmark-outline',
      content: [
        '100% full refund is guaranteed if the competition is cancelled by Feedants.',
        'Refunds are initiated within 3-5 business days directly to the original payment source.',
        'For payment queries or assistance, contact support@feedants.com.'
      ]
    });
  };

  // 8. User Switcher for Evaluator / Testing
  const handleSwitchUser = async (userType: 'REGISTERED' | 'NEW') => {
    try {
      setActionLoading(true);
      const fetchedUsers = await competitionService.getUsers().catch(() => []);
      let targetUser: IUser | null = null;
      if (userType === 'REGISTERED') {
        targetUser = fetchedUsers.find((u) => u.name.includes('Priya') || u.name.includes('Hassan')) || fetchedUsers[0];
        setIsRegistered(true);
      } else {
        targetUser = fetchedUsers.find((u) => u.name.includes('Rahul')) || fetchedUsers[fetchedUsers.length - 1];
        setIsRegistered(false);
      }

      if (targetUser) {
        setCurrentUser(targetUser);
        if (competition && competition._id !== 'default-comp-1') {
          await loadCompetitionDetails(competition._id, targetUser._id);
        }
      }

      showAppAlert(
        'Testing State Switched! 🔄',
        userType === 'REGISTERED'
          ? 'Switched to Registered User (Priya Patel). The screen displays the "Registered" badge and "Upload Submission" button.'
          : 'Switched to Unregistered User (Rahul Sharma). The screen displays "Register Now - ₹99" to test live registration.'
      );
    } catch (err: any) {
      showAppAlert('Switch Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDB = async () => {
    try {
      setActionLoading(true);
      await competitionService.seedDatabase();
      await loadInitialData();
      showAppAlert('Database Reset ✨', 'Competition data and participant registrations have been reset to fresh seed state.');
    } catch (err: any) {
      showAppAlert('Reset Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const spotsLeft = competition.computed
    ? competition.computed.spotsLeft
    : Math.max(0, competition.maxParticipants - competition.registeredParticipants);

  const status = competition.computed?.computedStatus || competition.status;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onGoBack={() => {
          if (activeTab !== 'Competitions') {
            setActiveTab('Competitions');
          } else if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
            window.history.back();
          }
        }}
      />

      {/* Active Tab View */}
      {activeTab === 'Home' && (
        <HomeView
          language={language}
          onNavigateToCompetition={() => setActiveTab('Competitions')}
        />
      )}

      {activeTab === 'Explore' && (
        <ExploreView
          language={language}
          onNavigateToCompetition={() => setActiveTab('Competitions')}
        />
      )}

      {activeTab === 'Profile' && (
        <ProfileView
          user={currentUser}
          isRegistered={isRegistered}
          language={language}
          onNavigateToCompetition={() => setActiveTab('Competitions')}
          onSwitchUser={handleSwitchUser}
          onResetDB={handleResetDB}
        />
      )}

      {/* Competitions View directly matching reference screenshot */}
      {activeTab === 'Competitions' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
        >
          {/* 1. Main Title, Badges & Registered Status */}
          <CompetitionHeader
            title={competition.title}
            category={competition.category}
            type={competition.type}
            certificateProvided={competition.certificateProvided}
            isRegistered={isRegistered}
            status={status}
            language={language}
          />

          {/* 2. Prize Pool, Entry Fee & Spots Progress */}
          <CompetitionStats
            prizePool={competition.prizePool}
            entryFee={competition.entryFee}
            registeredParticipants={competition.registeredParticipants}
            maxParticipants={competition.maxParticipants}
            spotsLeft={spotsLeft}
            language={language}
          />

          {/* 3. Judge Card with Active Play Button */}
          <JudgeCard
            judge={competition.judge}
            language={language}
            onPlayIntro={handlePlayJudgeIntro}
          />

          {/* 4. Live Dynamic Countdown Banner */}
          <CountdownTimer
            deadline={competition.registrationDeadline}
            language={language}
            onTimerEnd={() => {
              if (competition && competition._id !== 'default-comp-1') {
                loadCompetitionDetails(competition._id, currentUser?._id);
              }
            }}
          />

          {/* 5. Important Dates (2x2 Grid) */}
          <ImportantDates
            registrationDeadline={competition.registrationDeadline}
            submissionStart={competition.submissionStart}
            submissionEnd={competition.submissionEnd}
            resultDate={competition.resultDate}
            language={language}
          />

          {/* 6. Previous Winners with Active Video Player */}
          <WinnersSection
            winners={winners}
            language={language}
            onSelectWinner={handleSelectWinner}
          />

          {/* 7. Interactive Tabs: About, Judging Parameters, Rules & Eligibility */}
          <CompetitionTabs
            about={competition.about}
            judgingParameters={competition.judgingParameters}
            rules={competition.rules}
            eligibility={competition.eligibility}
            language={language}
          />

          {/* 8. Rewards (All Positions) & Disclaimer */}
          <RewardsSection
            rewards={rewards}
            disclaimer={competition.disclaimer}
            language={language}
          />

          {/* 9. Trust Badges & Prize Money Info */}
          <TrustAndInfoCards
            language={language}
            onOpenPrizeInfo={handleOpenPrizeInfo}
            onOpenRefundInfo={handleOpenRefundInfo}
          />

          {/* 10. Referral & Discount Card */}
          <ReferralCard
            referralLink={competition.referralLink}
            referralReward={competition.referralReward}
            language={language}
          />

          {/* 11. User Reviews & Ad Banner */}
          <ReviewsSection reviews={reviews} language={language} />

          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* Sticky Bottom Action Button (visible on Competitions tab) */}
      {activeTab === 'Competitions' && (
        <BottomActionBar
          isRegistered={isRegistered}
          status={status}
          entryFee={competition.entryFee}
          spotsLeft={spotsLeft}
          language={language}
          onRegisterPress={handleRegister}
          onUploadPress={() => setSubmissionModalVisible(true)}
          isLoading={actionLoading}
        />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav
        language={language}
        activeTab={activeTab}
        userAvatar={currentUser?.avatarUrl}
        onTabPress={(tab) => {
          if (tab === 'Create') {
            setCreateModalVisible(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Submission Modal */}
      {submissionModalVisible && (
        <SubmissionModal
          visible={submissionModalVisible}
          onClose={() => setSubmissionModalVisible(false)}
          onSubmit={handleSubmitEntry}
          existingSubmission={userSubmission}
          language={language}
        />
      )}

      {/* Video Player Modal */}
      {videoModalData.visible && (
        <VideoModal
          visible={videoModalData.visible}
          onClose={() => setVideoModalData((prev) => ({ ...prev, visible: false }))}
          title={videoModalData.title}
          subtitle={videoModalData.subtitle}
          videoUrl={videoModalData.videoUrl}
        />
      )}

      {/* Information Modal */}
      {infoModalData.visible && (
        <InfoModal
          visible={infoModalData.visible}
          onClose={() => setInfoModalData((prev) => ({ ...prev, visible: false }))}
          title={infoModalData.title}
          content={infoModalData.content}
          iconName={infoModalData.iconName}
        />
      )}

      {/* (+) Create / Host Modal */}
      {createModalVisible && (
        <CreateModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onOpenUpload={() => {
            if (isRegistered) {
              setSubmissionModalVisible(true);
            } else {
              showAppAlert(
                'Registration Required',
                'Please register for the competition first to upload your dance entry!'
              );
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF'
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
    width: '100%'
  },
  scrollContent: {
    paddingBottom: 16
  }
});
