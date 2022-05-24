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
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "reactstrap";

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
import { selectThemeColors } from "@utils";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "@styles/react/libs/editor/editor.scss";

function Index() {
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
    email_address: "",
    password: "",
    sender_name: "",
    outgoing_host: "",
    outgoing_type: "",
    outgoing_port: "",
    incoming_host: "",
    incoming_type: "",
    incoming_port: "",
    signature: "",
    username: null,
    request: 1,
    useEffectKey: 0,
    type: null,
    incoming_protocol: "ssl",
    outgoing_protocol: "ssl",
    project_id: 0,
  });

  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [value, setValue] = useState(EditorState.createEmpty());
  const history = useHistory();

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        if (response.status === 200) {
          let typeTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            typeTemp.push({
              value: result[i].project_id,
              label: result[i].name,
            });
          }
          setSelectedProject(typeTemp);
        }
      });
  }, []);

  const SignInSchema = yup.object().shape({
    reasonName: yup
      .string()
      .required("Reason Name is a required field.")
      .min(5),
    call: yup.string().required("Send to Call List is a required field."),
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
          .post(`${BASE_URL}/api/mail-management/account/create`, {
            incoming_protocol: formState.incoming_protocol,
            outgoing_protocol: formState.outgoing_protocol,
            email_address: formState.email_address,
            password: formState.password,
            signature: formState.signature,
            incoming_host: formState.incoming_host,
            incoming_type: formState.incoming_type,
            incoming_port: formState.incoming_port,
            outgoing_host: formState.outgoing_host,
            outgoing_type: formState.outgoing_type,
            outgoing_port: formState.outgoing_port,
            sender_name: formState.sender_name,
            source_id: formState.project_id,
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
              <h3 className="ml-1">New Mail</h3>
            </Col>
          </Row>
        </Col>
        <Col md={{ size: 6, offset: 2 }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="sender_name">
                Sender Name: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="sender_name"
                id="sender_name"
                placeholder="Sender Name"
                className={classnames({ "is-invalid": errors["name"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.sender_name && true}
              />
              {errors && errors.sender_name && (
                <FormFeedback>{errors.sender_name.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="email_address">
                Email Address: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="email_address"
                id="email_address"
                placeholder="Email Address"
                className={classnames({ "is-invalid": errors["name"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.email_address && true}
              />
              {errors && errors.email_address && (
                <FormFeedback>{errors.email_address.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="password">
                password: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="password"
                id="password"
                placeholder="Password"
                className={classnames({ "is-invalid": errors["password"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.password && true}
              />
              {errors && errors.password && (
                <FormFeedback>{errors.password.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="incoming_host">
                Incoming Mail Server: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="incoming_host"
                id="incoming_host"
                placeholder="Incoming Host"
                className={classnames({ "is-invalid": errors["name"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.incoming_host && true}
              />
              {errors && errors.incoming_host && (
                <FormFeedback>{errors.incoming_host.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="incoming_port">
                Port: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="incoming_port"
                id="incoming_port"
                placeholder="Incoming Port"
                className={classnames({ "is-invalid": errors["name"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.incoming_port && true}
              />
              {errors && errors.incoming_port && (
                <FormFeedback>{errors.incoming_port.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="incoming_type">
                Type: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="incoming_type"
                id="incoming_type"
                placeholder="Incoming Type"
                className={classnames({ "is-invalid": errors["name"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.incoming_type && true}
              />
              {errors && errors.incoming_type && (
                <FormFeedback>{errors.incoming_type.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="outgoing_host">
                Outgoing Mail Server: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="outgoing_host"
                id="outgoing_host"
                placeholder="Outgoing Host"
                className={classnames({
                  "is-invalid": errors["outgoing_host"],
                })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.outgoing_host && true}
              />
              {errors && errors.outgoing_host && (
                <FormFeedback>{errors.outgoing_host.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="outgoing_port">
                Port: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="outgoing_port"
                id="outgoing_port"
                placeholder="Outgoing Port"
                className={classnames({ "is-invalid": errors["name"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.outgoing_port && true}
              />
              {errors && errors.outgoing_port && (
                <FormFeedback>{errors.outgoing_port.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="outgoing_type">
                Type: <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="outgoing_type"
                id="outgoing_type"
                placeholder="Outgoing Type"
                className={classnames({
                  "is-invalid": errors["outgoing_type"],
                })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.outgoing_type && true}
              />
              {errors && errors.outgoing_type && (
                <FormFeedback>{errors.outgoing_type.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="project_id">
                Project : <span className="text-danger">*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={selectedProject}
                isClearable={false}
                name="project_id"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    project_id: e.value,
                  })
                }
              />
              {errors && errors.project_id && (
                <FormFeedback>{errors.project_id.message}</FormFeedback>
              )}
            </FormGroup>
            <Card>
              <Label for="signature">
                signature : <span className="text-danger">*</span>
              </Label>
              <CardBody>
                <Editor
                  editorState={value}
                  onEditorStateChange={(data) => setValue(data)}
                />
              </CardBody>
            </Card>

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
