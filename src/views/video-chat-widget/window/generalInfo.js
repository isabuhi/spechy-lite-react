import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import {
  Lock,
  Edit,
  Trash2,
  Coffee,
  AlertCircle,
  Mic,
  Paperclip,
  Send,
  MessageCircle,
} from "react-feather";
import {
  Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  CustomInput,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Avatar from "../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { SketchPicker } from "react-color";
import axios from "axios";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";

const GeneralInfo = (props) => {
  const image2 =
    require("@src/assets/images/ico/style-chat-rotary.jpeg").default;
  const image1 =
    require("@src/assets/images/ico/style-chat-ascent.jpeg").default;
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState([]);
  const [title, setTitle] = useState([]);
  const [welcome, setWelcome] = useState([]);
  const [position, sePosition] = useState("");
  const [view, setViewData] = useState("");
  const [titleModal, setTitleModal] = useState("");
  const [colorFunc, setColorFunc] = useState(0);
  const [inModalColor, setInModalColor] = useState("");
  const [titleModalPerv, setTitleModalPerv] = useState("");
  const [title_send_var_s, setTitle_send_var] = useState([]);
  const [welcome_send_var_s, setWelcome_send_var] = useState([]);

  const { id } = useParams();

  const [formState, setFormState] = useState({
    position: null,
    request: 1,
    useEffectKey: 0,
    is_sss: false,
    name: null,
    max_queue_limit: null,
    status: false,
    width: 0,
    height: 0,
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });
  const [basicModal, setBasicModal] = useState(false);
  const [basicModalPrev, setBasicModalPerv] = useState(false);
  const [backgroundHex, setBackground] = useState("#8A2BE2");
  const [backgroundHexAgent, setBackgroundAgenet] = useState("#5F9EA0");
  const [backgroundHexStatus, setBackgroundStatus] = useState("#8B008B");
  const [backgroundHexBorder, setBackgroundBorder] = useState("#006400");
  const [backgroundHexVisitor, setBackgroundVisitor] = useState("#FF7F50");
  const [backgroundHexButton, setBackgroundButton] = useState("#483D8B");
  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(
        `${BASE_URL}/api/conversation-management/video-chat-widget/select/chat-window/${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          let lang = response.data.data.title.text;
          let message = response.data.data.welcome_message.text;
          setTitle_send_var(lang);
          setWelcome_send_var(message);
          let obj = Object.keys(lang);
          let obg = Object.keys(message);
          let text = [];
          let welcome = [];
          setTitleModalPerv(lang[obj[0]]);
          for (let i = 0; i < obj.length; i++) {
            text.push({
              lang: obj[i],
              value: lang[obj[i]],
            });
          }
          for (let i = 0; i < obg.length; i++) {
            welcome.push({
              lang: obg[i],
              value: message[obg[i]],
            });
          }
          setTitle(text);
          setWelcome(welcome);
          sePosition(response.data.data.position);
          setViewData(response.data.data.style);
          setFormState({
            ...formState,
            width: response.data.data.width,
            height: response.data.data.height,
          });
          setBackground(response.data.data.background_color);
          setBackgroundAgenet(response.data.data.agent_message_color);
          setBackgroundBorder(response.data.data.border_color);
          setBackgroundButton(response.data.data.send_button_color);
          setBackgroundStatus(response.data.data.status_color);
        }
      });
  }, []);

  const onChanceHandler = (e, lang) => {
    let title_send_var = {};
    for (let i = 0; i < title.length; i++) {
      if (title[i]["lang"] === lang) {
        title[i]["value"] = e.target.value;
      }
      //title_send_var[0] = title[i]['lang'];
      title_send_var[title[i]["lang"]] = title[i]["value"];
    }
    console.log(title_send_var);
    setTitle_send_var(title_send_var);
  };

  const onChanceHandlerMessage = (e, lang) => {
    let title_send_var = {};
    for (let i = 0; i < welcome.length; i++) {
      if (welcome[i]["lang"] === lang) {
        welcome[i]["value"] = e.target.value;
      }
      title_send_var[welcome[i]["lang"]] = welcome[i]["value"];
    }
    setWelcome_send_var(title_send_var);
  };

  const setPosition = (e) => {
    sePosition(e);
  };

  const setView = (e) => {
    setViewData(e);
  };

  const handleChangeComplete = (e) => {
    if (colorFunc == 1) {
      setBackground(e.hex);
    } else if (colorFunc == 2) {
      setBackgroundAgenet(e.hex);
    } else if (colorFunc == 3) {
      setBackgroundVisitor(e.hex);
    } else if (colorFunc == 4) {
      setBackgroundStatus(e.hex);
    } else if (colorFunc == 5) {
      setBackgroundButton(e.hex);
    } else if (colorFunc == 6) {
      setBackgroundBorder(e.hex);
    }
    setInModalColor(e.hex);
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

  const onSubmit = async () => {
    if (1) {
      console.log(title_send_var_s);
      await axios
        .post(
          `${BASE_URL}/api/conversation-management/video-chat-widget/edit/chat-window/${id}`,
          {
            title: title_send_var_s,
            style: view,
            width: formState.width,
            height: formState.height,
            position: position,
            background_color: backgroundHex,
            agent_message_color: backgroundHexAgent,
            visitor_message_color: backgroundHexVisitor,
            status_color: backgroundHexStatus,
            send_button_color: backgroundHexButton,
            border_color: backgroundHexBorder,
            welcome_message: welcome_send_var_s,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully update chat widget background."}
                header={"Congratulations !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            );
            history.goBack();
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
    }
  };

  const openModal = (title, setBackgroundArg, color) => {
    setTitleModal(title);
    setBasicModal(!basicModal);
    setColorFunc(setBackgroundArg);
    setInModalColor(color);
  };

  const onChanceHandlerSize = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 10, offset: 1 }}>
              <Row>
                <Col md={{ size: 6, offset: 0 }}>
                  {title.map(function (object, i) {
                    return (
                      <FormGroup>
                        <Label for="title">
                          Title[{object.lang}] :{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="title"
                          defaultValue={object.value}
                          name="title"
                          onChange={(e) => onChanceHandler(e, object.lang)}
                          innerRef={register({ required: true })}
                          invalid={errors.title && true}
                        />
                        {errors && errors.title && (
                          <FormFeedback>{errors.title.message}</FormFeedback>
                        )}
                      </FormGroup>
                    );
                  })}
                </Col>
                <Col md={{ size: 6, offset: 0 }}>
                  <FormGroup>
                    <Label for="width">
                      Width : <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="width"
                      defaultValue={formState.width}
                      name="width"
                      onChange={onChanceHandlerSize}
                      innerRef={register({ required: true })}
                      invalid={errors.width && true}
                    />
                    {errors && errors.width && (
                      <FormFeedback>{errors.width.message}</FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="height">
                      Height : <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="height"
                      defaultValue={formState.height}
                      name="height"
                      onChange={onChanceHandlerSize}
                      innerRef={register({ required: true })}
                      invalid={errors.height && true}
                    />
                    {errors && errors.height && (
                      <FormFeedback>{errors.height.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 6, offset: 0 }}>
                  {welcome.map(function (object, i) {
                    return (
                      <FormGroup>
                        <Label for="title">
                          Title[{object.lang}] :{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="title"
                          defaultValue={object.value}
                          name="title"
                          onChange={(e) =>
                            onChanceHandlerMessage(e, object.lang)
                          }
                          innerRef={register({ required: true })}
                          invalid={errors.title && true}
                        />
                        {errors && errors.title && (
                          <FormFeedback>{errors.title.message}</FormFeedback>
                        )}
                      </FormGroup>
                    );
                  })}
                </Col>
                <Col md={{ size: 6, offset: 0 }}>
                  <FormGroup>
                    <Label for="width">
                      Position : <span className="text-danger">*</span>
                    </Label>
                    {position == 1 ? (
                      <CustomInput
                        type="radio"
                        id="Popup"
                        defaultChecked
                        label="Popup"
                        name="pos"
                        onChange={(e) => setPosition(1)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="Popup"
                        label="Popup"
                        name="pos"
                        onChange={(e) => setPosition(1)}
                      />
                    )}
                    {position == 2 ? (
                      <CustomInput
                        type="radio"
                        id="Embeded"
                        defaultChecked
                        label="Embeded"
                        name="pos"
                        onChange={(e) => setPosition(2)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="Embeded"
                        label="Embeded"
                        name="pos"
                        onChange={(e) => setPosition(2)}
                      />
                    )}
                    {errors && errors.width && (
                      <FormFeedback>{errors.width.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 6, offset: 0 }}>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <FormGroup>
                        {view == 1 ? (
                          <CustomInput
                            type="radio"
                            id="ascent"
                            defaultChecked
                            label="Ascent"
                            name="view"
                            onChange={(e) => setView(1)}
                          />
                        ) : (
                          <CustomInput
                            type="radio"
                            id="ascent"
                            label="Ascent"
                            name="view"
                            onChange={(e) => setView(1)}
                          />
                        )}
                        {errors && errors.width && (
                          <FormFeedback>{errors.width.message}</FormFeedback>
                        )}
                        <br />
                        <img
                          className="avatar rounded"
                          src={image1}
                          width="95"
                          height="95"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <FormGroup>
                        {view == 2 ? (
                          <CustomInput
                            type="radio"
                            id="rotary"
                            defaultChecked
                            label="Rotary"
                            name="view"
                            onChange={(e) => setView(2)}
                          />
                        ) : (
                          <CustomInput
                            type="radio"
                            id="rotary"
                            label="Rotary"
                            name="view"
                            onChange={(e) => setView(2)}
                          />
                        )}
                        {errors && errors.width && (
                          <FormFeedback>{errors.width.message}</FormFeedback>
                        )}
                        <br />
                        <img
                          className="avatar rounded"
                          src={image2}
                          width="95"
                          height="95"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md={{ size: 6, offset: 0 }}>
                  <FormGroup>
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Background
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: backgroundHex }}
                          onClick={() =>
                            openModal("Background Color", 1, backgroundHex)
                          }
                        ></label>
                        <Modal
                          isOpen={basicModal}
                          toggle={() => setBasicModal(!basicModal)}
                        >
                          <ModalHeader
                            toggle={() => setBasicModal(!basicModal)}
                          >
                            {titleModal}
                          </ModalHeader>
                          <ModalBody>
                            <SketchPicker
                              color={inModalColor}
                              onChangeComplete={handleChangeComplete}
                            />
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="primary"
                              onClick={() => setBasicModal(!basicModal)}
                            >
                              Accept & Set
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Agent Message
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: backgroundHexAgent }}
                          onClick={() =>
                            openModal(
                              "Agent Message Color",
                              2,
                              backgroundHexAgent
                            )
                          }
                        ></label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Visitor Message
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: backgroundHexVisitor }}
                          onClick={() =>
                            openModal(
                              "Visitor Message Color",
                              3,
                              backgroundHexVisitor
                            )
                          }
                        ></label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Status
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: backgroundHexStatus }}
                          onClick={() =>
                            openModal("Status Color", 4, backgroundHexStatus)
                          }
                        ></label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Send Button
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: backgroundHexButton }}
                          onClick={() =>
                            openModal(
                              "Send Button Color",
                              5,
                              backgroundHexButton
                            )
                          }
                        ></label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Text Color
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: backgroundHexBorder }}
                          onClick={() =>
                            openModal("Border Color", 6, backgroundHexBorder)
                          }
                        ></label>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col md={{ size: 10, offset: 1 }}>
              <br />
              <br />
              <Button.Ripple
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
                color="primary"
              >
                Save Changes
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                color="secondary"
                outline
              >
                Cancel
              </Button.Ripple>
              <Button.Ripple
                onClick={() => setBasicModalPerv(!basicModalPrev)}
                className="btn btn-outline-success waves-effect"
                outline
              >
                Preview
              </Button.Ripple>
              <Modal
                isOpen={basicModalPrev}
                toggle={() => setBasicModalPerv(!basicModalPrev)}
              >
                <ModalHeader toggle={() => setBasicModalPerv(!basicModalPrev)}>
                  Chat Preview
                </ModalHeader>
                <ModalBody>
                  {view == 1 ? (
                    <div className="chatContainer">
                      <div
                        className="chatHeader"
                        style={{ backgroundColor: backgroundHex }}
                      >
                        <p style={{ color: backgroundHexStatus }}>
                          {titleModalPerv}
                        </p>
                      </div>
                      <div className="chatBody">
                        <ul class="chat-list" id="scrollchat">
                          <li class="in">
                            <div class="chat-img">
                              <img
                                alt="Avtar"
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                              />
                            </div>
                            <div class="chat-body">
                              <div
                                class="chat-message"
                                style={{
                                  backgroundColor: backgroundHexVisitor,
                                }}
                              >
                                <h5>Jimmy Willams</h5>
                                <p>
                                  Raw denim heard of them tofu master cleanse
                                </p>
                              </div>
                            </div>
                          </li>
                          <li class="out">
                            <div class="chat-img">
                              <img
                                alt="Avtar"
                                src="https://bootdey.com/img/Content/avatar/avatar6.png"
                              />
                            </div>
                            <div class="chat-body">
                              <div
                                class="chat-message"
                                style={{ backgroundColor: backgroundHexAgent }}
                              >
                                <h5>Serena</h5>
                                <p>Next level veard</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <div className="chatFooter">
                          <input
                            id="messageBox"
                            type="text"
                            class="form-control-lg w-50"
                          />
                          <Avatar
                            size="sm"
                            customStyles={backgroundHexButton}
                            color={"infos"}
                            className="mic-chat"
                            icon={<Paperclip size={12} />}
                          />
                          <Avatar
                            size="sm"
                            customStyles={backgroundHexButton}
                            color={"infos"}
                            className="attach-chat"
                            icon={<Send size={12} />}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="chatContainer"
                      style={{ backgroundColor: backgroundHex }}
                    >
                      <div className="chatHeader-theme2">
                        <Avatar
                          size="lg"
                          color={"infoss"}
                          className="sign-chat"
                          icon={<MessageCircle size={14} />}
                        />
                        <span style={{ color: backgroundHexStatus }}>
                          {titleModalPerv}
                        </span>
                        <br />
                        <span
                          style={{ color: backgroundHexStatus }}
                          className="online-status-chat"
                        >
                          Online
                        </span>
                      </div>
                      <div className="chatBody-theme2">
                        <ul class="chat-list" id="scrollchat">
                          <li class="in">
                            <div class="chat-img">
                              <img
                                alt="Avtar"
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                              />
                            </div>
                            <div class="chat-body">
                              <div
                                class="chat-message"
                                style={{
                                  backgroundColor: backgroundHexVisitor,
                                }}
                              >
                                <h5>Jimmy Willams</h5>
                                <p>
                                  Raw denim heard of them tofu master cleanse
                                </p>
                              </div>
                            </div>
                          </li>
                          <li class="out">
                            <div class="chat-img">
                              <img
                                alt="Avtar"
                                src="https://bootdey.com/img/Content/avatar/avatar6.png"
                              />
                            </div>
                            <div class="chat-body">
                              <div
                                class="chat-message"
                                style={{ backgroundColor: backgroundHexAgent }}
                              >
                                <h5>Serena</h5>
                                <p>Next level veard</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <div className="chatFooter-theme2">
                          <input
                            id="messageBox-theme2"
                            type="text"
                            class="form-control-lg w-50"
                          />
                          <Avatar
                            size="sm"
                            customStyles={backgroundHexButton}
                            color={"infos"}
                            className="mic-chat"
                            icon={<Paperclip size={12} />}
                          />
                          <Avatar
                            size="sm"
                            customStyles={backgroundHexButton}
                            color={"infos"}
                            className="attach-chat"
                            icon={<Send size={12} />}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => setBasicModalPerv(!basicModalPrev)}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GeneralInfo;
