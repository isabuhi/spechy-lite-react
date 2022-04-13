import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { useSkin } from "@hooks/useSkin";
import { Link } from "react-router-dom";
import { ChevronLeft } from "react-feather";
import InputPassword from "@components/input-password-toggle";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Button,
  FormFeedback,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import jwt_decode from "jwt-decode";
import { Lock, Edit, Trash2, Coffee, AlertCircle } from "react-feather";
import Avatar from "../../../../src/@core/components/avatar";
// // import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
// import Flatpickr from "react-flatpickr";
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// // import classnames from "classnames";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isObjEmpty } from "../../../../src/utility/Utils";
import InputPasswordToggle from "../../../../src/@core/components/input-password-toggle";
// import Select from "react-select";
// import { selectThemeColors } from "@utils";
import axios from "axios";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
// import { deleteUserImage } from "../Store/Actions";

const ResetPasswordV2 = () => {
  const history = useHistory();
  const [skin, setSkin] = useSkin();
  const { token } = useParams();
  console.log("token", token);
  const [formState, setFormState] = useState({
    password: "",
    // password_confirmation: "",
    token: "",
  });
  const [password_confirmation, setPasswordConfirm] = useState("");
  // let isExpired = false;
  // var decoded = jwt_decode(token);
  // let decodedToken = jwt_decode(token, {
  //   complete: true,
  // });
  // let dateNow = new Date();

  // if (decodedToken.exp < dateNow.getTime()) isExpired = true;

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const SignInSchema = yup.object().shape({
    fullName: yup.string().required("Full name is a required field.").min(5),
    password: yup.string().when({
      is: (val) => val !== "",
      then: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One special case Character"
        ),
    }),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must be matched."),
    phone: yup.string().when({
      is: (val) => val !== "",
      then: yup.string().matches(phoneRegExp, "Phone number is not valid"),
    }),
    title: yup.string().when({
      is: (val) => val !== "",
      then: yup.string().min(5, "Title must be at least 5 characters"),
    }),
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
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
      const formData = new FormData();

      formData.append("password", formState.password);
      formData.append("password_confirmation", formState.password_confirmation);

      await axios
        .post(
          `${BASE_URL}/api/auth/forget-password-verify/${token}`,
          formData,
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded;application/json",
            },
          }
        )
        .then((response) => {
          console.log("responseforeditor", response);
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully updated the user."}
                header={"Congratulations !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            );
            history.push("/login");
          }
        })
        .catch(() => {
          toast.error(
            <ToastContent
              type={"danger"}
              content={"Something went wrong. Please try again."}
              header={"Error !!"}
            />,
            { transition: Slide, hideProgressBar: true, autoClose: 3000 }
          );
        });
    }
  };

  const onChanceHandler = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const illustration =
      skin === "dark" ? "reset-password-v2-dark.svg" : "reset-password-v2.svg",
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
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>
            <Form
              className="auth-reset-password-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label for="password">Password</Label>
                <InputPasswordToggle
                  onChange={onChanceHandler}
                  name="password"
                  defaultValue={formState.password}
                  className="input-group-merge"
                  id="register-password"
                  innerRef={register({ required: true })}
                  invalid={errors.password && true}
                />
                {errors && errors.password && (
                  <FormFeedback style={{ display: "block" }}>
                    {errors.password.message}
                  </FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="password_confirmation">Password Confirm</Label>
                <InputPasswordToggle
                  id="userEdit-password-confirm"
                  name="password_confirmation"
                  className="input-group-merge"
                  defaultValue={password_confirmation}
                  innerRef={register({ required: true })}
                  invalid={errors.password_confirmation && true}
                  onChange={onChanceHandler}
                />
                {errors && errors.password_confirmation && (
                  <FormFeedback style={{ display: "block" }}>
                    {errors.password_confirmation.message}
                  </FormFeedback>
                )}
              </FormGroup>
              <Button.Ripple color="primary" block type="submit">
                Set New Password
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

export default ResetPasswordV2;
