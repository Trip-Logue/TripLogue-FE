import Layout from '@/layouts/layout';
import { useState, useEffect } from 'react';
import { LogOut, User, Settings, Camera } from 'lucide-react';
import UserProfileSection from '@/components/myPage/userProfileSection';
import TravelSummarySection from '@/components/myPage/travelSummarySection';
import CountryChartSection from '@/components/myPage/countryChartSection';
import MyTripListSection from '@/components/myPage/myTripListSection';
import AccountSettingsSection from '@/components/myPage/accountSettingsSection';
import useAuthStore from '@/hooks/useAuthStore';
import useTravelStore from '@/hooks/useTravelStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RECORDS_PER_PAGE = 6; // 한 페이지당 표시할 여행 기록 수

export default function MyPage() {
  const [activeSection, setActiveSection] = useState<'profile' | 'summary' | 'settings'>('profile');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { user, logout, updateProfile } = useAuthStore();
  const { getRecordsByUser, deleteRecord } = useTravelStore();
  const navigate = useNavigate();

  const userTravelRecords = user ? getRecordsByUser(user.id) : [];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 섹션이 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection]);

  const handleProfileUpdate = (newProfileImageUrl: string | null, newName: string) => {
    if (user) {
      updateProfile({
        profileImageUrl: newProfileImageUrl || undefined,
        name: newName,
      });
      toast.success('프로필이 업데이트되었습니다.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('로그아웃되었습니다.');
  };

  const handleWithdrawal = () => {
    if (user) {
      // 사용자 데이터 삭제
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');

      // 여행 기록도 삭제
      const existingRecords = JSON.parse(localStorage.getItem('travelRecords') || '[]');
      const updatedRecords = existingRecords.filter(
        (record: { userId: string }) => record.userId !== user.id,
      );
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));

      // 사용자 목록에서도 삭제
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = existingUsers.filter((u: { id: string }) => u.id !== user.id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      logout();
      navigate('/login');
      toast.success('회원 탈퇴가 완료되었습니다.');
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    deleteRecord(recordId);
    toast.success('여행 기록이 삭제되었습니다.');
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(userTravelRecords.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentPageRecords = userTravelRecords.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (!user) {
    return null;
  }

  const currentProfileImageUrl = user.profileImageUrl || null;

  return (
    <Layout>
      <div className='mx-auto m-7 rounded-xl justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
        <div className='w-240 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
          {/* Hero Section */}
          <header className='mb-12'>
            <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 lg:p-12'>
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
                <div className='mt-6 flex items-center justify-center gap-4'>
                  <span className='inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm'>
                    {user.name}님 환영합니다
                  </span>
                  <button
                    onClick={handleLogout}
                    className='inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/30 transition-all duration-200'>
                    <LogOut size={16} />
                    로그아웃
                  </button>
                </div>
              </div>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl'></div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <nav className='mb-8'>
            <div className='bg-white rounded-2xl shadow-lg p-2 border border-gray-100'>
              <div className='flex gap-2'>
                {[
                  { key: 'profile', label: '프로필', icon: User },
                  { key: 'summary', label: '여행 요약', icon: Camera },
                  { key: 'settings', label: '계정 설정', icon: Settings },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key as 'profile' | 'summary' | 'settings')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      activeSection === key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Content Sections */}
          <main>
            {activeSection === 'profile' && (
              <div className='space-y-8'>
                <UserProfileSection
                  profileImageUrl={currentProfileImageUrl}
                  userName={user.name}
                  currentEmail={user.email}
                  onProfileUpdate={handleProfileUpdate}
                />
                <TravelSummarySection travelRecords={userTravelRecords} />
                <CountryChartSection travelRecords={userTravelRecords} />
                <MyTripListSection
                  travelRecords={currentPageRecords}
                  onDeleteRecord={handleDeleteRecord}
                  showPagination={totalPages > 1}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  totalRecords={userTravelRecords.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                />
              </div>
            )}

            {activeSection === 'summary' && (
              <div className='space-y-8'>
                <TravelSummarySection travelRecords={userTravelRecords} />
                <CountryChartSection travelRecords={userTravelRecords} />
                <MyTripListSection
                  travelRecords={currentPageRecords}
                  onDeleteRecord={handleDeleteRecord}
                  showPagination={totalPages > 1}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  totalRecords={userTravelRecords.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                />
              </div>
            )}

            {activeSection === 'settings' && (
              <AccountSettingsSection onLogout={handleLogout} onWithdrawal={handleWithdrawal} />
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
