// src/components/common/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string; // Added className prop
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className // Include className prop
}: ButtonProps) {
  // Base styles shared by all buttons
  const baseStyles = "rounded-full py-3 px-6 font-medium transition-all";

  // Variant-specific styles
  const variantStyles = {
    primary: `bg-orange-600 text-white hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-gray-100 text-gray-800 hover:bg-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    outline: `border-2 border-orange-600 text-orange-600 hover:bg-orange-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className || ''} // Include external className
      `}
    >
      {children}
    </button>
  );
}
