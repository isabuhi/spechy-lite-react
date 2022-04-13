// ** Router Import
import useJwt from "./auth/jwt/useJwt"
import io from "socket.io-client";
import jwt_decode from "jwt-decode";

const Socket = (props) => {
    const decodedToken = jwt_decode(useJwt.getToken());
    const socket = io("https://app.spechy.com", {
        forceNew : true,
        transports: ["websocket"],
        auth: {
            token: "43787DDFFB2C4EE9A82EC554EBB7F"
        },
        query: {
        access: "user",
        cid: decodedToken.cid, //companyId
        uid: decodedToken.uid, //userId
        ns: decodedToken.ns,
        usid : decodedToken.usid,
        ussid : decodedToken.ussid
        },
    });
}

export default Socket
