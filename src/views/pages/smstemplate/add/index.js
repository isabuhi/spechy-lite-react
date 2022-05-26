import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { Route, Switch, useHistory } from "react-router-dom";
import Select from "react-select";

import * as yup from "yup";
import Avatar from "../../../../@core/components/avatar";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Slide, toast } from "react-toastify";
import { ArrowLeft } from "react-feather";
import { isObjEmpty } from "../../../../utility/Utils";
import { FormattedMessage } from "react-intl";

function AddTemplate(props) {
  const animatedComponents = makeAnimated();
  const [formState, setFormState] = useState({
    templateName: "",
    templateContent: "",
    request: 0,
    role_id: null,
  });
  const [role, setRoleList] = useState([]);
  const [disabled, setDisabled] = useState(true)

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
  const dispatch = useDispatch();
  const store = useSelector((state) => state.users);
  const history = useHistory();
  const SignInSchema = yup.object().shape({
    templateName: yup
      .string()
      .required("Template Name is a required field.")
      .min(5, "Template Name must be at least 5 characters."),
    templateContent: yup
      .string()
      .required("Template Content is a required field.")
      .min(5, "Template Content must be at least 5 characters."),
  });
  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/user-roles/get-all-roles`)
      .then((response) => {
        console.log("rrrrrrr", response.data.data);
        if (response.status === 200) {
          let roles = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            roles.push({
              value: result[i].role_id,
              label: result[i].name,
            });
          }
          setRoleList(roles);
        }
      });
  }, [formState.useEffectKey]);

  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      if (formState.request === 0) {
        setFormState({
          ...formState,
          request: 0,
        });
        await axios
          .post(
            `${BASE_URL}/api/project-management/sms-template/create-sms-template`,
            {
              name: formState.templateName,
              smscontent: formState.templateContent,
            }
          )
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
      } else {
        console.log("don't click!");
      }
    }
  };
  useEffect(()=>{
    if(
      formState.templateName &&
      formState.templateContent &&
      formState.role_id
      ){
        setDisabled(false)
      }else {
        setDisabled(true)
      }
  },[formState])

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
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
                    <FormattedMessage id="Template Name"></FormattedMessage>{" "}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    autoFocus
                    type="text"
                    name="templateName"
                    id="templateName"
                    placeholder="Write the Template Name..."
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
              <Col sm="12" className="pb-2">
                <CardBody className="p-0">
                  <FormGroup>
                    <Label for="templateContent">
                      <FormattedMessage id="Template Content"></FormattedMessage>{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="textarea"
                      autoFocus
                      name="templateContent"
                      id="templateContent"
                      placeholder="Write the SMS Content..."
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
                  <FormGroup>
                    <Label for="role_id">
                      <FormattedMessage id="Select Role"></FormattedMessage>
                      <span className="text-danger">*</span>
                    </Label>
                    <Select
                      //isClearable={true}
                      name="role_id"
                      className="react-select"
                      classNamePrefix="select"
                      options={role}
                      defaultValue={formState.role_id}
                      onChange={(e) =>
                        setFormState({
                          ...formState,

                          role_id: e.value,
                          name: e.label,
                        })
                      }
                      innerRef={register({ required: true })}
                      invalid={errors.role_id && true}
                    />
                    {errors && errors.role_id && (
                      <FormFeedback>{errors.role_id.message}</FormFeedback>
                    )}
                  </FormGroup>
                </CardBody>
              </Col>
              <Col sm="12">
                <FormGroup className="d-flex mb-0">
                  <Button.Ripple
                    className="btn-lg mr-1"
                    color="primary"
                    type="submit"
                    disabled={disabled}
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

export default AddTemplate;
