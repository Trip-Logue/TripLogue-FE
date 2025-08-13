import { useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Download,
  Trash2,
  MapPin,
  Calendar,
  Tag,
  MessageCircle,
} from 'lucide-react';
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
      className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4'
      onClick={onClose}>
      <div
        className='bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative'
        onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className='sticky top-0 z-10 bg-white border-b border-gray-200 p-6 rounded-t-3xl'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-900'>{photo.title}</h2>
            <button
              onClick={onClose}
              className='p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-all duration-200'>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 이미지 */}
        <div className='relative'>
          <img
            src={photo.src}
            className='w-full h-auto max-h-[50vh] object-cover'
            alt={photo.title}
          />

          {/* 이미지 오버레이 정보 */}
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6'>
            <div className='flex items-center gap-4 text-white'>
              <div className='flex items-center gap-2'>
                <MapPin size={18} className='text-blue-300' />
                <span className='font-medium'>{photo.location}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar size={18} className='text-green-300' />
                <span className='font-medium'>{photo.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className='p-8'>
          {/* 태그 */}
          {photo.tags.length > 0 && (
            <div className='mb-6'>
              <div className='flex items-center gap-2 mb-3'>
                <Tag size={18} className='text-purple-600' />
                <span className='font-semibold text-gray-700'>태그</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {photo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 설명 */}
          {photo.description && (
            <div className='mb-8'>
              <div className='flex items-center gap-2 mb-3'>
                <MessageCircle size={18} className='text-blue-600' />
                <span className='font-semibold text-gray-700'>설명</span>
              </div>
              <p className='text-gray-800 leading-relaxed text-lg'>{photo.description}</p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className='flex flex-wrap gap-4'>
            <button
              onClick={handleFavorite}
              className={`px-6 py-3 flex items-center gap-3 rounded-xl font-medium transition-all duration-200 ${
                photo.isFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              <Heart size={20} className={photo.isFavorite ? 'fill-current' : ''} />
              {photo.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            </button>

            <button
              onClick={handleDelete}
              className='px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium flex items-center gap-3 shadow-lg'>
              <Trash2 size={20} />
              삭제
            </button>

            <a
              href={photo.src}
              download
              className='px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-medium flex items-center gap-3 shadow-lg'>
              <Download size={20} />
              다운로드
            </a>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className='absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl hover:bg-white transition-all duration-200 group'>
            <ChevronLeft size={24} className='text-gray-700 group-hover:text-gray-900' />
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNext}
            className='absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl hover:bg-white transition-all duration-200 group'>
            <ChevronRight size={24} className='text-gray-700 group-hover:text-gray-900' />
          </button>
        )}

        {/* 키보드 단축키 안내 */}
        <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4 text-center'>
          <div className='bg-gray-100 inline-flex items-center gap-4 px-4 py-2 rounded-full text-sm text-gray-600'>
            <span>ESC: 닫기</span>
            {hasPrev && hasNext && <span>•</span>}
            {hasPrev && <span>←: 이전</span>}
            {hasPrev && hasNext && <span>•</span>}
            {hasNext && <span>→: 다음</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
