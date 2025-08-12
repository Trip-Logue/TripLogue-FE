import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PuffLoader } from 'react-spinners';
import MainPage from './pages/mainPage';
import Login from './pages/loginPage';
import Signup from './pages/signupPage';
import MyPage from './pages/myPage';
import 'react-toastify/dist/ReactToastify.css';
import PhotoGallery from './pages/photoGalleryPage';
import { PrivateRoute } from './components/route/privateRoute'; // Corrected import path
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FriendPage from './pages/friendPage';

const queryClient = new QueryClient();

const render = (status: Status) => {
  if (status === Status.LOADING)
    return <PuffLoader color='#2469fc' loading size={150} speedMultiplier={1} />;
  if (status === Status.FAILURE) return <div>로딩 실패</div>;
  return <MainPage />;
};

function App() {
  const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // No need to get isLoggedIn here directly for routing, PrivateRoute handles it.

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
        <Wrapper apiKey={mapApiKey} render={render} libraries={['places']}>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              {/* Protected Routes */}
              <Route
                path='/'
                element={
                  <PrivateRoute>
                    <MainPage />
                  </PrivateRoute>
                }
              />
              <Route
                path='/photogallery'
                element={
                  <PrivateRoute>
                    <PhotoGallery />
                  </PrivateRoute>
                }
              />
              <Route
                path='/mypage'
                element={
                  <PrivateRoute>
                    <MyPage />
                  </PrivateRoute>
                }
              />
              <Route
                path='/friends'
                element={
                  <PrivateRoute>
                    <FriendPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </Wrapper>
      </QueryClientProvider>
    </>
  );
}

export default App;
