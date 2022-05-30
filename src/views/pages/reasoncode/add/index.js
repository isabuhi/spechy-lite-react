import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";

import {
  Button,
  FormGroup,
  ButtonGroup,
  Label,
  Form,
  Input,
  Col,
  FormFeedback,
  Row,
} from "reactstrap";
import {
  AvForm,
  AvGroup,
  AvField,
  AvInput,
  AvFeedback,
  AvRadioGroup,
  AvCheckboxGroup,
  AvRadio,
  AvCheckbox,
} from "availity-reactstrap-validation-safe";

import DualList from "./dualList";
import UserDualList from "./userDualList";
import DualListTeams from "./dualListTeam";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import Select from "react-select";

import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../utility/Utils";
import { selectThemeColors } from "@utils";
import { FormattedMessage } from "react-intl";

function Index() {
  const call = [
    {
      value: 1,
      label: "Yes",
    },
    {
      value: 0,
      label: "No",
    },
  ];
  const listType = [
    {
      value: 1,
      label: "User",
    },
    {
      value: 0,
      label: "Group",
    },
  ];
  const [formState, setFormState] = useState({
    reasonName: "",
    call: null,
    request: 0,
    useEffectKey: 0,
    type: null,
    sms: null,
    mail: null,
    listType: null,
    showResults: false,
    showUser: false,
    showTeams: false,
  });
  const [projects, setProjectList] = useState([]);
  const [teams, setAllTeams] = useState([]);

  const [channels, setChannelList] = useState([]);
  const [types, setTypesList] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);

  const [selectedChannel, setSelectedChannel] = useState([]);
  const [smsList, setSmsList] = useState([]);
  const [mailList, setMailList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [call_type, setCallListType] = useState("");

  const history = useHistory();

  const [disabled, setDisabled] = useState(true)

  const SignInSchema = yup.object().shape({
    reasonName: yup
      .string()
      .required("Reason Name is a required field.")
      .min(5),

    send_call_list: yup
      .string()
      .ensure()

      .required("status is required (from outter null check)"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        if (response.status === 200) {
          setProjectList(response.data.data);
        }
      });
    //--------
    await axios
      .get(`${BASE_URL}/api/user-management/teams/get-all-user-teams`)
      .then((response) => {
        if (response.status === 200) {
          setAllTeams(response.data.data);
        }
      });
    //--------
    await axios
      .get(`${BASE_URL}/api/project-management/reason-codes/conversation/types`)
      .then((response) => {
        if (response.status === 200) {
          let typeTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            typeTemp.push({
              value: result[i].reason_code_type_id,
              label: result[i].name,
            });
          }
          setTypesList(typeTemp);
        }
      });
    //-----------
    await axios
      .get(
        `${BASE_URL}/api/project-management/sms-template/get-all-sms-template`
      )
      .then((response) => {
        if (response.status === 200) {
          let smsTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            smsTemp.push({
              value: result[i].template_id,
              label: result[i].name,
            });
          }
          setSmsList(smsTemp);
        }
      });
    //-----------
    await axios
      .get(
        `${BASE_URL}/api/project-management/email-template/get-all-email-template`
      )
      .then((response) => {
        if (response.status === 200) {
          let mailTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            mailTemp.push({
              value: result[i].template_id,
              label: result[i].name,
            });
          }
          setMailList(mailTemp);
        }
      });

    await axios
      .get(`${BASE_URL}/api/user-management/user/get-all-users`)
      .then((response) => {
        if (response.status === 200) {
          let userTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            userTemp.push({
              value: result[i].user_id,
              label: result[i].profile.name_surname,
            });
          }
          setUserList(userTemp);
        }
      });
  }, [formState.useEffectKey]); 

  useEffect(()=>{
    if(
      selectedProject.length &&
      formState.reasonName &&
      formState.sms &&
      formState.type &&
      formState.mail 
    ){
      if(formState.call == "0"){
        setDisabled(false)
      }else{
        if(formState.showUser){
          if(selectedUser.length>0) {setDisabled(false)} else setDisabled(true)   
        }else if(formState.showTeams){
          if(selectedTeam.length>0){setDisabled(false)}else setDisabled(true)
        }
      }
    }else{
      setDisabled(true)
    }
  },[formState, selectedProject, selectedTeam, selectedUser])

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

  const onSubmit = async () => {
    console.log("click submit");
    console.log("errors", errors);

    if (isObjEmpty(errors) === false) {
      const btn = document.getElementById("submit-data");
      btn.setAttribute("disabled", true);
      btn.innerText = "Submitting..";

      setTimeout(() => {
        btn.removeAttribute("disabled");
        btn.innerText = "Submit";
      }, 3000);
      await axios
        .post(
          `${BASE_URL}/api/project-management/reason-codes/conversation/create`,
          {
            sources: selectedProject,
            name: formState.reasonName,
            send_call_list: formState.call,
            send_call_list_type: formState.listType,

            email_temp_id: formState.mail,
            sms_temp_id: formState.sms,
            type: formState.type,
            send_call_list_datas:
              formState.showUser === true ? selectedUser : selectedTeam,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully added a Reason Code."}
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
    }
  };

  const projectIds = (id) => {
    setSelectedProject(id);
  };
  const teamsIds = (id) => {
    setSelectedTeam(id);
  };
  const userIds = (id) => {
    setSelectedUser(id);
  };

  // const handleChangeChannels = (e) => {
  //   var options = e.target.options;
  //   var value = [];
  //   for (var i = 0, l = options.length; i < l; i++) {
  //     if (options[i].selected) {
  //       value.push(options[i].id);
  //     }
  //   }
  //   setSelectedChannel(value);
  // };

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={9}>
        <Col className="mb-2 d-flex " md={12}>
          <Row md={12}>
            <Col xs={2} style={{paddingTop: "12px"}}>
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={10} className="d-flex ml-6">
              <UserPlus size={"50px"} style={{marginLeft: "-20px"}}/>
              <h3 className="ml-1 text-nowrap" style={{paddingTop: "14px", paddingRight: "5px"}}>
                New Conversation Reason Code
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={8} style={{ paddingLeft:"100px" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="attached">
                <FormattedMessage id="Attached Source"> </FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <DualList projectList={projects} projectIds={projectIds} />
            </FormGroup>
            <FormGroup>
              <Label for="reasonName">
                <FormattedMessage id="Reason Name"> </FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="reasonName"
                id="reasonName"
                placeholder="Reason Name"
                className={classnames({ "is-invalid": errors["reasonName"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.reasonName && true}
              />
              {errors && errors.reasonName && (
                <FormFeedback>{errors.reasonName.message}</FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="type">
                <FormattedMessage id="Reason Code Type"> </FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={types}
                isClearable={false}
                name="call"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    type: e.value,
                  })
                }
              />
              {/* {errors && errors.type && (
                <div style={{ color: "red", marginTop: ".5rem" }}>
                  <p>{errors.type.label.message}</p>
                </div>
              )} */}
            </FormGroup>
            <FormGroup>
              <Label for="sms">
                <FormattedMessage id="Select SMS Template"> </FormattedMessage>{" "}
                : <span className="text-danger">*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={smsList}
                isClearable={false}
                name="sms"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    sms: e.value,
                  })
                }
              />
              {/* {errors && errors.sms && (
                <div style={{ color: "red", marginTop: ".5rem" }}>
                  <p>{errors.sms.label.message}</p>
                </div>
              )} */}
            </FormGroup>
            <FormGroup>
              <Label for="mail">
                <FormattedMessage id="Select Mail Template"> </FormattedMessage>{" "}
                : <span className="text-danger">*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={mailList}
                isClearable={false}
                name="mail"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    mail: e.value,
                  })
                }
              />
              {/* {errors && errors.mail && (
                <FormFeedback>{errors.types.mail}</FormFeedback>
              )} */}
            </FormGroup>
            <FormGroup>
              <Label for="send_call_list">
                <FormattedMessage id="Send to Call List"> </FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Select
                isClearables
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={call}
                isClearable={false}
                name="Call"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    call: e.value,
                    showResults: e.value === 1 ? true : false,
                  })
                }
              />

              {errors && errors.send_call_list && (
                <div style={{ color: "red", marginTop: ".5rem" }}>
                  <p>{errors.send_call_list.message}</p>
                </div>
              )}
            </FormGroup>
            {formState.showResults === true && (
              <>
                <FormGroup>
                  <Label for="List Type">
                    <FormattedMessage id="Send to Call List Type"></FormattedMessage>
                    : <span className="text-danger">*</span>
                  </Label>
                  <Select
                    required
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    options={listType}
                    isClearable={false}
                    name="List Type"
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        listType: e.value,
                        showUser: e.value === 1 ? true : false,
                        showTeams: e.value === 0 ? true : false,
                      })
                    }
                  />
                  {/* {errors && errors.call && (
                       <div style={{ color: "red", marginTop: ".5rem" }}>
                         <p>{errors.call.label.message}</p>
                       </div>
                     )} */}
                </FormGroup>
              </>
            ) }

            {formState.showTeams === true && (
              <FormGroup>
                <Label for="teams">
                  User Group
                  <span className="text-danger">*</span>
                </Label>
                <DualListTeams projectList={teams} projectIds={teamsIds} />
              </FormGroup>
            ) }

            {formState.showUser === true ? (
              <FormGroup>
                <Label for="user">
                  <FormattedMessage id="User List"> </FormattedMessage> :{" "}
                  <span className="text-danger">*</span>
                </Label>
                <UserDualList userList={userList} userIds={userIds} />
              </FormGroup>
            ) : (
              ""
            )}
            <div class="d-flex justify-content-center" >
            <Button
              onClick={onSubmit}
              className="btn-block mr-1 mt-0"
              color="primary"
              type="submit"
              id="submit-data"
              //disabled={disabled}
            >
              <FormattedMessage id="create"> </FormattedMessage>
            </Button>
            <Button
              onClick={history.goBack}
              type="reset"
              color="secondary"
              outline
              className="btn-block mt-0"
            >
              <FormattedMessage id="Cancel"> </FormattedMessage>
            </Button>
            </div>
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default Index;
