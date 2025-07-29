import { getCookie } from "../../lib/utils"; 
import type {PrivateRouteProps} from '@/types'
import ErrorPage from "../pages/errorPage";


const PrivateRoute = ({ children}:PrivateRouteProps ) => {
  const accessToken = getCookie("token"); 
  
  // 서버연결 및 이후 수정예정
  const errStatus = 200 ;
  const errMessage = '에러';

  if (!accessToken) {
    return <ErrorPage errorCode={errStatus} message={errMessage} />
  }
  return <>{children}</>;
};

export default PrivateRoute;