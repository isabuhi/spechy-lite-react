import {
  Fragment,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import classnames from "classnames";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Collapse,
  Input,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import * as Icons from "react-feather";
import Avatar from "@components/avatar";
import $, { data } from "jquery";
import axios from "axios";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { noteColumns } from "./noteColumns";
import { historyColumns } from "./historyColumns";
import { ticketsColumns } from "./ticketsColumns";
import { FormattedMessage } from "react-intl";
import Select from "react-select";

import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "../../customerManagement/store/Actions";
import { Slide, toast } from "react-toastify";
import { Coffee, AlertCircle, Plus, X } from "react-feather";

import AddNote from "./addNote";
import AddTicket from "./addTicket";

const PillBasic = forwardRef((props, ref) => {
  const { customer_id, log_id, channel_id, endChat, dataOfReason } = props;

  const dispatch = useDispatch();

  const store = useSelector((state) => state.customers);

  const [basicModal, setBasicModal] = useState(false);

  const [active, setActive] = useState("1");
  const [pinState, setPinState] = useState("alert");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    // name_surname: "",
    created_at: "",
    data: [],
    user_name_surname: "",
    start_at: "",
    status: 0,
    country: "",
    city: "",
    district: "",
    allCities: [{}],
    AllCountries: [{}],
  });
  const [idOFCustomer, setIdOfCustomer] = useState(customer_id);
  useEffect(() => {
    setIdOfCustomer(customer_id);
  }, [customer_id]);

  // const { current } = useRef({ name_surname, timer: null });s

  const [ticketsFormState, setTicketsFormState] = useState({
    ticketsData: [],
    start_at: "",
    status: 0,
  });

  const [name_surname, setCustomerName] = useState("");
  const [phone_number, setPhoneNumber] = useState([{}]);
  const [email_address, setEmailAddress] = useState([{ email: "" }]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [isOpenTickets, setIsOpenTickets] = useState(false);
  const [valueOfPhone, setValueOfPhone] = useState(null);

  const toggleContact = () => setIsOpen(!isOpen);
  const toggleAddress = () => setIsOpenAddress(!isOpenAddress);
  const toggleTickets = () => setIsOpenTickets(!isOpenTickets);
  const [centeredModal, setCenteredModal] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    dispatch(getCountries());
  }, []);

  const toggle = (tab) => {
    setActive(tab);
  };
  const closeSideBar = () => {
    $(".card-snippet").hide();
    $(".chat-app-window").animate({ width: "100%" }, { duration: 250 });
  };
  const toggleSidebarChat = () => {
    let sidebarStatus = localStorage.getItem("sideBarStatus");
    if (sidebarStatus == 1) {
      localStorage.setItem("sideBarStatus", 0);
      setPinState("alert");
    } else {
      localStorage.setItem("sideBarStatus", 1);
      setPinState("success");
    }
  };

  const getNoteTableData = () => {
    axios
      .post(`${BASE_URL}/api/customer-management/customer/conversation/notes`, {
        customer_id: customer_id,

        limit: 10,
        offset: 1,
      })
      .then((res) => {
        if (res.status === 200) {
          setFormState(res.data.data.history);
        }
      });
  };

  const getTicketsTableData = () => {
    axios
      .post(
        `${BASE_URL}/api/customer-management/customer/conversation/tickets`,
        {
          customer_id: customer_id,

          limit: 10,
          offset: 1,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTicketsFormState(res.data.data);
        }
      });
  };

  const getHistoryTableData = () => {
    axios
      .post(
        `${BASE_URL}/api/customer-management/customer/conversation/history`,
        {
          customer_id: customer_id,

          limit: 10,
          offset: 1,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setFormState(res.data.data.history);
        }
      });
  };

  const dataToRender = () => {
    if (formState.data == undefined) {
      return [];
    } else if (formState.data.length > 0) {
      return formState.data;
    } else if (formState.data.length === 0) {
      return [];
    } else {
      return formState.data.slice(0, rowsPerPage);
    }
  };

  const ticketsDataToRender = () => {
    if (ticketsFormState.length > 0) {
      return ticketsFormState;
    } else if (ticketsFormState.length === 0) {
      return [];
    } else {
      return [];
    }
  };

  const myComponent = {
    height: "100%",

    overflowY: "scroll",
  };

  const options = store.filterItems ? store.filterItems : null;

  if (options != null) {
    var listItems = [{}];

    for (var i = 0; i < options.length; i++) {
      listItems[i] = {
        val: options[i].country_id,
        label: options[i].country_name,
      };
    }
  }
  const onChangeCountry = async (id) => {
    // if (id != null) {
    await axios
      .get(
        `${BASE_URL}/api/project-management/address-management/country/get-all-cities/${id.val}`
      )
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data);
          var cityItemss = [{}];
          for (var j = 0; j < result.length; j++) {
            cityItemss[j] = {
              val: result[j].city_id,
              label: result[j].city_name,
            };
          }
          setFormState({
            ...formState,
            allCities: cityItemss,
            country: id.val,
          });
        }
      })
      .catch(() => console.log("error"));
    // }
  };

  const onChangeCities = async (id) => {
    // if (id != null) {
    await axios
      .get(
        `${BASE_URL}/api/project-management/address-management/country/get-all-districts/${formState.country}/${id.val}`
      )
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data);
          var distirctItems = [{}];
          for (var j = 0; j < result.length; j++) {
            distirctItems[j] = {
              val: result[j].district_id,
              label: result[j].district_name,
            };
          }
          setFormState({
            ...formState,
            district: distirctItems,
            city: id.val,
          });
        }
      })
      .catch(() => console.log("error"));
    // }
  };

  const ToastContent = ({ header, content, type }) => {
    return (
      <Fragment>
        <div className="toastify-header">
          <div className="title-wrapper">
            {type === "success" ? (
              <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
            ) : (
              <Avatar
                size="sm"
                color="danger"
                icon={<AlertCircle size={12} />}
              />
            )}
            <h6 className="toast-title font-weight-bold">{header}</h6>
          </div>
        </div>
        <div className="toastify-body">
          <span>{content}</span>
        </div>
      </Fragment>
    );
  };

  const getContactCardDatas = () => {
    axios
      .get(
        `${BASE_URL}/api/customer-management/customer/conversation/contact-card/${idOFCustomer}`
      )
      .then((response) => {
        if (response.status === 200) {
          console.log("dis", response);
          const emailTOSet = response.data.data.emails.map((x) => {
            return x.email_address;
          });

          setEmailAddress(emailTOSet);
          if (response.data.data.phones.length > 0) {
            const pickedPhone = response.data.data.phones.map((x) => {
              return x.phone_number;
            });
            setValueOfPhone(pickedPhone[0]);
          }

          // setAddressDetail(response.data.data.profile.address_detail);
          setCustomerName(response.data.data.profile.name_surname);
          setFormState({
            ...formState,
            country:
              response.data.data.profile.country === null
                ? ""
                : response.data.data.profile.country.country_name,
            city:
              response.data.data.profile.city === null
                ? ""
                : response.data.data.profile.city.city_name,
            // district: response.data.data.profile.district.district_name,
          });
        }
      });
  };

  useImperativeHandle(
    ref,
    () => ({
      async getHistoryTableDatas() {
        axios
          .post(
            `${BASE_URL}/api/customer-management/customer/conversation/history`,
            {
              customer_id: customer_id,

              limit: 10,
              offset: 1,
            }
          )
          .then((res) => {
            if (res.status === 200) {
              setFormState(res.data.data.history);
            }
          });
      },
      async getContactCardData() {
        await axios
          .get(
            `${BASE_URL}/api/customer-management/customer/conversation/contact-card/${idOFCustomer}`
          )
          .then((response) => {
            if (response.status === 200) {
              const emailTOSet = response.data.data.emails.map((x) => {
                return x.email_address;
              });

              setEmailAddress(emailTOSet);
              if (response.data.data.phones.length > 0) {
                const pickedPhone = response.data.data.phones.map((x) => {
                  return x.phone_number;
                });

                setValueOfPhone(pickedPhone[0]);
              }

              setCustomerName(response.data.data.profile.name_surname);
            }
          });
      },
      async onSubmit() {
        await axios.post(
          `${BASE_URL}/api/customer-management/customer/update-customer/${customer_id}`,
          {
            name_surname: name_surname,
            customer_id: formState.customer_id,
            country: formState.country,
            city: formState.city,
            district: formState.district,
            phone_number: valueOfPhone == null ? [""] : [valueOfPhone],
            email_address: email_address == null ? [""] : email_address,
          }
        );
        await axios
          .post(
            `${BASE_URL}/api/customer-management/customer/conversation/close-conversation-card`,
            {
              name_surname: name_surname,
              customer_id: formState.customer_id,
              country: formState.country,
              city: formState.city,
              district: formState.district,
              phone_number: valueOfPhone == null ? [""] : [valueOfPhone],
              email_address: email_address == null ? [""] : email_address,
              log_id: log_id,
              channel_id: channel_id,
              reason_codes: dataOfReason > 0 ? [dataOfReason] : [],
            }
          )
          .then((response) => {
            if (response.status === 200) {
              endChat();
              toast.success(
                <ToastContent
                  type={"success"}
                  content={"You have successfully update a company."}
                  header={"Congratulations !!"}
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
              );
              // history.goBack();
            }
          })
          .catch(() =>
            toast.error(
              <ToastContent
                type={"error"}
                content={"Something went wrong. Please try again!"}
                header={"Error !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
          );
      },
    }),
    [customer_id, getContactCardDatas]
  );

  const onChanceHandler = (e) => {
    setCustomerName(e.target.value);
  };

  const handlePhoneChange = (e, index) => {
    const value = e;
    const phoneList = [...phone_number];
    phoneList[index] = value;
    setPhoneNumber(phoneList);
  };

  const handleEmailChange = (e, i) => {
    const { name, value } = e.target;

    const emailList = [...email_address];

    emailList[i] = value;

    setEmailAddress(emailList);
  };

  // handle click event of the Remove button
  const handleRemovePhone = (index) => {
    const phoneList = [...phone_number];
    phoneList.splice(index, 1);
    setPhoneNumber(phoneList);
  };

  const handleRemoveEmail = (index) => {
    const emailList = [...email_address];
    emailList.splice(index, 1);
    setEmailAddress(emailList);
  };
  const handleAddPhone = () => {
    setPhoneNumber([...phone_number, { phone_number: "" }]);
  };

  const handleAddEmail = () => {
    setEmailAddress([...email_address, { email: "" }]);
  };

  return (
    <Fragment>
      <div style={myComponent}>
        <div className="nav-chat-header-right">
          <Avatar
            size="sm"
            className="cursor-pointer mr-1"
            icon={<Icons.ChevronsLeft size={12} />}
            onClick={closeSideBar}
          />
          <Avatar
            size="sm"
            className="cursor-pointer mr-1"
            color={pinState}
            icon={<Icons.Flag size={12} />}
            onClick={toggleSidebarChat}
          />
        </div>

        <Nav pills>
          <NavItem>
            <NavLink
              active={active === "1"}
              onClick={() => {
                toggle("1");
                getHistoryTableData();
              }}
            >
              History
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
                getContactCardDatas();
              }}
            >
              Contact Card
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "3"}
              onClick={() => {
                toggle("3");
                getTicketsTableData();
              }}
            >
              Tickets
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "4"}
              onClick={() => {
                toggle("4");
              }}
            >
              Tasks
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "5"}
              onClick={() => {
                toggle("5");
                getNoteTableData();
              }}
            >
              Notes
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="py-50" activeTab={active}>
          <TabPane tabId="1">
            <Card>
              <DataTable
                noHeader
                responsive
                paginationServer
                columns={historyColumns}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                data={dataToRender()}
              />
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Form onSubmit={useImperativeHandle}>
              <FormGroup
                style={{
                  width: "300px",
                }}
              >
                <Label for="name_surname">
                  <FormattedMessage id="Customer Name"></FormattedMessage>
                </Label>
                <Input
                  type="text"
                  id="name_surname"
                  placeholder="Jhon Doe"
                  defaultValue={name_surname}
                  name="name_surname"
                  onChange={(e) => onChanceHandler(e)}
                />
              </FormGroup>

              <FormGroup>
                {email_address.length === 0 ? (
                  <div className="box" style={{ marginBottom: "10px" }}>
                    <input
                      style={{
                        width: "300px",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                      name="email Address"
                      placeholder="Enter Email"
                      // value={x}
                      onChange={(e) => handleEmailChange(e, i)}
                    />

                    <div
                      className="btn-box"
                      style={{
                        marginLeft: "10px",
                        width: "50px",
                        display: "inline-block",
                        outline: "none",
                      }}
                    >
                      {email_address.length - 1 === i && (
                        <X onClick={() => handleRemoveEmail(i)}></X>
                        // <Button.Ripple
                        //   color="danger"
                        //   onClick={() => handleRemoveEmail(i)}
                        //   style={{ margin: "1px" }}
                        // >
                        //   X
                        // </Button.Ripple>
                      )}
                      {email_address.length !== 1 && (
                        <Plus onClick={handleAddEmail}></Plus>
                        // <Button.Ripple
                        //   color="primary"
                        //   onClick={handleAddEmail}
                        //   style={{ margin: "1px", maxHeight: "34px" }}
                        // >
                        //   +
                        // </Button.Ripple>
                      )}
                    </div>
                  </div>
                ) : (
                  email_address.map((x, i) => {
                    return (
                      <div className="box" style={{ marginBottom: "10px" }}>
                        <input
                          style={{
                            width: "300px",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                          name="email Address"
                          placeholder="Enter Email"
                          value={x}
                          onChange={(e) => handleEmailChange(e, i)}
                        />

                        <div
                          className="btn-box"
                          style={{
                            marginLeft: "10px",
                            width: "50px",
                            display: "inline-block",
                          }}
                        >
                          {email_address.length !== 1 && (
                            <X onClick={() => handleRemoveEmail(i)}></X>
                          )}
                          {email_address.length - 1 === i && (
                            <Plus onClick={handleAddEmail}></Plus>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                {}
              </FormGroup>

              <FormGroup>
                {phone_number.map((x, i) => {
                  return (
                    <div className="box">
                      <div
                        style={{
                          display: "inline-block",
                        }}
                      >
                        <PhoneInput
                          value={valueOfPhone}
                          country={"tr"}
                          name="phone_number"
                          containerStyle={{ marginTop: "15px" }}
                          searchClass="search-class"
                          searchStyle={{
                            margin: "0",
                            width: "97%",
                            height: "30px",
                          }}
                          enableSearchField
                          disableSearchIcon
                          onChange={(e) => handlePhoneChange(e, i)}
                        />
                      </div>
                      <div
                        style={{
                          display: "inline-block",
                        }}
                      ></div>

                      <div style={{ paddingTop: "10px" }}>
                        {phone_number.length !== 1 && (
                          <Button.Ripple
                            color="primary"
                            onClick={() => handleRemovePhone(i)}
                          >
                            <FormattedMessage id="Remove"></FormattedMessage>
                          </Button.Ripple>
                        )}
                        {phone_number.length - 1 === i && (
                          <Button.Ripple
                            color="primary"
                            onClick={handleAddPhone}
                          >
                            <FormattedMessage id="Add"></FormattedMessage>
                          </Button.Ripple>
                        )}
                      </div>
                    </div>
                  );
                })}
              </FormGroup>

              <FormGroup
                style={{
                  width: "300px",
                }}
              >
                <Label for="role">
                  <FormattedMessage id="Country List"></FormattedMessage>
                </Label>
                <Select
                  name="countyID"
                  className="react-select"
                  classNamePrefix="select"
                  options={listItems}
                  placeholder={formState.country}
                  defaultValue={formState.countryCode}
                  onChange={(e) => onChangeCountry(e)}
                />
              </FormGroup>

              <FormGroup
                style={{
                  width: "300px",
                }}
              >
                <Label for="role">
                  <FormattedMessage id="City List"></FormattedMessage>
                </Label>
                <Select
                  name="cityID"
                  className="react-select"
                  classNamePrefix="select"
                  options={formState.allCities}
                  placeholder={formState.city}
                  defaultValue={formState.allCities}
                  onChange={(e) => onChangeCities(e)}
                />
              </FormGroup>

              <FormGroup
                style={{
                  width: "300px",
                }}
              >
                <Label for="role">
                  <FormattedMessage id="Districts List"></FormattedMessage>
                </Label>
                <Select
                  name="cityID"
                  className="react-select"
                  classNamePrefix="select"
                  options={formState.district}
                  placeholder={
                    formState.district ? formState.district.district_name : "--"
                  }
                  defaultValue={formState.district}
                  onChange={(data) =>
                    setFormState({
                      ...formState,
                      district: data.id,
                    })
                  }
                />
              </FormGroup>
            </Form>

            <Collapse isOpen={isOpenAddress}>
              <div className="d-flex p-1 ">
                <Input
                  autoFocus
                  type="textarea"
                  name="templateName"
                  id="templateName"
                  placeholder="Write the Template Name..."
                />
              </div>
            </Collapse>
          </TabPane>
          <TabPane tabId="3">
            <Card>
              <div className="col-12 row" style={{ paddingBottom: "10px" }}>
                <div className="col-4"></div>
                <div className="col-4">
                  <Button.Ripple
                    color="primary"
                    onClick={() => setCenteredModal(!centeredModal)}
                  >
                    Add Ticket
                  </Button.Ripple>
                </div>
                <div className="col-4"></div>
              </div>
              <DataTable
                noHeader
                responsive
                paginationServer
                columns={ticketsColumns}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                data={ticketsDataToRender()}
              />
            </Card>

            <Modal
              size="lg"
              isOpen={centeredModal}
              toggle={() => setCenteredModal(!centeredModal)}
            >
              <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
                Ticket Name
              </ModalHeader>
              <ModalBody>
                <AddTicket
                  customer_id={customer_id}
                  setCenteredModal={setCenteredModal}
                />
              </ModalBody>
            </Modal>
          </TabPane>
          <TabPane tabId="4">
            <p>
              Chocolate croissant cupcake croissant jelly donut. Cheesecake
              toffee apple pie chocolate bar biscuit tart croissant. Lemon drops
              danish cookie. Oat cake macaroon icing tart lollipop cookie sweet
              bear claw. Toffee jelly-o pastry cake dessert chocolate bar jelly
              beans fruitcake. Dragée sweet fruitcake dragée biscuit halvah
              wafer gingerbread dessert. Gummies fruitcake brownie gummies tart
              pudding.
            </p>
          </TabPane>
          <TabPane tabId="5">
            <Card>
              <div className="col-12 row">
                <div className="col-4"></div>
                <div className="col-4">
                  <Button.Ripple
                    color="primary"
                    onClick={() => setBasicModal(!basicModal)}
                    size="md"
                  >
                    Add Note
                  </Button.Ripple>
                </div>
                <div className="col-4"></div>
              </div>
              <DataTable
                noHeader
                responsive
                paginationServer
                columns={noteColumns}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                data={dataToRender()}
              />
            </Card>
            <Modal
              style={{ minWidth: "900px" }}
              isOpen={basicModal}
              toggle={() => setBasicModal(!basicModal)}
            >
              <ModalHeader toggle={() => setBasicModal(!basicModal)}>
                Note Name
              </ModalHeader>
              <ModalBody>
                <AddNote
                  style={{ minWidth: "900px" }}
                  customer_id={customer_id}
                  channel_id={log_id}
                  log_id={channel_id}
                />
              </ModalBody>
            </Modal>
          </TabPane>
        </TabContent>
      </div>
    </Fragment>
  );
});
export default PillBasic;
