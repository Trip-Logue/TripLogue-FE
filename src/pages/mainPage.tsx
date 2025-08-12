import MainMap from '@/components/map/mainMap';
import Layout from '@/layouts/layout';
import { MapPin, Plane } from 'lucide-react';

function MainPage() {
  return (
    <Layout>
      <div className='justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full h-full'>
        <div className='max-w-7xl mx-auto p-4 w-full h-full h-300 sm:p-6 lg:p-8'>
          {/* Hero Section */}
          <header className='mb-12'>
            <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 lg:p-12'>
              <div className='absolute inset-0 bg-black/10'></div>
              <div className='relative z-10 text-center'>
                <div className='flex items-center justify-center gap-4 mb-4'>
                  <div className='p-3 bg-white/20 rounded-2xl backdrop-blur-sm'>
                    <MapPin className='text-white' size={32} />
                  </div>
                  <h1 className='text-4xl lg:text-5xl font-bold text-white tracking-tight'>
                    TripLogue
                  </h1>
                </div>
                <p className='text-xl text-blue-100 max-w-2xl mx-auto'>
                  여행의 모든 순간을 기록하고, 특별한 추억을 만들어보세요
                </p>
              </div>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl'></div>
            </div>
          </header>

          {/* Map Section */}
          <section className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
            <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-6'>
              <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                <Plane className='text-green-200' size={28} />
                여행 지도
              </h2>
            </div>
            <div className='p-6'>
              <MainMap />
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default MainPage;
