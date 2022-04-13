// ** React Imports
import {
  Fragment,
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";

// ** Chat App Component Imports
import Chat from "./Chat";
import Sidebar from "./SidebarLeft";
import io from "socket.io-client";
import $ from "jquery";
import Card from "@components/card-snippet";
import PillsBasic from "./PillsBasic";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, getChatContacts } from "./store/actions";
import jwt_decode from "jwt-decode";
import useJwt from "@src/auth/jwt/useJwt";
import axios from "axios";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";
// import { getAtiveConversation, ActiveCoversations } from "../../../token";
import Breadcrumbs from "./subComponents/breadCrumbs";
import Router from "../../../router/Router";

import "@styles/base/pages/app-chat.scss";
import "@styles/base/pages/app-chat-list.scss";
import { socket } from "../../../socket/index";

const AppChat = (props) => {
  const decodedToken = jwt_decode(useJwt.getToken());
  const [myRoomId, setroomId] = useState("");
  const [chatBarWidth, setChatBarWidth] = useState("100%");
  const [mychannelId, setChannelId] = useState("");
  const [logId, setlogId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [from, setFromId] = useState("");
  const [session, setSessionId] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const [chatContent, setChatContent] = useState([]);
  const [socketstop, setSocketStop] = useState(null);
  const [phone_number, setPhoneNumber] = useState("");
  const childCompRef = useRef();
  const childOpenRef = useRef();
  const [dataOfReason, setDataOfReason] = useState([]);

  const selectedReasonCode = (childdata) => {
    setDataOfReason(childdata);
    return childdata;
  };

  // const socket = io("https://app.spechy.com", {
  //   forceNew: true,
  //   transports: ["websocket"],
  //   auth: {
  //     token: "43787DDFFB2C4EE9A82EC554EBB7F",
  //   },
  //   query: {
  //     access: "user",
  //     cid: decodedToken.cid, //companyId
  //     uid: decodedToken.uid, //userId
  //     ns: decodedToken.ns,
  //     usid: decodedToken.usid,
  //     ussid: decodedToken.ussid,
  //   },
  // });

  const [formState, setFormState] = useState({
    chat: [],
    message: [],
  });
  const [showChat, setShowChat] = useState(false);

  let activeConversation = {
    channelId: 0,
  };
  let totalConversation = 0;

  const chatMessage = (
    id,
    channelId,
    customerId,
    roomId,
    name,
    avatar,
    logId,
    mailboxIdTemp
  ) => {
    setroomId(roomId);
    setlogId(logId);
    setChannelId(channelId);
    setAvatar(avatar);
    setFullName(name);
    setCustomerId(customerId);
    socket.on("panel_set_active_conversation", (data) => {
      let message = [];
      if (data.channelId !== 8) {
        if (data.channelId === 6) {
        } else {
          for (let i = 0; i < data.messages.length; i++) {
            if (data.messages[i].type === "T") {
              message.push({
                createdAt: data.messages[i].createdAt,
                message: data.messages[i].message,
                senderId: data.messages[i].sender,
                messageId: data.messages[i].messageId,
                senderName: data.messages[i].senderName,
                type: "T",
              });
            } else if (data[i].type === "I") {
              message.push({
                createdAt: data.messages[i].createdAt,
                message: data.messages[i].message,
                senderId: data.messages[i].sender,
                messageId: data.messages[i].messageId,
                senderName: data.messages[i].senderName,
                type: "I",
                url: "https://app.spechy.com:8000" + data[i].url,
              });
            } else if (data[i].type === "A") {
              message.push({
                createdAt: data.messages[i].createdAt,
                message: data.messages[i].message,
                senderId: data.messages[i].sender,
                messageId: data.messages[i].messageId,
                senderName: data.messages[i].senderName,
                type: "A",
                url: "https://app.spechy.com:8000" + data[i].url,
              });
            } else if (data[i].type === "V") {
              message.push({
                createdAt: data.messages[i].createdAt,
                message: data.messages[i].message,
                senderId: data.messages[i].sender,
                messageId: data.messages[i].messageId,
                senderName: data.messages[i].senderName,
                type: "V",
                url: "https://app.spechy.com:8000" + data[i].url,
              });
            } else if (data[i].type === "D") {
              message.push({
                createdAt: data.messages[i].createdAt,
                message: data.messages[i].message,
                senderId: data.messages[i].sender,
                messageId: data.messages[i].messageId,
                senderName: data.messages[i].senderName,
                type: "D",
                url: "https://app.spechy.com:8000" + data[i].url,
              });
            }
          }
        }
      } else {
        axios
          .post(`${BASE_URL}/api/mail-management/mailbox/get-mail-info`, {
            email_id: mailboxIdTemp,
            mailbox_id: id,
          })
          .then((response) => {
            if (response.status === 200) {
              let retio = {
                from_email: response.data.data.from.email_address,
                from_name: response.data.data.from.sender_name,
                to_email: response.data.data.to[0].email_address,
                to_name: response.data.data.to[0].sender_name,
                subject: response.data.data.subject,
                time: response.data.data.send_at,
                content: data.data,
                mailbox_id: id,
              };
              //setChatContent();
              setChatContent(retio);
            }
          });
      }
      setNewMessage([...message]);
    });
    let mailboxId = id;
    let emailId = mailboxIdTemp;
    let accountId = session;
    socket.emit("panel_get_active_conversation", {
      roomId,
      channelId,
      session,
      accountId,
      from,
      mailboxId,
      emailId,
    });
  };

  const sendMessage = (message, oldMessage) => {
    if (mychannelId == 3) {
      axios
        .post(
          `${BASE_URL}/api/conversation-management/social-media/whatsapp/sendText`,
          {
            message: message,
            source: session,
            from: from,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            socket.emit("whatsapp_set_message", {
              session,
              from,
              type: "T",
              message,
              sender: 1, //op
              session,
              from,
            });
          }
        });
    } else if (mychannelId == 2) {
      axios
        .post(`${BASE_URL}/api/integrations/facebook-server/send-message`, {
          message: message,
          log_id: logId,
        })
        .then((res) => {
          if (res.status === 200) {
            let newMessageGive;
            newMessageGive = {
              createdAt: "",
              message: message,
              senderId: 0,
              messageId: "",
              senderName: "",
              type: "T",
            };
            setNewMessage((newMessage) => [...newMessage, newMessageGive]);

            $("#havij").animate(
              {
                scrollTop: $("#havij").prop("scrollHeight"),
                //scrollTop: div.scrollHeight - div.clientHeight + 260
              },
              500
            );

            socket.emit("facebook_set_message", {
              accountId: session,
              from: from,
              type: "T",
              message,
              sender: 1, //op
            });
          }
        });
    } else {
      socket.emit("liveChat_set_message", {
        roomId: myRoomId,
        type: "T",
        message,
        sender: 1, //op
      });
      let newMessageGive;
      newMessageGive = {
        createdAt: "",
        message: message,
        senderId: 1,
        messageId: "",
        senderName: "",
        type: "T",
      };
      setNewMessage((newMessage) => [...newMessage, newMessageGive]);

      $("#havij").animate(
        {
          scrollTop: $("#havij").prop("scrollHeight"),
          //scrollTop: div.scrollHeight - div.clientHeight + 260
        },
        500
      );
    }
  };

  const fileUpload = (myfile) => {
    const roomId = myRoomId;
    const channelId = mychannelId;
    const files = myfile;
    for (let i = 0; i < files.length; i++) {
      let xhr = new XMLHttpRequest();
      xhr.onload = function (e) {
        if (this.readyState === 4) {
        }
      };
      let fd = new FormData();
      let ex = files[i].name.split(".");
      ex = ex[ex.length - 1];
      ex = ex.toLowerCase();
      fd.append("file[]", files[i]);
      fd.append("type", 2);
      fd.append("company_id", 1);
      fd.append("channel_id", 1);
      fd.append("description", `${channelId}:${roomId}:file`);
      xhr.onload = function () {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.response).data[0];

          let types = {
            I: ["png", "jpg", "jpeg", "gif", "svg", "tif"],
            A: ["mp3", "mpeg", "wav", "webm"],
            V: ["mp4", "flv", "mov", "wmv"],
            D: [
              "docx",
              "csv",
              "pdf",
              "xls",
              "xlsx",
              "txt",
              "rtf",
              "ppt",
              "pptx",
              "odt",
              "tiff",
            ],
            F: ["rar", "tar", "avi"],
          };

          let type = "X";

          if (types.I.findIndex((x) => x == ex) > -1) type = "I";
          else if (types.A.findIndex((x) => x == ex) > -1) type = "A";
          else if (types.V.findIndex((x) => x == ex) > -1) type = "V";
          else if (types.D.findIndex((x) => x == ex) > -1) type = "D";
          else if (types.F.findIndex((x) => x == ex) > -1) type = "F";

          if (
            activeConversation.channelId == channelId &&
            activeConversation.roomId == roomId
          ) {
          }
          if (mychannelId == 3) {
            socket.emit("whatsapp_set_message", {
              type: type,
              url: data.access_url,
              message: data.name,
              sender: 1, // top
              session: session,
              from: from,
            });
          } else {
            socket.emit("liveChat_set_message", {
              roomId,
              type: type,
              url: data.access_url,
              message: data.name,
              sender: 1, //op
            });
          }
        }
      };
      xhr.open("POST", "https://app.spechy.com:8000/api/storage/upload", true);
      xhr.send(fd);
    }
  };

  const recordVoice = (recordData) => {
    const filename = new Date().toISOString();
    const roomId = myRoomId;
    const channelId = mychannelId;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    fd.append("file[]", new Blob([recordData]), filename + ".mp3");
    fd.append("type", 2);
    fd.append("company_id", 1);
    fd.append("channel_id", 1);
    fd.append("description", `${channelId}:${roomId}:audio`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.response).data[0];
        if (
          activeConversation.channelId == channelId &&
          activeConversation.roomId == roomId
        ) {
        }
        if (mychannelId == 3) {
          socket.emit("whatsapp_set_message", {
            session: session,
            from: from,
            type: "A",
            url: data.access_url,
            message: data.name,
            sender: 1, //op
          });
        } else {
          socket.emit("liveChat_set_message", {
            roomId,
            type: "A",
            url: data.access_url,
            message: data.name,
            sender: 1, //op
          });
        }
      }
    };
    xhr.open("POST", "https://app.spechy.com:8000/api/storage/upload", true);
    xhr.send(fd);
  };

  useEffect(() => {
    socket.on("liveChat_preview_new_message", (data) => {
      let newMessageGive;
      if (data.type === "T") {
        newMessageGive = {
          createdAt: data.createdAt,
          message: data.message,
          senderId: data.sender,
          messageId: data.messageId,
          senderName: data.senderName,
          type: "T",
        };
      } else if (data.type === "I") {
        newMessageGive = {
          createdAt: data.createdAt,
          message: data.message,
          senderId: data.sender,
          messageId: data.messageId,
          senderName: data.senderName,
          type: "I",
          url: "https://app.spechy.com:8000" + data.url,
        };
      } else if (data.type === "A") {
        newMessageGive = {
          createdAt: data.createdAt,
          message: data.message,
          senderId: data.sender,
          messageId: data.messageId,
          senderName: data.senderName,
          type: "A",
          url: "https://app.spechy.com:8000" + data.url,
        };
      } else if (data.type === "V") {
        newMessageGive = {
          createdAt: data.createdAt,
          message: data.message,
          senderId: data.sender,
          messageId: data.messageId,
          senderName: data.senderName,
          type: "V",
          url: "https://app.spechy.com:8000" + data.url,
        };
      } else if (data.type === "D") {
        newMessageGive = {
          createdAt: data.createdAt,
          message: data.message,
          senderId: data.sender,
          messageId: data.messageId,
          senderName: data.senderName,
          type: "D",
          url: "https://app.spechy.com:8000" + data.url,
        };
      }
      setNewMessage((newMessage) => [...newMessage, newMessageGive]);
      $("#havij").animate(
        {
          scrollTop: $("#havij").prop("scrollHeight"),
          //scrollTop: div.scrollHeight - div.clientHeight + 260
        },
        500
      );
    });

    // socket.on("liveChat_preview_new_message", (data) => {
    //   socket.emit("panel_get_active_conversations");
    // });
  }, []);

  useEffect(() => {
    socket.on("panel_set_conversation_phone_close", (data) => {
      //phone call finish event
    });
    socket.on("panel_new_conversation", (data) => {
      if (data.message === undefined) {
        const latestMessage = [];
        latestMessage.push({
          createdAt: data.createdAt,
          phone: data.phone,
          senderId: data.customerId,
          messageId: data.roomId,
          senderName: data.name_surname,
        });
        setNewMessage(latestMessage);
      } else if (data.message.type === "T") {
        const latestMessage = [];
        latestMessage.push({
          createdAt: data.message.createdAt,
          message: data.message.message,
          senderId: data.message.sender,
          messageId: data.message.messageId,
          senderName: data.message.senderName,
          type: "T",
        });
        setNewMessage(latestMessage);
      }

      let chatf = [];
      socket.emit("panel_get_active_conversation", activeConversation);
      // if (data.channelId == 8) {
      // }
    });
  }, []);

  useEffect(() => {
    //socket bağlandığında mevcut oda var ise bağlan
    if (activeConversation.channelId !== 0) {
      // getAtiveConversation(activeConversation);
    }
    //soldaki aktif görüşmeleri getir
    // ActiveCoversations();
    socket.emit("panel_get_active_conversations");
    //--------------

    //--------------
    socket.on("panel_set_active_conversations", (data) => {
      let chatf = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].channelId == 6) {
          let from = "";
          let session = "";
          if (data[i].channelId == 6) {
            from = data[i].from;
            session = data[i].session;
            setFromId(from);
            setSessionId(session);
          }
          let date = new Date(data[i].createdAt);

          chatf.push({
            about: "new",
            avatar: "https://app.spechy.com:8000/" + data[i].profile_image,
            chat: {
              id: data[i].logId,
              type: data[i].channelId,
              lastMessage: {
                message: data[i].session,
                time: date.toLocaleTimeString(),
                senderId: data[i].phone,
              },
              unseenMsgs: "",
            },
            fullName: data[i].name_surname,
            //id: data[i].roomId,
            role: "Widget Chat",
            status: "online",
            channelId: data[i].channelId,
            customerId: data[i].customerId,
            logId: data[i].logId,
            roomId: data[i].roomId,
            time: date.toLocaleTimeString(),
            from: from,
            session: session,
            mailboxId: "",
            number: data[i].phone,
          });

          setPhoneNumber(data[i].phone);
        }
        if (data[i].channelId == 3) {
          let from = "";
          let session = "";
          if (data[i].channelId == 3) {
            from = data[i].from;
            session = data[i].session;
            setFromId(from);
            setSessionId(session);
          }
          let date = new Date(data[i].message.createdAt);
          chatf.push({
            about: "new",
            avatar: "https://app.spechy.com:8000/" + data[i].profile_image,
            chat: {
              id: data[i].message.messageId,
              type: data[i].message.type,
              lastMessage: {
                message: data[i].message.message,
                time: date.toLocaleTimeString(),
                senderId: data[i].message.sender,
              },
              unseenMsgs: data[i].isNotReadCount,
            },
            fullName: data[i].name_surname,
            id: data[i].roomId,
            role: "Widget Chat",
            status: "online",
            channelId: data[i].channelId,
            customerId: data[i].customerId,
            logId: data[i].logId,
            roomId: data[i].roomId,
            time: date.toLocaleTimeString(),
            from: from,
            session: session,
            mailboxId: "",
          });
        } else if (data[i].channelId == 8) {
          let from = "";
          let session = "";
          if (data[i].channelId == 8) {
            from = data[i].from;
            session = data[i].session;
            setFromId(from);
            setSessionId(session);
          }
          let date = new Date(data[i].createdAt);
          chatf.push({
            about: "new",
            avatar: "https://app.spechy.com:8000/" + data[i].profile_image,
            fullName: data[i].name_surname,
            id: data[i].mailboxId,
            role: "Widget Chat",
            status: "online",
            channelId: data[i].channelId,
            customerId: data[i].customerId,
            logId: data[i].logId,
            roomId: data[i].roomId,
            time: date.toLocaleTimeString(),
            from: from,
            session: session,
            mailboxId: data[i].emailId,
            chat: {
              id: data[i].mailboxId,
              type: "E",
              lastMessage: {
                message: data[i].subject,
                time: date.toLocaleTimeString(),
                senderId: data[i].name_surname,
              },
              unseenMsgs: data[i].isNotReadCount,
            },
          });
        } else if (data[i].channelId == 2) {
          let from = "";
          let session = "";
          if (data[i].channelId == 2) {
            from = data[i].from;
            session = data[i].accountId;
            setFromId(from);
            setSessionId(session);
          }
          let date = new Date(data[i].message.createdAt);
          chatf.push({
            about: "new",
            avatar: "https://app.spechy.com:8000/" + data[i].profile_image,
            chat: {
              id: data[i].message.messageId,
              type: data[i].message.type,
              lastMessage: {
                message: data[i].message.message,
                time: date.toLocaleTimeString(),
                senderId: 0,
              },
              unseenMsgs: data[i].isNotReadCount,
            },
            fullName: data[i].name_surname,
            id: data[i].roomId,
            role: "Widget Chat",
            status: "online",
            channelId: data[i].channelId,
            customerId: data[i].customerId,
            logId: data[i].logId,
            roomId: data[i].roomId,
            time: date.toLocaleTimeString(),
            from: from,
            session: session,
            mailboxId: "",
          });
        } else if (data[i].channelId == 1) {
          console.log("datasender", data);
          let from = "";
          let session = "";
          if (data[i].channelId == 1) {
            from = data[i].from;
            session = data[i].session;
            setFromId(from);
            setSessionId(session);
          }
          let date = new Date(data[i].createdAt);
          chatf.push({
            about: "new",
            avatar: "https://app.spechy.com:8000/" + data[i].profile_image,
            chat: {
              id: data[i].messageId,
              type: data[i].type,
              lastMessage: {
                message: data[i].message,
                time: date.toLocaleTimeString(),
                senderId: data[i].sender,
              },
              unseenMsgs: data[i].isNotReadCount,
            },
            fullName: data[i].name_surname,
            id: data[i].roomId,
            role: "Widget Chat",
            status: "online",
            channelId: data[i].channelId,
            customerId: data[i].customerId,
            logId: data[i].logId,
            roomId: data[i].roomId,
            time: date.toLocaleTimeString(),
            from: from,
            session: session,
            mailboxId: "",
          });
        }
      }

      setFormState({
        ...formState,
        chat: chatf,
      });
    });
    //--------------

    //-----------------
    socket.on("panel_remove_only_conversation", (data) => {});
    //----------------

    //----------------
    socket.on("panel_remove_conversation", (conversation) => {});
    //---------------
    socket.on("disconnect", () => {});
    //--------------
    socket.on("connect_error", (err) => {});
    //--------------
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //--------------
    socket.on("liveChat_get_message", (data) => {});
    //-----------
    socket.on("panel_remove_only_conversation", (data) => {
      socket.emit("panel_get_active_conversations");
    });
    //-----------

    //-----------
    socket.on("conversationStarter", (data) => {});

    //-----------
  }, [newMessage]);

  const rightBar = () => {
    axios
      .get(
        `${BASE_URL}/api/customer-management/customer/conversation/contact-card/${customerId}`
      )
      .then((response) => {
        if (response.data.data.emails.length > 0) {
          let email = response.data.data.emails[0];
          $(".email-sidebar").html(email.email_address);
        }

        $(".chat-user-name").html(response.data.data.name_surname);
        //$(".phone-sidebar").html(response.data.data.phones[0].phone_number);
        $("#userAvatar")
          .children("img")
          .attr(
            "src",
            "https://app.spechy.com:8000/" + response.data.data.profile_image
          );
      });
    $(".chat-app-window").animate({ width: "40%" }, { duration: 250 });
    $(".card-snippet").show();
  };
  const endChat = () => {
    socket.emit("panel_close_conversation", {
      roomId: myRoomId,
      channelId: mychannelId,
      session: session,
      accountId: session,
      from: from,
      emailId: null,
      mailboxId: null,
    });
  };

  const openContactOn = async (e) => {
    e.preventDefault();
    await childCompRef.current.getContactCardData();
  };
  const openContactOf = async (e, data) => {
    e.preventDefault();
    await childCompRef.current.getContactCardData();
  };
  const closeConsole = async (e, data) => {
    await childCompRef.current.getContactCardData();
    await childCompRef.current.onSubmit();
    e.preventDefault();
  };

  const close = async (e, data) => {
    await childCompRef.current.onSubmit();
    e.preventDefault();
  };
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.chat);
  // ** States
  const [user, setUser] = useState({});
  const [sidebar, setSidebar] = useState(false);
  const [userSidebarRight, setUserSidebarRight] = useState(false);
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => {
    //console.log('calling sidebar')
  };

  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);
  //console.log(handleUserSidebarLeft)
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight);
  const handleOverlayClick = () => {
    setSidebar(false);
    setUserSidebarRight(false);
    setUserSidebarLeft(false);
  };
  //console.log(formState.chat)
  // ** Set user function for Right Sidebar
  const handleUser = (obj) => setUser(obj);
  const handleClickUser = function () {
    //console.log('hello keyvan');
  };
  // ** Get data on Mount
  useEffect(() => {
    dispatch(getChatContacts());
    dispatch(getUserProfile());
  }, [dispatch]);
  return (
    <Fragment>
      <br />
      <br />

      <Sidebar
        store={store}
        sidebar={sidebar}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        handleUserSidebarLeft={handleUserSidebarLeft}
        handleClickUser={handleClickUser}
        chatList={formState.chat}
        chatMessage={chatMessage}
        customer_id={customerId}
        openContactOn={openContactOn}
        openContactOf={openContactOf}
      />

      <div className="content-right">
        <div className="content-wrapper">
          <div className="content-body">
            <div
              className={classnames("body-content-overlay", {
                show:
                  userSidebarRight == true ||
                  sidebar == true ||
                  userSidebarLeft == true,
              })}
              onClick={handleOverlayClick}
            ></div>

            <Chat
              store={store}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
              message={newMessage}
              sending={sendMessage}
              fileUpload={fileUpload}
              recordVoice={recordVoice}
              fullName={fullName}
              avatarIcon={avatar}
              rightBar={rightBar}
              chatBarWidth={chatBarWidth}
              close={close}
              closeConsole={closeConsole}
              mailContent={chatContent}
              channelId={mychannelId}
              selectedReasonCode={selectedReasonCode}
            />

            <Card title="" className="information-chat">
              <PillsBasic
                className="tab-chat"
                customer_id={customerId}
                channel_id={mychannelId}
                log_id={logId}
                close={close}
                closeConsole={closeConsole}
                endChat={endChat}
                ref={childCompRef}
                dataOfReason={dataOfReason}
              />
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AppChat;
