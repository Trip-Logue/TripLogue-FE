import type { AccountSettingsSectionProps } from '@/types';

export default function AccountSettingsSection({
  openChangePassword,
  openWithdrawal,
}: AccountSettingsSectionProps) {
  return (
    <section>
      <h3 className='text-lg font-semibold mb-2'>계정 설정</h3>
      <div className='flex flex-col gap-2'>
        <button
          onClick={openChangePassword}
          className='cursor-pointer text-blue-600 hover:underline text-left'>
          비밀번호 변경
        </button>
        <button
          onClick={openWithdrawal}
          className='cursor-pointer text-red-500 hover:underline text-left'>
          계정 탈퇴
        </button>
      </div>
    </section>
  );
}
