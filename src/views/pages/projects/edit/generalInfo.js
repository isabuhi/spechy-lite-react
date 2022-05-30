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
} from "reactstrap";
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
import { getFilterItems} from "../store/actions";
import { FormattedMessage } from "react-intl";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [imgForRequest, setImageForRequest] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [getProjectName, setProjectName] = useState(null);
  const { id } = useParams();

  const [formState, setFormState] = useState({
    projectName: "",
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setFormState({
            ...formState,
            projectName: response.data.data.name
          })
        }
      });
  }, []);

  useEffect(() => {
    dispatch(getFilterItems());
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

  const onSubmit = async () => {
    if (1) {
      await axios
      .post(`${BASE_URL}/api/project-management/project/update-project/${id}`, {
        name: formState.projectName,
      })
      .then((response) => {
        console.log(response)
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
      <Col sm="8">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 6, offset: 2 }}>
              <FormGroup>
                <Label for="projectName"><FormattedMessage id="Project Name"></FormattedMessage></Label>
                <Input
                  type="text"
                  id="projectName"
                  value={formState.projectName}
                  defaultValue={formState.projectName}
                  name="projectName"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.projectName && true}
                />
                {errors && errors.projectName && (
                  <FormFeedback>{errors.projectName.message}</FormFeedback>
                )}
              </FormGroup>

            </Col>

            <Col md={{ size: 6, offset: 2 }}>
              <div className="d-flex">
              <Button.Ripple
                className="btn-block mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
                color="primary"
              >
                <FormattedMessage id="Save Changes"></FormattedMessage>
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="btn-block mt-0"
                color="secondary"
                outline
              >
                <FormattedMessage id="Cancel"></FormattedMessage>
              </Button.Ripple>
              </div>  
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GeneralInfo;
