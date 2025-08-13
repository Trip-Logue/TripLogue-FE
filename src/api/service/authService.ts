import useAuthStore from '@/hooks/useAuthStore';

// 네트워크 지연 시뮬레이션 함수
const simulateNetwork = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

// 로그인
export const loginUser = async (email: string, password: string): Promise<{ message: string }> => {
  console.log('[MOCK] 로그인 시도', { email, password });
  const mockEmail = 'kmsn01@naver.com';
  const mockPassword = 'password';

  if (email === mockEmail && password === mockPassword) {
    useAuthStore.getState().login(email);
    return simulateNetwork({ message: '로그인 성공!' });
  } else {
    throw new Error('이메일 혹은 비밀번호가 틀렸습니다.');
  }
};

// 로그아웃
export const logoutUser = async (): Promise<{ message: string }> => {
  console.log('[MOCK] 로그아웃');
  useAuthStore.getState().logout();
  return simulateNetwork({ message: '로그아웃 되었습니다.' });
};
