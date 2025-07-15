import { useState } from 'react';
import { MainSidebar } from './mainSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useRoute } from '@/hooks/useRoute';
import { toast } from 'react-toastify';
import CommonBtn from '@/components/commons/commonBtn';
import RegisterInput from '@/components/commons/registerInput';

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Signup() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [emailError, setEmailError] = useState('');

  const { routeToLogin } = useRoute();

  // 이메일 실시간 유효성 검사
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserId(val);

    // 도메인까지 같이 확인해야 하니 전체 이메일 조합 후 검사
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

  //폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullEmail = `${userId}@${emailDomain === 'write' ? customDomain : emailDomain}`;

    // 유효성 검사
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

    console.log('회원가입 정보:');
    console.log('이름:', name);
    console.log('이메일:', fullEmail);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', passwordCheck);

    try {
      // 서버 연동 대신 더미 처리
      // 실제로는 axios.post('/signup', { name, email: fullEmail, password })
      await new Promise((r) => setTimeout(r, 1000)); // 더미 대기

      toast.success('회원가입이 완료되었습니다!');
      routeToLogin();
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className='flex w-full h-full justify-center items-center'>
      <div className='flex flex-col gap-4 bg-white'>
        <SidebarProvider>
          <MainSidebar />
        </SidebarProvider>
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className='flex border flex-col rounded-xl p-9 bg-[#FAFAF9] w-auto h-auto'>
          <h1 className='m-auto pl-2 pr-2 pb-4 font-bold text-2xl '>회원가입</h1>

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
    </div>
  );
}

export default Signup;
