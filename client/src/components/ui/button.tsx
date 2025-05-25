import React from 'react';
// src/components/ui/button.tsx
export const Button = ({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className={`bg-blue-600 text-white px-4 py-2 rounded ${className}`} {...props} />
);
