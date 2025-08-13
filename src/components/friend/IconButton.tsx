import React from 'react';

interface IconButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ElementType;
  variant: 'accept' | 'reject' | 'delete';
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon: Icon, variant }) => {
  const baseClasses = 'p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    accept: 'text-green-600 hover:bg-green-100 focus:ring-green-500',
    reject: 'text-red-600 hover:bg-red-100 focus:ring-red-500',
    delete: 'text-gray-500 hover:bg-gray-100 focus:ring-gray-500',
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      <Icon size={20} />
    </button>
  );
};

export default IconButton;