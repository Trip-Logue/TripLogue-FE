import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoute } from '@/hooks/useRoute';
import { toast } from 'react-toastify';
import CommonBtn from '@/components/commons/commonBtn';
import RegisterInput from '@/components/commons/registerInput';
import { MapPin, Camera, Users, Plane, LogIn, Mail, Lock } from 'lucide-react';
import { loginUser } from '@/api/service/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { routeToSignup } = useRoute();

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await loginUser(email, password);
      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      console.error('로그인 중 에러 발생:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-white'>
      <div className='mx-auto my-auto rounded-xl justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 items-center'>
        <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left Side - Features */}
            <div className='space-y-8 ml-10'>
              <div className='text-center lg:text-left'>
                <div className='flex items-center justify-center lg:justify-start gap-3 mb-3'>
                  <div className='p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl'>
                    <MapPin className='text-white' size={32} />
                  </div>
                  <h1 className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2'>
                    TripLogue
                  </h1>
                </div>
                <p className='text-lg text-gray-600 mb-8 max-w-lg'>
                  여행의 모든 순간을 기록하고, 특별한 추억을 만들어보세요
                </p>
              </div>

              {/* Features Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center'>
                  <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <MapPin className='text-blue-600' size={28} />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 mb-2'>지도 기반 기록</h3>
                  <p className='text-sm text-gray-600'>
                    방문한 장소를 지도에 표시하고 여행 경로를 시각화하세요
                  </p>
                </div>

                <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center'>
                  <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Camera className='text-purple-600' size={28} />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 mb-2'>사진 갤러리</h3>
                  <p className='text-sm text-gray-600'>
                    여행 사진을 체계적으로 정리하고 아름다운 추억을 보관하세요
                  </p>
                </div>

                <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center'>
                  <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Users className='text-green-600' size={28} />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 mb-2'>친구와 공유</h3>
                  <p className='text-sm text-gray-600'>
                    여행 동반자와 함께 특별한 순간을 만들어보세요
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white text-center'>
                <Plane className='mx-auto mb-3' size={32} />
                <h3 className='text-xl font-bold mb-2'>지금 시작해보세요!</h3>
                <p className='text-blue-100'>로그인하고 나만의 여행 이야기를 시작하세요</p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className='ml-10 flex justify-center'>
              <div className='w-full max-w-md'>
                <div className='bg-white rounded-3xl shadow-2xl p-8 border border-gray-100'>
                  <div className='text-center mb-8'>
                    <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                      <LogIn className='text-white' size={32} />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-900'>로그인</h2>
                    <p className='text-gray-600 mt-2'>TripLogue에 오신 것을 환영합니다</p>
                  </div>

                  <form onSubmit={handleLogin} className='space-y-6'>
                    <div>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        이메일
                      </label>
                      <div className='relative'>
                        <Mail
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                          size={20}
                        />
                        <RegisterInput
                          id='email'
                          type='email'
                          placeholder='ex) hong@naver.com'
                          autoFocus
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className='pl-10 w-full'
                        />
                      </div>
                    </div>

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

                    <CommonBtn
                      text='로그인'
                      type='submit'
                      className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
                    />
                  </form>

                  <div className='mt-8 text-center'>
                    <p className='text-gray-600 mb-4'>아직 회원이 아니신가요?</p>
                    <CommonBtn
                      text='회원가입'
                      className='w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200'
                      onClick={routeToSignup}
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

export default Login;
