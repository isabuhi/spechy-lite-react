import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Lock, Edit, Trash2, Coffee, AlertCircle } from "react-feather";
import {
  Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  CustomInput,
  FormFeedback,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import Avatar from "../../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { TagInput } from "reactjs-tag-input";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { getFilterItems } from "../store/actions";
import { Editor } from "react-draft-wysiwyg";
import "@styles/react/libs/editor/editor.scss";
import { EditorState } from "draft-js";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const GeneralInfo = (props) => {
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
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState([]);

  const { id } = useParams();

  const [valueText, setValueText] = useState(EditorState.createEmpty());
  const [pickerStart, setPickerStart] = useState(new Date());
  const [pickerEnd, setPickerEnd] = useState(new Date());
  const [projectList, setProjectList] = useState([""]);
  const [formState, setFormState] = useState({
    title: "",
    priority: null,
    request: 1,
    useEffectKey: 0,
    status: null,
    access: null,
    tags: [],
    user: null,
    assgin: null,
    project: null,
  });
  const [userList, setUserList] = useState([]);
  const [customers, setCustomerList] = useState([]);

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const [category, setCategoryList] = useState([]);
  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/ticket-management/ticket/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setFormState({
            ...formState,
            title: response.data.data.subject,
          });
          console.log(response.data.data);
        }
      });
  }, []);

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

  const setAssign = (id) => {
    console.log(id.target.value);
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
    console.log("item selected", item);
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
    if (1) {
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
      await axios
        .post(`${BASE_URL}/api/ticket-management/ticket/update-ticket/${id}`, {
          subject: formState.title,
          description: valueText.getCurrentContent().getPlainText(),
          priority: formState.priority,
          source: formState.project,
          status: formState.status,
          startAt: startTimeChanged,
          endAt: pickerEndChanged,
          customer_id: formState.user,
          assigned_uid: formState.assgin,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully update a ticket."}
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
            <Col md={{ size: 8, offset: 2 }}>
              <FormGroup>
                <Label for="title">
                  Ticket Name : <span className="text-danger">*</span>
                </Label>
                <Input
                  autoFocus
                  name="title"
                  id="title"
                  value={formState.title}
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
                      onChange={(date) => setPickerStart(date)}
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
                      onChange={(date) => setPickerEnd(date)}
                    />{" "}
                    {errors && errors.call && (
                      <FormFeedback>{errors.call.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="Description">
                  Description : <span className="text-danger">*</span>
                </Label>
                <Editor
                  editorState={valueText}
                  onEditorStateChange={(data) => setValueText(data)}
                />
                {errors && errors.call && (
                  <FormFeedback>{errors.call.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Row md={12}>
                  <Col md={{ size: 6 }}>
                    <Label for="call">
                      Find Customer : <span className="text-danger">*</span>
                    </Label>
                    <ReactSearchAutocomplete
                      items={customers}
                      onSearch={handleOnSearch}
                      onHover={handleOnHover}
                      onSelect={handleOnSelect}
                      onFocus={handleOnFocus}
                      styling={{
                        border: "1px solid #d8d6de",
                        borderRadius: 1,
                        backgroundColor: "white",
                        zIndex: 1,
                        marginBottom: "10px",
                      }}
                      autoFocus
                      formatResult={formatResult}
                    />
                    {errors && errors.call && (
                      <FormFeedback>{errors.call.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md={{ size: 6 }}>
                    <Label for="project">
                      Srouce : <span className="text-danger">*</span>
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
                </Row>
              </FormGroup>
            </Col>

            <Col md={{ size: 6, offset: 2 }}>
              <Button.Ripple
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="button"
                color="primary"
              >
                Save Changes
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                color="secondary"
                outline
              >
                Cancel
              </Button.Ripple>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GeneralInfo;
