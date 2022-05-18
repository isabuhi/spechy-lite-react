import React, { Fragment } from "react";
import { useState, useEffect, useContext } from "react";
import { Coffee, AlertCircle } from "react-feather";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import Avatar from "../../../../src/@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useHistory, useParams } from "react-router-dom";
// import InputPasswordToggle from "../../../../@core/components/input-password-toggle";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { IntlContext } from "../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";
import PhoneInput from "react-phone-input-2";
import { getCountries } from "../store/Actions";

import "react-phone-input-2/lib/style.css";

const GeneralInfo = (props) => {
  const context = useContext(IntlContext);

  const history = useHistory();
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [getCompanyName, setCompanyName] = useState(null);
  const { id } = useParams();

  const [formState, setFormState] = useState({
    name_surname: "",
    city: "",
    customer_id: 1,
    district:"",
    country: "",
    allCities: [{}],
    AllCountries: [{}],
    AllDistrict: [{}],
  });

  const [phone_number, setPhoneNumber] = useState("");
  const [email_address, setEmailAddress] = useState(null);
  const [valueOfPhone, setValueOfPhone] = useState(null);

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });
  useEffect(() => {
    dispatch(getCountries());
  }, []);

  const store = useSelector((state) => state.customers);

  // const onChange = (e) => {
  //   const file = URL.createObjectURL(e.target.files[0]);
  //   setFormState({ ...formState, imgPath: file });
  //   setImageForRequest(e.target.files[0]);
  // };

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/customer-management/customer/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setFormState(response.data.data.profile);
          setCompanyName(response.data.data.profile.name_surname);

          if (response.data.data.phones.length > 0) {
            const pickedPhone = response.data.data.phones.map((x) => {
              return x.phone_number;
            });
            // setPhoneNumber(pickedPhone);
            setValueOfPhone(pickedPhone[0]);
          }
          if (response.data.data.emails.length > 0) {
            const pickedEmail = response.data.data.emails.map((x) => {
              return x.email_address;
            });
            setEmailAddress(pickedEmail);
          }

          // setPhoneNumber(response.data.data.phones[0]);
          // setEmailAddress(response.data.data.emails);
        }
      });
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

  const onChangeCountry = async (id) => {
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
    // if (ids != null) {
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
            AllDistrict: distirctItems,
            city: id.val,
          });
        }
      })
      .catch(() => console.log("error"));
    // }
  };

  const onChanceHandler = (e) => {
    setFormState({
      ...phone_number,
      [e.target.name]: e.target.value,
    });
  };

  const onChanceEmailHandler = (e) => {
    setEmailAddress({
      ...email_address,
      [e.target.name]: e.target.value,
    });
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

  const renderContactAvatar = () => {
    if (formState.imgPath === null) {
      const stateNum = Math.floor(Math.random() * 6),
        states = [
          "light-success",
          "light-danger",
          "light-warning",
          "light-info",
          "light-primary",
          "light-secondary",
        ],
        color = states[stateNum];
      return (
        <Avatar
          initials
          color={color}
          className="rounded mr-2 my-25"
          content={"tolga"}
          contentStyles={{
            borderRadius: 0,
            fontSize: "calc(36px)",
            width: "100%",
            height: "100%",
          }}
          style={{
            height: "90px",
            width: "90px",
          }}
        />
      );
    } else {
      return (
        <img
          className="user-avatar rounded mr-2 my-25 cursor-pointer"
          src={formState.imgPath}
          alt="user profile avatar"
          height="90"
          width="90"
        />
      );
    }
  };

  const toggleModal = () => {
    setDeleteModal(!deleteModal);
  };

  const onChangePhoneHandler = (e) => {
    setPhoneNumber(e);
  };

  const onSubmit = async () => {
    if (1) {
      // console.log("hi", formState.phone_number[0].phone);
      await axios
        .post(
          `${BASE_URL}/api/customer-management/customer/update-customer/${id}`,
          {
            name_surname: formState.name_surname,
            customer_id: formState.customer_id,
            country: typeof formState.country === "object" ? formState.country.country_id : formState.country,
            district: formState.district=== "object" ? formState.district.district_id : formState.district.val,
            city: typeof formState.city === "object" ? formState.city.city_id : formState.city,
            phone_number:
              valueOfPhone === null ? [phone_number] : [valueOfPhone],
            email_address: email_address,
            // customer_company_id: formState.customer_company_id,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully update a company."}
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
  };

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="4" sm="12">
              <FormGroup>
                <Label for="name_surname">
                  <FormattedMessage id="Customer Name"></FormattedMessage>
                </Label>
                <Input
                  type="text"
                  id="name_surname"
                  placeholder="Jhon Doe"
                  defaultValue={formState.name_surname}
                  name="name_surname"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.name_surname && true}
                />
                {errors && errors.name_surname && (
                  <FormFeedback>{errors.name_surname.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="4" sm="12">
              <FormGroup>
                <div className="box">
                  <div
                    style={{
                      display: "inline-block",
                    }}
                  >
                    <PhoneInput
                      value={valueOfPhone}
                      country={"tr"}
                      name="phone_number"
                      containerStyle={{ marginTop: "15px" }}
                      searchClass="search-class"
                      searchStyle={{
                        margin: "0",
                        width: "97%",
                        height: "30px",
                      }}
                      onChange={onChangePhoneHandler}
                    />
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                    }}
                  ></div>
                </div>
              </FormGroup>
            </Col>
            <Col md="4" sm="12">
              <FormGroup>
                <Label for="email_address">
                  <FormattedMessage id="Email address"></FormattedMessage>
                </Label>
                <Input
                  type="text"
                  id="email_address"
                  placeholder=" Email Address"
                  defaultValue={email_address}
                  name="email_address"
                  onChange={onChanceEmailHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.email_address && true}
                />
                {errors && errors.email_address && (
                  <FormFeedback>{errors.email_address.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="role">
                  <FormattedMessage id="Country List"></FormattedMessage>
                </Label>
                <Select
                  name="countyID"
                  className="react-select"
                  classNamePrefix="select"
                  options={listItems}
                  placeholder={formState.country ? formState.country.country_name : "--"}
                  onChange={(e) => onChangeCountry(e)}
                  innerRef={register({ required: true })}
                  invalid={errors.countryCode && true}
                />
                {errors && errors.countryCode && (
                  <FormFeedback>{errors.countryCode.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="role">
                  <FormattedMessage id="City List"></FormattedMessage>
                </Label>
                <Select
                  name="allCities"
                  className="react-select"
                  classNamePrefix="select"
                  options={formState.allCities}
                  isDisabled={!formState.allCities ? true : false}
                  onChange={(e) => onChangeCities(e)}
                  placeholder={ formState.city ? formState.city.city_name : "--"}
                  innerRef={register({ required: true })}
                  invalid={errors.cityCode && true}
                />
                {errors && errors.cityCode && (
                  <FormFeedback>{errors.cityCode.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="role">
                  <FormattedMessage id="Districts List"></FormattedMessage>
                </Label>
                <Select
                  name="cityID"
                  className="react-select"
                  classNamePrefix="select"
                  placeholder={formState.district ? formState.district.district_name : "--"}
                  options={formState.AllDistrict}
                  isDisabled={!formState.AllDistrict ? true : false}
                  onChange={(data) =>
                    setFormState({
                      ...formState,
                      district: data,
                    })
                  }
                  innerRef={register({ required: true })}
                  invalid={errors.districtCode && true}
                />
                {errors && errors.districtCode && (
                  <FormFeedback>{errors.districtCode.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>

            <Col className="d-flex flex-sm-row flex-column mt-2" sm="12">
              <Button.Ripple
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
                color="primary"
              >
                <FormattedMessage id="Save Changes"></FormattedMessage>
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
  );
};

export default GeneralInfo;