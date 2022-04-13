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
  Table,
  CustomInput,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
// import Flatpickr from "react-flatpickr";
import Avatar from "../../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import classnames from "classnames";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { getFilterUsers } from "../store/actions";
import Uppy from "@uppy/core";
import thumbnailGenerator from "@uppy/thumbnail-generator";
import { DragDrop } from "@uppy/react";
import { FormattedMessage } from "react-intl";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [imgForRequest, setImageForRequest] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [getProjectName, setProjectName] = useState(null);
  const { id } = useParams();
  const [img, setImg] = useState(null);
  const [picker, setPicker] = useState(new Date());

  const [formState, setFormState] = useState({
    name_surname: "",
    gender: "",
    title: "",
    password: "",
    role_id: "",
    birth_date: "",
    file: [],
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/user/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("selecttheuser", response);
          // setFormState({
          //   ...formState,
          //   projectName: response.data.data.name,
          // });
        }
      });
  }, []);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/user/change-profile-image/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("selecttheuser", response);
          setImg({
            ...formState,
            file: response.data,
          });
        }
      });
  }, []);

  useEffect(() => {
    dispatch(getFilterUsers());
  }, []);

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

  const uppy = new Uppy({
    meta: { type: "avatar" },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
  });

  uppy.use(thumbnailGenerator);

  uppy.on("thumbnail:generated", (file, preview) => {
    setImg(preview);
  });
  console.log("image", img);
  const onSubmit = async () => {
    if (1) {
      await axios
        .post(`${BASE_URL}/api/user-management/user/edit/${id}`, {
          name_surname: formState.name_surname,
          password: formState.password,
          gender: formState.gender,
          title: formState.title,
          birth_date: formState.birth_date,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully update a project."}
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

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 6, offset: 2 }}>
              <FormGroup>
                <Label for="title"> <FormattedMessage id="title"></FormattedMessage></Label>
                <Input
                  type="title"
                  id="title"
                  value={formState.title}
                  defaultValue={formState.title}
                  name="title"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.title && true}
                />
                {errors && errors.title && (
                  <FormFeedback>{errors.title.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <FormattedMessage id="Photo"></FormattedMessage>
                <DragDrop uppy={uppy} />
                {img !== null ? (
                  <img className="rounded mt-2" src={img} alt="avatar" />
                ) : null}
              </FormGroup>
              <FormGroup>
                <Label for="date-time-picker"><FormattedMessage id="Date & Time"></FormattedMessage></Label>
                <Flatpickr
                  value={picker}
                  data-enable-time
                  id="date-time-picker"
                  className="form-control"
                  onChange={(date) => setPicker(date)}
                />
              </FormGroup>

              <FormGroup>
                <Label for="sms">
                  <FormattedMessage id="Gender"></FormattedMessage> : <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  // options={smsList}
                  isClearable={false}
                  name="sms"
                  // onChange={(e) =>
                  //   setFormState({
                  //     ...formState,
                  //     sms: e.value,
                  //   })
                  // }
                />
                {errors && errors.sms && (
                  <FormFeedback>{errors.sms.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>

            <Col md={{ size: 6, offset: 2 }}>
              <Button.Ripple
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
                color="primary"
              >
                <FormattedMessage id="Save Changes"></FormattedMessage>
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                color="secondary"
                outline
              >
                <FormattedMessage id="Cancel"></FormattedMessage>
              </Button.Ripple>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GeneralInfo;
