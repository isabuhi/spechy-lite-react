import React, { Fragment, useEffect, useState, Component } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import "@styles/react/libs/editor/editor.scss";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import makeAnimated from "react-select/animated";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { Route, Switch, useHistory } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isObjEmpty } from "../../../../utility/Utils";
import { FormattedMessage } from "react-intl";
import { Slide, toast } from "react-toastify";
import Avatar from "../../../../../src/@core/components/avatar";
import {
  AlertCircle,
  ArrowLeftCircle,
  Coffee,
  FolderPlus,
  ArrowLeft,
} from "react-feather";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

function AddEmailTemplate(props) {
  const animatedComponents = makeAnimated();
  const [formState, setFormState] = useState({
    templateName: "",
    templateContent: "",
    templateTopic: "",
    request: 0,
  });

  const [value, setValue] = useState(EditorState.createEmpty());
  console.log("contenvale", value);
  const [editorContent, setEditorContent] = useState("");

  const updateTextDescription = async (state) => {
    console.log("whythisstate", state);
    await setValue(state);
    const data = convertToRaw(value.getCurrentContent());
    console.log(
      "dataeditor",
      data.blocks.map((x) => x.text)
    );
    setEditorContent(data.blocks.map((x) => x.text));
  };

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

  const toastClose = (
    <button type="button" className="ml-1 close">
      <span>×</span>
    </button>
  );
  const dispatch = useDispatch();
  const store = useSelector((state) => state.users);
  const history = useHistory();
  const SignInSchema = yup.object().shape({
    templateName: yup
      .string()
      .required("Template name is a required field.")
      .min(5),
    templateTopic: yup
      .string()
      .required("Template Topic is a required field.")
      .min(5),
    templateContent: yup
      .string()
      .required("Template Content is a required field.")
      .min(5),
  });
  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });
  const onSubmit = async () => {
    if (isObjEmpty(errors) === false) {
      const btn = document.getElementById("submit-data");
      btn.setAttribute("disabled", true);
      btn.innerText = "Checking..";

      setTimeout(() => {
        btn.removeAttribute("disabled");
        btn.innerText = "Submit";
      }, 3000);
      // if (formState.request === 0) {
      // setFormState({
      //   ...formState,
      //   request: 1,
      // });
      await axios
        .post(
          `${BASE_URL}/api/project-management/email-template/create-email-template`,
          {
            name: formState.templateName,
            mailcontent: editorContent.toString(),
            subject: formState.templateTopic,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(response.data.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
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
      setFormState({
        ...formState,
        request: 0,
      });
      // } else {
      //   console.log("don't click!");
      // }
    }
  };
  return (
    <div className="w-100">
      <br />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">
            <ArrowLeft onClick={history.goBack} cursor="pointer" />
            <FormattedMessage id="goback"></FormattedMessage>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="templateName">
                    <FormattedMessage id="templatename"></FormattedMessage>
                  </Label>
                  <Input
                    autoFocus
                    type="text"
                    name="templateName"
                    id="templateName"
                    placeholder="Template Name..."
                    className={classnames({
                      "is-invalid": errors["template-name"],
                    })}
                    defaultValue={formState.templateName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        [e.target.name]: e.target.value,
                      })
                    }
                    innerRef={register({ required: true })}
                    invalid={errors.templateName && true}
                  />
                  {errors && errors.templateName && (
                    <FormFeedback>{errors.templateName.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="templateTopic">
                    <FormattedMessage id="topicoftemplate"></FormattedMessage>
                  </Label>
                  <Input
                    autoFocus
                    type="text"
                    name="templateTopic"
                    id="templateTopic"
                    placeholder="Template Topic..."
                    className={classnames({
                      "is-invalid": errors["template-topic"],
                    })}
                    defaultValue={formState.templateTopic}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        [e.target.name]: e.target.value,
                      })
                    }
                    innerRef={register({ required: true })}
                    invalid={errors.templateTopic && true}
                  />
                  {errors && errors.templateTopic && (
                    <FormFeedback>{errors.templateTopic.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col sm="12" className="pb-2">
                <CardBody className="p-0">
                  <FormGroup>
                    <Label for="templateContent">
                      Content : <span className="text-danger">*</span>
                    </Label>
                    <Editor
                      name="templateContent"
                      editorState={value}
                      // onEditorStateChange={(data) => setValue(data)}
                      // defaultValue={formState.templateContent}
                      onEditorStateChange={updateTextDescription}
                    />
                  </FormGroup>
                  {/* <FormGroup>
                    <Label for="templateContent">
                      <FormattedMessage id="templatecontent"></FormattedMessage>{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="textarea"
                      autoFocus
                      name="templateContent"
                      id="templateContent"
                      placeholder="Write the Email Content..."
                      className={classnames({
                        "is-invalid": errors["template-content"],
                      })}
                      defaultValue={formState.templateContent}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          [e.target.name]: e.target.value,
                        })
                      }
                      innerRef={register({ required: true })}
                      invalid={errors.templateContent && true}
                    />
                    {errors && errors.templateContent && (
                      <FormFeedback>
                        {errors.templateContent.message}
                      </FormFeedback>
                    )}
                  </FormGroup> */}
                </CardBody>
              </Col>
              <Col sm="12">
                <FormGroup className="d-flex mb-0">
                  <Button.Ripple
                    className="mr-1"
                    color="primary"
                    type="submit"
                    onClick={onSubmit}
                    id="submit-data"
                  >
                    <FormattedMessage id="create"></FormattedMessage>
                  </Button.Ripple>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddEmailTemplate;
