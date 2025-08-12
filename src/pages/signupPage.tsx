import { useState, useRef } from 'react';
import { useRoute } from '@/hooks/useRoute';
import { toast } from 'react-toastify';
import CommonBtn from '@/components/commons/commonBtn';
import RegisterInput from '@/components/commons/registerInput';
import { User, UserPlus, Mail, Lock, UserCheck, Camera, MapPin, Users } from 'lucide-react';

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Signup() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [emailError, setEmailError] = useState('');

  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { routeToLogin } = useRoute();

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserId(val);

    const emailToCheck = `${val}@${emailDomain === 'write' ? customDomain : emailDomain}`;
    if (strictEmailRegex.test(emailToCheck)) {
      setEmailError('');
    } else {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    }
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomDomain(val);

    const emailToCheck = `${userId}@${val}`;
    if (strictEmailRegex.test(emailToCheck)) {
      setEmailError('');
    } else {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImageUrl('');
    }
  };

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !userId || !password || !passwordCheck) {
      toast.error('모든 항목을 입력해주세요.');
      return;
    }

    if (emailDomain === 'write' && !customDomain) {
      toast.error('이메일 주소를 직접 입력해주세요.');
      return;
    }

    if (emailError) {
      toast.error('이메일 형식을 확인해주세요.');
      return;
    }

    if (password !== passwordCheck) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 실제 서버 연동 시 FormData를 사용하여 이미지 파일 전송
      // const formData = new FormData();
      // formData.append('name', name);
      // formData.append('email', fullEmail);
      // formData.append('password', password);
      // if (profileImage) {
      //   formData.append('profileImage', profileImage);
      // }
      // await axios.post('/signup', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });

      await new Promise((r) => setTimeout(r, 1000)); // 더미 대기

      toast.success('회원가입이 완료되었습니다!');
      routeToLogin();
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-white'>
      <div className='mx-auto m-7 rounded-xl justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'>
        <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]'>
            {/* Left Side - Welcome */}
            <div className='space-y-8'>
              <div className='text-center lg:text-left'>
                <div className='flex items-center justify-center lg:justify-start gap-3 mb-6'>
                  <div className='p-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl'>
                    <UserPlus className='text-white' size={32} />
                  </div>
                  <h1 className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent pb-2'>
                    TripLogue
                  </h1>
                </div>
                <p className='text-lg text-gray-600 mb-8 max-w-lg'>
                  여행의 모든 순간을 기록하고, 특별한 추억을 만들어보세요
                </p>
              </div>

              {/* Benefits */}
              <div className='space-y-6'>
                <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                  <div className='flex items-center gap-4'>
                    <div className='bg-green-100 w-12 h-12 rounded-full flex items-center justify-center'>
                      <MapPin className='text-green-600' size={24} />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900'>지도 기반 기록</h3>
                      <p className='text-gray-600'>
                        방문한 장소를 지도에 표시하고 여행 경로를 시각화
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                  <div className='flex items-center gap-4'>
                    <div className='bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center'>
                      <Camera className='text-emerald-600' size={24} />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900'>사진 갤러리</h3>
                      <p className='text-gray-600'>
                        여행 사진을 체계적으로 정리하고 아름다운 추억 보관
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                  <div className='flex items-center gap-4'>
                    <div className='bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center'>
                      <Users className='text-teal-600' size={24} />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900'>친구와 공유</h3>
                      <p className='text-gray-600'>여행 동반자와 함께 특별한 순간을 만들어보세요</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className='bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white text-center'>
                <UserCheck className='mx-auto mb-3' size={32} />
                <h3 className='text-xl font-bold mb-2'>지금 가입하고 시작하세요!</h3>
                <p className='text-green-100'>무료로 여행 기록을 시작할 수 있습니다</p>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className='flex justify-center lg:justify-end'>
              <div className='w-full max-w-md'>
                <div className='bg-white rounded-3xl shadow-2xl p-8 border border-gray-100'>
                  <div className='text-center mb-8'>
                    <div className='w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                      <UserPlus className='text-white' size={32} />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-900'>회원가입</h2>
                    <p className='text-gray-600 mt-2'>TripLogue의 새로운 멤버가 되어보세요</p>
                  </div>

                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Profile Image */}
                    <div className='text-center'>
                      <div
                        className='relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mx-auto cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors duration-200'
                        onClick={handleProfileImageClick}>
                        {previewImageUrl ? (
                          <img
                            src={previewImageUrl}
                            alt='프로필 미리보기'
                            className='w-full h-full object-cover'
                            onError={() => setPreviewImageUrl('')}
                          />
                        ) : (
                          <Camera className='text-gray-400' size={32} />
                        )}
                        <input
                          type='file'
                          accept='image/*'
                          onChange={handleProfileImageChange}
                          className='hidden'
                          ref={fileInputRef}
                        />
                      </div>
                      <p className='text-sm text-gray-500 mt-2'>클릭하여 프로필 이미지 선택</p>
                    </div>

                    {/* Name */}
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        이름
                      </label>
                      <div className='relative'>
                        <User
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                          size={20}
                        />
                        <RegisterInput
                          id='name'
                          type='text'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoFocus
                          className='pl-10 w-full'
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor='userId'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        이메일 주소
                      </label>
                      <div className='flex gap-2'>
                        <div className='relative flex-1'>
                          <Mail
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                            size={20}
                          />
                          <RegisterInput
                            id='userId'
                            type='text'
                            value={userId}
                            onChange={handleUserIdChange}
                            className='pl-10 w-full'
                            placeholder='아이디'
                          />
                        </div>
                        <span className='flex items-center text-gray-500'>@</span>
                        <select
                          value={emailDomain}
                          onChange={(e) => setEmailDomain(e.target.value)}
                          className='bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 min-w-[140px]'>
                          <option value='gmail.com'>gmail.com</option>
                          <option value='naver.com'>naver.com</option>
                          <option value='write'>직접 입력</option>
                        </select>
                      </div>

                      {emailDomain === 'write' && (
                        <RegisterInput
                          type='text'
                          value={customDomain}
                          onChange={handleCustomDomainChange}
                          className='w-full mt-2'
                          placeholder='도메인을 입력하세요'
                        />
                      )}

                      {emailError && <p className='text-red-600 text-sm mt-1'>{emailError}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor='password'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        비밀번호
                      </label>
                      <div className='relative'>
                        <Lock
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                          size={20}
                        />
                        <RegisterInput
                          id='password'
                          type='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='pl-10 w-full'
                        />
                      </div>
                    </div>

                    {/* Password Check */}
                    <div>
                      <label
                        htmlFor='passwordCheck'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        비밀번호 확인
                      </label>
                      <div className='relative'>
                        <Lock
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                          size={20}
                        />
                        <RegisterInput
                          id='passwordCheck'
                          type='password'
                          value={passwordCheck}
                          onChange={(e) => setPasswordCheck(e.target.value)}
                          className='pl-10 w-full'
                        />
                      </div>
                    </div>

                    <CommonBtn
                      text='가입하기'
                      type='submit'
                      className='w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
                    />
                  </form>

                  <div className='mt-8 text-center'>
                    <p className='text-gray-600 mb-4'>이미 계정이 있으신가요?</p>
                    <CommonBtn
                      text='로그인'
                      className='w-full bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold rounded-xl transition-all duration-200'
                      onClick={routeToLogin}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
