// ** React Imports
import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  Fragment,
} from "react";
import ReactDOM from "react-dom";

// ** Custom Components
import Avatar from "@components/avatar";
import $ from "jquery";
import { FormattedMessage } from "react-intl";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { sendMsg } from "./store/actions";
import AddTicket from "./addTicket";
import AddReason from "./addReason/index";

// ** Third Party Components
import classnames from "classnames";
import jwt_decode from "jwt-decode";
import useJwt from "@src/auth/jwt/useJwt";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  MessageSquare,
  Menu,
  PhoneCall,
  Video,
  Search,
  MoreVertical,
  Mic,
  Image,
  Send,
  CornerUpLeft,
  CornerUpRight,
  AlertCircle,
  ArrowLeftCircle,
  Coffee,
  UserPlus,
  Trash2,
  XCircle,
} from "react-feather";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Label,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button,
  Card,
  CardHeader,
  Table,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Tooltip,
} from "reactstrap";
import { ReactMic } from "react-mic";
import ScrollToBottom, {
  useScrollToBottom,
  useSticky,
} from "react-scroll-to-bottom";
import axios from "axios";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { Slide, toast } from "react-toastify";
// import { socket } from "../../../socket/index";

const ChatLog = (props) => {
  const {
    handleUser,
    handleUserSidebarRight,
    handleSidebar,
    store,
    userSidebarLeft,
    message,
    sending,
    fileUpload,
    recordVoice,
    fullName,
    avatarIcon,
    rightBar,
    close,
    closeConsole,
    mailContent,
    channelId,
    selectedReasonCode,
    roomId,
    startConference,
    jitsiContainer,
  } = props;
  // ** State
  const [record, setRecord] = useState(false);
  const [mic, setMic] = useState("#82868b");
  const scrollToBottom1 = useScrollToBottom();
  const [sticky] = useSticky();
  const [centeredModal, setCenteredModal] = useState(false);
  const [centeredModal2, setCenteredModal2] = useState(false);
  const [openSide, setOpenSide] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const childCompRef = useRef();
  const listReasonCode = [
    {
      value: 1,
      label: "User",
    },
    {
      value: 0,
      label: "Group",
    },
  ];

  const [reasonList, setReasonList] = useState([]);
  const [selectedReason, setSelectedReason] = useState([]);

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };
  const [msg, setMsg] = useState("");
  // ** Props & Store

  const { userProfile, selectedUser } = store;
  // ** Refs & Dispatch
  const chatArea = useRef(null);
  const dispatch = useDispatch();
  const decodedToken = jwt_decode(useJwt.getToken());

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current);
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
  };

  const containerStyle = {
    width: "800px",
    height: "400px",
  };

  const jitsiContainerStyle = {
    display: "block",
    width: "100%",
    height: "100%",
  };

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    scrollToBottom1();
    //const selectedUserLen = Object.entries(message).length
    //console.log(selectedUserLen)
    //if (selectedUserLen) {
    //  scrollToBottom()
    //}
  }, [selectedUser]);

  useEffect(async () => {
    await axios
      .get(
        `${BASE_URL}/api/project-management/reason-codes/conversation/get-all-reason-codes`
      )
      .then((response) => {
        if (response.status === 200) {
          let typeTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            typeTemp.push({
              value: result[i].reason_code_id,
              label: result[i].name,
            });
          }

          setReasonList(typeTemp);
        }
      });
    //-----------
  }, []);

  // const renderChats = () => {
  //   return (
  //     <div className="chat-body">
  //       <div style={containerStyle}>
  //         <div id={jitsiContainer} style={jitsiContainerStyle} />
  //       </div>
  //     </div>
  //   );
  // };

  // ** Renders user chat
  const renderChats = () => {
    scrollToBottom1();
    if (channelId == 5) {
      return (
        <div className="chat-body">
          <div style={containerStyle}>
            <div id={jitsiContainer} style={jitsiContainerStyle} />
          </div>
        </div>
      );
    }

    if (channelId !== 8) {
      if (channelId == 6) {
        <div>Phone Call</div>;
      } else {
        return message.map((item, index) => {
          if (item.type === "T") {
            return (
              <div
                key={index}
                className={classnames("chat", {
                  "chat-left": item.senderId !== 0,
                })}
              >
                <div className="chat-avatar">
                  <Avatar
                    className="box-shadow-1 cursor-pointer"
                    img={
                      item.senderId === 0
                        ? userProfile.avatar
                        : selectedUser.contact.avatar
                    }
                  />
                </div>

                <div className="chat-body">
                  <div key={item.messageId} className="chat-content">
                    <p>{item.message}</p>
                  </div>
                </div>
              </div>
            );
          } else if (item.type === "I") {
            return (
              <div
                key={index}
                className={classnames("chat", {
                  "chat-left": item.senderId !== 0,
                })}
              >
                <div className="chat-avatar">
                  <Avatar
                    className="box-shadow-1 cursor-pointer"
                    img={
                      item.senderId === 0
                        ? userProfile.avatar
                        : selectedUser.contact.avatar
                    }
                  />
                </div>

                <div className="chat-body">
                  <div key={item.messageId} className="chat-content">
                    <img src={item.url} width="100" height="100" />
                  </div>
                </div>
              </div>
            );
          } else if (item.type === "A") {
            return (
              <div
                key={index}
                className={classnames("chat", {
                  "chat-left": item.senderId !== 0,
                })}
              >
                <div className="chat-avatar">
                  <Avatar
                    className="box-shadow-1 cursor-pointer"
                    img={
                      item.senderId === 0
                        ? userProfile.avatar
                        : selectedUser.contact.avatar
                    }
                  />
                </div>

                <div className="chat-body">
                  <div key={item.messageId} className="chat-content">
                    <audio controls>
                      <source src={item.url} type="audio/webm" />
                    </audio>
                  </div>
                </div>
              </div>
            );
          } else if (item.type === "V") {
            return (
              <div
                key={index}
                className={classnames("chat", {
                  "chat-left": item.senderId !== 0,
                })}
              >
                <div className="chat-avatar">
                  <Avatar
                    className="box-shadow-1 cursor-pointer"
                    img={
                      item.senderId === 0
                        ? userProfile.avatar
                        : selectedUser.contact.avatar
                    }
                  />
                </div>

                <div className="chat-body">
                  <div key={item.messageId} className="chat-content">
                    <video height="300" width="300" controls>
                      <source src={item.url} type="video/mp4"></source>
                    </video>
                  </div>
                </div>
              </div>
            );
          } else if (item.type === "D") {
            return (
              <div
                key={index}
                className={classnames("chat", {
                  "chat-left": item.senderId !== 0,
                })}
              >
                <div className="chat-avatar">
                  <Avatar
                    className="box-shadow-1 cursor-pointer"
                    img={
                      item.senderId === 0
                        ? userProfile.avatar
                        : selectedUser.contact.avatar
                    }
                  />
                </div>

                <div className="chat-body">
                  <div
                    key={item.messageId}
                    className="chat-content bg-light-warning avatar"
                  >
                    <a href="{item.url}">Download Document</a>
                  </div>
                </div>
              </div>
            );
          }
        });
      }
    } else {
      return (
        <Card>
          <CardHeader className="email-detail-head">
            <div className="user-details d-flex justify-content-between align-items-center flex-wrap">
              <Avatar
                img={avatarIcon}
                className="mr-75"
                imgHeight="48"
                imgWidth="48"
              />
              <div className="mail-items">
                <h5 className="mb-0">{mailContent.from_name}</h5>
                <UncontrolledDropdown className="email-info-dropup">
                  <DropdownToggle
                    className="font-small-3 text-muted cursor-pointer"
                    tag="span"
                    caret
                  >
                    {mailContent.from_email}
                  </DropdownToggle>
                </UncontrolledDropdown>
                <DropdownMenu>
                  <Table className="font-small-3" size="sm" borderless>
                    <tbody>
                      <tr>
                        <td className="text-right text-muted align-top">
                          From:
                        </td>
                        <td>{mailContent.from_email}</td>
                      </tr>
                      <tr>
                        <td className="text-right text-muted align-top">To:</td>
                        <td>{mailContent.to_email}</td>
                      </tr>
                      <tr>
                        <td className="text-right text-muted align-top">
                          Date:
                        </td>
                        <td>{mailContent.time}</td>
                      </tr>
                    </tbody>
                  </Table>
                </DropdownMenu>
              </div>
            </div>
            <div className="mail-meta-item d-flex align-items-center">
              <small className="mail-date-time text-muted">
                {mailContent.time}
              </small>
            </div>
          </CardHeader>
          <CardBody className="mail-message-wrapper pt-2">
            <div
              className="mail-message"
              dangerouslySetInnerHTML={{ __html: mailContent.content }}
            ></div>
          </CardBody>
        </Card>
      );
    }
  };
  const sidebarFuction = () => {};
  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (obj) => {
    rightBar();
  };
  // const handleSelectedReason = (obj) => {

  // };

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (
      !Object.keys(selectedUser).length &&
      !userSidebarLeft &&
      window.innerWidth <= 1200
    ) {
      handleSidebar();
    }
  };

  // ** upload file
  const handleChangeFile = (event) => {
    let file = event.target.files;
    fileUpload(file);
  };
  // ** Sends New Msg
  const handleSendMsg = (e) => {
    e.preventDefault();
    if (msg.length) {
      sending(msg, message);
      setMsg("");
    }
  };

  const onData = (recordedBlob) => {};

  const onStop = (recordedBlob) => {
    recordVoice(recordedBlob);
  };

  const micController = () => {
    if (record == true) {
      setRecord(false);
      setMic("#82868b");
    } else {
      setRecord(true);
      setMic("red");
    }
  };
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [basicModal, setBasicModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [formState, setFormState] = useState({
    from: 0,
    subject: "",
    to: 0,
    cc: "",
    bcc: "",
    content: "",
    type: 0,
  });

  const openModal = (e, title, id) => {
    e.preventDefault();
    axios
      .get(
        `${BASE_URL}/api/mail-management/account/get-available-email-addresses`
      )
      .then((response) => {
        let data = response.data.data;
        let email = [];
        for (let i = 0; i < data.length; i++) {
          email.push({
            label: data[i].email_address,
            value: data[i].email_id,
          });
        }
        setEmailList(email);
        setModalTitle(title);
        setFormState({
          ...formState,
          type: id,
        });
        setBasicModal(!basicModal);
      });
  };

  const [value, setValue] = useState(EditorState.createEmpty());

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

  const handleSubmitModal = () => {
    if (formState.from !== 0) {
      if (formState.to !== 0) {
        let cc_data = [];
        let bcc_data = [];
        let to_data = [];
        cc_data[0] = formState.cc;
        bcc_data[0] = formState.bcc;
        to_data[0] = formState.to;
        axios
          .post(`${BASE_URL}/api/mail-management/mailbox/send-mail`, {
            email_id: formState.from,
            mailbox_id: mailContent.mailbox_id,
            type: formState.type,
            contents: value.getCurrentContent().getPlainText(),
            cc: cc_data,
            bcc: bcc_data,
            subject: mailContent.subject,
            to: to_data,
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success(
                <ToastContent
                  type={"success"}
                  content={"You have successfully added a Ticket Category."}
                  header={"Congratulations !!"}
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
              );
              setBasicModal(!basicModal);
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
      } else {
        toast.error(
          <ToastContent
            type={"error"}
            content={"To is Required!"}
            header={"Error !!"}
          />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        );
      }
    } else {
      toast.error(
        <ToastContent
          type={"error"}
          content={"From is Required!"}
          header={"Error !!"}
        />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      );
    }
  };

  const onChangeReasonCode = (e) => {
    setSelectedReason(e.value);
    selectedReasonCode(e.value);
  };

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper = "div";
  return (
    <div className="chat-app-window">
      <div
        className={classnames("start-chat-area", {
          "d-none": Object.keys(selectedUser).length,
        })}
      >
        <div className="start-chat-icon mb-1">
          <MessageSquare />
        </div>
        <h4
          className="sidebar-toggle start-chat-text"
          onClick={handleStartConversation}
        >
          Start Conversation
        </h4>
      </div>

      {Object.keys(selectedUser).length ? (
        <div
          className={classnames("active-chat", {
            "d-none": selectedUser === null,
          })}
        >
          <div className="chat-navbar">
            <header className="chat-header">
              <div className="d-flex align-items-center">
                <div
                  className="sidebar-toggle d-block d-lg-none mr-1"
                  onClick={sidebarFuction}
                >
                  <Menu size={21} />
                </div>
                <Avatar
                  imgHeight="36"
                  imgWidth="36"
                  img={avatarIcon}
                  status={selectedUser.contact.status}
                  className="avatar-border user-profile-toggle m-0 mr-1"
                  onClick={() => {
                    return (
                      handleAvatarClick(selectedUser.contact), setShow(true)
                    );
                  }}
                />
                <h6 className="mb-0">{fullName.slice(0, 6)}</h6>
              </div>
              <div className="d-flex align-items-center">
                {/* <div style={{ paddingRight: "10px" }}> */}
                {/* <div className="d-inline-block mr-2"> */}
                {/* <Button.Ripple
                  className="btn-icon mr-1"
                  color="primary"
                  onClick={() => setCenteredModal(!centeredModal)}
                >
                  Add Ticket
                </Button.Ripple> */}
                {/* </div> */}

                {/* <Button.Ripple
                  className="btn-icon mr-1"
                  color="primary"
                  onClick={() => setCenteredModal2(!centeredModal2)}
                >
                  Add Reason
                </Button.Ripple> */}
                {/* <FormGroup> */}
                <div style={{ width: "150px" }}>
                  <Select
                    isClearables
                    theme={selectThemeColors}
                    className="react-select mr-1"
                    classNamePrefix="select"
                    options={reasonList}
                    isClearable={false}
                    name="reason"
                    onChange={(e) => {
                      onChangeReasonCode(e);
                      // setSelectedReason(e.value),
                      //   selectedReasonCode(selectedReason);
                    }}
                  />
                </div>

                {/* {errors && errors.send_call_list && (
                    <div style={{ color: "red", marginTop: ".5rem" }}>
                      <p>{errors.send_call_list.message}</p>
                    </div>
                  )} */}
                {/* </FormGroup> */}

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
                      closeToggle={() => setCenteredModal(!centeredModal)}
                    />
                  </ModalBody>
                </Modal>
                <Modal
                  size="lg"
                  isOpen={centeredModal2}
                  toggle={() => setCenteredModal2(!centeredModal2)}
                >
                  <ModalHeader
                    toggle={() => setCenteredModal2(!centeredModal2)}
                  >
                    Reason Name
                  </ModalHeader>
                  <ModalBody>
                    <AddReason
                      closeToggle={() => setCenteredModal2(!centeredModal2)}
                    />
                  </ModalBody>
                </Modal>
                {}

                {show === true ? (
                  <XCircle
                    id="TooltipExample"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={(e) => {
                      close(e);
                    }}
                  />
                ) : (
                  <XCircle
                    id="TooltipExample"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={(e) => {
                      closeConsole(e);
                    }}
                  />
                )}

                <Tooltip
                  isOpen={tooltipOpen}
                  placement="right"
                  target="TooltipExample"
                  toggle={() => {
                    setTooltipOpen(!tooltipOpen);
                  }}
                >
                  Save And Close
                </Tooltip>

                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn-icon"
                    color="transparent"
                    size="sm"
                  >
                    <MoreVertical size="18" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                      View Contact
                    </DropdownItem>
                    {/* <DropdownItem href="/" onClick={(e) => close(e)}>
                      Close Chat
                    </DropdownItem> */}
                    <DropdownItem
                      onClick={() => setCenteredModal(!centeredModal)}
                    >
                      Add Ticket
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </header>
          </div>

          <ChatWrapper
            ref={chatArea}
            className="user-chats"
            options={{ wheelPropagation: false }}
            id="havij"
          >
            {message ? (
              <ScrollToBottom className="chats">{renderChats()}</ScrollToBottom>
            ) : null}
          </ChatWrapper>
          {(() => {
            if (channelId == 8) {
              return (
                <Row>
                  <Col sm="12">
                    <Card>
                      <CardBody>
                        <h5 className="mb-0">
                          Click here to{" "}
                          <a
                            href="/"
                            onClick={(e) => openModal(e, "Reply Message", 1)}
                          >
                            Reply
                          </a>{" "}
                          or{" "}
                          <a
                            href="/"
                            onClick={(e) =>
                              openModal(e, "Reply All Message", 2)
                            }
                          >
                            Reply All
                          </a>{" "}
                          or{" "}
                          <a
                            href="/"
                            onClick={(e) => openModal(e, "Froward Message", 3)}
                          >
                            Forward
                          </a>
                        </h5>
                      </CardBody>
                    </Card>
                  </Col>
                  <Modal
                    isOpen={basicModal}
                    toggle={() => setBasicModal(!basicModal)}
                  >
                    <ModalHeader toggle={() => setBasicModal(!basicModal)}>
                      {modalTitle}
                    </ModalHeader>
                    <ModalBody>
                      <Form className="mb-6 pb-5">
                        <FormGroup>
                          <Label for="from">
                            From : <span className="text-danger">*</span>
                          </Label>
                          <Select
                            theme={selectThemeColors}
                            className="react-select"
                            classNamePrefix="select"
                            options={emailList}
                            isClearable={false}
                            name="from"
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                from: e.value,
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="subject">
                            Subject : <span className="text-danger">*</span>
                          </Label>
                          <Input
                            autoFocus
                            name="subject"
                            id="subject"
                            value={mailContent.subject}
                            disable={true}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                subject: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="to">
                            To : <span className="text-danger">*</span>
                          </Label>
                          <Select
                            theme={selectThemeColors}
                            className="react-select"
                            classNamePrefix="select"
                            options={emailList}
                            isClearable={false}
                            name="to"
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                to: e.label,
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="cc_name">
                            CC : <span className="text-danger">*</span>
                          </Label>
                          <Input
                            autoFocus
                            name="cc_name"
                            id="cc_name"
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                cc_name: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="bcc_name">
                            BCC : <span className="text-danger">*</span>
                          </Label>
                          <Input
                            autoFocus
                            name="bcc_name"
                            id="bcc_name"
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                bcc_name: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="reasonName">
                            Content : <span className="text-danger">*</span>
                          </Label>
                          <Editor
                            editorState={value}
                            onEditorStateChange={(data) => setValue(data)}
                          />
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onClick={() => handleSubmitModal()}
                      >
                        Send Message
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Row>
              );
            } else if (channelId == 6) {
              return (
                <Row>
                  <Col sm="12">
                    <Card>
                      <CardBody>
                        <PhoneCall size={12} /> Phone Call
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              );
            } else {
              return (
                <Form
                  className="chat-app-form"
                  onSubmit={(e) => handleSendMsg(e)}
                >
                  <InputGroup className="input-group-merge mr-1 form-send-message">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <div className="d-none">
                          <ReactMic
                            record={record}
                            className="sound-wave"
                            onStop={onStop}
                            onData={onData}
                            strokeColor="#000000"
                            backgroundColor="#FF4081"
                            style={{ display: "none" }}
                          />
                        </div>
                        <Mic
                          className="cursor-pointer"
                          size={14}
                          onClick={micController}
                          style={{ color: mic }}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Type your message or use speech to text"
                    />
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <Label
                          className="attachment-icon mb-0"
                          for="attach-doc"
                        >
                          <Image
                            className="cursor-pointer text-secondary"
                            size={14}
                          />
                          <input
                            type="file"
                            id="attach-doc"
                            name="file"
                            hidden
                            onChange={handleChangeFile}
                            key={Date.now()}
                            multiple
                          />
                        </Label>
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <Button className="send" color="primary">
                    <Send size={14} className="d-lg-none" />
                    <span className="d-none d-lg-block">Send</span>
                  </Button>
                </Form>
              );
            }
          })()}
        </div>
      ) : null}
    </div>
  );
};

export default ChatLog;
