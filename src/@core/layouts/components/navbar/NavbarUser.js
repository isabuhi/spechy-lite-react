// ** Dropdowns Imports
import IntlDropdown from "./IntlDropdown";
import CartDropdown from "./CartDropdown";
import UserDropdown from "./UserDropdown";
import NavbarSearch from "./NavbarSearch";
import NotificationDropdown from "./NotificationDropdown";
import { Button, Form, Input, Row, Label, FormGroup } from "reactstrap";
import Select from "react-select";
import io from "socket.io-client";
import { Fragment, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import useJwt from "@src/auth/jwt/useJwt";
// import {Menu} from "../../../../token"
import { socket } from "../../../../socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faCheckDouble,
  faPhoneAlt,
  faBan,
  faPhoneSlash,
  faBowlFood,
  faHandshake,
  faUser,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

{
  /*             
  //     <FontAwesomeIcon icon="fa-solid fa-coffee-pot" />
  //     <FontAwesomeIcon icon="fa-solid fa-check-double" />
  //     <FontAwesomeIcon icon="fa-solid fa-phone-arrow-up-right" />
  // <FontAwesomeIcon icon="fa-solid fa-ban" />

  // <FontAwesomeIcon icon="fa-solid fa-phone-slash" />
  // <FontAwesomeIcon icon="fa-solid fa-pot-food" />
  // <FontAwesomeIcon icon="fa-regular fa-handshake" />
  // <FontAwesomeIcon icon="fa-solid fa-user-robot-xmarks" />
  // <FontAwesomeIcon icon="fa-regular fa-chart-mixed" /> */
}

// ** Third Party Components
import { Sun, Moon } from "react-feather";
import { NavItem, NavLink } from "reactstrap";

const NavbarUser = (props) => {
  const havij = props.param;
  const decodedToken = jwt_decode(useJwt.getToken());
  //console.log(decodedToken)
  const call = [
    {
      val: 1,
      label: "Available",
    },
    {
      val: 0,
      label: "Busy",
    },
  ];

  const [statusList, setStatusList] = useState([]);
  const [active, setActive] = useState("");
  const [socketProble, setSocketProblem] = useState("0");
  const [value, setValue] = useState(0);
  const userStatus = JSON.parse(localStorage.getItem("userStatus"));
  useEffect(() => {
    if (socketProble == 0) {
      let status = [];
      for (let i = 0; i < userStatus.length; i++) {
        status.push({
          value: userStatus[i].statu_id,
          label: userStatus[i].name,
        });
        if (userStatus[i].statu_id === decodedToken.usid) {
          setActive(userStatus[i].name);
          setValue(userStatus[i].statu_id);
        }
      }
      setStatusList(status);
      setSocketProblem(1);
    }
  }, [socketProble]);
  // ** Props
  const { skin, setSkin } = props;

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />;
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />;
    }
  };

  const onChangeStatus = (e) => {
    setActive(e.label);
    setValue(e.value);
    socket.emit("set_change_statu", {
      statu_id: e.value,
    });
    // Menu(e)
  };

  return (
    <ul className="nav navbar-nav align-items-center ml-auto">
      <IntlDropdown />
      <NavItem className="d-none d-lg-block">
        <NavLink className="nav-link-style">
          <ThemeToggler />
        </NavLink>
      </NavItem>
      <NavbarSearch />
      <CartDropdown />
      <NotificationDropdown />
      <li>
        <Form>
          <FormGroup
            style={{
              width: "100px",
              paddingTop: "15px",
              marginRight: "10px",
              float: "left",
              marginLeft: "10px",
            }}
          >
            <Select
              name="source_id"
              className="react-select"
              classNamePrefix="select"
              // value={{ label: active, value: value }}
              options={statusList}
              onChange={(e) => onChangeStatus(e)}
              style={{ width: "150px" }}
              getOptionLabel={(e) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FontAwesomeIcon
                    icon={
                      e.value === 1
                        ? faCheckDouble
                        : e.value === 2
                        ? faPhoneAlt
                        : e.value === 3
                        ? faBan
                        : e.value === 4
                        ? faPhoneSlash
                        : e.value === 5
                        ? faBowlFood
                        : e.value === 6
                        ? faHandshake
                        : e.value === 7
                        ? faUser
                        : e.value === 8
                        ? faChartBar
                        : e.value === 9
                        ? faCoffee
                        : ""
                    }
                  />
                  {/* <span style={{ marginLeft: 5 }}>{e.label}</span> */}
                </div>
              )}
            />
          </FormGroup>
        </Form>
      </li>
      <UserDropdown />
    </ul>
  );
};
export default NavbarUser;
