import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../components/admin/AdminAuthProvider';
import { ShieldCheck, Mail, Lock, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const { admin, login, loading, authError, sessionExpired } = useAdminAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState(null);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password) {
      setLocalError('Please fill in all credentials fields.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-dark relative overflow-hidden font-sans px-4">
      {/* Decorative Beachfront Background Wave lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,64L80,101.3C160,139,320,213,480,218.7C640,224,800,160,960,128C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-charcoal border border-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl relative z-10 text-center"
      >
        {/* Navora Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-deepblue border border-gold/40 text-gold rounded-full flex items-center justify-center mb-4 shadow-xl">
            <ShieldCheck size={26} className="stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-wider text-white">
            NAVORA<span className="text-gold">.</span>
          </h1>
          <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-gold font-bold mt-1.5">
            REALTORS ADMIN PORTAL
          </span>
        </div>

        {/* Warning expired session details */}
        {sessionExpired && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-xl flex items-start space-x-3 mb-6 text-xs text-left leading-relaxed">
            <Clock size={16} className="flex-shrink-0 mt-0.5" />
            <span>Session expired due to 15 minutes of inactivity. Please sign in again.</span>
          </div>
        )}

        {/* Alert Error Box */}
        {(authError || localError) && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start space-x-3 mb-6 text-xs text-left leading-relaxed animate-shake">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{authError || localError}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Email input */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@navorarealty.com"
                className="w-full bg-charcoal-dark border border-gray-800 focus:border-gold focus:ring-1 focus:ring-gold text-white placeholder:text-gray-600 rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full bg-charcoal-dark border border-gray-800 focus:border-gold focus:ring-1 focus:ring-gold text-white placeholder:text-gray-600 rounded-xl pl-11 pr-12 py-3.5 text-xs focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-3.5 text-[10px] text-gold uppercase tracking-wider font-bold hover:text-white"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deepblue text-white hover:bg-gold hover:text-deepblue disabled:bg-gray-800 disabled:text-gray-600 transition-all duration-300 py-4 rounded-xl flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2.5 shadow-lg"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={15} />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
        
        {/* Notice of strict access policies */}
        <p className="text-[10px] text-gray-600 leading-relaxed mt-10">
          Authorized administrative personnel only. System activities are logged and subject to audit security compliance.
        </p>
      </motion.div>
    </div>
  );
}
