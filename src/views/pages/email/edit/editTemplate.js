import React, { Fragment, useState, useEffect } from "react";
import { Check, AlertCircle, ArrowLeft } from "react-feather";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import Avatar from "../../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useHistory, useParams, Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import classnames from "classnames";
import { isObjEmpty } from "../../../../utility/Utils";
const EmailTemplateInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { templateID } = useParams();
  const [formState, setFormState] = useState({
    templateName: "",
    templateContent: "",
    templateTopic: "",
    request: 0,
  });

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

  useEffect(async () => {
    await axios
      .get(
        `${BASE_URL}/api/project-management/email-template/select/${templateID}`
      )
      .then((response) => {
        if (response.status === 200) {
          setFormState({
            ...formState,
            templateName: response.data.data.name,
            templateTopic: response.data.data.subject,
            templateContent: response.data.data.content,
          });
        }
      });
  }, []);

  const onChangeHandler = (e) => {
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
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
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
    if (isObjEmpty(errors)) {
      if (formState.request === 0) {
        setFormState({
          ...formState,
          request: 1,
        });
        await axios
          .post(
            `${BASE_URL}/api/project-management/email-template/update-email-template/${templateID}`,
            {
              name: formState.templateName,
              mailcontent: formState.templateContent,
              subject: formState.templateTopic,
            }
          )
          .then((response) => {
            console.log("here is response", response);
            if (response.status === 200) {
              toast.success(
                <ToastContent
                  type={"success"}
                  content={response.data.data}
                  header={"Success!"}
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
              );
              history.goBack();
            }
          })
          .catch((err) => {
            toast.error(
              <ToastContent
                type={"error"}
                content={"Something went wrong. Try again later!"}
                header={"Error !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            );
            setFormState({
              ...formState,
              request: 0,
            });
          });
      } else {
        console.log("don't click!");
      }
    }
  };

  return (
    <div className="w-100">
      <Card>
        <CardBody>
          <Row>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm="8">
                  <FormGroup>
                    <Label for="templateName"><FormattedMessage id="templatename"></FormattedMessage></Label>
                    <Input
                      type="text"
                      id="templateName"
                      name="templateName"
                      defaultValue={formState.templateName}
                      onChange={onChangeHandler}
                      innerRef={register({ required: true })}
                      invalid={errors.templateName && true}
                    />
                    {errors && errors.name && (
                      <FormFeedback>{errors.templateName.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col sm="8">
                  <FormGroup>
                    <Label for="templateTopic"><FormattedMessage id="topicoftemplate"></FormattedMessage></Label>
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
                      <FormFeedback>
                        {errors.templateTopic.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col sm="8" className="pb-2">
                  <CardBody className="p-0">
                    <FormGroup>
                      <Label for="templateContent">
                        <FormattedMessage id="templatecontent"></FormattedMessage> <span className="text-danger">*</span>
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
                    </FormGroup>
                  </CardBody>
                </Col>

                <Col sm="8">
                  <div className="d-flex">
                  <Button.Ripple
                    className="btn-block mb-1 mb-sm-0 mr-0 mr-sm-1"
                    type="submit"
                    color="primary"
                  >
                    <FormattedMessage id="Update"></FormattedMessage>
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
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default EmailTemplateInfo;
