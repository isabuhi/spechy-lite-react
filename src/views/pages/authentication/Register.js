import { Fragment, useState } from "react";
import { isObjEmpty } from "@utils";
import classnames from "classnames";
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import InputPasswordToggle from "@components/input-password-toggle";
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  AlertCircle,
  Coffee,
} from "react-feather";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  FormGroup,
  Label,
  Button,
  Form,
  Input,
  CustomInput,
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Avatar from "../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Register(props) {
  const [skin, setSkin] = useSkin();
  const history = useHistory();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is a required field.")
      .email("Email must be a valid email."),
    password: yup
      .string()
      .required("Password is a required field.")
      .min(8)
      .matches(
        /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One special case Character"
      ),
    phone: yup
      .string()
      .required("Phone Number is a required field.")
      .matches(phoneRegExp, "Phone number is not valid"),
    namesurname: yup.string().required("Full name is a required field.").min(5),
    passwordConfirm: yup
      .string()
      .required("Password confirm is a required field.")
      .oneOf([yup.ref("password"), null], "Passwords must be matched."),
    terms: yup.boolean().oneOf([true]),
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
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    namesurname: "",
    phone: "",
    request: 0,
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [valErrors, setValErrors] = useState({});
  const [terms, setTerms] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  const illustration =
      skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const Terms = () => {
    return (
      <Fragment>
        I agree to
        <a className="ml-25" href="/" onClick={(e) => e.preventDefault()}>
          privacy policy & terms
        </a>
      </Fragment>
    );
  };

  //console.log("checkthesubmit1", isObjEmpty(errors))
  //console.log("phone", formState.phone)
  const onSubmit = () => {
    //console.log("checkthesubmit2", isObjEmpty(errors))
    if (isObjEmpty(errors)) {
      if (formState.request === 0) {
        setFormState({
          ...formState,
          request: 1,
        });
        useJwt
          .register({ ...formState })
          .then((res) => {
            if (res.status === 200) {
              console.log(formState.email);
              localStorage.setItem("temp_email", formState.email);
              history.push("/verify");
              toast.success(
                <ToastContent
                  type={"success"}
                  content={
                    "You have successfully signed up. Please sing in with your information."
                  }
                  header={"Congratulations !!"}
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
              );
            }
          })
          .catch((err) => {
            //console.error(err)
            toast.error(
              <ToastContent
                type={"error"}
                content={"Something went wrong. Please try again!"}
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
        console.log("do not click many time bro!");
      }
    }
  };

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
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
              Adventure starts here 🚀
            </CardTitle>
            <CardText className="mb-2">
              Make your app management easy and fun!
            </CardText>

            <Form
              action="/"
              className="auth-register-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="register-username">
                  Full Name
                </Label>
                <Input
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [e.target.name]: e.target.value,
                    })
                  }
                  type="text"
                  name="namesurname"
                  defaultValue={formState.namesurname}
                  id="namesurname"
                  placeholder="Jhon Doe"
                  autoFocus
                  innerRef={register({ required: true })}
                  invalid={errors.namesurname && true}
                />
                {errors && errors.namesurname && (
                  <FormFeedback>{errors.namesurname.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label className="form-label" for="register-email">
                  Email
                </Label>
                <Input
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [e.target.name]: e.target.value,
                    })
                  }
                  type="email"
                  name="email"
                  defaultValue={formState.email}
                  id="register-email"
                  placeholder="john@example.com"
                  innerRef={register({ required: true })}
                  invalid={errors.email && true}
                />
                {errors && errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </FormGroup>

              <FormGroup>
                <div
                  style={{
                    display: "inline-block",
                  }}
                >
                  <PhoneInput
                    inputStyle={{ width: "277px" }}
                    country={"tr"}
                    name="phone"
                    containerStyle={{ marginTop: "15px" }}
                    searchClass="search-class"
                    // searchStyle={{ margin: "0", width: "97%", height: "30px" }}
                    enableSearchField
                    disableSearchIcon
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        phone: e,
                      })
                    }
                    defaultValue={formState.phone}
                    innerRef={register({ required: true })}
                    invalid={errors.phone && true}
                  />

                  <Input
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        [e.target.name]: e.target.value,
                      })
                    }
                    type="hidden"
                    name="phone"
                    value={formState.phone}
                    id="register-phone"
                    innerRef={register({ required: true })}
                    invalid={errors.email && true}
                  />
                </div>
                {errors && errors.phone && (
                  <FormFeedback style={{ display: "block" }}>
                    {errors.phone.message}
                  </FormFeedback>
                )}
              </FormGroup>

              <FormGroup>
                <Label className="form-label" for="register-password">
                  Password
                </Label>
                <InputPasswordToggle
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [e.target.name]: e.target.value,
                    })
                  }
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
                <Label className="form-label" for="register-password">
                  Password Confirm
                </Label>
                <InputPasswordToggle
                  id="register-password-confirm"
                  name="passwordConfirm"
                  className="input-group-merge"
                  defaultValue={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  innerRef={register({ required: true })}
                  invalid={errors.passwordConfirm && true}
                />
                {errors && errors.passwordConfirm && (
                  <FormFeedback style={{ display: "block" }}>
                    {errors.passwordConfirm.message}
                  </FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <CustomInput
                  type="checkbox"
                  id="terms"
                  name="terms"
                  defaultValue={terms}
                  label={<Terms />}
                  className="custom-control-Primary"
                  innerRef={register({ required: true })}
                  onChange={() => setTerms(!terms)}
                  invalid={errors.terms && true}
                />
              </FormGroup>
              <Button.Ripple type="submit" block color="primary">
                Sign up
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <span className="mr-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button.Ripple color="facebook">
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color="twitter">
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color="google">
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className="mr-0" color="github">
                <GitHub size={14} />
              </Button.Ripple>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
