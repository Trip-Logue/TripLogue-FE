import React from 'react';

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-4 min-h-[120px]'>
    {children}
  </div>
);

export default Card;
