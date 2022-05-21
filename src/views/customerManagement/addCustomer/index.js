import React, { Fragment, useEffect, useState } from "react";

import classnames from "classnames";
import { useForm } from "react-hook-form";
import {
  Button,
  FormGroup,
  Label,
  FormText,
  Form,
  Input,
  Col,
  FormFeedback,
  Row,
  CustomInput,
} from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";
import { useDispatch, useSelector } from "react-redux";

import Select from "react-select";
import {
  isObjEmpty,
  getHomeRouteForLoggedInUser,
  isObjEmptyf,
} from "../../../utility/Utils";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeftCircle,
  Coffee,
  FolderPlus,
} from "react-feather";
import axios from "axios";
import { getCountries } from "../store/Actions";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";
import Avatar from "../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FormattedMessage } from "react-intl";

const customId = "custom-id-yes";

const index = (props) => {
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [formState, setFormState] = useState({
    name_surname: "",
    city: "",
    district: "",
    customer_id: "",
    onTime: 0,
    country: "",
    allCities: [{}],
    AllCountries: [{}],
    // customer_id: [],
  });

  const defaultValues = {
    phoneNumber: "",
    ReactSelect: null,
    reactFlatpickr: null,
  };

  const [phone_number, setPhoneNumber] = useState([{}]);
  const [email_address, setEmailAddress] = useState([{}]);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.customers);
  const history = useHistory();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const SignInSchema = yup.object().shape({
    email_address: yup
      .string()
      .required("Email is a required field.")
      .email("Email must be a valid email."),
    name_surname: yup.string().required(" name is a required field.").min(5),

    phone_number: yup
      .string()
      .required("Phone number is a required field.")
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

  useEffect(() => {
    dispatch(getCountries());
  }, []);

  const options = store.filterItems ? store.filterItems : null;
  if (options != null) {
    var listItems = [{}];

    for (var i = 0; i < options.length; i++) {
      listItems[i] = {
        val: options[i].country_id,
        label: options[i].country_name,
      };
    }
  }

  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      // if (formState.onTime === 0) {
      //   setFormState({
      //     ...formState,
      //     onTime: 1,
      //   });

      const btn = document.getElementById("submit-data");
      btn.setAttribute("disabled", true);
      btn.innerText = "Checking..";

      setTimeout(() => {
        btn.removeAttribute("disabled");
        btn.innerText = "Submit";
      }, 4000);

      await axios
        .post(
          `${BASE_URL}/api/customer-management/customer/create-new-customer`,
          {
            customer_id: formState.customer_id,
            name_surname: formState.name_surname,
            phone_number: phone_number,
            city: formState.city,
            district: formState.district_name,
            email_address: email_address,

            country: formState.country,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully added a user."}
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
            // setErrorRes(arr[0]);

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

  const onChange = async (id) => {
    if (id != null) {
      await axios
        .get(
          `${BASE_URL}/api/project-management/address-management/country/get-all-cities/${id.val}`
        )
        .then((response) => {
          if (response.status === 200) {
            var result = Object.values(response.data.data);
            var cityItemss = [{}];
            for (var j = 0; j < result.length; j++) {
              cityItemss[j] = {
                val: result[j].city_id,
                label: result[j].city_name,
              };
            }
            setFormState({
              ...formState,
              allCities: cityItemss,
              country: id.val,
            });
          }
        })
        .catch(() => console.log("error"));
    }
  };

  const onChangeCities = async (id) => {
    console.log("whhhhhhhhhh", id.val);
    if (id != null) {
      await axios
        .get(
          `${BASE_URL}/api/project-management/address-management/country/get-all-districts/${formState.country}/${id.val}`
        )
        .then((response) => {
          if (response.status === 200) {
            var result = Object.values(response.data.data);
            var distirctItems = [{}];
            for (var j = 0; j < result.length; j++) {
              distirctItems[j] = {
                val: result[j].district_id,
                label: result[j].district_name,
              };
            }
            setFormState({
              ...formState,
              district: distirctItems,
              city: id.val,
            });
          }
        })
        .catch(() => console.log("error"));
    }
  };

  const handlePhoneChange = (e, index) => {
    const value = e;
    const phoneList = [...phone_number];
    phoneList[index] = value;
    setPhoneNumber(phoneList);
  };

  const handleEmailChange = (e, i) => {
    const value = e.target.value;
    const emailList = [...email_address];

    emailList[i] = value;

    setEmailAddress(emailList);
  };

  // handle click event of the Remove button
  const handleRemovePhone = (index) => {
    const phoneList = [...phone_number];
    phoneList.splice(index, 1);
    setPhoneNumber(phoneList);
  };

  const handleRemoveEmail = (index) => {
    const emailList = [...email_address];
    emailList.splice(index, 1);
    setEmailAddress(emailList);
  };

  const handleAddPhone = () => {
    setPhoneNumber([...phone_number, { phone_number: "" }]);
  };

  const handleAddEmail = () => {
    setEmailAddress([...email_address, { email_address: "" }]);
  };

  const notify = () => {
    toast("I cannot be duplicated!", {
      toastId: customId,
    });
  };

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={12}>
        <Col className="mb-2 d-flex " md={12}>
          <Row md={12}>
            <Col xs={2}>
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={8} className="d-flex ml-3">
              <FolderPlus />
              <h3 className="ml-1">
                <FormattedMessage id="addNewCustomer"></FormattedMessage>
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={{ size: 6, offset: 2 }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-5 pb-5">
            <FormGroup>
              <Label for="name_surname">
                <FormattedMessage id="Name Surname"></FormattedMessage>{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="name_surname"
                id="name_surname"
                placeholder="Name Surname"
                className={classnames({ "is-invalid": errors["full-name"] })}
                defaultValue={formState.name_surname}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.name_surname && true}
              />
              {errors && errors.name_surname && (
                <FormFeedback>{errors.name_surname.message}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              {email_address.map((x, i) => {
                return (
                  <div className="box">
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    >
                      <Label for="email_address">
                        <FormattedMessage id="Email"></FormattedMessage>{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="email_address"
                        name="email_address"
                        id="email_address"
                        placeholder="john.doe@example.com"
                        onChange={(e) => handleEmailChange(e, i)}
                        innerRef={register({ required: true })}
                        invalid={errors.email_address && true}
                      />
                      {errors && errors.email_address && (
                        <FormFeedback>
                          {errors.email_address.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    ></div>

                    <div style={{ paddingTop: "10px" }}>
                      {email_address.length !== 1 && (
                        <Button.Ripple
                          color="primary"
                          onClick={() => handleRemoveEmail(i)}
                        >
                          <FormattedMessage id="Remove"></FormattedMessage>
                        </Button.Ripple>
                      )}
                      {email_address.length - 1 === i && (
                        <Button.Ripple color="primary" onClick={handleAddEmail}>
                          <FormattedMessage id="Add"></FormattedMessage>
                        </Button.Ripple>
                      )}
                    </div>
                  </div>
                );
              })}
            </FormGroup>

            <FormGroup>
              {phone_number.map((x, i) => {
                return (
                  <div className="box">
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    >
                      <PhoneInput
                        country={"tr"}
                        name="phone_number"
                        containerStyle={{ marginTop: "15px" }}
                        searchClass="search-class"
                        searchStyle={{
                          margin: "0",
                          width: "97%",
                          height: "30px",
                        }}
                        enableSearchField
                        disableSearchIcon
                        onChange={(e) => handlePhoneChange(e, i)}
                        innerRef={register({ required: true })}
                        invalid={errors.phone_number && true}
                      />
                      {errors && errors.phone_number && (
                        <FormFeedback>
                          {errors.phone_number.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                      }}
                    ></div>

                    <div style={{ paddingTop: "10px" }}>
                      {phone_number.length !== 1 && (
                        <Button.Ripple
                          color="primary"
                          onClick={() => handleRemovePhone(i)}
                        >
                          <FormattedMessage id="Remove"></FormattedMessage>
                        </Button.Ripple>
                      )}
                      {phone_number.length - 1 === i && (
                        <Button.Ripple color="primary" onClick={handleAddPhone}>
                          <FormattedMessage id="Add"></FormattedMessage>
                        </Button.Ripple>
                      )}
                    </div>
                  </div>
                );
              })}
            </FormGroup>

            <FormGroup>
              <Label for="role">
                <FormattedMessage id="Country List"></FormattedMessage>
              </Label>
              <Select
                isClearable={true}
                name="countyID"
                className="react-select"
                classNamePrefix="select"
                options={listItems}
                defaultValue={formState.AllCountries}
                onChange={(e) => onChange(e)}
                innerRef={register({ required: true })}
                invalid={errors.AllCountries && true}
              />
              {errors && errors.AllCountries && (
                <FormFeedback>{errors.AllCountries.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="role">
                <FormattedMessage id="City List"></FormattedMessage>
              </Label>
              <Select
                isClearable={true}
                name="allCities"
                className="react-select"
                classNamePrefix="select"
                options={formState.allCities}
                defaultValue={formState.allCities}
                onChange={(e) => onChangeCities(e)}
                innerRef={register({ required: true })}
                invalid={errors.allCities && true}
              />
              {errors && errors.allCities && (
                <FormFeedback>{errors.allCities.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="role">
                <FormattedMessage id="Districts List"></FormattedMessage>
              </Label>
              <Select
                isClearable={true}
                name="cityID"
                className="react-select"
                classNamePrefix="select"
                options={formState.district}
                defaultValue={formState.district}
                onChange={(data) =>
                  setFormState({
                    ...formState,
                    district: data,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.district && true}
              />
              {errors && errors.district && (
                <FormFeedback>{errors.district.message}</FormFeedback>
              )}
            </FormGroup>

            <Button
              onClick={onSubmit}
              type="submit"
              className="mr-1"
              color="primary"
              id="submit-data"
            >
              <FormattedMessage id="Save"></FormattedMessage>
            </Button>
            <Button
              onClick={history.goBack}
              type="reset"
              color="secondary"
              outline
            >
              <FormattedMessage id="Cancel"></FormattedMessage>
            </Button>
          </Form>
        </Col>
      </Col>
    </div>
  );
};

export default index;
