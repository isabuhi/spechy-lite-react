// ** Router Import
import { checkAuth } from "./redux/actions/auth";
import { useEffect, useState } from "react";
import Router from "./router/Router";
import { useDispatch, useSelector } from "react-redux";
import useJwt from "./auth/jwt/useJwt";
import io from "socket.io-client";
import jwt_decode from "jwt-decode";
// import { Conection } from "./token";

const App = (props) => {
  const dispatch = useDispatch();
  const access_token = useJwt.getToken();
  const refresh_token = useJwt.getRefreshToken();
  const [mySocket, setMySocket] = useState("");
  const change_status = (id) => {};

  useEffect(() => {
    if (access_token && refresh_token) {
      // const newtoken = Conection();
      dispatch(checkAuth());
    } else {
      useJwt.removeAuthInfos();
    }
  }, []);

  return <Router {...props} params={change_status} />;
};

export default App;
