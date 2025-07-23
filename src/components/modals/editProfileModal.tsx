import { useState } from 'react';
import type { ChangeEvent } from 'react';

type Props = {
  onClose: () => void;
};

export default function EditProfileModal({ onClose }: Props) {
  const [nickname, setNickname] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  // 이미지 파일 핸들링
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-xl shadow-lg w-96'>
        <h2 className='text-lg font-bold '>프로필 수정</h2>
        <p className='text-sm mb-4'>변경된 항목만 적용됩니다.</p>

        {/* 이미지 미리보기 */}
        <div className='flex flex-col items-center gap-2 mb-4'>
          <div className='w-24 h-24 rounded-full overflow-hidden border'>
            {preview ? (
              <img src={preview} alt='프로필 미리보기' className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-400'>
                No Image
              </div>
            )}
          </div>
          <label className='text-sm text-blue-600 cursor-pointer hover:underline'>
            이미지 업로드
            <input
              type='file'
              accept='image/*'
              className='hidden cursor-pointer'
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* 닉네임 */}
        <div className='mb-4'>
          <label className='block mb-1 text-sm text-gray-600'>닉네임</label>
          <input
            type='text'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className='w-full px-3 py-2 border rounded-md text-sm'
            placeholder='닉네임 입력'
          />
        </div>

        {/* 버튼 */}
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='cursor-pointer px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300'>
            취소
          </button>
          <button
            onClick={() => {
              // 저장 로직 넣기
              onClose();
            }}
            className='cursor-pointer px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600'>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
