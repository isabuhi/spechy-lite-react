import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft } from "react-feather";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import Avatar from "../../../../src/@core/components/avatar";
import "@styles/base/pages/page-auth.scss";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  isObjEmpty,
  getHomeRouteForLoggedInUser,
} from "../../../../src/utility/Utils";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
// import { useHistory } from "react-router";
import { useHistory, useParams } from "react-router-dom";

const ForgotPasswordV2 = () => {
  const [skin, setSkin] = useSkin();
  const [formState, setFormState] = useState({
    email: "",
  });

  let history = useHistory();
  const handleAddClick = () => {
    history.push("/reset-password");
  };

  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is a required field.")
      .email("Email must be a valid email."),
  });

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
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

  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      await axios
        .post(`${BASE_URL}/api/auth/forget-password-send-reset-link`, {
          email: formState.email,
        })
        .then((response) => {
          console.log("respondetome", response);
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully added a user."}
                header={"Congratulations !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            );
            history.push("/submit-password");
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

  const illustration =
      skin === "dark"
        ? "forgot-password-v2-dark.svg"
        : "forgot-password-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <h2 className="brand-text text-primary ml-1">Spechy</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login V2" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Forgot Password? 🔒
            </CardTitle>
            <CardText className="mb-2">
              Enter your email and we'll send you instructions to reset your
              password
            </CardText>
            <Form
              className="auth-forgot-password-form mt-2"
              // onSubmit={(e) => e.preventDefault()}
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  autoFocus
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [e.target.name]: e.target.value,
                    })
                  }
                  innerRef={register({ required: true })}
                  invalid={errors.email && true}
                />
                {errors && errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </FormGroup>
              <Button.Ripple color="primary" type="submit" block>
                Send reset link
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="mr-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPasswordV2;
