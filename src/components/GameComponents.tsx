import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export const GameButton: React.FC<GameButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'px-6 py-3 font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white neon-glow',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  children, 
  className = '',
  glowing = false 
}) => {
  return (
    <div className={`game-card rounded-xl p-6 ${glowing ? 'pulse-glow' : ''} ${className}`}>
      {children}
    </div>
  );
};

interface GameInputProps {
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  as?: 'input' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  rows?: number;
  register?: object;
}

export const GameInput: React.FC<GameInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  as = 'input',
  options = [],
  rows = 3,
  register
}) => {
  const baseClasses = 'w-full px-4 py-3 bg-gray-900 border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-300 text-cyan-100 placeholder-gray-400 transition-colors duration-200';

  const renderInput = () => {
    if (as === 'select') {
      return (
        <select
          {...register}
          value={value}
          onChange={onChange}
          className={baseClasses}
          required={required}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-gray-900">
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (as === 'textarea') {
      return (
        <textarea
          {...register}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
          required={required}
          rows={rows}
        />
      );
    }

    return (
      <input
        {...register}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={baseClasses}
        required={required}
      />
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-cyan-300 font-semibold">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};
