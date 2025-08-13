import { useState } from 'react';
import { LogOut, UserX, AlertTriangle, Shield, Settings } from 'lucide-react';

interface AccountSettingsSectionProps {
  onLogout: () => void;
  onWithdrawal: () => void;
}

export default function AccountSettingsSection({
  onLogout,
  onWithdrawal,
}: AccountSettingsSectionProps) {
  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);

  return (
    <div className='space-y-6'>
      {/* 계정 보안 */}
      <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-3 bg-blue-100 rounded-full'>
            <Shield className='text-blue-600' size={24} />
          </div>
          <h2 className='text-2xl font-bold text-gray-900'>계정 보안</h2>
        </div>

        <div className='space-y-4'>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <h3 className='font-semibold text-gray-900 mb-2'>로그아웃</h3>
            <p className='text-gray-600 mb-3'>현재 계정에서 로그아웃합니다.</p>
            <button
              onClick={onLogout}
              className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
              <LogOut size={16} />
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 계정 관리 */}
      <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-3 bg-gray-100 rounded-full'>
            <Settings className='text-gray-600' size={24} />
          </div>
          <h2 className='text-2xl font-bold text-gray-900'>계정 관리</h2>
        </div>

        <div className='space-y-4'>
          <div className='p-4 bg-red-50 rounded-lg border border-red-200'>
            <h3 className='font-semibold text-red-900 mb-2'>회원 탈퇴</h3>
            <p className='text-red-700 mb-3'>
              계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.
            </p>
            <button
              onClick={() => setShowWithdrawalConfirm(true)}
              className='inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
              <UserX size={16} />
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      {showWithdrawalConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-red-100 rounded-full'>
                <AlertTriangle className='text-red-600' size={24} />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>회원 탈퇴 확인</h3>
            </div>
            <p className='text-gray-600 mb-6'>
              정말로 회원 탈퇴를 하시겠습니까?
              <br />
              <span className='text-red-600 font-medium'>
                이 작업은 되돌릴 수 없으며, 모든 여행 기록과 사진이 영구적으로 삭제됩니다.
              </span>
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowWithdrawalConfirm(false)}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
                취소
              </button>
              <button
                onClick={() => {
                  onWithdrawal();
                  setShowWithdrawalConfirm(false);
                }}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
