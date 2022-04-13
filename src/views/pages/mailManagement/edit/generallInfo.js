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
import { getFilterItems } from "../store/actions";
import DualList from "./dualList";

const GeneralInfo = (props) => {
  const call = [
    {
      val: 1,
      label: "Yes",
    },
    {
      val: 0,
      label: "No",
    },
  ];
  const history = useHistory();
  const dispatch = useDispatch();
  const [projects, setProjectList] = useState([]);
  const [channels, setChannelList] = useState([]);
  const [types, setTypesList] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [smsList, setSmsList] = useState([]);
  const [mailList, setMailList] = useState([]);
  const { id } = useParams();

  const [formState, setFormState] = useState({
    name: "",
    call: null,
    request: 1,
    useEffectKey: 0,
    members: [],
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.userGroups);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/teams/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setFormState({
            ...formState,
            name: response.data.data.name,
          });
        }
      });
  }, []);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/user/get-all-users`)
      .then((response) => {
        if (response.status === 200) {
          setProjectList(response.data.data);
        }
      });
    //--------

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
    if (1) {
      await axios
        .post(`${BASE_URL}/api/user-management/teams/update-team/${id}`, {
          name: formState.name,
          members: selectedProject,
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

  const projectIds = (id) => {
    setSelectedProject(id);
  };

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 6, offset: 2 }}>
              <FormGroup>
                <Label for="attached">
                  Attached Source : <span className="text-danger">*</span>
                </Label>
                <DualList projectList={projects} projectIds={projectIds} />
              </FormGroup>
              <FormGroup>
                <Label for="name">
                  User Group Name : <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={formState.name}
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
