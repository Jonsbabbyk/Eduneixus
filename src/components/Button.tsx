// src/components/Button.tsx

import React, { forwardRef } from 'react';

// 1. Extend the size prop type to include 'icon'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'danger'; // Added 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        className = '',
        children,
        ...props
    }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
            secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
            ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
            white: 'bg-white hover:bg-gray-50 text-gray-900 shadow-sm border border-gray-300 focus:ring-blue-500',
            danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500', // Added 'danger' variant
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
            icon: 'h-10 w-10 p-2.5',
        };

        const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

        return (
            <button
                ref={ref} // 2. Pass the forwarded ref to the native button element
                className={classes}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button'; // 3. Set a display name for better debugging

export default Button;