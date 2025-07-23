// src/components/commons/tripCard.tsx
import type { TripCardProps } from '@/types';

export default function TripCard({
  title,
  date = '날짜 미정',
  description = '간단한 여행 설명이 들어갑니다.',
}: TripCardProps) {
  return (
    <div className='flex-none w-64 bg-white rounded-xl shadow p-4 hover:shadow-md transition cursor-pointer h-48 flex justify-between'>
      <div>
        <h4 className='text-lg font-semibold text-gray-800 truncate'>{title}</h4>
        <p className='text-sm text-gray-500'>{date}</p>
        <p className='text-sm text-gray-600 mt-2 line-clamp-3'>{description}</p>{' '}
      </div>
    </div>
  );
}
