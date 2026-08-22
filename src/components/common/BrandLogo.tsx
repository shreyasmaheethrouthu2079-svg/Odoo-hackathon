import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  rounded?: string;
  showBorder?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-10 h-10',
  rounded = 'rounded-xl',
  showBorder = true,
}) => {
  return (
    <div
      className={`relative overflow-hidden inline-flex items-center justify-center shrink-0 ${rounded} ${
        showBorder ? 'ring-1 ring-black/10 shadow-xs' : ''
      } ${className}`}
      style={{ backgroundColor: '#459ee5' }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
      >
        {/* Sky Blue Painted Canvas Background */}
        <rect width="200" height="200" fill="#459ee5" />
        <rect width="200" height="200" fill="url(#sky-texture)" opacity="0.4" />

        {/* Back Ridges / Spines */}
        <g stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" fill="#58a82d">
          <path d="M 45 92 C 34 94 35 106 46 109" />
          <path d="M 44 114 C 33 116 34 128 45 131" />
          <path d="M 42 136 C 30 139 31 151 43 154" />
          <path d="M 41 159 C 28 162 29 174 42 177" />
          <path d="M 40 182 C 26 185 27 197 41 200" />
        </g>

        {/* Crocodile Body Outline and Green Base */}
        <path
          d="M 46 76
             L 46 200
             L 142 200
             L 140 128
             C 152 126 166 120 174 110
             C 180 102 181 94 176 86
             C 170 76 154 72 132 76
             C 120 78 108 72 98 70
             L 46 76 Z"
          fill="#78bc38"
          stroke="#18181b"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Painted Texture overlay on green skin */}
        <path
          d="M 50 82 Q 75 110 70 145 Q 85 110 115 95 Q 140 90 165 98 C 172 90 160 80 135 80 Z"
          fill="#9dd84e"
          opacity="0.6"
        />
        <circle cx="88" cy="115" r="22" fill="#cbe86b" opacity="0.35" />
        <circle cx="120" cy="100" r="18" fill="#cbe86b" opacity="0.35" />

        {/* Yellow Chest / Throat Area */}
        <path
          d="M 68 135
             L 68 200
             L 136 200
             L 136 135
             C 120 145 84 145 68 135 Z"
          fill="#f6de72"
          stroke="#18181b"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Soft warmth on belly */}
        <ellipse cx="102" cy="175" rx="24" ry="18" fill="#f5b878" opacity="0.3" />

        {/* Nostrils */}
        <path
          d="M 160 103 C 158 107 160 111 163 110 C 165 109 165 105 163 103"
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 169 105 C 168 109 170 112 172 111 C 174 110 174 107 172 105"
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mouth Cavity & Zigzag Sharp Teeth */}
        <path
          d="M 75 128
             L 173 113
             C 172 125 165 134 150 136
             L 75 128 Z"
          fill="#18181b"
        />
        {/* Upper & Lower Sharp White Teeth */}
        <path
          d="M 76 128
             L 82 142 L 89 128
             L 96 142 L 103 128
             L 110 142 L 117 127
             L 124 141 L 131 126
             L 138 138 L 145 124
             L 152 135 L 158 121
             L 165 131 L 171 114"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Mouth line */}
        <path
          d="M 74 128 L 173 113"
          stroke="#18181b"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Left Big Googly Eye */}
        <circle
          cx="78"
          cy="60"
          r="24"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="5.5"
        />
        {/* Left Eye Pupil */}
        <circle cx="79" cy="62" r="7.5" fill="#18181b" />
        <circle cx="77" cy="59" r="2.5" fill="#ffffff" />

        {/* Eyeglasses Bridge / Connection */}
        <line
          x1="98"
          y1="67"
          x2="108"
          y2="67"
          stroke="#18181b"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Right Big Googly Eye */}
        <circle
          cx="128"
          cy="60"
          r="23"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="5.5"
        />
        {/* Right Eye Pupil */}
        <circle cx="127" cy="59" r="7.5" fill="#18181b" />
        <circle cx="125" cy="56" r="2.5" fill="#ffffff" />

        {/* Subtle decorative brush shader */}
        <defs>
          <radialGradient id="sky-texture" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
