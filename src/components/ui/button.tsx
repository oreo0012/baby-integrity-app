import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-pink-400 to-red-400 text-white hover:from-pink-500 hover:to-red-500 shadow-md': variant === 'default',
            'border-2 border-pink-300 text-pink-600 hover:bg-pink-50': variant === 'outline',
            'hover:bg-pink-50 text-pink-600': variant === 'ghost',
            'h-10 px-4 py-2 text-sm': size === 'default',
            'h-9 px-3 text-xs': size === 'sm',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
