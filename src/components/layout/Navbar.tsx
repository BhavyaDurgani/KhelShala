import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  Search, 
  Bell, 
  Trophy, 
  Award, 
  Layers, 
  Home, 
  Zap, 
  Menu, 
  X,
  ChevronDown,
  CheckCircle,
  Sparkles,
  LogIn,
  LogOut
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AuthService } from '../../services/authService';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    isAuthenticated, 
    openAuthModal, 
    logout, 
    notifications, 
    clearNotification 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await AuthService.logout();
    logout();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Tracks', path: '/tracks', icon: Layers },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Achievements', path: '/achievements', icon: Award },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/95 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center shrink-0 mr-4 lg:mr-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-500 p-0.5 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-4.5 h-4.5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white font-display whitespace-nowrap">
                  KHEL<span className="text-amber-400">SHALA</span>
                </span>
                <span className="text-[8px] uppercase tracking-widest text-slate-400 font-semibold -mt-1 font-mono whitespace-nowrap">
                  Learn • Play • Progress
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities: Search, XP Counter, Notifications, Profile / Auth */}
          <div className="flex items-center space-x-2 xl:space-x-3 shrink-0 ml-auto lg:ml-4">
            
            {/* Quick Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:block relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 xl:w-40 bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:w-48 transition-all font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            {/* User XP Badge */}
            <div className="flex items-center px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 font-mono shrink-0 whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-amber-400 mr-1 fill-current animate-bounce" />
              <span className="text-xs font-bold text-amber-400">{user.totalXP}</span>
              <span className="text-[10px] text-amber-500 ml-1 font-bold">XP</span>
            </div>

            {/* Notifications Bell */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-[#0B0F17] animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-3 z-50">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                      Activity Alerts
                    </span>
                    <span className="text-[10px] text-slate-400">{notifications.length} new</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No unread notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="flex justify-between items-start p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                          <div>
                            <div className="font-semibold text-slate-200">{n.title}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5">{n.message}</div>
                            <span className="text-[9px] text-slate-500 mt-1 block font-mono">{n.timestamp}</span>
                          </div>
                          <button onClick={() => clearNotification(n.id)} className="text-slate-500 hover:text-slate-300 ml-2">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Quick Menu OR Sign In Button */}
            {isAuthenticated ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 rounded-full border border-slate-700/80 hover:border-blue-500 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50 shrink-0"
                  />
                  <span className="hidden xl:inline-block text-xs font-semibold text-slate-200 max-w-[90px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-3 z-50 space-y-2">
                    <div className="pb-2 border-b border-slate-800">
                      <div className="font-bold text-sm text-slate-100">{user.name}</div>
                      <div className="text-xs text-slate-400 flex items-center mt-0.5 font-mono">
                        <CheckCircle className="w-3 h-3 text-teal-400 mr-1" />
                        Level {user.currentLevel} Learner
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl"
                    >
                      Learner Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl"
                    >
                      View & Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Sign Up</span>
              </button>
            )}

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bg-card border-b border-bg-border px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-surface border border-bg-border rounded-lg py-2 pl-9 pr-3 text-xs text-slate-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs font-semibold ${
                    isActive(link.path)
                      ? 'bg-brand-primary text-white'
                      : 'bg-bg-surface text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
