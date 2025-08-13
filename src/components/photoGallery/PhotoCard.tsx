import type { Photo } from '@/types';
import { Calendar, MapPin, Heart, Trash2 } from 'lucide-react';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

export default function PhotoCard({ photo, onClick, onToggleFavorite, onDelete }: PhotoCardProps) {
  return (
    <div
      className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer border border-gray-100'
      onClick={onClick}>
      <div className='relative'>
        <img src={photo.src} alt={photo.title} className='h-64 object-cover' />
        <div className='absolute top-3 right-3 flex gap-2'>
          <button
            className='transition-transform hover:scale-125 cursor-pointer p-2 bg-white/80 rounded-full backdrop-blur-sm'
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}>
            <Heart
              className={`h-5 w-5 ${
                photo.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
              }`}
            />
          </button>
          <button
            className='transition-transform hover:scale-125 cursor-pointer p-2 bg-white/80 rounded-full backdrop-blur-sm text-red-600 hover:bg-red-100'
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className='p-5'>
        <h3 className='text-lg font-bold text-gray-800 truncate mb-2'>{photo.title}</h3>
        <div className='space-y-2 text-sm text-gray-600'>
          <div className='flex items-center gap-2'>
            <Calendar size={14} />
            <span>{photo.date}</span>
          </div>
          <div className='flex items-center gap-2'>
            <MapPin size={14} />
            <span className='truncate'>{photo.location}</span>
          </div>
        </div>
        {photo.tags.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {photo.tags.map((tag) => (
              <span
                key={tag}
                className='px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium'>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
