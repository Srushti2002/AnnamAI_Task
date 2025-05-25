import React from 'react';
// src/components/ui/label.tsx
export const Label = ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className="font-medium" {...props}>{children}</label>
);