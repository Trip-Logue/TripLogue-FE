// src/components/commons/tripCard.tsx
import { MapPin, Calendar, Camera, Trash2 } from 'lucide-react';

interface TripCardProps {
  title: string;
  date: string;
  location: string;
  country: string;
  photoCount: number;
  onDelete: () => void;
}

export default function TripCard({
  title,
  date,
  location,
  country,
  photoCount,
  onDelete,
}: TripCardProps) {
  return (
    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200'>
      <div className='flex items-start justify-between mb-4'>
        <h3 className='text-lg font-bold text-gray-900 line-clamp-2'>{title}</h3>
        <button
          onClick={onDelete}
          className='p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors ml-2'>
          <Trash2 size={16} />
        </button>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Calendar size={14} />
          <span>{date}</span>
        </div>

        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <MapPin size={14} />
          <span className='line-clamp-1'>
            {location}, {country}
          </span>
        </div>

        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Camera size={14} />
          <span>{photoCount}장의 사진</span>
        </div>
      </div>
    </div>
  );
}
