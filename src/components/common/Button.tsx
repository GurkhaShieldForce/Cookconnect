interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
  }
  
  export function Button({ 
    children, 
    variant = 'primary', 
    fullWidth = false,
    onClick,
    type = 'button'
  }: ButtonProps) {
    const baseStyles = "rounded-full py-3 px-6 font-medium transition-all";
    const variantStyles = {
      primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg",
      secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${fullWidth ? 'w-full' : ''}
        `}
      >
        {children}
      </button>
    );
  }
  
  