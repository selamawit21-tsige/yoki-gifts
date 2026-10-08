import React from 'react';
import { ArtMotif } from '../types';

interface ArtMotifGraphicProps {
  motif: ArtMotif;
  className?: string;
}

export const ArtMotifGraphic: React.FC<ArtMotifGraphicProps> = ({
  motif,
  className = "w-8 h-8 text-[#A87B4F]"
}) => {
  if (motif === 'NONE') return null;

  if (motif === 'BOTANICAL_SPRIG') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 52 C24 40 38 28 52 12" />
        <path d="M22 42 C18 36 20 28 26 26 C28 32 26 38 22 42 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M34 30 C30 24 32 16 38 14 C40 20 38 26 34 30 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M30 46 C36 44 42 46 44 40 C38 38 32 40 30 46 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M42 34 C48 32 54 34 56 28 C50 26 44 28 42 34 Z" fill="currentColor" fillOpacity="0.1" />
      </svg>
    );
  }

  if (motif === 'COFFEE_BRANCH') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M10 32 Q32 20 54 32" />
        <circle cx="24" cy="24" r="4" fill="currentColor" fillOpacity="0.2" />
        <circle cx="32" cy="20" r="4" fill="currentColor" fillOpacity="0.2" />
        <circle cx="40" cy="24" r="4" fill="currentColor" fillOpacity="0.2" />
        <path d="M20 28 C16 34 18 42 24 44 C26 38 24 32 20 28 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M44 28 C48 34 46 42 40 44 C38 38 40 32 44 28 Z" fill="currentColor" fillOpacity="0.1" />
      </svg>
    );
  }

  if (motif === 'HERITAGE_CREST') {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M32 8 L48 16 V32 C48 44 32 54 32 54 C32 54 16 44 16 32 V16 Z" />
        <path d="M32 16 V46" strokeDasharray="2 2" />
        <path d="M22 28 H42" />
        <circle cx="32" cy="28" r="3" fill="currentColor" />
      </svg>
    );
  }

  return null;
};
