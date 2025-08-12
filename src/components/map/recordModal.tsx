import { useState, useEffect } from 'react';
import type { RecordModalProps, TravelRecordData, Photo } from '@/types';
import { ImagePlus, X, MapPin, Calendar, FileText, Camera, Tag, Plus } from 'lucide-react';
import useAuthStore from '@/hooks/useAuthStore';
import useTravelStore from '@/hooks/useTravelStore';
import { toast } from 'react-toastify';

export default function RecordModal({
  open,
  onClose,
  selectedPlace,
}: Omit<RecordModalProps, 'onSubmit'>) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [country, setCountry] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const { user } = useAuthStore();
  const { addRecord } = useTravelStore();

  // 드래그 앤 드랍 관리하는 코드
  const dragStart = () => setIsActive(true);
  const dragEnd = () => setIsActive(false);

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      const newImages = [...images, ...imageFiles];
      setImages(newImages);

      // 이미지 URL 생성
      const newUrls = imageFiles.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newUrls]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      const newImages = [...images, ...imageFiles];
      setImages(newImages);

      // 이미지 URL 생성
      const newUrls = imageFiles.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!title || !date || !selectedPlace) {
      toast.error('제목, 날짜, 장소를 모두 입력해주세요.');
      return;
    }

    // 사진 데이터 생성
    const photos: Photo[] = images.map((file, index) => ({
      id: `photo_${Date.now()}_${index}`,
      src: imageUrls[index],
      title: title,
      date: date,
      location: selectedPlace.name,
      tags: tags, // 모든 사진에 동일한 태그 적용
      isFavorite: false,
      description: memo,
    }));

    // 여행 기록 데이터 생성
    const travelRecord: Omit<TravelRecordData, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.id,
      title,
      date,
      location: selectedPlace.name,
      latitude: selectedPlace.location.lat(),
      longitude: selectedPlace.location.lng(),
      country: country || 'Unknown',
      memo,
      photos,
    };

    try {
      // 여행 기록 추가
      addRecord(travelRecord);

      toast.success('여행 기록이 저장되었습니다!');

      // 모달 닫기
      onClose();

      // 폼 초기화
      setTitle('');
      setDate('');
      setMemo('');
      setImages([]);
      setImageUrls([]);
      setCountry('');
      setTags([]);
    } catch (error) {
      toast.error('여행 기록 저장 중 오류가 발생했습니다.');
      console.error('Error saving travel record:', error);
    }
  };

  useEffect(() => {
    if (open && selectedPlace) {
      setTitle(selectedPlace.name);
      setDate(new Date().toISOString().split('T')[0]);
      setMemo('');
      setImages([]);
      setImageUrls([]);
      setCountry('');
      setTags([]);
    }
  }, [open, selectedPlace]);

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 min-w-[400px] w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>여행 기록 추가</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <X size={24} />
          </button>
        </div>

        <div className='space-y-6'>
          {/* 제목 */}
          <div>
            <label className='flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2'>
              <MapPin size={16} />
              제목
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
              placeholder='여행 제목을 입력하세요'
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
              <Calendar size={16} />
              날짜
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
            />
          </div>

          {/* 국가 */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>국가</label>
            <input
              type='text'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className='w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
              placeholder='방문한 국가를 입력하세요'
            />
          </div>

          {/* 태그 */}
          <div>
            <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
              <Tag size={16} />
              태그
            </label>
            <div className='flex gap-2 mb-3'>
              <input
                type='text'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className='flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                placeholder='태그를 입력하고 Enter를 누르세요'
              />
              <button
                type='button'
                onClick={addTag}
                className='px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors'>
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm'>
                    #{tag}
                    <button
                      type='button'
                      onClick={() => removeTag(tag)}
                      className='hover:text-blue-900'>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 메모 */}
          <div>
            <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
              <FileText size={16} />
              메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className='w-full border border-gray-300 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none'
              placeholder='여행에 대한 메모를 작성해주세요'
            />
          </div>

          {/* 사진 업로드 */}
          <div>
            <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
              <Camera size={16} />
              사진 업로드
            </label>

            {/* 이미지 미리보기 */}
            {imageUrls.length > 0 && (
              <div className='grid grid-cols-3 gap-3 mb-4'>
                {imageUrls.map((url, index) => (
                  <div key={index} className='relative group'>
                    <img
                      src={url}
                      alt={`이미지 ${index + 1}`}
                      className='w-full h-24 object-cover rounded-lg'
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 드래그 앤 드롭 영역 */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={dragStart}
              onDragLeave={dragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}>
              <div className='flex flex-col items-center gap-3'>
                <ImagePlus className='w-12 h-12 text-gray-400' />
                <div>
                  <p className='text-lg font-medium text-gray-700 mb-1'>
                    사진을 드래그하거나 클릭하여 업로드
                  </p>
                  <p className='text-sm text-gray-500'>JPG, PNG, GIF 파일을 지원합니다</p>
                </div>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleFileSelect}
                  className='hidden'
                  id='image-upload'
                />
                <label
                  htmlFor='image-upload'
                  className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors'>
                  사진 선택
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className='flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={onClose}
            className='px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors'>
            취소
          </button>
          <button
            type='button'
            onClick={handleSubmit}
            disabled={!title || !date}
            className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium'>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
