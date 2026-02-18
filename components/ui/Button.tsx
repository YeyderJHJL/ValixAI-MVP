import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
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
  
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-300";
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200 active:transform active:scale-95',
    secondary: 'bg-white text-brand-900 border-2 border-brand-100 hover:bg-brand-50 shadow-sm',
    ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
  };
  
  const sizes = {
    default: 'text-xl px-10 py-5 min-h-[64px]',
    lg: 'text-2xl px-14 py-6 min-h-[84px] rounded-2xl',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
          Cargando...
        </span>
      ) : children}
    </button>
  );
}
