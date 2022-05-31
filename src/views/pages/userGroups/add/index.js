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
} from "reactstrap";

import DualList from "./dualList";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { FormattedMessage } from "react-intl";

import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../utility/Utils";

const customId = "custom-id-yes";

function Index() {
  const [formState, setFormState] = useState({
    name: "",
    members: [],
    call: null,
    request: 1,
    useEffectKey: 0,
    type: null,
  });
  const [projects, setProjectList] = useState([]);

  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState([]);

  const [disabled, setDisabled] = useState(true);

  const history = useHistory();

  const SignInSchema = yup.object().shape({
    name: yup.string().required("Name is a required field.").min(5),
    selectedProject: yup.object().required("Please Select Users."),
  });

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/user/get-all-users`)
      .then((response) => {
        console.log("listcherker", response.data.data);
        if (response.status === 200) {
          setProjectList(response.data.data);
        }
      });
  }, [formState.useEffectKey]);

  useEffect(() => {
    if (selectedProject.length && formState.name) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formState, selectedProject]);

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

  const onSubmit = async (e) => {
    if (isObjEmpty(errors)) {
      const btn = document.getElementById("submit-data");
      btn.setAttribute("disabled", true);
      btn.innerText = "Checking..";

      setTimeout(() => {
        btn.removeAttribute("disabled");
        btn.innerText = "Submit";
      }, 4000);
      await axios
        .post(`${BASE_URL}/api/user-management/teams/create-new-team`, {
          // sources: selectedProject,
          name: formState.name,
          // send_call_list: formState.call,
          members: selectedProject,
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
  };

  const projectIds = (id) => {
    console.log("id", id);
    setSelectedProject(id);
  };

  const handleChangeChannels = (e) => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].id);
      }
    }
    setSelectedChannel(value);
  };

  const notify = () => {
    toast("I cannot be duplicated!", {
      toastId: customId,
    });
  };

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={12}>
        <Col className="mb-2 d-flex " md={12}>
          <Row md={12}>
            <Col xs={2} style={{ paddingTop: "7px" }}>
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={9} className="d-flex mr-1">
              <UserPlus size="40px" />
              <h3
                className="ml-1 text-nowrap"
                style={{ paddingTop: "9px", paddingRight: "5px" }}
              >
                New User Groups
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={6} style={{ paddingLeft: "100px" }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="name">
                <FormattedMessage id="Group Name"></FormattedMessage>
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="name"
                id="name"
                placeholder="Name"
                className={classnames({ "is-invalid": errors["name"] })}
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
              <Label for="attached">
                <FormattedMessage id="User List"></FormattedMessage>
                <span className="text-danger">*</span>
              </Label>
              <DualList projectList={projects} projectIds={projectIds} />
            </FormGroup>
            {errors && errors.selectedProject && (
              <p
                style={{
                  color: "#ea5455",
                  fontSize: "0.857rem",
                  marginTop: "-0.75rem",
                }}
              >
                {errors.selectedProject.message}
              </p>
            )}
            <div className="d-flex justify-content-center">
              <Button
                onClick={onSubmit}
                type="submit"
                className="btn-block mr-1 mt-0"
                color="primary"
                id="submit-data"
                disabled={disabled}
              >
                <FormattedMessage id="submit"></FormattedMessage>
              </Button>
              <Button
                onClick={history.goBack}
                type="reset"
                color="secondary"
                outline
                className="btn-block mt-0"
              >
                <FormattedMessage id="cancel"></FormattedMessage>
              </Button>
            </div>
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default Index;
