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
import Axios from "axios";
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
import useDigitInput from "react-digit-input";
import { val } from "dom7";

function Register(props) {
  const emailssss = localStorage.getItem("temp_email");
  console.log("emailssss", emailssss);

  const [skin, setSkin] = useSkin();
  const history = useHistory();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const [value, onChange] = useState("");
  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 6,
    value,
    onChange,
  });

  const SignInSchema = yup.object().shape({});

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
  const isNumber = function isNumeric(num) {
    return !isNaN(num);
  };
  //console.log("checkthesubmit1", isObjEmpty(errors))
  //console.log("phone", formState.phone)
  const onSubmit = () => {
    if (isNumber(value) === true && value > 99999 && value < 10000000) {
      Axios.post(
        `https://app.spechy.com:8000/api/auth/verify/email/${value}`,
        {
          email: emailssss,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => {
          console.log("hello", res);

          history.push("/login");
          toast.success(
            <ToastContent
              type={"success"}
              content={
                "You have successfully virified. Please sing in with your information."
              }
              header={"Congratulations !!"}
            />,
            { transition: Slide, hideProgressBar: true, autoClose: 3000 }
          );
        })
        .catch((error) => error);
    } else {
      console.log("error");
    }
    console.log(value);
  };

  const style = {
    display: "inline",
    width: "15%",
    margin: "2px",
    outline: "0",
    borderWidth: "0 0 2px",
    textAlign: "center",
    fontSize: "19px",
    fontFamily: "Montserrat, Helvetica, Arial, serif",
    backgroundColor: "#bae8f5",
    borderRadius: "10px",
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
                <input
                  style={style}
                  inputMode="decimal"
                  autoFocus
                  {...digits[0]}
                />
                <input style={style} inputMode="decimal" {...digits[1]} />
                <input style={style} inputMode="decimal" {...digits[2]} />
                <input style={style} inputMode="decimal" {...digits[3]} />
                <input style={style} inputMode="decimal" {...digits[4]} />
                <input style={style} inputMode="decimal" {...digits[5]} />
              </FormGroup>
              <Button.Ripple type="submit" block color="primary">
                Submit
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
