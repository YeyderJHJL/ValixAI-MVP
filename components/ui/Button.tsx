import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'default' | 'lg';
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'default',
  loading = false,
  disabled,
  className = '',
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-brand-100 active:scale-95";
  
  const variants = {
    primary: 'bg-brand-400 text-white hover:bg-brand-500 shadow-lg shadow-brand-100',
    secondary: 'bg-white text-accent-500 border-2 border-accent-100 hover:bg-accent-50 shadow-sm',
    ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-100',
  };
  
  const sizes = {
    default: 'text-lg px-8 py-4 min-h-[56px]',
    lg: 'text-xl px-12 py-5 min-h-[72px] rounded-2xl',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
          Cargando...
        </span>
      ) : children}
    </button>
  );
}
