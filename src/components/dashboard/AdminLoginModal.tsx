import React, { useState } from 'react';
import { Lock, User, KeyRound, X, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { playClickSound, play8BitArcadeSound } from '../../utils/audio';
import { SpecularButton } from '../SpecularButton';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Credenciales protegidas para Aylin Flores Portfolio
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
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#081208] border border-[#76FF03]/40 rounded-3xl p-8 shadow-[0_20px_60px_rgba(118,255,3,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#76FF03]/15 rounded-full blur-[70px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#76FF03]/10 border border-[#76FF03]/40 flex items-center justify-center text-[#76FF03] mb-4 shadow-[0_0_20px_rgba(118,255,3,0.3)]">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#76FF03] uppercase block mb-1">
            PANEL DE CONTROL PRIVADO
          </span>
          <h3 className="text-2xl font-black italic uppercase text-white tracking-tight">
            Acceso Administrativo
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Ingresa para gestionar proyectos, sliders, especialidades y medios.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              Usuario Administrador
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. Aylin2026"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] rounded-xl text-white text-sm placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              Contraseña de Seguridad
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] rounded-xl text-white text-sm placeholder-gray-500 outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <SpecularButton
              type="submit"
              variant="solid-lime"
              size="lg"
              radius={12}
              disabled={isLoading}
              className="w-full text-xs font-black tracking-wider uppercase py-3.5 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#050B05] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ENTRAR AL DASHBOARD</span>
                </>
              )}
            </SpecularButton>
          </div>
        </form>

        {/* Security badge note */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <span className="text-[10px] font-mono text-gray-500">
            Aylin Daniela Flores • Studio Kinetic Security System
          </span>
        </div>
      </div>
    </div>
  );
};
