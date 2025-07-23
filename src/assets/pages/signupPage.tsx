// src/components/Signup.tsx (또는 Signup.jsx)
import { useState, useRef } from 'react';
import { useRoute } from '@/hooks/useRoute';
import { toast } from 'react-toastify';
import CommonBtn from '@/components/commons/commonBtn';
import RegisterInput from '@/components/commons/registerInput';
import Layout from '@/layouts/layout';
import { User } from 'lucide-react'; // lucide-react에서 User 아이콘 임포트

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Signup() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [emailError, setEmailError] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>(''); // 기본 이미지 URL 제거
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
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(null);
      setPreviewImageUrl(''); // 파일 선택 취소 시 미리보기 URL 초기화
    }
  };

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullEmail = `${userId}@${emailDomain === 'write' ? customDomain : emailDomain}`;

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
    <Layout outerClassName='justify-center items-center'>
      <div>
        <form
          onSubmit={handleSubmit}
          className='flex border flex-col rounded-xl p-9 bg-[#FAFAF9] w-auto h-auto'>
          <h1 className='m-auto pl-2 pr-2 pb-4 font-bold text-2xl '>회원가입</h1>

          {/* 프로필 이미지 미리보기 및 선택 */}
          <div
            className='relative w-24 h-24 rounded-full overflow-hidden bg-[#E5E7EB] m-auto mb-4 cursor-pointer flex items-center justify-center'
            onClick={handleProfileImageClick}>
            {/* lucide-react의 User 아이콘 표시 */}
            <User className='text-gray-600 text-xl' />
            {/* 선택된 이미지가 있을 때만 img 태그로 미리보기 표시 */}
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt='프로필 미리보기'
                className='absolute inset-0 w-full h-full object-cover' // absolute inset-0로 부모 div를 완전히 덮도록 설정
                onError={() => setPreviewImageUrl('')} // 이미지 로드 실패 시 미리보기 URL 초기화
              />
            )}
            <input
              type='file'
              accept='image/*'
              onChange={handleProfileImageChange}
              className='hidden'
              ref={fileInputRef}
            />
          </div>

          <label htmlFor='name'>이름</label>
          <RegisterInput
            id='name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className='w-40'
          />

          <label htmlFor='userId' className='mt-4'>
            아이디(이메일)
          </label>
          <div>
            <RegisterInput
              id='userId'
              type='text'
              value={userId}
              onChange={handleUserIdChange}
              className='w-40'
            />{' '}
            @&nbsp;
            <select
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              className='bg-white border rounded-lg px-4 py-2 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200 w-35 h-10'>
              <option value='gmail.com'> gmail.com </option>
              <option value='naver.com'> naver.com </option>
              <option value='write'> 직접 입력 </option>
            </select>
          </div>

          {emailDomain === 'write' && (
            <RegisterInput
              type='text'
              value={customDomain}
              onChange={handleCustomDomainChange}
              className='w-35 mt-2 self-end'
            />
          )}

          {emailError && <p className='text-red-600 mt-1'>{emailError}</p>}

          <label className='mt-4' htmlFor='password'>
            비밀번호
          </label>
          <RegisterInput
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className='mt-4' htmlFor='passworCheck'>
            비밀번호 확인
          </label>
          <RegisterInput
            id='passwordCheck'
            type='password'
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />

          <CommonBtn text='가입하기' type='submit' className='w-full mt-4' />
        </form>
      </div>
    </Layout>
  );
}

export default Signup;
