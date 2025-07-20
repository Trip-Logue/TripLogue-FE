import { Status, Wrapper } from "@googlemaps/react-wrapper";
import MainPage from "./assets/pages/mainPage";

const render = (status: Status) => {
  if (status === Status.LOADING) return <div>로딩중...</div>;
  if (status === Status.FAILURE) return <div>로딩 실패</div>;
  return <MainPage />;
};

function App() {
  const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <Wrapper
      apiKey={mapApiKey}
      render={render}
      libraries={["places"]}
    ></Wrapper>
  );
}

export default App;
