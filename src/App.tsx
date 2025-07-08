import { useState } from "react";
import CommonInput from "./components/commons/commomInput";
import CommonBtn from "./components/commons/commonBtn";
import MainPage from "./assets/pages/mainPage";

function App() {
  const [value, setValue] = useState("");
  const testOnClick = () => {
    console.log("Button clicked!");
  };
  const testOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  return (
    <><div className="flex">
      <div className="flex gap-4 bg-white-100">
        <MainPage />
      </div>
      <div className="flex">
        <CommonBtn onClick={testOnClick} text={"asdasd"} />
        <CommonInput onChange={testOnchange} placeholder="테스트용" value={value}/>
      </div>
      </div>
     

    </>
  );
}

export default App;
