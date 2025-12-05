import React from 'react';

interface StageProps {
  content: string;
  loading: boolean;
}

export const Stage: React.FC<StageProps> = ({ content, loading }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto min-h-[300px] md:min-h-[400px] p-8 md:p-12 flex flex-col items-center justify-center text-center">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-black z-0"></div>
      
      {/* Spotlight Effect */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120%] h-full bg-blue-900/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* Mic Stand Visual (SVG) */}
      <div className={`transition-all duration-700 absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20 z-0 ${loading ? 'scale-110' : 'scale-100'}`}>
        <svg width="200" height="400" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="48" y="0" width="4" height="200" fill="#333" />
          <circle cx="50" cy="10" r="15" fill="#222" stroke="#444" strokeWidth="2" />
          <path d="M40 100 L60 100 L50 200" fill="#222" />
        </svg>
      </div>

      <div className="relative z-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <div className="text-2xl md:text-4xl font-display text-red-600 tracking-widest neon-text">
              WRITING SET...
            </div>
            <p className="text-slate-500 font-mono text-sm">Reviewing notes...</p>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in duration-500">
            {content ? (
              <p className="text-xl md:text-3xl font-bold leading-relaxed whitespace-pre-line text-white drop-shadow-lg">
                "{content}"
              </p>
            ) : (
              <p className="text-slate-500 italic text-lg">
                Step up to the mic. Select a mode and hit generate.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};