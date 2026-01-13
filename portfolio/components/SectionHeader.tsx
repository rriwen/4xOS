import React from 'react';

export const SectionHeader: React.FC<{ title: string; number: string }> = ({ title, number }) => {
  return (
    <div className="flex items-center gap-4 mb-12 border-b-2 border-black pb-4">
      <span className="font-mono text-xl font-bold bg-black text-white px-3 py-1">{number}</span>
      <h2 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-tight">{title}</h2>
    </div>
  );
};
