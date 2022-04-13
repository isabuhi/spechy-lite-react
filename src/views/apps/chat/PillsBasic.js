import {
  Fragment,
  useEffect,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import classnames from "classnames";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Collapse,
  InputGroup,
  Input,
  InputGroupText,
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
import PerfectScrollbar from "react-perfect-scrollbar";

import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "../../customerManagement/store/Actions";
import { useForm, Controller } from "react-hook-form";
import { Slide, toast } from "react-toastify";
import { Lock, Edit, Trash2, Coffee, AlertCircle } from "react-feather";

import AddNote from "./addNote";
import AddTicket from "./addTicket";

const PillBasic = forwardRef((props, ref) => {
  const {
    customer_id,
    log_id,
    channel_id,
    close,
    endChat,
    childFunc,
    dataOfReason,
  } = props;

  const dispatch = useDispatch();

  const store = useSelector((state) => state.customers);

  const [basicModal, setBasicModal] = useState(false);

  const [active, setActive] = useState("1");
  const [pinState, setPinState] = useState("alert");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    name_surname: "",
    created_at: "",
    data: [],
    user_name_surname: "",
    start_at: "",
    status: 0,
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

  // const [email_address, setEmailAddress] = useState(null);
  const [name_surname, setCustomerName] = useState("");
  const [phone_number, setPhoneNumber] = useState([{}]);
  const [email_address, setEmailAddress] = useState([{}]);

  // const [phone_number, setPhoneNumber] = useState(null);

  const [address_detail, setAddressDetail] = useState([]);

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

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

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

  const onChangePhoneHandler = (e) => {
    setPhoneNumber({
      ...phone_number,

      [e]: e,
    });
  };

  const inputChangeHandler = (e, type) => {
    current.name_surname = { ...current.name_surname, [type]: e.target.value };

    if (current.timer) clearTimeout(current.timer);

    current.timer = setTimeout(() => {
      current.timer = null;
      setCustomerName(current.name_surname);
    }, 1000);
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
          const emailTOSet = response.data.data.emails.map((x) => {
            return x.email_address;
          });
          // const phoneTOSet = response.data.data.phones.map((x) => {
          //   return x.phone_number;
          // });
          setEmailAddress(emailTOSet);
          if (response.data.data.phones.length > 0) {
            const pickedPhone = response.data.data.phones.map((x) => {
              return x.phone_number;
            });
            // setPhoneNumber(pickedPhone);
            setValueOfPhone(pickedPhone[0]);
          }
          // setPhoneNumber(phoneTOSet);

          setAddressDetail(response.data.data.profile.address_detail);
          setCustomerName(response.data.data.profile.name_surname);
        }
      });
  };

  // useImperativeHandle(ref, () => ({
  //   async getConsoleLog() {
  //     await console.log("fuckingwork");
  //   },
  // }));
  useImperativeHandle(
    ref,
    () => ({
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

              setAddressDetail(response.data.data.profile.address_detail);
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
            phone_number: valueOfPhone == [] ? valueOfPhone : [""],
            email_address: email_address == [] ? email_address : [""],

            // customer_company_id: formState.customer_company_id,
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
              phone_number: valueOfPhone == [] ? valueOfPhone : [""],
              email_address: email_address == [] ? email_address : [""],
              log_id: log_id,
              channel_id: channel_id,
              reason_codes: dataOfReason > 0 ? [dataOfReason] : [],
              // customer_company_id: formState.customer_company_id,
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

  // const onSubmit = async () => {

  //   await axios
  //     .all([requestOne, requestTwo], {
  //       name_surname: formState.name_surname,
  //       customer_id: formState.customer_id,
  //       country: formState.country,
  //       city: formState.city,
  //       phone_number: phone_number,
  //       email_address: email_address,
  //       // customer_company_id: formState.customer_company_id,
  //     })
  //     .then(
  //       axios.spread((...responses) => {
  //         const responseOne = responses[0];
  //         const responseTwo = responses[1];
  //         if (responses.status === 200) {
  //           toast.success(
  //             <ToastContent
  //               type={"success"}
  //               content={"You have successfully update a company."}
  //               header={"Congratulations !!"}
  //             />,
  //             { transition: Slide, hideProgressBar: true, autoClose: 3000 }
  //           );
  //           history.goBack();
  //         }
  //       })
  //     )
  //     .catch(() =>
  //       toast.error(
  //         <ToastContent
  //           type={"error"}
  //           content={"Something went wrong. Please try again!"}
  //           header={"Error !!"}
  //         />,
  //         { transition: Slide, hideProgressBar: true, autoClose: 3000 }
  //       )
  //     );
  // };
  const onChanceHandler = (e) => {
    setCustomerName(e.target.value);
    // setFormState({
    //   ...phone_number,
    //   [e.target.name]: e.target.value,
    // });
  };

  const handlePhoneChange = (e, index) => {
    const value = e;
    const phoneList = [...phone_number];
    phoneList[index] = value;
    setPhoneNumber(phoneList);
  };

  const handleEmailChange = (e, i) => {
    const value = e.target.value;

    const emailList = [...email_address];

    emailList[i] = value;

    setEmailAddress(emailList[i]);
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
    setEmailAddress([...email_address, { email_address: "" }]);
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
        {/* <div className="header-profile-sidebar">
          <Avatar
            className="box-shadow-1 avatar-border"
            size="xl"
            status="online"
            img="/static/media/avatar-s-2.d21f2121.jpg"
            imgHeight="70"
            imgWidth="70"
            id="userAvatar"
          />
          <h4 className="chat-user-name">Metin Ageturk</h4>
          <span className="user-post email-sidebar">Big Bos</span> /{" "}
          <span className="user-post phone-sidebar">Big Bos</span>
        </div> */}
        <Nav pills>
          <NavItem>
            <NavLink
              active={active === "1"}
              onClick={() => {
                toggle("1"), getHistoryTableData();
              }}
            >
              History
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2"), getContactCardDatas();
              }}
            >
              Contact Card
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "3"}
              onClick={() => {
                toggle("3"), getTicketsTableData();
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
                toggle("5"), getNoteTableData();
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
            {/* <PerfectScrollbar className="customizer-content"> */}
            <Form onSubmit={useImperativeHandle}>
              <FormGroup>
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
                  // innerRef={register({ required: true })}
                  // invalid={errors.name_surname && true}
                />
                {/* {errors && errors.name_surname && (
                      <FormFeedback>{errors.name_surname.message}</FormFeedback>
                    )} */}
              </FormGroup>

              <FormGroup>
                {email_address.length > 0 ? (
                  <div className="box">
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    >
                      <Label for="email_address">
                        <FormattedMessage id="Email"></FormattedMessage>{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        // type="email_address"
                        // name="email_address"
                        // id="email_address"
                        value={email_address.toString()}
                        onChange={(e) => handleEmailChange(e, i)}
                        // innerRef={register({ required: true })}
                        // invalid={errors.email_address && true}
                      />
                      {/* {errors && errors.email_address && (
                    <FormFeedback>
                      {errors.email_address.message}
                    </FormFeedback>
                  )} */}
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    ></div>

                    <div style={{ paddingTop: "10px" }}>
                      {email_address.length !== 0 && (
                        <Button.Ripple
                          color="primary"
                          onClick={() => handleRemoveEmail(i)}
                        >
                          <FormattedMessage id="Remove"></FormattedMessage>
                        </Button.Ripple>
                      )}
                      {email_address.length - 1 === i && (
                        <Button.Ripple color="primary" onClick={handleAddEmail}>
                          <FormattedMessage id="Add"></FormattedMessage>
                        </Button.Ripple>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="box">
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    >
                      <Label for="email_address">
                        <FormattedMessage id="Email"></FormattedMessage>{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        // type="email_address"
                        // name="email_address"
                        // id="email_address"
                        // placeholder="john.doe@example.com"
                        onChange={(e) => handleEmailChange(e, i)}
                        // innerRef={register({ required: true })}
                        // invalid={errors.email_address && true}
                      />
                      {/* {errors && errors.email_address && (
                        <FormFeedback>
                          {errors.email_address.message}
                        </FormFeedback>
                      )} */}
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    ></div>

                    <div style={{ paddingTop: "10px" }}>
                      {email_address.length !== 0 && (
                        <Button.Ripple
                          color="primary"
                          onClick={() => handleRemoveEmail(i)}
                        >
                          <FormattedMessage id="Remove"></FormattedMessage>
                        </Button.Ripple>
                      )}
                      {email_address.length - 1 === i && (
                        <Button.Ripple color="primary" onClick={handleAddEmail}>
                          <FormattedMessage id="Add"></FormattedMessage>
                        </Button.Ripple>
                      )}
                    </div>
                  </div>
                )}
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

              <FormGroup>
                <Label for="role">
                  <FormattedMessage id="Country List"></FormattedMessage>
                </Label>
                <Select
                  isClearable={true}
                  name="countyID"
                  className="react-select"
                  classNamePrefix="select"
                  options={listItems}
                  defaultValue={formState.countryCode}
                  // placeholder={formState.countryCode}
                  onChange={(e) => onChangeCountry(e)}
                  // innerRef={register({ required: true })}
                  // invalid={errors.countryCode && true}
                />
                {/* {errors && errors.countryCode && (
                      <FormFeedback>{errors.countryCode.message}</FormFeedback>
                    )} */}
              </FormGroup>

              <FormGroup>
                <Label for="role">
                  <FormattedMessage id="City List"></FormattedMessage>
                </Label>
                <Select
                  isClearable={true}
                  name="cityID"
                  className="react-select"
                  classNamePrefix="select"
                  options={formState.cities}
                  defaultValue={formState.districtCode}
                  // placeholder={formState.cityCode}
                  onChange={(e) => onChangeCities(e)}
                  // innerRef={register({ required: true })}
                  // invalid={errors.cityCode && true}
                />
                {/* {errors && errors.cityCode && (
                      <FormFeedback>{errors.cityCode.message}</FormFeedback>
                    )} */}
              </FormGroup>

              <FormGroup>
                <Label for="role">
                  <FormattedMessage id="Districts List"></FormattedMessage>
                </Label>
                <Select
                  isClearable={true}
                  name="cityID"
                  className="react-select"
                  classNamePrefix="select"
                  // placeholder={formState.districtCode}
                  options={formState.distirct}
                  defaultValue={formState.districtCode}
                  onChange={(data) =>
                    setFormState({
                      ...formState,
                      districtCode: data.id,
                    })
                  }
                  // innerRef={register({ required: true })}
                  // invalid={errors.districtCode && true}
                />
                {/* {errors && errors.districtCode && (
                      <FormFeedback>{errors.districtCode.message}</FormFeedback>
                    )} */}
              </FormGroup>

              {/* <Button.Ripple
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
                color="primary"
                onClick={() => toggle("1")}
              >
                <FormattedMessage id="Save Changes"></FormattedMessage>
              </Button.Ripple> */}
            </Form>

            {/* <Collapse isOpen={isOpen}>
              <InputGroup className="mb-2">
                <InputGroupText>@</InputGroupText>
                <Input
                  type="email"
                  id="email"
                  defaultValue={email_address}
                  disabled
                  name="email"
                  // onChange={onChanceHandler}
                />
              </InputGroup>

              <Input
                type="text"
                id="phone"
                defaultValue={phone_number}
                name="phone"
              />
            </Collapse> */}

            <Collapse isOpen={isOpenAddress}>
              <div className="d-flex p-1 ">
                <Input
                  autoFocus
                  type="textarea"
                  name="templateName"
                  id="templateName"
                  placeholder="Write the Template Name..."
                  // className={classnames({
                  //   "is-invalid": errors["template-name"],
                  // })}
                  // defaultValue={formState.templateName}
                  // onChange={(e) =>
                  //   setFormState({
                  //     ...formState,
                  //     [e.target.name]: e.target.value,
                  //   })
                  // }
                  // innerRef={register({ required: true })}
                  // invalid={errors.templateName && true}
                />
              </div>
            </Collapse>
          </TabPane>
          <TabPane tabId="3">
            <Card>
              <Button.Ripple
                color="primary"
                onClick={() => setCenteredModal(!centeredModal)}
              >
                Add New Ticket
              </Button.Ripple>
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
                <AddTicket />
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
              <Button.Ripple
                color="primary"
                onClick={() => setBasicModal(!basicModal)}
              >
                Add New Note
              </Button.Ripple>
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
