// ** React Imports
import { useEffect, useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { selectChat } from "./store/actions";

// ** Utils
import { formatDateToMonthShort } from "@utils";

// ** Third Party Components
import classnames from "classnames";
import io from "socket.io-client";
import jwt_decode from "jwt-decode";
import useJwt from "@src/auth/jwt/useJwt";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  X,
  Search,
  CheckSquare,
  Bell,
  User,
  Trash,
  Facebook,
  MessageSquare,
  Phone,
  Mail,
} from "react-feather";
import {
  CardText,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Badge,
  CustomInput,
  Button,
} from "reactstrap";
import axios from "axios";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";

import imgf from "../../../../src/assets/images/icons/1260673.png";
import imge from "../../../../src/assets/images/icons/e-mail-icon-11.jpg";
import imgl from "../../../../src/assets/images/icons/live-chat-icon.png";
import imgw from "../../../../src/assets/images/icons/WhatsApp.svg.png";

const SidebarLeft = (props) => {
  // ** Props & Store
  const {
    store,
    sidebar,
    handleSidebar,
    userSidebarLeft,
    handleUserSidebarLeft,
    chatList,
    chatMessage,
    customer_id,
    openContactOn,
    openContactOf,
    childFunc,
  } = props;

  const { chats, contacts, userProfile } = store;

  // ** Dispatch
  const dispatch = useDispatch();
  // ** State
  const [about, setAbout] = useState("");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState({});
  const [status, setStatus] = useState("online");
  const [filteredChat, setFilteredChat] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [checkOnec, setCheckOnce] = useState(1);

  // ** Handles User Chat Click
  const handleUserClick = (
    type,
    id,
    channelId,
    customerId,
    roomId,
    name,
    avatar,
    logId,
    mailboxId
  ) => {
    chatMessage(
      id,
      channelId,
      customerId,
      roomId,
      name,
      avatar,
      logId,
      mailboxId
    );

    dispatch(selectChat(2));
    setActive({ type, id });
    if (sidebar === true) {
      handleSidebar();
    }
  };
  const fuc = async (e) => {
    await openContactOn(e);
    await openContactOf(e);
  };

  // ** Renders Chat
  const renderChats = () => {
    if (chatList && chatList.length) {
      if (chatList.length == 0) {
        return (
          <li className="no-results show">
            <h6 className="mb-0">No Chats Found</h6>
          </li>
        );
      } else {
        const arrToMap =
          query.length && filteredChat.length ? filteredChat : chatList;

        return arrToMap.map((item) => {
          if (item.chat != null) {
            return (
              <li
                className={classnames({
                  active: active.type === "chat" && active.id === item.id,
                })}
                key={item.id}
                onClick={(e) => {
                  handleUserClick(
                    "chat",
                    item.id,
                    item.channelId,
                    item.customerId,
                    item.roomId,
                    item.fullName,
                    item.avatar,
                    item.logId,
                    item.mailboxId
                  );
                    // openContactOn(e)
                    fuc(e);
                }}
              >
                <Avatar
                  img={item.avatar}
                  // img={
                  //   item.channelId === 2
                  //     ? imgf
                  //     : item.channelId === 3
                  //     ? imgw
                  //     : item.channelId === 1
                  //     ? imgl
                  //     : item.channelId === 8
                  //     ? imge
                  //     : item.avatar
                  // }
                  imgHeight="42"
                  imgWidth="42"
                  status={item.status}
                />

                <div className="chat-info flex-grow-1">
                  <h5 className="mb-0">{item.fullName}</h5>
                  {item.channelId == 6 ? (
                    <CardText>{item.number}</CardText>
                  ) : item.channelId == 5 ? (
                    console.log("first")
                  ) : item.chat.lastMessage ? (
                    <CardText>
                      {item.chat.lastMessage.message.message === undefined
                        ? item.chat.lastMessage.message
                        : item.chat.lastMessage.message.message}
                    </CardText>
                  ) : (
                    <CardText>{chats[chats.length - 1].message}</CardText>
                  )}
                </div>

                {/* <div className="chat-info flex-grow-1">
                  <h5 className="mb-0">{item.fullName}</h5>
                  {item.chat.lastMessage ? (
                    <CardText>
                      {item.chat.lastMessage.message.message === undefined
                        ? item.chat.lastMessage.message
                        : item.chat.lastMessage.message.message}
                    </CardText>
                  ) : (
                    <CardText>{chats[chats.length - 1].message}</CardText>
                  )}
                </div> */}

                <div className="chat-meta text-nowrap">
                  <small className="float-right mb-25 chat-time ml-25">
                    {item.time}
                  </small>
                  {item.channelId === 2 ? (
                    <Facebook color="blue" className="float-right" />
                  ) : item.channelId === 3 ? (
                    <MessageSquare color="#495057" className="float-right" />
                  ) : item.channelId === 1 ? (
                    <MessageSquare color="#495057" className="float-right" />
                  ) : item.channelId === 8 ? (
                    <Mail />
                  ) : (
                    item.avatar
                  )}

                  {item.chat.unseenMsgs >= 1 ? (
                    <Badge className="float-right " color="danger" pill>
                      {item.chat.unseenMsgs}
                    </Badge>
                  ) : null}
                </div>
              </li>
            );
          }
        });
      }
    } else {
      return null;
    }
  };
  // ** Renders Contact
  const renderContacts = () => {
    if (contacts && contacts.length) {
      if (query.length && !filteredContacts.length) {
        return (
          <li className="no-results show">
            <h6 className="mb-0">No Chats Found</h6>
          </li>
        );
      } else {
        const arrToMap =
          query.length && filteredContacts.length ? filteredContacts : contacts;
        return arrToMap.map((item) => {});
      }
    } else {
      return null;
    }
  };

  // ** Handles Filter
  const handleFilter = (e) => {
    setQuery(e.target.value);
    const searchFilterFunction = (contact) =>
      contact.fullName.toLowerCase().includes(e.target.value.toLowerCase());
    const filteredChatsArr = chats.filter(searchFilterFunction);
    const filteredContactssArr = contacts.filter(searchFilterFunction);
    setFilteredChat([...filteredChatsArr]);
    setFilteredContacts([...filteredContactssArr]);
  };
  return store ? (
    <div className="sidebar-left">
      <div className="sidebar">
        <div
          className={classnames("chat-profile-sidebar", {
            show: userSidebarLeft,
          })}
        >
          <header className="chat-profile-header">
            <div className="close-icon" onClick={handleUserSidebarLeft}>
              <X size={14} />
            </div>
            <div className="header-profile-sidebar">
              <Avatar className="box-shadow-1 avatar-border" size="xl" />
              <h4 className="chat-user-name"></h4>
              <span className="user-post"></span>
            </div>
          </header>
          <PerfectScrollbar
            className="profile-sidebar-area"
            options={{ wheelPropagation: false }}
          >
            <h6 className="section-label mb-1">About</h6>
            <div className="about-user">
              <Input
                rows="5"
                type="textarea"
                onChange={(e) => setAbout(e.target.value)}
                className={classnames("char-textarea", {
                  "text-danger": about && about.length > 120,
                })}
              />
              <small className="counter-value float-right">
                <span className="char-count"></span>/ 120
              </small>
            </div>
            <h6 className="section-label mb-1 mt-3">Status</h6>
            <ul className="list-unstyled user-status">
              <li className="pb-1">
                <CustomInput
                  type="radio"
                  className="custom-control-primary"
                  id="online"
                  label="Online"
                  onChange={(e) => setStatus("online")}
                  checked={status === "online"}
                />
              </li>
              <li className="pb-1">
                <CustomInput
                  type="radio"
                  className="custom-control-danger"
                  id="busy"
                  label="Do Not Disturb"
                  onChange={(e) => setStatus("busy")}
                  checked={status === "busy"}
                />
              </li>
              <li className="pb-1">
                <CustomInput
                  type="radio"
                  className="custom-control-warning"
                  id="away"
                  label="Away"
                  onChange={(e) => setStatus("away")}
                  checked={status === "away"}
                />
              </li>
              <li className="pb-1">
                <CustomInput
                  type="radio"
                  className="custom-control-secondary"
                  id="offline"
                  label="Offline"
                  onChange={(e) => setStatus("offline")}
                  checked={status === "offline"}
                />
              </li>
            </ul>
            <h6 className="section-label mb-1 mt-2">Settings</h6>
            <ul className="list-unstyled">
              <li className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center">
                  <CheckSquare className="mr-75" size="18" />
                  <span className="align-middle">Two-step Verification</span>
                </div>
                <CustomInput
                  type="switch"
                  id="verification"
                  name="verification"
                  label=""
                  defaultChecked
                />
              </li>
              <li className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center">
                  <Bell className="mr-75" size="18" />
                  <span className="align-middle">Notification</span>
                </div>
                <CustomInput
                  type="switch"
                  id="notifications"
                  name="notifications"
                  label=""
                />
              </li>
              <li className="d-flex align-items-center cursor-pointer mb-1">
                <User className="mr-75" size="18" />
                <span className="align-middle">Invite Friends</span>
              </li>
              <li className="d-flex align-items-center cursor-pointer">
                <Trash className="mr-75" size="18" />
                <span className="align-middle">Delete Account</span>
              </li>
            </ul>
            <div className="mt-3">
              <Button color="primary">Logout</Button>
            </div>
          </PerfectScrollbar>
        </div>
        <div
          className={classnames("sidebar-content", {
            show: sidebar === true,
          })}
        >
          <div className="sidebar-close-icon" onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
              <div className="sidebar-profile-toggle"></div>
              <InputGroup className="input-group-merge ml-1 w-100 sreach-chat">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="round">
                    <Search className="text-muted" size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  value={query}
                  className="round"
                  placeholder="Search"
                  onChange={handleFilter}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar
            className="chat-user-list-wrapper list-group"
            options={{ wheelPropagation: false }}
          >
            <h4 className="chat-list-title">Conversations</h4>
            <ul
              className="chat-users-list chat-list media-list"
              style={{ height: "100%" }}
            >
              {renderChats()}
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  ) : null;
};

export default SidebarLeft;
