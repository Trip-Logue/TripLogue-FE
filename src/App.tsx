import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PuffLoader } from 'react-spinners';
import MainPage from './assets/pages/mainPage';
import Login from './assets/pages/loginPage';
import Signup from './assets/pages/signupPage';
import MyPage from './assets/pages/myPage';
import 'react-toastify/dist/ReactToastify.css';
import PhotoGallery from './assets/pages/photoGalleryPage';
import PrivateRoute from './components/commons/privateRoute';

const render = (status: Status) => {
  if (status === Status.LOADING)
    return <PuffLoader color='#2469fc' loading size={150} speedMultiplier={1} />;
  if (status === Status.FAILURE) return <div>로딩 실패</div>;
  return <MainPage />;
};

function App() {
  const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <>
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
            <PrivateRoute >
            <Route path='/' element={<MainPage />} />
            </PrivateRoute>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/photogallery' element={<PhotoGallery />} />
            <Route path='/mypage' element={<MyPage />} />
          </Routes>
        </BrowserRouter>
      </Wrapper>
    </>
  );
}

export default App;
