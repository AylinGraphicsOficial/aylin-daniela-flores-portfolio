import React, { useRef } from 'react';
import './SpecularButton.css';

export interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  variant?: 'primary' | 'solid-lime' | 'glass' | 'custom';
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export const SpecularButton: React.FC<SpecularButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  radius = 12,
  tint = '#76FF03',
  textColor,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style = {},
  ...restProps
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
  };

  const variantClass = variant !== 'custom' ? `specular-button--${variant}` : '';

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`specular-button specular-button--${size} ${variantClass} ${className}`.trim()}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-tint': tint,
        ...(textColor ? { '--sb-text-color': textColor } : {}),
        ...style,
      } as React.CSSProperties}
      {...restProps}
    >
      <span className="specular-button__label">{children}</span>
    </button>
  );
};

export default SpecularButton;
