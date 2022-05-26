import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import classnames from "classnames";
import { useForm } from "react-hook-form";

import {
  Button,
  ButtonGroup,
  FormGroup,
  Label,
  Form,
  Input,
  Col,
  FormFeedback,
  Row,
} from "reactstrap";

import DualList from "./dualList";
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

const customId = "custom-id-yes";

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
  const [formState, setFormState] = useState({
    reasonName: "",
    call: null,
    request: 1,
    useEffectKey: 0,
    type: null,
    sms: null,
    mail: null,
    status: null,
  });
  const [projects, setProjectList] = useState([]);
  const [status, setStatus] = useState([]);
  const [types, setTypesList] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [smsList, setSmsList] = useState([]);
  const [mailList, setMailList] = useState([]);
  const [disabled, setDisabled] = useState(true)

  const history = useHistory();

  const SignInSchema = yup.object().shape({
    reasonName: yup
      .string()
      .required("Reason Name is a required field.")
      .min(5),
    // call: yup.string().required("Send to Call List is a required field.")
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
    //------------
    await axios
      .get(
        `${BASE_URL}/api/project-management/reason-codes/ticket/status-types`
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          let statusTemp = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            statusTemp.push({
              value: result[i].reason_code_status_type_id,
              label: result[i].name,
            });
          }
          setStatus(statusTemp);
        }
      });
  }, [formState.useEffectKey]);

  useEffect(()=>{
    if(
      selectedProject.length &&
      formState.reasonName &&
      formState.call &&
      formState.type &&
      formState.sms &&
      formState.mail
      ){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
  },[formState, selectedProject])

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
      const btn = document.getElementById("submit-data");
      btn.setAttribute("disabled", true);
      btn.innerText = "Submitting..";

      setTimeout(() => {
        btn.removeAttribute("disabled");
        btn.innerText = "Submit";
      }, 3000);
      await axios
        .post(`${BASE_URL}/api/project-management/reason-codes/ticket/create`, {
          sources: selectedProject,
          name: formState.reasonName,
          ticket_status_type_id: formState.call,
          email_temp_id: formState.mail,
          sms_temp_id: formState.sms,
          type: formState.type,
        })
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
      // }
    }
  };

  const projectIds = (id) => {
    setSelectedProject(id);
  };

  const handleChangeChannels = (e) => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].id);
      }
    }
    setSelectedChannel(value);
  };

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
            <Col xs={9} className="d-flex mr-1">
              <UserPlus size="60px" style={{paddingBottom: "10px"}}/>
              <h3 className="ml-1 text-nowrap" style={{paddingTop: "14px", paddingRight: "5px"}}>
                Add Ticket Reason Code
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={8} style={{ paddingLeft:"100px" }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="attached">
                <FormattedMessage id="AttachedSource"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <DualList projectList={projects} projectIds={projectIds} />
            </FormGroup>
            <FormGroup>
              <Label for="reasonName">
                <FormattedMessage id="ReasonName"></FormattedMessage> :{" "}
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
              <Label for="call">
                <FormattedMessage id="Status"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={status}
                isClearable={false}
                name="call"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    call: e.value,
                  })
                }
              />
              {errors && errors.call && (
                <FormFeedback>{errors.call.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="type">
                <FormattedMessage id="ReasonCodeType"></FormattedMessage> :{" "}
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
              {errors && errors.type && (
                <FormFeedback>{errors.type.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="sms">
                <FormattedMessage id="SelectSMSTemplate"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
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
              {errors && errors.sms && (
                <FormFeedback>{errors.sms.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="mail">
                <FormattedMessage id="Select Mail Template"></FormattedMessage>{" "}
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
              {errors && errors.mail && (
                <FormFeedback>{errors.types.mail}</FormFeedback>
              )}
            </FormGroup>
            <div class="d-flex justify-content-center" >
            <Button
              type="submit"
              className="btn-block mr-1 mt-0"
              color="primary"
              id="submit-data"
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
