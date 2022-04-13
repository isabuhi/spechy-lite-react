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
    position: 0,
    apprance: 0,
  });
  const [confirm_message_data_server, setConfirmMessageData] = useState([]);
  const [text_color, setTextColor] = useState("#483D8B");
  const [background_color, setBackgroundColor] = useState("#483D8B");
  const [description_data_server, setDescriptionData] = useState([]);
  const [title_data_server, setTitleData] = useState([]);
  const [titleModal, setTitleModal] = useState("");
  const [title_var, setTitleVar] = useState([]);
  const [desc_var, setDecVar] = useState([]);
  const [conf_var, setConfVar] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
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
        `${BASE_URL}/api/conversation-management/chat-widget/select/offline-contact-form/${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          let confirm_message_data = response.data.data.confirm_message.text;
          let description_data = response.data.data.description.text;
          let title_data_var = response.data.data.title.text;
          setConfirmMessageData(confirm_message_data);
          setDescriptionData(description_data);
          setTitleData(title_data_var);
          let message_obj = Object.entries(confirm_message_data);
          let desc_obj = Object.entries(description_data);
          let title_obj = Object.entries(title_data_var);
          let message_array = [];
          let desc_array = [];
          let title_array = [];
          for (let i = 0; i < message_obj.length; i++) {
            message_array.push({
              lang: message_obj[i][0],
              value: message_obj[i][1],
            });
          }
          setConfVar(message_array);
          for (let i = 0; i < desc_obj.length; i++) {
            desc_array.push({
              lang: desc_obj[i][0],
              value: desc_obj[i][1],
            });
          }
          setDecVar(desc_array);
          for (let i = 0; i < title_obj.length; i++) {
            title_array.push({
              lang: title_obj[i][0],
              value: title_obj[i][1],
            });
          }
          setTitleVar(title_array);
          setBackgroundColor(response.data.data.background_color);
          setTextColor(response.data.data.text_color);
          setFormState({
            ...formState,
            fields_email_required: response.data.data.fields_email_required,
            fields_email_status: response.data.data.fields_email_status,
            fields_message_required: response.data.data.fields_message_required,
            fields_message_status: response.data.data.fields_message_status,
            fields_name_required: response.data.data.fields_name_required,
            fields_name_status: response.data.data.fields_name_status,
            fields_phone_required: response.data.data.fields_phone_required,
            fields_phone_status: response.data.data.fields_phone_status,
            height: response.data.data.height,
            position: response.data.data.position,
            style: response.data.data.style,
            width: response.data.data.width,
          });
        }
      });
  }, []);

  const setPosition = (e) => {
    setFormState({
      ...formState,
      position: e,
    });
    //console.log(e)
  };

  const setView = (e, id) => {
    if (id == 1) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_name_required: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_name_required: true,
        });
      }
    } else if (id == 2) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_name_status: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_name_status: true,
        });
      }
    } else if (id == 3) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_message_status: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_message_status: true,
        });
      }
    } else if (id == 4) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_message_required: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_message_required: true,
        });
      }
    } else if (id == 5) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_phone_status: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_phone_status: true,
        });
      }
    } else if (id == 6) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_phone_required: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_phone_required: true,
        });
      }
    } else if (id == 7) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_email_status: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_email_status: true,
        });
      }
    } else if (id == 8) {
      if (e.target.checked === false) {
        setFormState({
          ...formState,
          fields_email_required: false,
        });
      } else {
        setFormState({
          ...formState,
          fields_email_required: true,
        });
      }
    }
  };

  const handleChangeComplete = (e) => {
    console.log(colorFunc, e.hex);
    if (colorFunc == 1) {
      setBackgroundColor(e.hex);
    } else if (colorFunc == 2) {
      setTextColor(e.hex);
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
      console.log(text_color);
      await axios
        .post(
          `${BASE_URL}/api/conversation-management/chat-widget/edit/offline-contact-form/${id}`,
          {
            style: formState.style,
            width: formState.width,
            height: formState.height,
            position: formState.position,
            background_color: background_color,
            text_color: text_color,
            title: title_data_server,
            description: description_data_server,
            confirm_message: confirm_message_data_server,
            fields_name_status: formState.fields_name_status ? 1 : 0,
            fields_name_required: formState.fields_name_required ? 1 : 0,
            fields_phone_status: formState.fields_phone_status ? 1 : 0,
            fields_phone_required: formState.fields_phone_required ? 1 : 0,
            fields_email_status: formState.fields_email_status ? 1 : 0,
            fields_email_required: formState.fields_email_required ? 1 : 0,
            fields_message_status: formState.fields_message_status ? 1 : 0,
            fields_message_required: formState.fields_message_required ? 1 : 0,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={
                  "You have successfully update chat widget offline form."
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

  const onChangeTitle = (e, lang) => {
    let title_send_var = {};
    for (let i = 0; i < title_var.length; i++) {
      if (title_var[i]["lang"] === lang) {
        title_var[i]["value"] = e.target.value;
      }
      title_send_var[title_var[i]["lang"]] = title_var[i]["value"];
    }
    //console.log(title_send_var)
    setTitleData(title_send_var);
  };

  const onChanceHandlerDesc = (e, lang) => {
    let desc_send_var = {};
    for (let i = 0; i < desc_var.length; i++) {
      if (desc_var[i]["lang"] === lang) {
        desc_var[i]["value"] = e.target.value;
      }
      desc_send_var[desc_var[i]["lang"]] = desc_var[i]["value"];
    }
    //console.log(title_send_var)
    setDescriptionData(desc_send_var);
  };

  const onChanceHandlerConf = (e, lang) => {
    let havij = {};
    for (let i = 0; i < conf_var.length; i++) {
      if (conf_var[i]["lang"] === lang) {
        conf_var[i]["value"] = e.target.value;
      }
      havij[conf_var[i]["lang"]] = conf_var[i]["value"];
    }
    //console.log(title_send_var)
    setConfirmMessageData(havij);
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
                  {title_var.map(function (object, i) {
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
                          onChange={(e) => onChangeTitle(e, object.lang)}
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
                  {desc_var.map(function (object, i) {
                    return (
                      <FormGroup>
                        <Label for="title">
                          Description[{object.lang}] :{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="title"
                          defaultValue={object.value}
                          name="title"
                          onChange={(e) => onChanceHandlerDesc(e, object.lang)}
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
                    {formState.position == 1 ? (
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
                    {formState.position == 2 ? (
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
                  {conf_var.map(function (object, i) {
                    return (
                      <FormGroup>
                        <Label for="title">
                          Confirm Message[{object.lang}] :{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="title"
                          defaultValue={object.value}
                          name="title"
                          onChange={(e) => onChanceHandlerConf(e, object.lang)}
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
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Background
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: background_color }}
                          onClick={() =>
                            openModal("Background Color", 1, background_color)
                          }
                        ></label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="colorText">
                          Text
                        </Label>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <label
                          className="colorPicker"
                          style={{ backgroundColor: text_color }}
                          onClick={() => openModal("Text Color", 2, text_color)}
                        ></label>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 6, offset: 0 }}>
                  <Row>
                    <Col md={{ size: 6, offset: 0 }}>
                      <FormGroup>
                        {formState.style == 1 ? (
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
                        {formState.style == 2 ? (
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
                        <Label for="name" className="">
                          Name
                        </Label>
                        <Row>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_name_status == true ? (
                              <CustomInput
                                type="checkbox"
                                id="require_name"
                                checked
                                label="Active"
                                name="require_name"
                                onChange={(e) => setView(e, 2)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="require_name"
                                label="Active"
                                name="require_name"
                                onChange={(e) => setView(e, 2)}
                              />
                            )}
                          </Col>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_name_required == true ? (
                              <CustomInput
                                type="checkbox"
                                id="active_name"
                                checked
                                label="Require"
                                name="active_name"
                                onChange={(e) => setView(e, 1)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="active_name"
                                label="Require"
                                name="active_name"
                                onChange={(e) => setView(e, 1)}
                              />
                            )}
                          </Col>
                        </Row>
                        <br />
                        <Label for="name" className="">
                          Phone
                        </Label>
                        <Row>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_phone_status == true ? (
                              <CustomInput
                                type="checkbox"
                                id="require_phone"
                                checked
                                label="Active"
                                name="require_phone"
                                onChange={(e) => setView(e, 5)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="require_phone"
                                label="Active"
                                name="require_nrequire_phoneame"
                                onChange={(e) => setView(e, 5)}
                              />
                            )}
                          </Col>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_phone_required == true ? (
                              <CustomInput
                                type="checkbox"
                                id="active_phone"
                                checked
                                label="Require"
                                name="active_phone"
                                onChange={(e) => setView(e, 6)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="active_phone"
                                label="Require"
                                name="active_phone"
                                onChange={(e) => setView(e, 6)}
                              />
                            )}
                          </Col>
                        </Row>
                      </Col>
                      <Col md={{ size: 6, offset: 0 }}>
                        <Label for="name" className="">
                          Message
                        </Label>
                        <Row>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_message_status == true ? (
                              <CustomInput
                                type="checkbox"
                                id="require_message"
                                checked
                                label="Active"
                                name="reqrequire_messageuire_name"
                                onChange={(e) => setView(e, 3)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="require_message"
                                label="Active"
                                name="require_message"
                                onChange={(e) => setView(e, 3)}
                              />
                            )}
                          </Col>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_message_required == true ? (
                              <CustomInput
                                type="checkbox"
                                id="active_message"
                                checked
                                label="Require"
                                name="active_message"
                                onChange={(e) => setView(e, 4)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="active_message"
                                label="Require"
                                name="active_message"
                                onChange={(e) => setView(e, 4)}
                              />
                            )}
                          </Col>
                        </Row>
                        <br />
                        <Label for="name" className="">
                          Email
                        </Label>
                        <Row>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_email_status == true ? (
                              <CustomInput
                                type="checkbox"
                                id="require_email"
                                checked
                                label="Active"
                                name="require_email"
                                onChange={(e) => setView(e, 7)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="require_email"
                                label="Active"
                                name="require_email"
                                onChange={(e) => setView(e, 7)}
                              />
                            )}
                          </Col>
                          <Col md={{ size: 6, offset: 0 }}>
                            {formState.fields_email_required == true ? (
                              <CustomInput
                                type="checkbox"
                                id="active_email"
                                checked
                                label="Require"
                                name="active_email"
                                onChange={(e) => setView(e, 8)}
                              />
                            ) : (
                              <CustomInput
                                type="checkbox"
                                id="active_email"
                                label="Require"
                                name="active_email"
                                onChange={(e) => setView(e, 8)}
                              />
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </FormGroup>
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
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GeneralInfo;
