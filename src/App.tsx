import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { GamesPage } from './pages/GamesPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { TracksPage } from './pages/TracksPage';
import { AuthModal } from './components/auth/AuthModal';
import { useStore } from './store/useStore';
import { AuthService } from './services/authService';

export const App: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, setUser } = useStore();

  useEffect(() => {
    // Persistent Firebase Auth state listener
    const unsubscribe = AuthService.listenAuthState((userProfile) => {
      setUser(userProfile);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col justify-between selection:bg-brand-primary selection:text-white">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:gameSlug" element={<GameDetailPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tracks" element={<TracksPage />} />
            </Routes>
          </main>
        </div>
        <Footer />

        {/* Global Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
        />
      </div>
    </Router>
  );
};

export default App;

