import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  glow = true,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'border-indigo-400/30 hover:border-indigo-400/60 glow-primary',
    secondary: 'border-purple-400/30 hover:border-purple-400/60 glow-secondary',
    accent: 'border-pink-400/30 hover:border-pink-400/60 glow-accent',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        'glass rounded-xl font-semibold text-gray-200 border transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        glow && 'glow-hover',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}