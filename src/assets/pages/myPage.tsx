import Layout from '@/layouts/layout';
import { useState } from 'react';
import EditProfileModal from '@/components/modals/editProfileModal';
import ChangePasswordModal from '@/components/modals/changePasswordModal';
import UserProfileSection from '@/components/myPage/userProfileSection';
import TravelSummarySection from '@/components/myPage/travelSummarySection';
import CountryChartSection from '@/components/myPage/countryChartSection';
import MyTripListSection from '@/components/myPage/myTripListSection';
import AccountSettingsSection from '@/components/myPage/accountSettingsSection';
import WithdrawalModal from '@/components/modals/withdrawalModal';

function MyPage() {
  const [activeModal, setActiveModal] = useState<
    null | 'edit-profile' | 'change-password' | 'withdrawal'
  >(null);

  const openEditProfile = () => setActiveModal('edit-profile');
  const openChangePassword = () => setActiveModal('change-password');
  const closeModal = () => setActiveModal(null);
  const openWithdrawal = () => setActiveModal('withdrawal'); // 새로 추가

  return (
    <Layout>
      <div className='flex flex-col gap-6 px-6 py-8 max-w-5xl mx-auto m-7 bg-[#FAFAF9] rounded-xl'>
        <UserProfileSection openEditProfile={openEditProfile} />
        <TravelSummarySection />
        <CountryChartSection />
        <MyTripListSection />
        <AccountSettingsSection
          openChangePassword={openChangePassword}
          openWithdrawal={openWithdrawal}
        />
      </div>
      {activeModal === 'edit-profile' && <EditProfileModal onClose={closeModal} />}
      {activeModal === 'change-password' && <ChangePasswordModal onClose={closeModal} />}
      {activeModal === 'withdrawal' && <WithdrawalModal onClose={closeModal} />}
    </Layout>
  );
}

export default MyPage;
