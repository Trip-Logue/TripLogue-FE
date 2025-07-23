import type { UserProfileSectionProps } from '@/types';
import { Pencil, User } from 'lucide-react';

export default function UserProfileSection({
  openEditProfile,
  profileImageUrl,
  userName,
}: UserProfileSectionProps) {
  const defaultProfileStyle =
    'w-20 h-20 rounded-full shadow-md bg-gray-200 flex items-center justify-center';

  return (
    <section className='flex items-center gap-4'>
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt='Profile'
          className='w-20 h-20 rounded-full shadow-md object-cover'
          onError={(e) => {
            console.error('프로필 이미지 로드 실패:', e.currentTarget.src);
          }}
        />
      ) : (
        <div className={defaultProfileStyle}>
          <User className='w-10 h-10 text-gray-500' />
        </div>
      )}

      <div>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-bold'>{userName} 님</h2>
          <div
            onClick={openEditProfile}
            className='inline-flex items-center justify-center w-10 h-10 rounded-full hover:shadow-md transition-shadow duration-200 overflow-visible bg-white cursor-pointer'>
            <Pencil className='w-5 h-5 text-gray-700' />
          </div>
        </div>
        <p className='text-sm text-gray-500'>sion@example.com</p>
      </div>
    </section>
  );
}
