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

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";

import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../utility/Utils";
import { FormattedMessage } from "react-intl";

function Index() {
  const [formState, setFormState] = useState({
    projectName: "",
    request: 1,
  });
  const [disabled, setDisabled] = useState()

  const history = useHistory();

  const SignInSchema = yup.object().shape({
    projectName: yup
      .string()
      .required("Project Name is a required field.")
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
          .post(`${BASE_URL}/api/project-management/project/create-project`, {
            name: formState.projectName,
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success(
                <ToastContent
                  type={"success"}
                  content={"You have successfully added a Project."}
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
  useEffect(()=>{
    if(formState.projectName) {
      setDisabled(false)
    }else{
      setDisabled(true)
    }
  },[formState])

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={12}>
        <Col className="mb-2 d-flex " md={12}>
          <Row md={12}>
            <Col xs={2} style={{paddingTop: "3px"}} >
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={8} className="d-flex ml-2" style={{marginRight: "6px"}} >
              <UserPlus size={"40px"} style={{paddingBottom: "8px"}}/>
              <h3 className="ml-1 text-nowrap" style={{paddingTop:"5px"}} ><FormattedMessage id="New Project"></FormattedMessage></h3>
            </Col>
          </Row>
        </Col>
        <Col md={6} style={{ paddingLeft:"100px" }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="projectName">
                <FormattedMessage id="Project Name"></FormattedMessage> : <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="projectName"
                id="projectName"
                placeholder="Project Name"
                className={classnames({ "is-invalid": errors["projectName"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.projectName && true}
              />
              {errors && errors.projectName && (
                <FormFeedback>{errors.projectName.message}</FormFeedback>
              )}
            </FormGroup>
            <div className="d-flex justify-content-center align-items-center">
            <Button 
              type="submit"
              className="btn-block mr-1 mt-0"
              color="primary"
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
              <FormattedMessage id="Cancel"></FormattedMessage>
            </Button>
            </div>
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default Index;
