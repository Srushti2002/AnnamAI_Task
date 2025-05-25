import React from 'react';
//       const formData = new FormData();   
// src/components/ui/progress.tsx
export const Progress = ({ value, max = 100 }: { value: number; max?: number }) => (
    <progress value={value} max={max} className="w-full h-2" />
);