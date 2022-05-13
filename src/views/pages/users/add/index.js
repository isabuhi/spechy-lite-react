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
import Select from "react-select";
import { selectThemeColors } from "@utils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
// import { getAllRoles } from "../store/actions";

function Index() {
  const [formState, setFormState] = useState({
    email_address: "",
    request: 1,
    useEffectKey: 1,
    name_surname: "",
    role_id: null,
    call: null,
    phone_number: "",
    source_name: "",
  });
  const dispatch = useDispatch();
  const [projects, setProjectList] = useState([]);
  const [role, setRoleList] = useState([]);
  const [disabled, setDisabled] = useState(true);

  const [selectedProject, setSelectedProject] = useState([]);

  const store = useSelector((state) => state.users);
  console.log("mystore", store);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        console.log("projectresponse", projects);
        if (response.status === 200) {
          let typeTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            typeTemp.push({
              value: result[i].project_id,
              label: result[i].name,
            });
          }
          setProjectList(typeTemp);
          setSelectedProject(typeTemp);
        }
      });
  }, [formState.useEffectKey]);

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

  useEffect(() => {
    if ( formState.name_surname &&
      formState.role_id &&
      formState.email_address  &&
      formState.name &&
      formState.call &&
      formState.phone_number.length >= 11) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formState])

  const history = useHistory();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const SignInSchema = yup.object().shape({
    projectName: yup
      .string()
      .required("Project Name is a required field.")
      .min(5),
    phone: yup
      .string()
      .required("Phone Number is a required field.")
      .matches(phoneRegExp, "Phone number is not valid"),
  });

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

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      // if (formState.request == 1) {
      //   setFormState({
      //     ...formState,
      //     request: 0,
      //   });
      await axios
        .post(`${BASE_URL}/api/user-management/user/create`, {
          email_address: formState.email_address,
          name_surname: formState.name_surname,
          phone_number: formState.phone_number,
          sources: formState.call,
          role_id: formState.role_id,
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
      // }
    }
  };

  // useEffect(() => {
  //   dispatch(getAllRoles());
  // }, []);

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={12}>
        <Col className="mb-2 d-flex  " md={12}>
          <Row md={12}>
            <Col xs={2}>
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={8} className="d-block ml-3">
              <h3 style={{ width: "242px" }}>
                <span className="mr-2">
                  <UserPlus />
                </span>
                <FormattedMessage id="addnewuser" ></FormattedMessage>
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={{ size: 6, offset: 1 }} >
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5 ml-4">
            <FormGroup>
              <FormGroup>
                <Label for="call">
                  <FormattedMessage id="Source Name"></FormattedMessage> :{" "}
                  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  // className="react-select"
                  className={classnames({
                    "is-invalid": errors["call"],
                  })}
                  classNamePrefix="select"
                  options={projects}
                  isClearable={false}
                  name="call"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      call: [e.value],
                    })
                  }
                  innerRef={register({ required: true })}
                  invalid={errors.call && true}
                />
                {errors && errors.call && (
                  <FormFeedback>{errors.call.message}</FormFeedback>
                )}
              </FormGroup>
            </FormGroup>
            <FormGroup>
              <Label for="email_address">
                <FormattedMessage id="Email"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="email_address"
                id="email_address"
                placeholder="John@example.com"
                className={classnames({
                  "is-invalid": errors["email_address"],
                })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.email_address && true}
              />
              {errors && errors.email_address && (
                <FormFeedback>{errors.email_address.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="name_surname">
                <FormattedMessage id="name"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="name_surname"
                id="name_surname"
                placeholder="Name Surname"
                className={classnames({ "is-invalid": errors["name"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.name && true}
              />
              {errors && errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="phone" >
                <FormattedMessage id="Phone"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <PhoneInput
                country={"tr"}
                // containerStyle={{ marginTop: "4px" }}
                searchClass="search-class"
                searchStyle={{ margin: "0", width: "97%", height: "30px" }}
                enableSearchField
                disableSearchIcon
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    phone_number: e,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="role_id">
                <FormattedMessage id="Select Role"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Select
                isClearable={true}
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
            <div class="d-flex justify-content-center" >
              <Button
                onClick={onSubmit}
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
