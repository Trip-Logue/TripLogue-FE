import { useState, useEffect, useRef } from 'react';
import type { TravelRecordData, Photo } from '@/types';
import useTravelStore from '@/hooks/useTravelStore';
import { X, Save, Calendar, Type, Camera, Tag, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: TravelRecordData | null;
}

// 파일을 Base64로 변환하는 헬퍼 함수
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function EditTripModal({ isOpen, onClose, record }: EditTripModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');
  const [newTags, setNewTags] = useState<{ [photoId: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    travelRecords,
    updateRecord,
    addPhotoToRecord,
    removePhotoFromRecord,
    updatePhotoDetails,
  } = useTravelStore();

  const currentRecord = travelRecords.find((r) => r.id === record?.id);
  const photos = currentRecord?.photos || [];

  useEffect(() => {
    if (currentRecord) {
      setTitle(currentRecord.title);
      setDate(currentRecord.date);
      setMemo(currentRecord.memo);
    } else {
      // 모달이 닫힐 때 상태 초기화
      setTitle('');
      setDate('');
      setMemo('');
      setNewTags({});
    }
  }, [currentRecord]);

  const handleSave = () => {
    if (record) {
      updateRecord(record.id, { title, date, memo });
      toast.success('여행 기록이 저장되었습니다.');
      onClose();
    }
  };

  const handleAddPhotos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!record) return;
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        const base64Url = await fileToBase64(file);
        const newPhoto: Photo = {
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          src: base64Url,
          title: record.title, // 기본값으로 레코드 제목 사용
          date: record.date,
          location: record.location,
          tags: [],
          isFavorite: false,
        };
        addPhotoToRecord(record.id, newPhoto);
      }
      toast.success(`${files.length}개의 사진이 추가되었습니다.`);
    } catch (error) {
      toast.error('사진 추가 중 오류가 발생했습니다.');
      console.error('Error adding photos:', error);
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    if (record) {
      removePhotoFromRecord(record.id, photoId);
      toast.info('사진이 삭제되었습니다.');
    }
  };

  const handleAddTag = (photoId: string) => {
    if (record && newTags[photoId]?.trim()) {
      const photo = photos.find((p) => p.id === photoId);
      if (photo && !photo.tags.includes(newTags[photoId].trim())) {
        const updatedTags = [...photo.tags, newTags[photoId].trim()];
        updatePhotoDetails(record.id, photoId, { tags: updatedTags });
        setNewTags({ ...newTags, [photoId]: '' });
      }
    }
  };

  const handleRemoveTag = (photoId: string, tagToRemove: string) => {
    if (record) {
      const photo = photos.find((p) => p.id === photoId);
      if (photo) {
        const updatedTags = photo.tags.filter((tag) => tag !== tagToRemove);
        updatePhotoDetails(record.id, photoId, { tags: updatedTags });
      }
    }
  };

  if (!isOpen || !record) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'
      onClick={onClose}>
      <div
        className='bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between mb-6 sticky top-0 bg-white py-4 z-10'>
          <h2 className='text-2xl font-bold text-gray-900'>여행 기록 수정</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors'>
            <X size={24} />
          </button>
        </div>

        <div className='space-y-6'>
          {/* 기본 정보 수정 */}
          <div className='p-6 border rounded-xl'>
            <div className='relative mb-4'>
              <Type className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='여행 제목'
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              />
            </div>
            <div className='relative'>
              <Calendar
                className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              />
            </div>
            <div className='relative mt-4'>
              <Type className='absolute left-4 top-4 text-gray-400' size={20} />
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder='메모'
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px] resize-none'
              />
            </div>
          </div>

          {/* 사진 관리 */}
          <div className='p-6 border rounded-xl'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <Camera size={20} />
                사진 관리
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2'>
                <Plus size={16} />
                사진 추가
              </button>
              <input
                type='file'
                multiple
                accept='image/*'
                ref={fileInputRef}
                onChange={handleAddPhotos}
                className='hidden'
              />
            </div>

            {photos.length > 0 ? (
              <div className='space-y-6'>
                {photos.map((photo) => (
                  <div key={photo.id} className='flex gap-4 p-4 border rounded-lg'>
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className='w-40 h-40 object-cover rounded-md'
                    />
                    <div className='flex-1'>
                      <div className='flex justify-between items-start'>
                        <h4 className='font-semibold text-gray-700'>태그</h4>
                        <button
                          onClick={() => handleRemovePhoto(photo.id)}
                          className='p-1 text-red-500 hover:bg-red-100 rounded-full'>
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className='flex flex-wrap gap-2 my-2'>
                        {photo.tags.map((tag) => (
                          <span
                            key={tag}
                            className='flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs'>
                            {tag}
                            <button onClick={() => handleRemoveTag(photo.id, tag)}>
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          placeholder='새 태그 추가'
                          value={newTags[photo.id] || ''}
                          onChange={(e) => setNewTags({ ...newTags, [photo.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag(photo.id)}
                          className='flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm'
                        />
                        <button
                          onClick={() => handleAddTag(photo.id)}
                          className='px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700'>
                          추가
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-10 border-2 border-dashed rounded-lg text-gray-500'>
                <p>이 기록에는 사진이 없습니다.</p>
                <p className='text-sm'>'사진 추가' 버튼을 눌러 추가해 보세요.</p>
              </div>
            )}
          </div>
        </div>

        <div className='flex gap-4 justify-end mt-8 sticky bottom-0 bg-white py-4 z-10'>
          <button
            onClick={onClose}
            className='px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium'>
            취소
          </button>
          <button
            onClick={handleSave}
            className='px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2'>
            <Save size={18} />
            변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
}
