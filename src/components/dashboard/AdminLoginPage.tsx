import React, { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { playClickSound, play8BitArcadeSound } from '../../utils/audio';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim() === 'Aylin2026' && password === '2026studio') {
        play8BitArcadeSound();
        setIsLoading(false);
        sessionStorage.setItem('aylin_admin_auth', 'true');
        onLoginSuccess();
      } else {
        playClickSound();
        setIsLoading(false);
        setError('Usuario o contraseña incorrectos. Por favor verifica tus credenciales.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background soft ambient gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top row: Back to Portfolio */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onNavigateHome();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Portafolio</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-slate-400">Portal Administrativo Seguro</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
              ACCESO PRIVADO
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Aylin Studio Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Ingresa tus credenciales autorizadas para gestionar proyectos, sliders y contenidos.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Usuario Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Aylin2026"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-[#0F172A] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-slate-500 outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer security note */}
          <div className="pt-4 border-t border-slate-700/60 text-center">
            <span className="text-[11px] font-mono text-slate-500">
              Aylin Daniela Flores • Studio Kinetic Administration
            </span>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="max-w-7xl w-full mx-auto text-center text-xs text-slate-500 font-mono z-10">
        © {new Date().getFullYear()} AYLIN STUDIO • ALL RIGHTS RESERVED
      </div>
    </div>
  );
};
