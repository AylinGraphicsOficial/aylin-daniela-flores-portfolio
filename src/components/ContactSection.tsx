import React, { useState, useEffect } from 'react';
import { Clock, Check, Copy, MessageSquare, Star, Send, Sparkles, User, Building, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, CommentItem } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';
import { getStoredComments, saveStoredComment, syncCommentsFromRemote, subscribeToPortfolioChanges } from '../utils/portfolioStorage';

interface ContactSectionProps {
  lang: Language;
  onOpenProjectPlanner: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  onOpenProjectPlanner,
}) => {
  const t = translations[lang];

  const [comments, setComments] = useState<CommentItem[]>(getStoredComments);
  const [isCopied, setIsCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Comment Form State
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentCompany, setCommentCompany] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Sync comments on mount
  useEffect(() => {
    syncCommentsFromRemote().then((remote) => {
      if (remote && remote.length > 0) setComments(remote);
    });

    const unsubscribe = subscribeToPortfolioChanges(() => {
      setComments(getStoredComments());
    });
    return () => unsubscribe();
  }, []);

  // Live El Salvador Time Clock (UTC-6)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/El_Salvador',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText('Floresaylin2@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setIsSubmittingComment(true);
    playClickSound();

    try {
      const newCmt = await saveStoredComment({
        name: commentName.trim(),
        company: commentCompany.trim(),
        rating: commentRating,
        comment: commentText.trim(),
        status: 'approved',
      });

      playSuccessSound();
      setComments((prev) => [newCmt, ...prev]);
      setCommentSuccess(true);
      setCommentText('');
      setCommentName('');
      setCommentCompany('');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#76FF03', '#38B000', '#F59E0B'],
        });
      } catch {}

      setTimeout(() => {
        setCommentSuccess(false);
        setIsAddingComment(false);
      }, 2500);
    } catch (err) {
      console.error('Error saving comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const approvedComments = comments.filter((c) => c.status === 'approved');

  return (
    <section id="contact" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Background Ambience Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#76FF03]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#38B000]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ==================== 1. SECCIÓN DE COMENTARIOS (ENCIMA) ==================== */}
      <div className="mb-24 space-y-10 relative z-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="section-tag-pill inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#76FF03]" />
            <span>{lang === 'es' ? 'COMENTARIOS & TESTIMONIOS' : 'COMMUNITY FEEDBACK & REVIEWS'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
            {lang === 'es' ? 'Lo Que Dicen Sobre Mi Trabajo' : 'What Clients & Colleagues Say'}
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-xl mx-auto">
            {lang === 'es'
              ? 'Opiniones de clientes, colaboradores y la comunidad sobre proyectos de diseño, 3D e identidad visual.'
              : 'Opinions and feedback from clients, collaborators and community on 3D design and branding projects.'}
          </p>
          
          <div className="pt-2">
            <SpecularButton
              onClick={() => {
                playClickSound();
                setIsAddingComment(!isAddingComment);
              }}
              variant="glass"
              size="sm"
              radius={10}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#76FF03] border-[#76FF03]/40 hover:bg-[#76FF03]/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingComment ? (lang === 'es' ? 'CERRAR FORMULARIO' : 'CLOSE FORM') : (lang === 'es' ? 'DEJAR UN COMENTARIO' : 'LEAVE A REVIEW')}</span>
            </SpecularButton>
          </div>
        </div>

        {/* New Comment Submission Form Panel */}
        {isAddingComment && (
          <div className="max-w-xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-[#76FF03]/30 bg-[#061006]/90 shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-in fade-in duration-300">
            {commentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#76FF03]/20 border border-[#76FF03] mx-auto flex items-center justify-center text-[#76FF03]">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white uppercase">
                  {lang === 'es' ? '¡Comentario publicado!' : 'Review Submitted!'}
                </h4>
                <p className="text-xs text-gray-300">
                  {lang === 'es' ? 'Gracias por tu valoración. Ya es visible en la plataforma.' : 'Thank you for your feedback!'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#76FF03]" />
                  <span>{lang === 'es' ? 'Escribir una reseña' : 'Write a Review'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                      {lang === 'es' ? 'Tu Nombre *' : 'Your Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Roberto Henríquez"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#76FF03]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                      {lang === 'es' ? 'Empresa / Cargo (Opcional)' : 'Company / Role (Optional)'}
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Ej. Diana Brand / Diseñador"
                        value={commentCompany}
                        onChange={(e) => setCommentCompany(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#76FF03]"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Stars Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                    {lang === 'es' ? 'Calificación:' : 'Rating:'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentRating(star)}
                        className="p-1 text-gray-500 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= commentRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-gray-400 ml-2">
                      {commentRating}/5 {lang === 'es' ? 'estrellas' : 'stars'}
                    </span>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                    {lang === 'es' ? 'Comentario *' : 'Comment *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={lang === 'es' ? 'Comparte tu opinión sobre el trabajo realizado o experiencia colaborando...' : 'Share your thoughts on the creative work or collaboration...'}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#76FF03] resize-none"
                  />
                </div>

                <SpecularButton
                  type="submit"
                  disabled={isSubmittingComment}
                  variant="solid-lime"
                  size="sm"
                  radius={10}
                  className="w-full font-bold text-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#050B05]" />
                  <span>{isSubmittingComment ? 'PUBLICANDO...' : (lang === 'es' ? 'PUBLICAR COMENTARIO' : 'SUBMIT REVIEW')}</span>
                </SpecularButton>
              </form>
            )}
          </div>
        )}

        {/* Comments Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedComments.slice(0, 6).map((c) => (
            <div
              key={c.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#76FF03]/40 transition-all hover:shadow-[0_10px_30px_rgba(118,255,3,0.1)] group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < c.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed italic line-clamp-4">
                  "{c.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#76FF03] transition-colors truncate">
                    {c.name}
                  </h4>
                  {c.company && (
                    <span className="text-[10px] font-mono text-gray-400 block truncate">
                      {c.company}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 2. CAPTURA 4 CENTRADA ("CREEMOS JUNTOS") ==================== */}
      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="section-tag-pill inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-ping" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none">
            {t.contact.title}
          </h2>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Quick Copy Email Card (Centered) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-[#76FF03] uppercase font-bold">
              {t.contact.directEmail}
            </span>
            <SpecularButton
              onClick={handleCopyEmail}
              variant="glass"
              size="sm"
              radius={8}
              className="text-xs font-mono text-gray-200"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#76FF03]" />
                  <span className="text-[#76FF03] font-bold">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </SpecularButton>
          </div>
          <p className="text-xl md:text-2xl font-bold font-mono text-white select-all">
            Floresaylin2@gmail.com
          </p>
        </div>

        {/* Live El Salvador Clock (Centered) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono text-gray-400 block">
              {t.contact.localTime}
            </span>
            <span className="text-2xl font-black font-mono text-white tracking-wider">
              {currentTime || '02:30:00 PM'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#38B000]/20 border border-[#76FF03]/50 flex items-center justify-center text-[#76FF03]">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Start Project Quote Banner (Centered) */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#76FF03]/40 bg-gradient-to-br from-[#38B000]/20 to-[#050B05] flex flex-col sm:flex-row justify-between items-center gap-5 text-left shadow-[0_10px_30px_rgba(118,255,3,0.15)]">
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              {lang === 'es' ? '¿Deseas iniciar o cotizar un nuevo proyecto?' : 'Looking for a tailored quote?'}
            </h4>
            <p className="text-xs md:text-sm text-gray-300">
              {lang === 'es'
                ? 'Accede a la página de inicio de proyecto para enviar tus requerimientos.'
                : 'Use the dedicated project initiation page to submit your inquiry.'}
            </p>
          </div>
          <SpecularButton
            onClick={() => {
              playClickSound();
              onOpenProjectPlanner();
            }}
            variant="solid-lime"
            size="md"
            radius={12}
            className="text-xs md:text-sm font-black whitespace-nowrap shadow-[0_0_20px_rgba(118,255,3,0.4)]"
          >
            {lang === 'es' ? 'INICIAR PROYECTO' : 'LAUNCH ESTIMATOR'}
          </SpecularButton>
        </div>
      </div>
    </section>
  );
};
