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
  CustomInput,
} from "reactstrap";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { selectThemeColors } from "@utils";

import Avatar from "../../../../src/@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../src/utility/Utils";
import { Editor } from "react-draft-wysiwyg";
import "@styles/react/libs/editor/editor.scss";
import { EditorState } from "draft-js";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "../../../../node_modules/flatpickr/dist/flatpickr.css";

function AddTicket(props) {
  const { closeToggle, customer_id, setCenteredModal } = props;
  const perioty = [
    {
      value: 0,
      label: "Low",
    },
    {
      value: 1,
      label: "Normal",
    },
    {
      value: 2,
      label: "High",
    },
  ];
  const statusValue = [
    {
      value: 0,
      label: "Pending",
    },
    {
      value: 1,
      label: "Resolved",
    },
    {
      value: 2,
      label: "Unresolved",
    },
  ];
  const [valueText, setValue] = useState(EditorState.createEmpty());
  const [pickerStart, setPickerStart] = useState(new Date());
  const [pickerEnd, setPickerEnd] = useState(new Date());
  const [projectList, setProjectList] = useState([""]);
  const [disabled, setDisabled] = useState(true);
  const [startDateChange, setStartDateChange] = useState(false);
  const [endDateChange, setEndDateChange] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    priority: null,
    request: 1,
    useEffectKey: 0,
    status: null,
    access: null,
    tags: [],
    assgin: null,
    project: null,
  });
  const [userList, setUserList] = useState([]);
  const [customers, setCustomerList] = useState([]);

  const history = useHistory();

  const SignInSchema = yup.object().shape({
    title: yup.string().required("Title is required field.").min(5),
    access: yup.string().required("Access is required field."),
    user: yup.string().required("Select a Customer is required field."),
    priority: yup.string().required("Select a Priority is required field."),
    status: yup.string().required("Select a Status is required field."),
    assgin: yup.string().required("Select a Assign is required field."),
    project: yup.string().required("Select a Project is required field."),
  });

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/user/get-all-users`)
      .then((response) => {
        if (response.status === 200) {
          //console.log(response.data.data)
          setUserList(response.data.data);
        }
      });
    //-----------
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        if (response.status === 200) {
          let array = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            array.push({
              value: result[i].project_id,
              label: result[i].name,
            });
          }
          //console.log(array)

          setProjectList(array);
        }
      });
  }, [formState.useEffectKey]);


  useEffect(() => {
    if(
          formState.title &&
          formState.priority &&
          formState.assgin &&
          formState.status &&
          startDateChange &&
          endDateChange &&
          valueText
    ) {setDisabled(false)} else {
      setDisabled(true)
    }
  }, [formState, startDateChange, endDateChange, valueText]);

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
    let d = new Date(pickerStart[0]);
    let startTimeChanged =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getDate() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes();

    let b = new Date(pickerEnd[0]);
    var pickerEndChanged =
      b.getFullYear() +
      "-" +
      (b.getMonth() + 1) +
      "-" +
      b.getDate() +
      " " +
      b.getHours() +
      ":" +
      b.getMinutes();

    if (isObjEmpty(errors)) {
      //
      // if (formState.request == 1) {
      //   setFormState({
      //     ...formState,
      //     request: 0,
      //   });
      await axios
        .post(`${BASE_URL}/api/ticket-management/ticket/create-new-ticket`, {
          subject: formState.title,
          description: valueText.getCurrentContent().getPlainText(),
          priority: formState.priority,
          source: projectList.length===1 ? projectList[0].value : formState.project,
          status: formState.status,
          startAt: startTimeChanged,
          endAt: pickerEndChanged,
          customer_id: customer_id,
          assigned_uid: formState.assgin,
        })
        .then((response) => {
          if (response.status === 200) {
            setCenteredModal(false)
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully added a Ticket Category."}
                header={"Congratulations !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            );
            //   history.goBack();
            closeToggle();
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
      // }
    }
  };

  const setAssign = (id) => {
    let value = [];
    if (typeof id.target.value === "string") {
      value[0] = id.target.value;
    } else {
      value = id.target.value;
    }
    setFormState({
      ...formState,
      assgin: value,
    });
  };

  const handleOnSearch = async (string, results) => {
    if (string.length > 2) {
      await axios
        .post(
          `${BASE_URL}/api/customer-management/customer/get-like-customer`,
          { search: string }
        )
        .then((response) => {
          if (response.status === 200) {
            if (response.data.data.length > 0) {
              let ret = response.data.data;
              let array = [];
              for (let i = 0; i < ret.length; i++) {
                if (ret[i].phone != null) {
                  array.push({
                    id: ret[i].customer_id,
                    name:
                      ret[i].profile.name_surname +
                      "(" +
                      ret[i].phone.phone_number +
                      ") - " +
                      ret[i].email.email_address,
                  });
                } else {
                  array.push({
                    id: ret[i].customer_id,
                    name: ret[i].profile.name_surname,
                  });
                }
                setCustomerList([...array]);
              }
            }
          }
        });
    }
  };

  const handleOnHover = (result) => {
    // the item hovered
    //console.log(result)
  };

  const handleOnSelect = (item) => {
    setFormState({
      ...formState,
      user: item.id,
    });
    // the item selected
  };

  const handleOnFocus = () => {
    //console.log('Focused')
  };

  const formatResult = (item) => {
    return item;
  };

  const setValueEdit = (data) => {
    setValue(data);
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
            <Col xs={9} className="d-flex ml-1">
              <UserPlus />
              <h3 className="ml-1">New Ticket</h3>
            </Col>
          </Row>
        </Col>
        <Col md={10} style={{ paddingLeft:"100px" }} >
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5 align-content-center">
            <FormGroup>
              <Label for="title">
                Ticket Name : <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="title"
                id="title"
                placeholder="Ticket Subject"
                className={classnames({ "is-invalid": errors["title"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.title && true}
              />
              {errors && errors.title && (
                <FormFeedback>{errors.title.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="top">
                Assign To : <span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                name="select"
                id="select-multi"
                multiple
                onChange={(e) => {
                  setAssign(e);
                }}
              >
                {userList.map(function (object, i) {
                  return (
                    <option value={object.user_id}>
                      {" "}
                      {object.profile.name_surname}{" "}
                    </option>
                  );
                })}
              </Input>
              {errors && errors.type && (
                <FormFeedback>{errors.top.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Row md={12}>
                <Col md={{ size: 6 }}>
                  <Label for="status">
                    Status : <span className="text-danger">*</span>
                  </Label>
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    options={statusValue}
                    isClearable={false}
                    name="status"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        status: e.value,
                      })
                    }
                  />
                  {errors && errors.status && (
                    <FormFeedback>{errors.status.message}</FormFeedback>
                  )}
                </Col>
                <Col md={{ size: 6 }}>
                  <Label for="priority">
                    Priority : <span className="text-danger">*</span>
                  </Label>
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    options={perioty}
                    isClearable={false}
                    name="priority"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        priority: e.value,
                      })
                    }
                  />
                  {errors && errors.priority && (
                    <FormFeedback>{errors.priority.message}</FormFeedback>
                  )}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row md={12}>
                <Col md={{ size: 6 }}>
                  <Label for="call">
                    Start Date : <span className="text-danger">*</span>
                  </Label>
                  <Flatpickr
                    value={pickerStart}
                    data-enable-time
                    id="date-time-picker"
                    className="form-control"
                    onChange={(date) =>{
                      setPickerStart(date);
                      setStartDateChange(true)
                    } }
                  />
                  {errors && errors.call && (
                    <FormFeedback>{errors.call.message}</FormFeedback>
                  )}
                </Col>
                <Col md={{ size: 6 }}>
                  <Label for="call">
                    End Date : <span className="text-danger">*</span>
                  </Label>
                  <Flatpickr
                    value={pickerEnd}
                    data-enable-time
                    id="date-time-picker"
                    className="form-control"
                    onChange={(date) =>{
                      setPickerEnd(date);
                      setEndDateChange(true)
                    } }
                  />{" "}
                  {errors && errors.call && (
                    <FormFeedback>{errors.call.message}</FormFeedback>
                  )}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="call">
                Description : <span className="text-danger">*</span>
              </Label>
              <Editor
                editorState={valueText}
                onEditorStateChange={(data) => setValueEdit(data)}
              />
              {errors && errors.call && (
                <FormFeedback>{errors.call.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              {projectList.length === 1 ? 
              <Row md={12}>
              <Col md={{ size: 6 }}>
                <Label for="project">
                  Source : <span className="text-danger">*</span>
                </Label>
                <Input
                disabled="true"
                name="title"
                id="title"
                placeholder={projectList[0].label}
                className={classnames({ "is-invalid": errors["title"] })}
                
                innerRef={register({ required: true })}
                invalid={errors.title && true}
              />
              </Col>
            </Row> :
            <Row md={12}>
            <Col md={{ size: 6 }}>
              <Label for="project">
                Source : <span className="text-danger">*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={projectList}
                isClearable={false}
                name="project"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    project: e.value,
                  })
                }
              />
              {errors && errors.project && (
                <FormFeedback>{errors.project.message}</FormFeedback>
              )}
            </Col>
          </Row>}
              
            </FormGroup>
            <div className="row col-12 justify-content-center" >
            <div className="col-4" >
            <Button
              onClick={onSubmit}
              disabled={disabled}
              type="button"
              color="primary"
              style={{width:"100%"}}
            >
              Submit
            </Button>
            </div>
            <div className="col-4" >
            <Button
              onClick={history.goBack}
              type="reset"
              color="secondary"
              outline
              style={{width:"100%"}}
            >
              Cancel
            </Button>
            </div>
            </div>
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default AddTicket;
