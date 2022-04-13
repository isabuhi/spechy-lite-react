import React, { Fragment, useEffect, useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";

// ** Third Party Components
import classnames from "classnames";
import { useForm } from "react-hook-form";

import {
  Button,
  FormGroup,
  Label,
  FormText,
  Form,
  Input,
  Col,
  FormFeedback,
  Row,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";

import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";

import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../utility/Utils";
import DualList from "./dualList";

function Index(props) {
  const [projects, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);

  const [role, setRole] = useState("subscriber");
  const [formState, setFormState] = useState({
    source_name: "",
    webhook: "http://app.spechy.com:5858/npbx/conversation/whatsapp/inbound",
    description: "",
    request: 1,
    call: null,
    name: "",
  });

  const history = useHistory();

  const SignInSchema = yup.object().shape({
    source_name: yup
      .string()
      .required("Source name is a required field.")
      .min(5),
    description: yup
      .string()
      .required("Description is a required field.")
      .min(5),
  });

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

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        console.log("projectresponse", projects);
        if (response.status === 200) {
          let typeTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            typeTemp.push({
              value: result[i].project_id,
              label: result[i].name,
            });
          }
          setProjectList(typeTemp);
          setSelectedProject(typeTemp);
        }
      });
  }, [formState.useEffectKey]);

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });
  console.log("cell", selectedProject.label);

  const onSubmit = async () => {
    console.log(formState);
    if (isObjEmpty(errors)) {
      if (formState.request == 1) {
        setFormState({
          ...formState,
          request: 0,
        });
        await axios
          .post(
            `${BASE_URL}/api/conversation-management/whatsapp-account/create`,
            {
              source_name: formState.name,
              source: formState.call,
              webhook: formState.webhook,
              description: formState.description,
            }
          )
          .then((response) => {
            if (response.status === 200) {
              toast.success(
                <ToastContent
                  type={"success"}
                  content={"You have successfully added a Whatsapp channel."}
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
    }
  };

  // const projectIds = (id) => {
  //   setSelectedProject(id);
  // };

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
            <Col xs={8} className="d-flex ml-3">
              <UserPlus />
              <h3 className="ml-1">New Whatsapp</h3>
            </Col>
          </Row>
        </Col>
        <Col md={{ size: 6, offset: 2 }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-5 pb-5">
            <FormGroup>
              <FormGroup>
                <Label for="call">
                  Source Name: <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  className={classnames({
                    "is-invalid": errors["call"],
                  })}
                  classNamePrefix="select"
                  options={projects}
                  isClearable={false}
                  name="call"
                  onChange={(e) =>
                    setFormState({
                      ...formState,

                      call: e.value,
                      name: e.label,
                    })
                  }
                  innerRef={register({ required: true })}
                  invalid={errors.call && true}
                />
                {errors && errors.call && (
                  <FormFeedback>{errors.call.message}</FormFeedback>
                )}
              </FormGroup>
            </FormGroup>
            <FormGroup>
              <Label for="email">
                Webhook <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="webhook"
                id="webhook"
                placeholder="http://app.spechy.com:5858/npbx/conversation/whatsapp/inbound"
                disabled={true}
                className={classnames({ "is-invalid": errors["webhook"] })}
                defaultValue={formState.webhook}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.webhook && true}
              />
              {errors && errors.webhook && (
                <FormFeedback>{errors.webhook.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="company-name">
                Desription <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="description"
                id="description"
                placeholder="Describe about whatsapp"
                className={classnames({ "is-invalid": errors["description"] })}
                defaultValue={formState.description}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.description && true}
              />
              {errors && errors.description && (
                <FormFeedback>{errors.description.message}</FormFeedback>
              )}
            </FormGroup>
            <Button
              onClick={onSubmit}
              type="submit"
              className="mr-1"
              color="primary"
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
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default Index;
