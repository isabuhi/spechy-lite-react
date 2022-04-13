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
  Breadcrumb,
  BreadcrumbItem,
  CardBody,
} from "reactstrap";
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
import { isObjEmpty } from "../../../../utility/Utils";
import { FormattedMessage } from "react-intl";
// import { getFilterItems} from "../store/action"
const SMSTemplateInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const { id } = useParams();
  const [formState, setFormState] = useState({
    templateName: "",
    templateContent: "",
    request: 0,
  });

  const SignInSchema = yup.object().shape({
    templateName: yup
      .string()
      .required("Template Name is a required field.")
      .min(5, "Template Name must be at least 5 characters."),
    templateContent: yup
      .string()
      .required("Template Name is a required field.")
      .min(5, "Template Content must be at least 5 characters."),
  });
  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      mode: "onSubmit",
      resolver: yupResolver(SignInSchema),
    });
  const store = useSelector((state) => state.smsTemplates);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/sms-template/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setFormState({
            ...formState,
            templateName: response.data.data.name,
            templateContent: response.data.data.content,
          });
        }
      });
  }, []);
  console.log("here is form state", formState);

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
            `${BASE_URL}/api/project-management/sms-template/update-sms-template/${id}`,
            {
              name: formState.templateName,
              smscontent: formState.templateContent,
            }
          )
          .then((response) => {
            console.log("here is response", response.data);
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
                content={"Something went wrong. Please try again later!"}
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
        console.log("dont click!");
      }
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">
            <ArrowLeft onClick={history.goBack} cursor="pointer" />
            <FormattedMessage id="goback"></FormattedMessage>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardBody>
          <Row>
            <Col sm="12">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={{ size: 6, offset: 2 }}>
                    <FormGroup>
                      <Label for="templateName"><FormattedMessage id="Template Name"></FormattedMessage></Label>
                      <Input
                        type="text"
                        id="templateName"
                        name="templateName"
                        defaultValue={formState.templateName}
                        onChange={onChangeHandler}
                        innerRef={register({ required: true })}
                        invalid={errors.templateName && true}
                      />
                      {errors && errors.templateName && (
                        <FormFeedback>
                          {errors.templateName.message}
                        </FormFeedback>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="templateContent"><FormattedMessage id="Template Content"></FormattedMessage></Label>
                      <Input
                        type="textarea"
                        id="templateContent"
                        name="templateContent"
                        defaultValue={formState.templateContent}
                        onChange={onChangeHandler}
                        innerRef={register({ required: true })}
                        invalid={errors.templateContent && true}
                      />
                      {errors && errors.templateContent && (
                        <FormFeedback>
                          {errors.templateContent.message}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md={{ size: 6, offset: 2 }}>
                    <Button.Ripple
                      className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                      type="submit"
                      color="primary"
                    >
                      <FormattedMessage id="Update"></FormattedMessage>
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
        </CardBody>
      </Card>
    </>
  );
};

export default SMSTemplateInfo;
