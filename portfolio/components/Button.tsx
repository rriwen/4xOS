import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "px-6 py-3 font-mono font-bold text-sm uppercase transition-all duration-200 border-2 border-black focus:outline-none";
  
  const variants = {
    primary: "bg-black text-white hover:bg-white hover:text-black shadow-retro hover:shadow-none hover:translate-x-1 hover:translate-y-1",
    secondary: "bg-transparent text-black hover:bg-black hover:text-white shadow-retro hover:shadow-none hover:translate-x-1 hover:translate-y-1"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
