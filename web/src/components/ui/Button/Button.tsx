import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClass = styles.button;
  const variantClass = styles[variant] || styles.primary;
  
  return (
    <button 
      className={`${baseClass} ${variantClass} hover-scale ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
