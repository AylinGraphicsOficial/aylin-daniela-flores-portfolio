import React from 'react';

interface SocialIconProps {
  preset?: string;
  logoUrl?: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  preset = 'globe',
  logoUrl,
  className = 'w-4 h-4',
}) => {
  // If a custom logo URL is uploaded to Hostinger, render it
  if (logoUrl && logoUrl.trim().length > 0) {
    return (
      <img
        src={logoUrl}
        alt="Social icon"
        loading="lazy"
        className={`${className} object-contain rounded`}
      />
    );
  }

  const key = (preset || '').toLowerCase().trim();

  // SVG Presets for top design & creative platforms
  switch (key) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );

    case 'behance':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M7.85 13.25c.75-.24 1.4-.7 1.84-1.33.45-.63.67-1.4.67-2.31 0-1.04-.32-1.89-.96-2.55C8.75 6.4 7.76 6.07 6.42 6.07H1v11.86h5.88c1.37 0 2.45-.37 3.25-1.12.79-.75 1.19-1.74 1.19-2.97 0-.96-.26-1.73-.78-2.31-.53-.58-1.43-.88-2.69-.88zm-3.8-4.71h2.15c.67 0 1.18.14 1.54.42.36.28.54.7.54 1.26 0 .54-.18.96-.54 1.25-.36.29-.87.43-1.54.43H4.05V8.54zm2.42 6.92H4.05v-2.73h2.42c.73 0 1.29.16 1.68.49.39.32.58.78.58 1.36 0 .57-.2 1.02-.6 1.35-.4.34-.99.53-1.66.53zM21.58 11.23c-.34-1.03-.97-1.83-1.88-2.4-.92-.57-2.02-.85-3.32-.85-1.25 0-2.33.28-3.23.83-.9.56-1.58 1.33-2.03 2.33-.45.99-.68 2.14-.68 3.44 0 1.27.23 2.41.68 3.42.45 1.01 1.12 1.8 2.01 2.36.89.56 1.95.84 3.19.84 1.48 0 2.7-.4 3.65-1.19.95-.8 1.57-1.86 1.85-3.19h-2.92c-.17.58-.49 1.02-.97 1.34-.48.31-1.05.47-1.72.47-.79 0-1.44-.23-1.93-.68-.5-.46-.79-1.12-.87-1.99h8.48c.03-.27.05-.51.05-.73 0-1.04-.23-2.06-.69-3.08zm-5.46.73c.48 0 .89.15 1.22.44.33.29.56.71.69 1.27h-4.04c.12-.55.35-.97.68-1.27.34-.29.79-.44 1.45-.44zM14.69 5.25h5.17v1.44h-5.17V5.25z" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );

    case 'dribbble':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
          <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
          <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
        </svg>
      );

    case 'artstation':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M1.77 16.76l1.96 3.4h.01c.47.78 1.3 1.28 2.24 1.28h11.96l-2.48-4.29H1.77zM22.5 16.73c-.22.42-.56.76-.98.98l-3.32-5.75-4.46-7.72c-.44-.76-1.25-1.24-2.14-1.24-.46 0-.89.13-1.26.35L15.4 12l7.1 4.73zM11.66 8.52L8.24 14.4h6.84l-3.42-5.88z" />
        </svg>
      );

    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      );

    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );

    case 'twitter':
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
      );

    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
};

export default SocialIcon;
