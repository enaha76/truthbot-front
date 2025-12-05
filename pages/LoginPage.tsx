import React, { useState } from 'react';
import { useAuth } from '../App';
import { Lock, ArrowRight, User as UserIcon, Mail, Search, Check, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Handle structured errors from backend
        // Backend returns: { field: ["error1", "error2"] }
        setErrors(error.response.data);
      } else {
        // Fallback for generic errors
        setErrors({ non_field_errors: [isLogin ? "Login failed. Please check your credentials." : "Registration failed. Please try again."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const Logo = () => (
    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-lg border border-white/30">
      <Search className="w-10 h-10 text-white" strokeWidth={2.5} />
      <div className="absolute inset-0 flex items-center justify-center pt-1 pl-1">
        <Check className="w-5 h-5 text-secondary" strokeWidth={4} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-mint dark:bg-dark-bg transition-colors duration-300">

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 bg-grid-slate-100 dark:bg-grid-slate-900/5 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:[mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white/80 dark:bg-dark-card/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden z-10 animate-slideUp">

        {/* Left Side: Brand */}
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary to-[#1A4546] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 text-center flex flex-col items-center">
            <Logo />
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Truthboot</h1>
            <p className="text-secondary text-sm max-w-[250px] mx-auto leading-relaxed">
              Verify reality. Detect misinformation.
              <br />Powered by Advanced AI.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white relative">
              <Search className="w-6 h-6" />
              <Check className="w-3 h-3 absolute text-secondary" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Truthboot</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {isLogin ? 'Enter your details to access the analyzer.' : 'Get started with your free account.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.non_field_errors && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  {errors.non_field_errors.map((err, idx) => (
                    <div key={idx}>{err}</div>
                  ))}
                </div>
              </div>
            )}
            {!isLogin && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Name</label>
                <div className="relative group">
                  <UserIcon className={`absolute left-3 top-3 h-5 w-5 transition-colors ${errors.username ? 'text-red-500' : 'text-gray-400 group-focus-within:text-primary'}`} />
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-mint/50 dark:bg-dark-bg/50 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.username
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200 dark:border-dark-border focus:ring-primary/20 focus:border-primary'
                      }`}
                    placeholder="Full Name"
                  />
                </div>
                {errors.username && (
                  <div className="mt-1 text-xs text-red-500 flex items-start gap-1 animate-fadeIn">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{errors.username[0]}</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <Mail className={`absolute left-3 top-3 h-5 w-5 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-primary'}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-mint/50 dark:bg-dark-bg/50 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-200 dark:border-dark-border focus:ring-primary/20 focus:border-primary'
                    }`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <div className="mt-1 text-xs text-red-500 flex items-start gap-1 animate-fadeIn">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{errors.email[0]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-3 h-5 w-5 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-primary'}`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-mint/50 dark:bg-dark-bg/50 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-200 dark:border-dark-border focus:ring-primary/20 focus:border-primary'
                    }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <div className="mt-1 text-xs text-red-500 flex flex-col gap-1 animate-fadeIn">
                  {errors.password.map((err, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#235b5c] text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "New to Truthboot?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setIsLogin(!isLogin); setEmail(''); setPassword(''); setName(''); }}
                className="text-primary font-semibold hover:text-[#235b5c] dark:text-secondary dark:hover:text-white transition-colors focus:outline-none"
              >
                {isLogin ? 'Create an account' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};