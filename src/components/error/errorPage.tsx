import { useNavigate } from 'react-router-dom';
import { Frown } from 'lucide-react';
import type { ErrorPageProps } from '@/types';

export default function ErrorPage({ errorCode, message }: ErrorPageProps) {
  const navigate = useNavigate();

  const errorMessage: Record<number, string> = {
    401: '로그인이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '페이지를 찾을 수 없습니다.',
    500: '서버 오류가 발생했습니다.',
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-[100px] text-gray-400 mb-2'>
        <Frown />
      </div>
      <h1 className='text-5xl font-bold text-gray-400 mb-2'>{errorCode}</h1>
      <p className='text-xl text-gray-400 mb-4'>
        {message || errorMessage[errorCode] || '알 수 없는 오류 발생'}
      </p>
      <p className='text-gray-400 mb-8 text-center'>
        찾으시는 페이지가 존재하지 않거나, 다른 오류가 발생했습니다.
        <br />
        이전 페이지로 돌아가거나, 홈으로 이동해 주세요.
      </p>

      <button
        onClick={() => {
          navigate('/');
        }}
        className='px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition'>
        홈으로 이동
      </button>
    </div>
  );
}
