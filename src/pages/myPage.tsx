import Layout from '@/layouts/layout';
import { useState } from 'react';
import EditProfileModal from '@/components/myPage/editProfileModal';
import ChangePasswordModal from '@/components/myPage/changePasswordModal';
import UserProfileSection from '@/components/myPage/userProfileSection';
import TravelSummarySection from '@/components/myPage/travelSummarySection';
import CountryChartSection from '@/components/myPage/countryChartSection';
import MyTripListSection from '@/components/myPage/myTripListSection';
import AccountSettingsSection from '@/components/myPage/accountSettingsSection';
import WithdrawalModal from '@/components/myPage/withdrawalModal';
import { User } from 'lucide-react';

function MyPage() {
  const [activeModal, setActiveModal] = useState<
    null | 'edit-profile' | 'change-password' | 'withdrawal'
  >(null);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string>('김나박'); // 초기값 설정

  const openEditProfile = () => {
    setActiveModal('edit-profile');
  };
  const openChangePassword = () => setActiveModal('change-password');
  const closeModal = () => setActiveModal(null);
  const openWithdrawal = () => setActiveModal('withdrawal');

  const handleProfileUpdate = (newNickname: string, newProfileImageUrl: string | null) => {
    setUserNickname(newNickname);
    setUserProfileImage(newProfileImageUrl);
    closeModal();
  };

  return (
    <Layout>
      <div className='mx-auto m-7 rounded-xl justify-center min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'>
        <div className='w-240 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
          {/* Hero Section */}
          <header className='mb-12'>
            <div className='relative overflow-hidden bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-3xl shadow-2xl p-8 lg:p-12'>
              <div className='absolute inset-0 bg-black/10'></div>
              <div className='relative z-10 text-center'>
                <div className='flex items-center justify-center gap-4 mb-4'>
                  <div className='p-3 bg-white/20 rounded-2xl backdrop-blur-sm'>
                    <User className='text-white' size={32} />
                  </div>
                  <h1 className='text-4xl lg:text-5xl font-bold text-white tracking-tight'>
                    마이페이지
                  </h1>
                </div>
                <p className='text-xl text-sky-100 max-w-2xl mx-auto'>
                  나의 여행 기록과 프로필을 관리하고, 특별한 순간들을 되돌아보세요
                </p>
              </div>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl'></div>
            </div>
          </header>

          {/* Main Content */}
          <div className='space-y-8'>
            <UserProfileSection
              openEditProfile={openEditProfile}
              profileImageUrl={userProfileImage}
              userName={userNickname}
            />
            <TravelSummarySection />
            <CountryChartSection />
            <MyTripListSection />
            <AccountSettingsSection
              openChangePassword={openChangePassword}
              openWithdrawal={openWithdrawal}
            />
          </div>
        </div>
      </div>

      {activeModal === 'edit-profile' && (
        <EditProfileModal
          onClose={closeModal}
          onProfileUpdate={handleProfileUpdate}
          currentNickname={userNickname}
          currentProfileImageUrl={userProfileImage}
        />
      )}
      {activeModal === 'change-password' && <ChangePasswordModal onClose={closeModal} />}
      {activeModal === 'withdrawal' && <WithdrawalModal onClose={closeModal} />}
    </Layout>
  );
}

export default MyPage;
