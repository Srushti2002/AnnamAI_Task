import React from 'react';
// src/components/ui/input.tsx
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => <input ref={ref} {...props} className="border rounded px-3 py-2 w-full" />
);
Input.displayName = "Input";