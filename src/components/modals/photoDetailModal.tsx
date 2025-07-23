import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import type { PhotoDetailModalProps } from '@/types';
import { toast } from 'react-toastify';

export default function PhotoDetailModal({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  toggleFavorite,
  onDelete,
}: PhotoDetailModalProps) {
  const handleFavorite = () => {
    toggleFavorite(photo.id);
    toast.success(photo.isFavorite ? '즐겨찾기에서 해제되었습니다.' : '즐겨찾기에 추가되었습니다.');
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 사진을 삭제하시겠습니까?')) {
      onDelete(photo.id);
      toast.success('사진이 삭제되었습니다.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'
      onClick={onClose}>
      <div
        className='bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative'
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-700 hover:text-gray-900'>
          <X size={24} />
        </button>

        <img
          src={photo.src}
          alt={photo.alt}
          className='w-full h-auto max-h-[60vh] object-contain rounded-t-lg'
        />

        <div className='p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>{photo.title}</h2>
          <p className='text-gray-700 mb-1'>
            <span className='font-semibold'>날짜:</span> {photo.date}
          </p>
          <p className='text-gray-700 mb-1'>
            <span className='font-semibold'>장소:</span> {photo.location}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-semibold'>태그:</span> {photo.tags.join(', ')}
          </p>
          {photo.description && <p className='text-gray-800 mb-4'>{photo.description}</p>}

          <div className='flex gap-3 mt-4'>
            <button
              onClick={handleFavorite}
              className={`px-4 py-2 flex items-center gap-2 rounded-md transition-colors ${
                photo.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-800'
              }`}>
              <Heart
                size={18}
                className={photo.isFavorite ? 'fill-current text-white' : 'text-gray-700'}
              />
              {photo.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            </button>

            <button
              onClick={handleDelete}
              className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'>
              삭제
            </button>

            <a
              href={photo.src}
              download
              className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'>
              다운로드
            </a>
          </div>
        </div>

        {hasPrev && (
          <button
            onClick={onPrev}
            className='absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100'>
            <ChevronLeft />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className='absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100'>
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
