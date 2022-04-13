import io from "socket.io-client";

import jwt_decode from "jwt-decode";
import useJwt from "@src/auth/jwt/useJwt";

// const decodedToken = jwt_decode(useJwt.getToken());
export const socket =
  useJwt.getToken() !== null
    ? io("https://app.spechy.com", {
        forceNew: true,
        transports: ["websocket"],
        auth: {
          token: "43787DDFFB2C4EE9A82EC554EBB7F",
        },
        query: {
          access: "user",
          cid: jwt_decode(useJwt.getToken()).cid, //companyId
          uid: jwt_decode(useJwt.getToken()).uid, //userId
          ns: jwt_decode(useJwt.getToken()).ns,
          usid: jwt_decode(useJwt.getToken()).usid,
          ussid: jwt_decode(useJwt.getToken()).ussid,
        },
      })
    : "";
