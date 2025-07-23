import type { UserProfileSectionProps } from '@/types';
import { Pencil } from 'lucide-react';

export default function UserProfileSection({ openEditProfile }: UserProfileSectionProps) {
  return (
    <section className='flex items-center gap-4'>
      <img src='/profile.png' alt='Profile' className='w-20 h-20 rounded-full shadow-md' />
      <div>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-bold'>김시온 님</h2>
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
