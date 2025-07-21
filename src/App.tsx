import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MainPage from './assets/pages/mainPage';
import Login from './assets/pages/loginPage';
import Signup from './assets/pages/signupPage';
import 'react-toastify/dist/ReactToastify.css';

const render = (status: Status) => {
  if (status === Status.LOADING) return <div>로딩중...</div>;
  if (status === Status.FAILURE) return <div>로딩 실패</div>;
  return <MainPage />;
};

function App() {
  const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
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
      <Wrapper
      apiKey={mapApiKey}
      render={render}
      libraries={["places"]}
    ></Wrapper>
    </>
  );
}

export default App;
