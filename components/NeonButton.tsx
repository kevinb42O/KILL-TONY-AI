import React from 'react';

interface NeonButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  color?: 'red' | 'blue' | 'green';
  disabled?: boolean;
  className?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  onClick, 
  children, 
  active = false, 
  color = 'red',
  disabled = false,
  className = ''
}) => {
  const baseStyles = "relative px-6 py-3 font-bold uppercase transition-all duration-300 transform border-2 tracking-wider";
  
  const colors = {
    red: {
      border: active ? "border-red-500" : "border-red-900",
      text: active ? "text-red-500" : "text-red-800",
      shadow: active ? "shadow-[0_0_20px_rgba(239,68,68,0.5)] bg-red-500/10" : "hover:border-red-700 hover:text-red-700 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    },
    blue: {
      border: active ? "border-blue-400" : "border-blue-900",
      text: active ? "text-blue-400" : "text-blue-800",
      shadow: active ? "shadow-[0_0_20px_rgba(96,165,250,0.5)] bg-blue-500/10" : "hover:border-blue-700 hover:text-blue-700 hover:shadow-[0_0_10px_rgba(96,165,250,0.3)]",
    },
    green: {
      border: active ? "border-green-400" : "border-green-900",
      text: active ? "text-green-400" : "text-green-800",
      shadow: active ? "shadow-[0_0_20px_rgba(74,222,128,0.5)] bg-green-500/10" : "hover:border-green-700 hover:text-green-700 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)]",
    }
  };

  const current = colors[color];

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${current.border} ${current.text} ${current.shadow} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'} ${className}`}
    >
      {children}
    </button>
  );
};