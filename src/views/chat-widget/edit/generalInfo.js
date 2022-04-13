import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Lock, Edit, Trash2, Coffee, AlertCircle } from "react-feather";
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
} from "reactstrap";
import Avatar from "../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { TagInput } from "reactjs-tag-input";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "axios";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { getFilterItems } from "../store/actions";
import DualList from "./dualList";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState([]);

  const { id } = useParams();

  const [formState, setFormState] = useState({
    accepted_language: "",
    is_offline_form: null,
    request: 1,
    useEffectKey: 0,
    is_sss: false,
    name: null,
    max_queue_limit: null,
    status: false,
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const [languageList, setlangList] = useState([]);
  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(
        `${BASE_URL}/api/conversation-management/chat-widget/select/chat-button/${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          let is = "";
          let statusChat = "";
          let offline = "";
          if (response.data.data.is_sss === 1) {
            is = "checked";
          }
          if (response.data.data.status === 1) {
            statusChat = "checked";
          }
          if (response.data.data.is_offline_form === true) {
            offline = "checked";
          }
          setFormState({
            ...formState,
            name: response.data.data.title,
            is_sss: is,
            max_queue_limit: response.data.data.max_queue_limit,
            status: statusChat,
            is_offline_form: offline,
          });
          console.log(formState.max_queue_limit);
        }
      });
  }, []);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/general-management/language/get-all-languages`)
      .then((response) => {
        if (response.status === 200) {
          setlangList(response.data.data);
        }
      });
    dispatch(getFilterItems(id));
  }, [formState.useEffectKey]);

  const onChanceHandler = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
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
    console.log(formState.is_sss);
    let is;
    if (formState.is_sss === false) {
      is = 0;
    } else {
      is = 1;
    }
    let off;
    if (formState.is_offline_form === false) {
      off = 0;
    } else {
      off = 1;
    }
    let sta;
    if (formState.status === false) {
      sta = 0;
    } else {
      sta = 1;
    }
    if (1) {
      await axios
        .post(
          `${BASE_URL}/api/conversation-management/chat-widget/edit/chat-button/${id}`,
          {
            name: formState.name,
            accepted_languages: selectedProject,
            is_sss: is,
            is_offline_form: off,
            max_queue_limit: formState.max_queue_limit,
            status: sta,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully update a ticket category."}
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

  const setRequest = (e) => {
    if (e.target.checked === false) {
      setFormState({
        ...formState,
        is_sss: false,
      });
    } else {
      setFormState({
        ...formState,
        is_sss: true,
      });
    }
  };

  const setPermission = (e) => {
    if (e.target.checked === false) {
      setFormState({
        ...formState,
        is_offline_form: false,
      });
    } else {
      setFormState({
        ...formState,
        is_offline_form: true,
      });
    }
  };

  const setStatus = (e) => {
    if (e.target.checked === false) {
      setFormState({
        ...formState,
        status: false,
      });
    } else {
      setFormState({
        ...formState,
        status: true,
      });
    }
  };

  const projectIds = (id) => {
    setSelectedProject(id);
  };

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 10, offset: 1 }}>
              <FormGroup>
                <Label for="name">
                  Name : <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  defaultValue={formState.name}
                  name="name"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.name && true}
                />
                {errors && errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="attached">
                  Languages : <span className="text-danger">*</span>
                </Label>
                <DualList projectList={languageList} projectIds={projectIds} />
              </FormGroup>
              <FormGroup>
                <Label for="is_sss">
                  <span className="text-danger"></span>
                </Label>
                <CustomInput
                  type="checkbox"
                  id="iss_checked"
                  checked={formState.is_sss}
                  label="Request information by pre-chat form, when chat butten clicked"
                  name="iss_checked"
                  onChange={(e) => setRequest(e)}
                />
                {errors && errors.is_sss && (
                  <FormFeedback>{errors.access.is_sss}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="access">
                  <span className="text-danger"></span>
                </Label>
                <CustomInput
                  type="checkbox"
                  id="is_offline_form"
                  checked={formState.is_offline_form}
                  label="When no agent is online, offline button is displayed and visitor can use contact form"
                  name="is_offline_form"
                  onChange={(e) => setPermission(e)}
                />
                {errors && errors.access && (
                  <FormFeedback>{errors.access.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="max_queue_limit">
                  Max Queue Length : <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="max_queue_limit"
                  defaultValue={formState.max_queue_limit}
                  name="title"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.max_queue_limit && true}
                />
                <Label>
                  Show button as offline if waiting queue is button's department
                  reached the limit
                </Label>
                {errors && errors.max_queue_limit && (
                  <FormFeedback>{errors.max_queue_limit.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="access">
                  <span className="text-danger"></span>
                </Label>
                <CustomInput
                  type="checkbox"
                  id="status"
                  checked={formState.status}
                  label="Active"
                  name="status"
                  onChange={(e) => setStatus(e)}
                />
                {errors && errors.access && (
                  <FormFeedback>{errors.access.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>

            <Col md={{ size: 6, offset: 2 }}>
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
