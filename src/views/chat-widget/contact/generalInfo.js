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

  const { id } = useParams();

  const [formState, setFormState] = useState({
    request: 1,
    useEffectKey: 0,
    appearance_on_mobiles: 0,
  });
  const [background_gradient1_color, setGradientOne] = useState("#483D8B");
  const [background_gradient2_color, setGradienTwo] = useState("#483D8B");
  const [bubble_color, setBubble] = useState("#483D8B");
  const [from_color, setForm] = useState("#483D8B");
  const [icon_color, setIcon] = useState("#483D8B");
  const [to_color, setToColor] = useState("#483D8B");

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  useEffect(async () => {
    await axios
      .get(
        `${BASE_URL}/api/conversation-management/chat-widget/select/online-chat-button/${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          setGradientOne(response.data.data.background_gradient1_color);
          setGradienTwo(response.data.data.background_gradient2_color);
          setBubble(response.data.data.bubble_color);
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
      await axios
        .post(
          `${BASE_URL}/api/conversation-management/chat-widget/edit/chat-window/${id}`,
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
            <Col md={{ size: 10, offset: 1 }}></Col>
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
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GeneralInfo;
