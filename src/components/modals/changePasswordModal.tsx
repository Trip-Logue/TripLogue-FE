import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    // 현재 비밀번호 확인 (실제 백엔드 연동 필요) 여기서는 예시를 위해 'correct_password'를 올바른 현재 비밀번호로 가정
    if (currentPassword !== 'correct_password') {
      // 'correct_password'를 실제 유효성 검사 로직으로 대체해야 함
      toast.error('현재 비밀번호가 올바르지 않습니다.');
      return;
    }

    console.log('비밀번호 변경 시도:', { currentPassword, newPassword });
    toast.success('성공적으로 변경되었습니다.');
    onClose();
    navigate('/login');
  };

  return (
    <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-xl shadow-lg w-96 relative'>
        <h2 className='text-lg font-bold mb-4'>비밀번호 변경</h2>
        <form onSubmit={handleChangePassword} className='flex flex-col gap-4'>
          <input
            type='password'
            placeholder='현재 비밀번호'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <input
            type='password'
            placeholder='새 비밀번호'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <input
            type='password'
            placeholder='새 비밀번호 확인'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md'>
              취소
            </button>
            <button
              type='submit'
              onClick={handleChangePassword}
              className='cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
              변경
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
