import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: { name: string; email: string; avatar?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      onSuccessLogin({
        name: 'Tanu Shree',
        email: 'tanu.shree@accenture.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      });
      setIsSigningIn(false);
      onClose();
    }, 600);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSigningIn(true);
    setTimeout(() => {
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      onSuccessLogin({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
      });
      setIsSigningIn(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border border-dark-750 w-full max-w-md rounded-3xl p-7 shadow-glow-card relative overflow-hidden text-dark-100">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-blue/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-dark-850 border border-dark-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <img src="/logo.png" alt="ControlPlane Logo" className="w-8 h-8 object-contain" />
          </div>
          <h3 className="font-display font-bold text-xl text-gradient-brand">
            Sign in to ControlPlane.ai
          </h3>
          <p className="text-xs text-dark-400 font-sans mt-1">
            Access the Enterprise AI Oversight & Guardrail Control Tower
          </p>
        </div>

        {/* 1-Click Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-white text-dark-950 hover:bg-dark-100 font-semibold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 group mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
          <ArrowRight className="w-3.5 h-3.5 text-dark-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-dark-800" />
          <span className="px-3 text-[11px] font-mono text-dark-500 uppercase">
            or email
          </span>
          <div className="flex-1 border-t border-dark-800" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-dark-400 uppercase mb-1">
              Enterprise Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-dark-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-850 border border-dark-750 text-white placeholder-dark-500 text-xs focus:outline-none focus:border-accent-gold/60 focus:ring-1 focus:ring-accent-gold/60 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-dark-400 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-dark-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-850 border border-dark-750 text-white placeholder-dark-500 text-xs focus:outline-none focus:border-accent-gold/60 focus:ring-1 focus:ring-accent-gold/60 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent-gold to-amber-500 hover:from-amber-500 hover:to-amber-600 text-dark-950 font-display font-semibold text-xs transition-all shadow-glow-gold active:scale-98 disabled:opacity-50 mt-2"
          >
            {isSigningIn ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Security Footnote */}
        <div className="mt-5 pt-4 border-t border-dark-800/80 text-center text-[10px] text-dark-500 font-sans flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-status-safe" />
          <span>SOC-2 & ISO 27001 AI Governance Compliant</span>
        </div>

      </div>
    </div>
  );
};
