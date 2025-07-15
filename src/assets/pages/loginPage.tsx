import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainSidebar } from './mainSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useRoute } from '@/hooks/useRoute';
import { toast } from 'react-toastify';
import CommonBtn from '@/components/commons/commonBtn';
import RegisterInput from '@/components/commons/registerInput';
import Layout from '@/layouts/layout';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { routeToSignup } = useRoute();

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // 주소 추가 예정
      const response = await fetch('#', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: email,
          password: password,
        }),
      });

      if (!response.ok) {
        toast.error('이메일 혹은 비밀번호가 틀렸습니다.');
        return;
      }

      const result = await response.json();
      // sessionStorage.setItem 등 처리 기능 추가 가능
      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      // 네트워크 오류, JSON 파싱 오류 등
      console.error('로그인 중 에러 발생:', error);
      toast.error('서버와의 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <Layout outerClassName='justify-center items-center'>
      <div>
        <form
          onSubmit={handleLogin}
          className='flex border flex-col rounded-xl p-9 bg-[#FAFAF9] w-85 h-auto'>
          <h1 className='m-auto pl-2 pr-2 pb-4 font-bold text-2xl '>Trip Logue</h1>
          <label htmlFor='email'>이메일</label>
          <RegisterInput
            id='email'
            type='email'
            placeholder='ex) hong@naver.com'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className='mt-4' htmlFor='password'>
            비밀번호
          </label>
          <RegisterInput
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <CommonBtn text='로그인' type='submit' className='w-full mt-4' />
        </form>
        <p>
          아직 회원이 아니신가요?{' '}
          <CommonBtn
            text='회원가입'
            className='w-1/3 h-1/4 mt-2'
            onClick={routeToSignup}></CommonBtn>
        </p>
      </div>
    </Layout>
  );
}

export default Login;
