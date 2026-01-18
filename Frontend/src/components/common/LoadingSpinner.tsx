import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    className?: string;
    fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'currentColor',
    className = '',
    fullPage = false
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4'
    };

    const spinner = (
        <div className={`relative flex items-center justify-center ${className}`}>
            <div className={`${sizeClasses[size]} border-gray-200 rounded-full animate-spin`} style={{ borderTopColor: color }}></div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
                <div className="text-center">
                    {spinner}
                    <p className="mt-4 text-gray-600 font-medium animate-pulse font-serif italic">Loading OffWeGo...</p>
                </div>
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
