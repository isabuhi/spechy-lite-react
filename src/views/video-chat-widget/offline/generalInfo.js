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
  Mail,
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
    position: 0,
    apprance: 0,
  });
  const [background_gradient1_color, setGradientOne] = useState("#483D8B");
  const [background_gradient2_color, setGradienTwo] = useState("#483D8B");
  const [bubble_color, setBubble] = useState("#483D8B");
  const [from_color, setForm] = useState("#483D8B");
  const [icon_colorOne, setIconOne] = useState("#483D8B");
  const [icon_colorTwo, setIconTwo] = useState("#483D8B");
  const [to_color, setToColor] = useState("#483D8B");
  const [envelope_back_color, setEnvelopeBackColor] = useState("#483D8B");
  const [envelope_bottom_color, setEnvelopeBottomColor] = useState("#483D8B");
  const [envelope_top_color, setEnvelopeTopColor] = useState("#483D8B");
  const [letter_color, setLetterColor] = useState("#483D8B");
  const [basicModal, setBasicModal] = useState(false);
  const [basicModalPrev, setBasicModalPerv] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [inModalColor, setInModalColor] = useState("");
  const [colorFunc, setColorFunc] = useState(0);

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  useEffect(async () => {
    await axios
      .get(
        `${BASE_URL}/api/conversation-management/video-chat-widget/select/offline-chat-button/${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          setGradientOne(response.data.data.background_gradient1_color);
          setGradienTwo(response.data.data.background_gradient2_color);
          setBubble(response.data.data.bubble_color);
          setForm(response.data.data.from_color);
          setIconOne(response.data.data.icon_color_1);
          setIconTwo(response.data.data.icon_color_2);
          setToColor(response.data.data.to_color);
          setEnvelopeBackColor(response.data.data.envelope_back_color);
          setEnvelopeBottomColor(response.data.data.envelope_bottom_color);
          setEnvelopeTopColor(response.data.data.envelope_top_color);
          setLetterColor(response.data.data.letter_color);
          setFormState({
            ...formState,
            position: response.data.data.position,
            apprance: response.data.data.appearance_on_mobiles,
          });
        }
      });
  }, []);

  const setPosition = (e) => {
    sePosition(e);
  };

  const setView = (e) => {
    setViewData(e);
  };

  const handleChangeComplete = (e) => {
    console.log(colorFunc, e.hex);
    if (colorFunc == 1) {
      setGradientOne(e.hex);
    } else if (colorFunc == 2) {
      setGradienTwo(e.hex);
    } else if (colorFunc == 3) {
      setBubble(e.hex);
    } else if (colorFunc == 4) {
      setIconOne(e.hex);
    } else if (colorFunc == 5) {
      setForm(e.hex);
    } else if (colorFunc == 6) {
      setToColor(e.hex);
    } else if (colorFunc == 7) {
      setEnvelopeBottomColor(e.hex);
    } else if (colorFunc == 8) {
      setEnvelopeTopColor(e.hex);
    } else if (colorFunc == 9) {
      setEnvelopeBackColor(e.hex);
    } else if (colorFunc == 10) {
      setLetterColor(e.hex);
    } else if (colorFunc == 11) {
      setIconTwo(e.hex);
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
      //console.log(title_send_var_s)
      await axios
        .post(
          `${BASE_URL}/api/conversation-management/video-chat-widget/edit/offline-chat-button/${id}`,
          {
            background_gradient1_color: background_gradient1_color,
            background_gradient2_color: background_gradient2_color,
            bubble_color: bubble_color,
            icon_color_1: icon_colorOne,
            from_color: from_color,
            to_color: to_color,
            appearance_on_mobiles: formState.apprance,
            position: formState.position,
            envelope_bottom_color: envelope_bottom_color,
            envelope_top_color: envelope_top_color,
            envelope_back_color: envelope_back_color,
            letter_color: letter_color,
            icon_color_2: icon_colorTwo,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={
                  "You have successfully update chat widget offline chat button."
                }
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

  const setPermission = (e) => {
    setFormState({
      ...formState,
      position: e,
    });
  };

  const setApper = (e) => {
    setFormState({
      ...formState,
      apprance: e,
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
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Background Gradient :
                      </Label>
                    </Col>
                    <Col md={{ size: 3, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: background_gradient1_color }}
                        onClick={() =>
                          openModal(
                            "Background Gradient",
                            1,
                            background_gradient1_color
                          )
                        }
                      ></label>
                    </Col>
                    <Col md={{ size: 3, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: background_gradient2_color }}
                        onClick={() =>
                          openModal(
                            "Background Gradient",
                            2,
                            background_gradient2_color
                          )
                        }
                      ></label>
                    </Col>
                  </Row>
                </Col>
                <Col md={{ size: 6, offset: 0 }}>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Bubble Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: bubble_color }}
                        onClick={() =>
                          openModal("Bubble Color", 3, bubble_color)
                        }
                      ></label>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Icon Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: icon_colorOne }}
                        onClick={() =>
                          openModal("Icon Color", 4, icon_colorOne)
                        }
                      ></label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 6, offset: 0 }}>
                  <FormGroup>
                    <Label for="access">
                      Position
                      <span className="text-danger"></span>
                    </Label>
                    {formState.position == 1 ? (
                      <CustomInput
                        type="radio"
                        defaultChecked
                        id="leftPage"
                        label="Left Page Edge"
                        name="position"
                        onChange={(e) => setPermission(1)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="leftPage"
                        label="Left Page Edge"
                        name="position"
                        onChange={(e) => setPermission(1)}
                      />
                    )}
                    {formState.position == 2 ? (
                      <CustomInput
                        type="radio"
                        defaultChecked
                        id="RightPage"
                        label="Right Page Edge"
                        name="position"
                        onChange={(e) => setPermission(2)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="RightPage"
                        label="Right Page Edge"
                        name="position"
                        onChange={(e) => setPermission(2)}
                      />
                    )}
                    {formState.position == 3 ? (
                      <CustomInput
                        type="radio"
                        defaultChecked
                        id="BottomPagre"
                        label="Bottom Page Edge"
                        name="position"
                        onChange={(e) => setPermission(3)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="BottomPagre"
                        label="Bottom Page Edge"
                        name="position"
                        onChange={(e) => setPermission(3)}
                      />
                    )}
                    {errors && errors.access && (
                      <FormFeedback>{errors.access.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md={{ size: 6, offset: 0 }}>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        From Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: from_color }}
                        onClick={() => openModal("From Color", 5, from_color)}
                      ></label>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Text Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: to_color }}
                        onClick={() => openModal("To Color", 6, to_color)}
                      ></label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 6, offset: 0 }}>
                  <FormGroup>
                    <Label for="access">
                      Appearance on Mobiles
                      <span className="text-danger"></span>
                    </Label>
                    {formState.apprance == 1 ? (
                      <CustomInput
                        type="radio"
                        defaultChecked
                        id="scale"
                        label="Scale Down"
                        name="mobile"
                        onChange={(e) => setApper(1)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="scale"
                        label="Scale Down"
                        name="mobile"
                        onChange={(e) => setApper(1)}
                      />
                    )}
                    {formState.apprance == 2 ? (
                      <CustomInput
                        type="radio"
                        defaultChecked
                        id="hide"
                        label="Hide"
                        name="mobile"
                        onChange={(e) => setApper(2)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="hide"
                        label="Hide"
                        name="mobile"
                        onChange={(e) => setApper(2)}
                      />
                    )}
                    {formState.apprance == 3 ? (
                      <CustomInput
                        type="radio"
                        defaultChecked
                        id="noChange"
                        label="No Change"
                        name="mobile"
                        onChange={(e) => setApper(3)}
                      />
                    ) : (
                      <CustomInput
                        type="radio"
                        id="noChange"
                        label="No Change"
                        name="mobile"
                        onChange={(e) => setApper(3)}
                      />
                    )}
                    {errors && errors.access && (
                      <FormFeedback>{errors.access.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md={{ size: 6, offset: 0 }}>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Envelope Bottom Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: envelope_bottom_color }}
                        onClick={() =>
                          openModal(
                            "Envelope Bottom Color",
                            7,
                            envelope_bottom_color
                          )
                        }
                      ></label>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Envelope Top Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: envelope_top_color }}
                        onClick={() =>
                          openModal("Envelope Top Color", 8, envelope_top_color)
                        }
                      ></label>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Envelope Back Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: envelope_back_color }}
                        onClick={() =>
                          openModal(
                            "Envelope Back Color",
                            9,
                            envelope_back_color
                          )
                        }
                      ></label>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Letter Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: letter_color }}
                        onClick={() =>
                          openModal("Letter Color", 10, letter_color)
                        }
                      ></label>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <Label for="title" className="gradiant-chat">
                        Button Color :
                      </Label>
                    </Col>
                    <Col md={{ size: 6, offset: 0 }}>
                      <label
                        className="colorPicker"
                        style={{ backgroundColor: icon_colorTwo }}
                        onClick={() =>
                          openModal("Icon Color", 11, icon_colorTwo)
                        }
                      ></label>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Modal
              isOpen={basicModal}
              toggle={() => setBasicModal(!basicModal)}
            >
              <ModalHeader toggle={() => setBasicModal(!basicModal)}>
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
                  Edit Chat Offline Button
                </ModalHeader>
                <ModalBody>
                  <div
                    className="mail-offline-container"
                    style={{
                      backgroundImage:
                        "linear-gradient(" +
                        background_gradient1_color +
                        ", " +
                        background_gradient2_color +
                        ")",
                    }}
                  >
                    <Avatar
                      size="lg"
                      color="info"
                      className="offline-chat-botton"
                      customStyles={icon_colorOne}
                      customBackgroundStyle={envelope_back_color}
                      icon={<Mail size={12} />}
                    />
                  </div>
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
