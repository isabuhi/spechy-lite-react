import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import classnames from "classnames";
import { useForm } from "react-hook-form";

import {
  Button,
  FormGroup,
  Label,
  Form,
  Input,
  Col,
  FormFeedback,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  ButtonGroup,
} from "reactstrap";
import DualList from "./dualList";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import Select from "react-select";

import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../utility/Utils";
import WorkingHours from "../components/working_hours";
import "../working_hours.scss";

function Index(props) {
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
  const [formState, setFormState] = useState({
    name: "",
    call: null,
    useEffectKey: 0,
    source_id: "",
    type: 0,
    request: 1,
    // users: [],
  });
  const [basicModal, setBasicModal] = useState(true);
  const [projects, setProjectList] = useState([]);
  const [users, setUsersList] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [workingTimes, setWorkingTimes] = useState([]);

  const [lang, setLangs] = useState([]);
  const [types, setTypesList] = useState([]);
  const history = useHistory();

  const SignInSchema = yup.object().shape({
    title: yup
      .string()
      .required("Ready Answer Title is a required field.")
      .min(5),
  });

  useEffect(async (e) => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data);
          var projectItems = [{}];
          for (var j = 0; j < result.length; j++) {
            projectItems[j] = {
              val: result[j].project_id,
              label: result[j].name,
            };
          }
          setProjectList(projectItems);
        }
      });

    await axios
      .get(`${BASE_URL}/api/user-management/user/get-all-users`)
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data);
          var projectUsers = [{}];
          for (var j = 0; j < result.length; j++) {
            projectUsers[j] = {
              val: result[j].user_id,
              label: result[j].profile.name_surname,
            };
          }
          setUsersList(projectUsers);
        }
      });
  }, []);

  const ToastContent = ({ header, content, type, errorResTo }) => {
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
          <span>{errorResTo}</span>
        </div>
      </Fragment>
    );
  };

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      if (formState.request == 1) {
        setFormState({
          ...formState,
          request: 0,
        });
        await axios
          .post(`${BASE_URL}/api/project-management/auto-assign/create`, {
            name: formState.name,
            users: selectedUser,
            type: formState.type,
            source_id: formState.source_id,
            workingtimes: workingTimes,
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success(
                <ToastContent
                  type={"success"}
                  content={"You have successfully added a Reason Code."}
                  header={"Congratulations !!"}
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
              );
              history.goBack();
            }
          })
          .catch((error) => {
            if (error.response.status === 422) {
              let arr = [];
              arr.push(Object.values(error.response.data.data.error));

              toast.error(
                <ToastContent
                  type={"error"}
                  errorResTo={arr[0]}
                  header={"Error !!"}
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
              );
            } else {
              toast.error(
                <ToastContent
                  type={"error"}
                  errorResTo={"something went wronge, please try again"}
                  header={"Error !!"}
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
              );
            }
          });
      }
    }
  };

  const projectIds = (id) => {
    setSelectedProject(id);
  };
  const usersIds = (id) => {
    setSelectedUser(id);
  };

  var days = [
    { key: "mon", name: "Monday" },
    { key: "tue", name: "Tuesday" },
    { key: "wed", name: "Wednesday" },
    { key: "thu", name: "Thursday" },
    { key: "fri", name: "Friday" },
    { key: "sat", name: "Saturday" },
    { key: "sun", name: "Sunday" },
  ];

  var data = {};
  var fieldName = "location[working_hours]";

  const getTheHours = (data) => {
    console.log("ddddddd", data);
    setWorkingTimes(data);
  };

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={12}>
        <Col className="mb-2 d-flex " md={12}>
          <Row md={12}>
            <Col xs={2}>
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={9} className="d-flex ml-1">
              <UserPlus size="35px" className="d-flex align-items-center"/>
              <h3 className="ml-1 d-flex align-items-center text-nowrap" style >New Auto Assign</h3>
            </Col>
          </Row>
        </Col>
        <Col md={8} style={{ paddingLeft:"100px" }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="source_id">
                Select Source : <span className="text-danger">*</span>
              </Label>
              <Select
                isClearable={true}
                name="source_id"
                className="react-select"
                classNamePrefix="select"
                options={projects}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    source_id: e.val,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.type && true}
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">
                Name : <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="name"
                id="name"
                placeholder="Title Name"
                className={classnames({ "is-invalid": errors["title"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.name && true}
              />
              {errors && errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="users">
                Users : <span className="text-danger">*</span>
              </Label>
              <DualList userList={users} usersIds={usersIds} />
            </FormGroup>

            <FormGroup>
              <WorkingHours
                days={days}
                fieldName={fieldName}
                data={data}
                getTheHours={getTheHours}
              />
            </FormGroup>
            <ButtonGroup
            className="col text-center"
            >
              <Button
                onClick={onSubmit}
                type="submit"
                className="mr-1"
                color="primary"
                disabled={disabled}
              >
                Submit
              </Button>
              <Button
                onClick={history.goBack}
                type="reset"
                color="secondary"
                outline
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default Index;
