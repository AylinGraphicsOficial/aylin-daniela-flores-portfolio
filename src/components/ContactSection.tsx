import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Check,
  Copy,
  MessageSquare,
  Star,
  Send,
  Sparkles,
  User,
  Building,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Quote,
  X,
  Maximize2
} from 'lucide-react';
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

  // Comment Expansion & Modal State
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [selectedCommentForModal, setSelectedCommentForModal] = useState<CommentItem | null>(null);
  const [carouselPage, setCarouselPage] = useState(0);

  // Comment Form State
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentCompany, setCommentCompany] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCommentForModal) {
        setSelectedCommentForModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCommentForModal]);

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
    navigator.clipboard.writeText('aylin.graphicsdesign@gmail.com');
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

  // Filtrar comentarios aprobados que estén marcados como destacados para la portada
  const featuredComments = useMemo(() => {
    const list = comments.filter((c) => c.status === 'approved' && c.featured !== false);
    return list.length > 0 ? list : comments.filter((c) => c.status === 'approved');
  }, [comments]);

  const pageSize = 3;
  const totalPages = Math.ceil(featuredComments.length / pageSize);
  const currentItems = featuredComments.slice(
    carouselPage * pageSize,
    (carouselPage + 1) * pageSize
  );

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
          
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
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

            {featuredComments.length > pageSize && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                <span>{carouselPage + 1} / {totalPages}</span>
              </div>
            )}
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

        {/* ==================== 1.1 COMMENTS DISPLAY: SPOTLIGHT OR GRID ==================== */}
        {featuredComments.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-10 px-6 glass-panel rounded-2xl border border-white/10 space-y-2">
            <Quote className="w-8 h-8 text-[#76FF03]/40 mx-auto" />
            <p className="text-xs font-mono text-gray-400">
              {lang === 'es'
                ? 'Aún no hay testimonios destacados en la portada. ¡Sé el primero en compartir tu opinión!'
                : 'No reviews featured yet. Be the first to leave your feedback!'}
            </p>
          </div>
        ) : featuredComments.length === 1 ? (
          /* Single Spotlight Featured Review (Centered & Highlighted) */
          (() => {
            const c = featuredComments[0];
            const isExpanded = !!expandedIds[c.id];
            const isLong = c.comment.length > 130;

            return (
              <div className="max-w-2xl mx-auto">
                <div
                  className="glass-panel p-7 sm:p-9 rounded-3xl border border-[#76FF03]/40 bg-gradient-to-b from-[#0a1a0a]/90 to-[#040804]/95 shadow-[0_15px_50px_rgba(118,255,3,0.12)] flex flex-col justify-between space-y-5 hover:border-[#76FF03] transition-all group relative"
                >
                  {/* Decorative Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#76FF03]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4">
                    {/* Top Bar: Stars + Badge + Modal Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < c.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold bg-[#76FF03]/15 text-[#76FF03] border border-[#76FF03]/30 uppercase tracking-wider">
                          ★ {lang === 'es' ? 'TESTIMONIO DESTACADO' : 'FEATURED REVIEW'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setSelectedCommentForModal(c);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#76FF03]/20 text-gray-400 hover:text-[#76FF03] transition-colors cursor-pointer"
                          title={lang === 'es' ? 'Ver en modal completo' : 'View full review modal'}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Comment Text with Quote Mark */}
                    <div className="relative">
                      <Quote className="w-8 h-8 text-[#76FF03]/15 absolute -top-3 -left-2 -z-0" />
                      <p
                        className={`text-sm sm:text-base text-gray-200 leading-relaxed italic relative z-10 transition-all duration-300 ${
                          isExpanded ? 'whitespace-pre-line' : 'line-clamp-4'
                        }`}
                      >
                        "{c.comment}"
                      </p>
                    </div>

                    {/* Toggle Arrow Button if Long */}
                    {isLong && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          setExpandedIds((prev) => ({ ...prev, [c.id]: !isExpanded }));
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#76FF03] hover:text-white transition-colors cursor-pointer pt-1"
                      >
                        <span>
                          {isExpanded
                            ? (lang === 'es' ? 'Ocultar / Reducir' : 'Show less')
                            : (lang === 'es' ? 'Ver comentario completo' : 'Read full comment')}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#76FF03]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#76FF03]" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Author Info Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#76FF03]/20 to-[#38B000]/30 border border-[#76FF03]/50 flex items-center justify-center text-sm font-black text-[#76FF03] shadow-[0_0_15px_rgba(118,255,3,0.2)]">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#76FF03] transition-colors">
                          {c.name}
                        </h4>
                        {c.company && (
                          <span className="text-xs font-mono text-gray-400 block">
                            {c.company}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          /* Multi-Comment Responsive Grid / Carousel with Arrow Navigation */
          <div className="space-y-6">
            <div
              className={`grid gap-6 ${
                featuredComments.length === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}
            >
              {currentItems.map((c) => {
                const isExpanded = !!expandedIds[c.id];
                const isLong = c.comment.length > 130;

                return (
                  <div
                    key={c.id}
                    className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#76FF03]/40 transition-all hover:shadow-[0_10px_30px_rgba(118,255,3,0.1)] group relative"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Stars + Badge / Modal Action */}
                      <div className="flex items-center justify-between">
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

                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setSelectedCommentForModal(c);
                          }}
                          className="p-1 rounded-md bg-white/5 hover:bg-[#76FF03]/20 text-gray-400 hover:text-[#76FF03] transition-colors cursor-pointer"
                          title={lang === 'es' ? 'Ver en modal' : 'Expand modal'}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Comment Body with expand toggle */}
                      <p
                        className={`text-xs md:text-sm text-gray-300 leading-relaxed italic transition-all duration-300 ${
                          isExpanded ? 'whitespace-pre-line' : 'line-clamp-4'
                        }`}
                      >
                        "{c.comment}"
                      </p>

                      {/* Interactive Arrow Button to see full comment */}
                      {isLong && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClickSound();
                            setExpandedIds((prev) => ({ ...prev, [c.id]: !isExpanded }));
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#76FF03] hover:text-white transition-colors cursor-pointer pt-1"
                        >
                          <span>
                            {isExpanded
                              ? (lang === 'es' ? 'Mostrar menos' : 'Show less')
                              : (lang === 'es' ? 'Ver comentario completo' : 'Read full comment')}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#76FF03]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#76FF03]" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Author Footer */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#76FF03]/10 border border-[#76FF03]/40 flex items-center justify-center text-xs font-bold text-[#76FF03] flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#76FF03] transition-colors truncate">
                            {c.name}
                          </h4>
                          {c.company && (
                            <span className="text-[10px] font-mono text-gray-400 block truncate">
                              {c.company}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-gray-500 flex-shrink-0 ml-2">
                        {new Date(c.createdAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls with Arrows */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCarouselPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#76FF03]/20 border border-white/10 hover:border-[#76FF03]/40 text-gray-300 hover:text-[#76FF03] transition-all cursor-pointer"
                  title={lang === 'es' ? 'Anterior' : 'Previous'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setCarouselPage(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        carouselPage === idx
                          ? 'w-7 bg-[#76FF03] shadow-[0_0_10px_#76FF03]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      title={`${lang === 'es' ? 'Página' : 'Page'} ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCarouselPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#76FF03]/20 border border-white/10 hover:border-[#76FF03]/40 text-gray-300 hover:text-[#76FF03] transition-all cursor-pointer"
                  title={lang === 'es' ? 'Siguiente' : 'Next'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== 1.2 FULL TESTIMONIAL MODAL ==================== */}
      {selectedCommentForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCommentForModal(null)}
        >
          <div
            className="max-w-xl w-full glass-panel p-6 sm:p-8 rounded-3xl border border-[#76FF03]/40 bg-[#061206]/95 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCommentForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={lang === 'es' ? 'Cerrar' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#76FF03]/10 border border-[#76FF03]/40 flex items-center justify-center text-[#76FF03] shadow-[0_0_15px_rgba(118,255,3,0.2)]">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < selectedCommentForModal.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-[#76FF03] uppercase tracking-wider font-bold block mt-0.5">
                  ★ {lang === 'es' ? 'Testimonio Verificado' : 'Verified Review'}
                </span>
              </div>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed italic whitespace-pre-line">
                "{selectedCommentForModal.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#76FF03]/20 border border-[#76FF03] flex items-center justify-center text-sm font-bold text-[#76FF03]">
                  {selectedCommentForModal.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedCommentForModal.name}</h4>
                  {selectedCommentForModal.company && (
                    <span className="text-xs font-mono text-gray-400 block">
                      {selectedCommentForModal.company}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs font-mono text-gray-500">
                {new Date(selectedCommentForModal.createdAt).toLocaleDateString(
                  lang === 'es' ? 'es-ES' : 'en-US',
                  { month: 'long', year: 'numeric' }
                )}
              </span>
            </div>
          </div>
        </div>
      )}

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
        <div className="glass-panel p-6 rounded-lg border border-white/10 space-y-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-[#76FF03] uppercase font-bold">
              {t.contact.directEmail}
            </span>
            <SpecularButton
              onClick={handleCopyEmail}
              variant="glass"
              size="sm"
              radius={6}
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
          <p className="text-xl md:text-2xl font-bold font-mono text-white select-all break-all sm:break-normal">
            aylin.graphicsdesign@gmail.com
          </p>
        </div>

        {/* Live El Salvador Clock (Centered) */}
        <div className="glass-panel p-6 rounded-lg border border-white/10 flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono text-gray-400 block">
              {t.contact.localTime}
            </span>
            <span className="text-2xl font-black font-mono text-white tracking-wider">
              {currentTime || '02:30:00 PM'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-md bg-[#38B000]/20 border border-[#76FF03]/50 flex items-center justify-center text-[#76FF03]">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Start Project Quote Banner (Centered) */}
        <div className="glass-panel p-6 sm:p-8 rounded-lg border border-[#76FF03]/40 bg-gradient-to-br from-[#38B000]/20 to-[#050B05] flex flex-col sm:flex-row justify-between items-center gap-5 text-left shadow-[0_10px_30px_rgba(118,255,3,0.15)]">
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
            radius={8}
            className="text-xs md:text-sm font-black whitespace-nowrap shadow-[0_0_20px_rgba(118,255,3,0.4)]"
          >
            {lang === 'es' ? 'INICIAR PROYECTO' : 'LAUNCH ESTIMATOR'}
          </SpecularButton>
        </div>
      </div>
    </section>
  );
};
