import React from 'react';

export const FieldError: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null;
  return <p className="text-danger text-xs mt-1.5 font-medium">{error}</p>;
};