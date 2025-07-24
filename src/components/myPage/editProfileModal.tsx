import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import type { EditProfileModalProps } from '@/types';
import { Trash, ArrowUpToLine } from 'lucide-react';

export default function EditProfileModal({
  onClose,
  onProfileUpdate,
  currentNickname,
  currentProfileImageUrl,
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  useEffect(() => {
    if (currentNickname) {
      setNickname(currentNickname);
    }
    setPreview(currentProfileImageUrl);
    setIsImageRemoved(false);
  }, [currentNickname, currentProfileImageUrl]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsImageRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(currentProfileImageUrl && !isImageRemoved ? currentProfileImageUrl : null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsImageRemoved(true);
    toast.info('프로필 이미지가 제거됩니다.');
  };

  const handleSave = async () => {
    const isNicknameChanged = nickname.trim() !== currentNickname;
    const isImageUpdated = selectedFile !== null || isImageRemoved;

    if (!nickname.trim()) {
      toast.warn('닉네임은 비워둘 수 없습니다.');
      return;
    }
    if (!isNicknameChanged && !isImageUpdated) {
      toast.warn('변경할 내용이 없습니다.');
      return;
    }

    try {
      // const formData = new FormData();

      // if (nickname !== currentNickname) {
      //   formData.append('nickname', nickname.trim());
      // }

      // if (selectedFile) {
      //   formData.append('profileImage', selectedFile);
      // }
      // else if (isImageRemoved) {
      //   formData.append('deleteProfileImage', 'true'); // 서버에 이미지 삭제 요청을 알리는 플래그
      // }

      // const response = await axios.put('/api/users/profile', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // if (response.data.success) {
      //   toast.success('프로필이 성공적으로 업데이트되었습니다!');
      //   if (onProfileUpdate) {
      //     const newImageUrlFromServer = isImageRemoved ? null : (response.data.newProfileImageUrl || preview);
      //     onProfileUpdate(nickname, newImageUrlFromServer);
      //   }
      // } else {
      //   toast.error('프로필 업데이트에 실패했습니다: ' + response.data.message);
      // }

      // 더미 대기 (실제 API 호출 시 제거)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('성공적으로 업데이트되었습니다!');

      // 실제 API 호출 성공 시에는 API 응답에서 받은 URL을 사용
      if (onProfileUpdate) {
        onProfileUpdate(nickname, isImageRemoved ? null : preview);
      }

      onClose();
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      toast.error('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-xl shadow-lg w-96'>
        <h2 className='text-lg font-bold '>프로필 수정</h2>
        <p className='text-sm mb-4'>변경된 항목만 적용됩니다.</p>
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
          <div className='flex gap-3'>
            <label className='text-sm text-blue-600 cursor-pointer hover:underline flex items-center gap-1'>
              <ArrowUpToLine className='w-4 h-4' />
              이미지 업로드
              <input
                type='file'
                accept='image/*'
                className='hidden cursor-pointer'
                onChange={handleImageChange}
              />
            </label>
            {(currentProfileImageUrl || selectedFile) && !isImageRemoved && (
              <button
                type='button'
                onClick={handleRemoveImage}
                className='text-sm text-red-600 cursor-pointer hover:underline flex items-center gap-1'>
                <Trash className='w-4 h-4' /> 제거
              </button>
            )}
          </div>
        </div>

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

        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='cursor-pointer px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300'>
            취소
          </button>
          <button
            onClick={handleSave}
            className='cursor-pointer px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600'>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
