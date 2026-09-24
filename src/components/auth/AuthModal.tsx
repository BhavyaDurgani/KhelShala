import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User as UserIcon, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Check, 
  Zap 
} from 'lucide-react';
import { AuthService } from '../../services/authService';
import { useStore } from '../../store/useStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
];

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { setUser } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userProfile = await AuthService.loginWithEmail(email, password);
      setUser(userProfile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username or player name.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const userProfile = await AuthService.signUpWithEmail(email, password, username, selectedAvatar);
      setUser(userProfile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      const userProfile = await AuthService.loginWithGoogle();
      setUser(userProfile);
      onClose();
    } catch (err: any) {
      console.warn('[Google Auth Error]', err);
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup')) {
        setError('🚫 Google login popup was blocked by your browser! Look at the top-right of your address bar, click the blocked popup icon (🚫 or 🔒), and select "Always allow popups from localhost". Then try clicking Sign In again.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completing authentication.');
      } else if (err?.code === 'auth/configuration-not-found' || err?.message?.includes('configuration-not-found')) {
        setError('Google Sign-In is not enabled yet in your Firebase Console. Go to Firebase Console -> Authentication -> Sign-in method and toggle Google to Enabled.');
      } else {
        setError(err?.message || 'Google sign-in popup was cancelled or failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 overflow-y-auto animate-fadeIn">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] absolute -bottom-10 right-10" />
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md rounded-3xl border border-slate-700/60 bg-[#0B0F17]/95 p-6 sm:p-8 shadow-2xl relative backdrop-blur-2xl transition-all my-auto z-10 ring-1 ring-blue-500/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all hover:rotate-90 duration-300"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pb-5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[11px] font-bold tracking-wide uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>KhelShala Player Identity</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mt-1">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join KhelShala'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {activeTab === 'login' 
              ? 'Sign in to access your interactive simulations, Level XP rank, and global leaderboard status.'
              : 'Create a player account to sync progress, earn badges, and compete across data tracks.'}
          </p>
        </div>

        {/* Segmented Tab Toggle */}
        <div className="flex rounded-2xl bg-slate-900/90 p-1 border border-slate-800 mb-6 relative">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 relative z-10 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 relative z-10 ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-start space-x-2.5 shadow-inner">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed font-sans">{error}</span>
          </div>
        )}

        {/* Form Controls */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="player@khelshala.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-blue-600/25 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-current" />
              <span>{loading ? 'AUTHENTICATING...' : 'LOG IN TO PLAYER ACCOUNT'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                Player Handle / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="CyberArchitect_99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="player@khelshala.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Avatar Selector Grid */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Select Player Avatar</span>
                <span className="text-[10px] text-teal-400 font-semibold flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Custom Preset
                </span>
              </label>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {AVATAR_PRESETS.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer p-0.5 border transition-all ${
                      selectedAvatar === url 
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-lg' 
                        : 'border-slate-800 opacity-65 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Avatar Preset ${idx + 1}`}
                      className="w-full h-11 object-cover rounded-lg"
                    />
                    {selectedAvatar === url && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-blue-600/25 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'CREATING PLAYER...' : 'CREATE PLAYER ACCOUNT'}</span>
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="bg-[#0B0F17] px-3">OR INSTANT AUTH</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="flex w-full items-center justify-center space-x-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all shadow-md active:scale-98"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.8c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9c-.2-.7-.4-1.4-.4-2.2z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

      </div>
    </div>
  );
};
