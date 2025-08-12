import React from 'react';
import UserItem from './UserItem';
import type { SearchUser, Friend } from '@/types';

interface UserListProps {
  users: (SearchUser | Friend)[];
  onAction: (id: number) => void;
  actionIcon: React.ElementType;
  actionText: string;
  isLoading?: boolean;
  listType: 'search' | 'friends' | 'requests';
}

const UserList: React.FC<UserListProps> = ({ users, onAction, actionIcon: ActionIcon, actionText, isLoading, listType }) => {
  if (isLoading) return <p className='text-center text-gray-500 mt-6'>검색 중...</p>;
  if (users.length === 0 && listType === 'search') return <p className='text-center text-gray-500 mt-6'>검색 결과가 없습니다.</p>;
  if (users.length === 0) return null;

  return (
    <div className='mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-4'>
      {users.map((user) => {
        const id = 'user_id' in user ? user.user_id : user.friend_id;
        const name = 'name' in user ? user.name : user.friend_name;
        const profileImage = 'profile_image' in user ? user.profile_image : undefined;

        return (
          <UserItem key={id} name={name} profileImage={profileImage}>
            <button
              onClick={() => onAction(id)}
              className='flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm'
            >
              <ActionIcon size={16} />
              {actionText}
            </button>
          </UserItem>
        );
      })}
    </div>
  );
};

export default UserList;
