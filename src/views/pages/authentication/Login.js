import { useSkin } from "@hooks/useSkin";
import { Link, useHistory } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  AlertCircle,
  ArrowLeftCircle,
  Coffee,
  UserPlus,
} from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Button,
  FormFeedback,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import { useState, Fragment, useEffect } from "react";
import { toast, Slide } from "react-toastify";
// import Avatar from '../../@core/components/avatar'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useJwt from "@src/auth/jwt/useJwt";
import {
  isObjEmpty,
  getHomeRouteForLoggedInUser,
} from "../../../utility/Utils";
import jwt_decode from "jwt-decode";
import { handleLogin, ui_loading } from "../../../redux/actions/auth";
// import Spechy_Logo from '../../assets/images/pages/login/Spechy_Logo.png'
import classnames from "classnames";
import axios from "axios";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import Avatar from "../../../../src/@core/components/avatar";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import "./index.css";
const clientID =
  "879500809139-mmsmpe7uhobstkccgedhr69s23g1nhnt.apps.googleusercontent.com";

const Login = () => {
  //console.log(localStorage)
  const [skin, setSkin] = useSkin();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    request: 0,
  });
  const [isLoggedin, setIsLoggedin] = useState(false);
  const store = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [faceData, setFaceData] = useState({});
  const [accessTokens, setAccessToken] = useState();

  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState("");

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is a required field.")
      .email("Email must be a valid email"),
    password: yup
      .string()
      .required("Password is a required field.")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One special Case Character"
      ),
  });
  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });
  //console.log("thestore", store)
  //console.log("thisisphone", formState)
  // console.log("theobbefore", isObjEmpty(errors))
  const onSubmit = () => {
    if (isObjEmpty(errors)) {
      if (formState.request === 0) {
        setFormState({
          ...formState,
          request: 1,
        });
        useJwt
          .login({
            ...formState,
          })
          .then((res) => {
            //console.log("stateres", res)
            //console.log("jwt", useJwt);
            if (res.status === 200) {
              useJwt.setToken(res.data.data.access_token); // Set access_token
              useJwt.setRefreshToken(res.data.data.refresh_token); // Set refresh_token
              if (useJwt.getToken()) {
                const decodedToken = jwt_decode(useJwt.getToken());
                //console.log("decodedToken", decodedToken)
                dispatch(handleLogin(decodedToken)); // Redux-Userdata = decodedJWT
                localStorage.setItem(
                  "userData",
                  JSON.stringify(res.data.data.user_data)
                );
                localStorage.setItem(
                  "userStatus",
                  JSON.stringify(res.data.data.user_data.user_status)
                );
                //console.log("localstoage", res)
                window.location.href =
                  window.location.protocol + "//" + window.location.host;
                // history.push("/home");
              }
            } else {
              useJwt.removeAuthInfos();
              setFormState({
                ...formState,
                request: 0,
              });
            }
          })
          .catch((err) => {
            //console.error(err)
            useJwt.removeAuthInfos();
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

  const onLoginClick = () => {
    window.FB.login((response) => {
      // setFaceData(response);
      setAccessToken(response.authResponse.accessToken);
      statusChangeCallback(response);
    });
  };

  const statusChangeCallback = async (response) => {
    if (response.status === "connected") {
      await axios
        .post(`${BASE_URL}/api/auth/fb-login`, {
          access_token: response.authResponse.accessToken,
        })

        .then((res) => {
          useJwt.setToken(res.data.data.access_token); // Set access_token
          useJwt.setRefreshToken(res.data.data.refresh_token); // Set refresh_token
          if (useJwt.getToken()) {
            const decodedToken = jwt_decode(useJwt.getToken());
            //console.log("decodedToken", decodedToken)
            dispatch(handleLogin(decodedToken)); // Redux-Userdata = decodedJWT
            localStorage.setItem(
              "userData",
              JSON.stringify(res.data.data.user_data)
            );
            localStorage.setItem(
              "userStatus",
              JSON.stringify(res.data.data.user_data.user_status)
            );
            //console.log("localstoage", res)
            // history.push("/home");
            window.location.href =
              window.location.protocol + "//" + window.location.host;
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

  // console.log("reslan", accessToken);

  // const responseGoogle = (res) => {
  //   console.log(res);
  // };

  const onSuccess = async (res) => {
    console.log("login success", res.profileObj);

    await axios
      .post(`${BASE_URL}/api/auth/gmail-login`, {
        name_surname: res.profileObj.name,
        user_id: res.profileObj.googleId,
        email_address: res.profileObj.email,
      })

      .then((res) => {
        useJwt.setToken(res.data.data.access_token); // Set access_token
        useJwt.setRefreshToken(res.data.data.refresh_token); // Set refresh_token
        if (useJwt.getToken()) {
          const decodedToken = jwt_decode(useJwt.getToken());
          //console.log("decodedToken", decodedToken)
          dispatch(handleLogin(decodedToken)); // Redux-Userdata = decodedJWT
          localStorage.setItem(
            "userData",
            JSON.stringify(res.data.data.user_data)
          );
          localStorage.setItem(
            "userStatus",
            JSON.stringify(res.data.data.user_data.user_status)
          );
          //console.log("localstoage", res)
          // history.push("/home");
          window.location.href =
            window.location.protocol + "//" + window.location.host;
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
  };

  const onFailure = (res) => {
    console.log("login success", res);
  };

  const responseFacebook = (response) => {
    console.log("wtf", response);
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

  const googleButton = {
    borderRadius: "8px",
    borderStyle: "none",
    boxSizing: "border-box",
    color: "black",
    cursor: "pointer",
    flexShrink: "0",

    fontSize: "16px",
    fontWeight: "500",
    height: "4rem",
    padding: "0 1.6rem",
    textAlign: " center",
    textShadow: "rgba(0, 0, 0, 0.25) 0 3px 8px",
    transition: "all 0.5s",
    userSelect: "none",

    touchAction: "manipulation",
    margin: "20px",
  };

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/">
          {/*<h2 className='brand-text text-primary ml-1'>Spechy</h2>*/}
        </Link>
        <Col
          className="d-none d-lg-block align-items-center p-5"
          lg="8"
          sm="12"
        >
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            {/* <img className='img-fluid w-50' src={Spechy_Logo} alt='Welcome to Spechy'/> */}
          </div>
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Welcome to Spechy! 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account.
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="login-email">
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
                  id="login-email"
                  placeholder="john@example.com"
                  autoFocus
                  innerRef={register({ required: true })}
                  invalid={errors.email && true}
                />
                {/*{errors && errors.email&&errors.email?.type === 'required' &&  <FormFeedback>First name is required</FormFeedback>}*/}
                {errors && errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
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
                  id="password"
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
                <CustomInput
                  type="checkbox"
                  className="custom-control-Primary"
                  id="remember-me"
                  label="Remember Me"
                />
              </FormGroup>
              <Button.Ripple type="submit" color="primary" block>
                Sign in
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <span className="mr-25">New on our platform?</span>
              <Link to="/register">
                <span>Create an account</span>
              </Link>
            </p>
            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            {/* <div className="auth-footer-btn d-flex justify-content-center"> */}
            {/* <Button.Ripple color="facebook" onClick={onLoginClick}>
                <Facebook size={14} />
              </Button.Ripple> */}
            <FacebookLogin
              appId="327300976058800"
              autoLoad={false}
              fields="name,email,picture"
              scope="public_profile,email"
              callback={onLoginClick}
              icon="fa-facebook"
              textButton={false}
              cssClass="my-facebook-button-class"
            />
            <GoogleLogin
              clientId="879500809139-mmsmpe7uhobstkccgedhr69s23g1nhnt.apps.googleusercontent.com"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              icon={true}
              buttonText={false}
            />
            {/* </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
