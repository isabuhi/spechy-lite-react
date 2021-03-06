// ** React Imports
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { isUserLoggedIn } from "@utils";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { handleLogout } from "@store/actions/auth";

// ** Third Party Components
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
  LogOut,
} from "react-feather";
import { socket } from "../../../../socket";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import useJwt from "@src/auth/jwt/useJwt";
import jwt_decode from "jwt-decode";
import { useHistory, useLocation } from "react-router-dom";

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  const [userData, setUserData] = useState(null);

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);

  const LogOut = () => {
    dispatch(handleLogout());
    window.location.href = "/login";
  };

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;
  const decodedToken = jwt_decode(useJwt.getToken());

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name font-weight-bold">{decodedToken.ns}</span>
          <span className="user-status">
            {(userData && userData.role) || "Spechy User"}
          </span>
        </div>
        <Avatar
          img={userAvatar}
          imgHeight="40"
          imgWidth="40"
          status={socket.connected === true ? "online" : "offline"}
        />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to="/pages/profile">
          <User size={14} className="mr-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/apps/email">
          <Mail size={14} className="mr-75" />
          <span className="align-middle">Inbox</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/conversations">
          <MessageSquare size={14} className="mr-75" />
          <span className="align-middle">Chats</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/pages/account-settings">
          <Settings size={14} className="mr-75" />
          <span className="align-middle">Settings</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/pages/faq">
          <HelpCircle size={14} className="mr-75" />
          <span className="align-middle">FAQ</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/login" onClick={() => LogOut()}>
          <Power size={14} className="mr-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
