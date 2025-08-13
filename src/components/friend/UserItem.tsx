import React from 'react';

interface UserItemProps {
  name: string;
  profileImage?: string;
  children?: React.ReactNode;
}

const UserItem: React.FC<UserItemProps> = ({ name, profileImage, children }) => (
  <div className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors'>
    <div className='flex items-center gap-4'>
      <img
        src={profileImage || `https://ui-avatars.com/api/?name=${name}&background=random`}
        alt={name}
        className='w-12 h-12 rounded-full object-cover'
      />
      <span className='font-semibold text-gray-800 text-base'>{name}</span>
    </div>
    <div className='flex gap-4'>{children}</div>
  </div>
);

export default UserItem;