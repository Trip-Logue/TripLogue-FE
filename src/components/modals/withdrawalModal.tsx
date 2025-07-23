import type { WithdrawalModalProps } from '@/types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRoute } from '@/hooks/useRoute';

export default function WithdrawalModal({ onClose }: WithdrawalModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [agreeToWithdraw, setAgreeToWithdraw] = useState(false);

  const { routeToLogin } = useRoute();
  const handleWithdrawal = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!currentPassword) {
      toast.error('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!agreeToWithdraw) {
      toast.error('회원 탈퇴 동의에 체크해주세요.');
      return;
    }

    // 실제 백엔드 연동을 위한 로직 (예시)
    // 1. 현재 비밀번호 검증 (서버에서 수행되어야 함)
    // 2. 회원 탈퇴 처리 (서버에서 사용자 데이터 삭제 등)
    try {
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (currentPassword === 'correct_password') {
            // 실제 비밀번호와 비교하는 로직으로 변경 필요
            resolve({ success: true });
          } else {
            reject(new Error('현재 비밀번호가 올바르지 않습니다.'));
          }
        }, 500); // 0.5초 지연 시뮬레이션
      });

      if ((response as { success: boolean }).success) {
        toast.success('성공적으로 회원 탈퇴 되었습니다.');
        onClose();
        routeToLogin();
      }
    } catch (error: any) {
      toast.error(error.message || '회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-xl shadow-lg w-96 relative'>
        <h2 className='text-lg font-bold mb-4 text-red-600'>회원 탈퇴</h2>
        <p className='text-sm text-gray-700 mb-4'>
          회원 탈퇴 시 모든 여행 기록 및 개인 정보가 삭제되며, 복구할 수 없습니다. 정말로
          탈퇴하시겠습니까?
        </p>
        <form onSubmit={handleWithdrawal} className='flex flex-col gap-4'>
          <input
            type='password'
            placeholder='현재 비밀번호 입력'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400'
          />
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='agreeToWithdraw'
              checked={agreeToWithdraw}
              onChange={(e) => setAgreeToWithdraw(e.target.checked)}
              className='form-checkbox h-4 w-4 text-red-600 rounded'
            />
            <label htmlFor='agreeToWithdraw' className='text-sm text-gray-700 select-none'>
              위 내용을 이해했으며, 회원 탈퇴에 동의합니다.
            </label>
          </div>
          <div className='flex justify-end gap-2 mt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md'>
              취소
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'>
              회원 탈퇴
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
