import { useState, useEffect, useRef } from 'react';
import type { RecordModalProps } from '@/types';
import { ImagePlus, X } from 'lucide-react';

export default function RecordModal({ open, onClose, onSubmit, selectedPlace }: RecordModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const dragStart = () => setIsActive(true);
  const dragEnd = () => setIsActive(false);
  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsActive(false);
    const files = event.dataTransfer.files;
    handleFileUpload(Array.from(files));
  };

  
  const handleFileUpload = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    
    if (uploadedImages.length + imageFiles.length > 5) {
      alert('최대 5개의 이미지만 업로드 가능합니다.');
      return;
    }

    const newImages = [...uploadedImages, ...imageFiles];
    setUploadedImages(newImages);

    
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };


  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(Array.from(files));
    }
  };


  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    setUploadedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

 
  const handleSubmit = () => {
    onSubmit({ title, date, memo, images: uploadedImages });
  };

  useEffect(() => {
    if (open) {
      setTitle(selectedPlace?.name || '');
      setDate('');
      setMemo('');
      setUploadedImages([]);
      setImagePreviewUrls([]);
    }
  }, [open, selectedPlace]);


  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  const unUploadStyle =
    'text-sm font-medium mb-1 h-40 border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors';
  const uploadStyle =
    'text-sm font-medium mb-1 h-40 border-dashed border-2 border-black rounded-lg flex items-center justify-center cursor-pointer';

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h2 className='text-lg font-bold mb-4'>마커 정보 입력</h2>
        <div className='mb-3'>
          <label className='block text-sm font-medium mb-1'>
            제목
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>
        </div>
        <div className='mb-3'>
          <label className='block text-sm font-medium mb-1'>
            날짜
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>
        </div>
        <div className='mb-3'>
          <label className='block text-sm font-medium mb-1'>
            메모
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>
        </div>
        
        {/* 이미지 업로드 영역 */}
        <div className='mb-3'>
          <label className='block text-sm font-medium mb-1'>이미지</label>
          <div
            className={isActive ? uploadStyle : unUploadStyle}
            onDragEnter={dragStart}
            onDragLeave={dragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <div className='flex flex-col items-center gap-2'>
              <ImagePlus className='w-8 h-8 text-gray-400' />
              <span className='text-sm text-gray-500'>이미지를 드래그하거나 클릭하여 업로드</span>
              <span className='text-xs text-gray-400'>(최대 5개, 이미지 파일만)</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>

        {/* 이미지 미리보기 */}
        {imagePreviewUrls.length > 0 && (
          <div className='mb-3'>
            <label className='block text-sm font-medium mb-2'>업로드된 이미지</label>
            <div className='grid grid-cols-3 gap-2'>
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={url}
                    alt={`미리보기 ${index + 1}`}
                    className='w-full h-20 object-cover rounded border'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex justify-end gap-2 mt-4'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300'>
            취소
          </button>
          <button
            type='button'
            onClick={handleSubmit}
            disabled={!title || !date}
            className='px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed'>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
