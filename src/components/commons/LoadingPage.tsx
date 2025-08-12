import React from 'react';
import { PacmanLoader } from 'react-spinners';

const LoadingPage: React.FC = () => {
  return (
    <div className='fixed inset-0 bg-white flex flex-col items-center justify-center z-50'>
      <PacmanLoader color='#2563EB' size={40} />
      <p className='text-gray-700 text-2xl mt-8 font-semibold'>서버가 밥 먹는 중...</p>
    </div>
  );
};

export default LoadingPage;
