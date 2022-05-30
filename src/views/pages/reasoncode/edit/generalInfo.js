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
  Table,
  CustomInput,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Avatar from "../../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import classnames from "classnames";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { getFilterItems} from "../store/actions";
import DualList from "./dualList"
import { FormattedMessage } from "react-intl";

const GeneralInfo = (props) => {
  const call = [
    {
      val : 1,
      label : "Yes"
    },
    {
      val : 0,
      label : 'No'
    }
  ]
  const history = useHistory();
  const dispatch = useDispatch();
  const [projects, setProjectList] = useState([]);
  const [channels, setChannelList] = useState([]);
  const [types, setTypesList] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [smsList, setSmsList] = useState([]);
  const [mailList, setMailList] = useState([]);
  const { id } = useParams();

  const [formState, setFormState] = useState({
    reasonName: "",
    call : null,
    request : 1,
    useEffectKey : 0,
    type : null,
    sms : null,
    mail : null
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/reason-codes/conversation/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setFormState({
            ...formState,
            reasonName: response.data.data.name
          })
        }
      });
  }, []);

  useEffect(async () => {
    await axios
    .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
    .then((response) => {
      if (response.status === 200) {
        setProjectList(response.data.data)
      }
    });
    //--------
    await axios
    .get(`${BASE_URL}/api/project-management/reason-codes/conversation/types`)
    .then((response) => {
      if (response.status === 200) {
        let typeTemp = [];
        let result = response.data.data;
        for(let i = 0;i<result.length;i++)
        {
          typeTemp.push({
            value : result[i].reason_code_type_id,
            label : result[i].name
          });
        }
        setTypesList(typeTemp)
      }
    });
    //-----------
    await axios
    .get(`${BASE_URL}/api/project-management/sms-template/get-all-sms-template`)
    .then((response) => {
      if (response.status === 200) {
        let smsTemp = [];
        let result = response.data.data;
        for(let i = 0;i<result.length;i++)
        {
          smsTemp.push({
            value : result[i].template_id,
            label : result[i].name
          });
        }
        setSmsList(smsTemp)
      }
    });
    //-----------
    await axios
    .get(`${BASE_URL}/api/project-management/email-template/get-all-email-template`)
    .then((response) => {
      if (response.status === 200) {
        let mailTemp = [];
        let result = response.data.data;
        for(let i = 0;i<result.length;i++)
        {
          mailTemp.push({
            value : result[i].template_id,
            label : result[i].name
          });
        }
        setMailList(mailTemp)
      }
    });
    dispatch(getFilterItems(id));
  }, [formState.useEffectKey]);

  const onChanceHandler = (e) => {
    setFormState({
      ...formState,
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

  const onSubmit = async () => {
    if (1) {
      await axios
      .post(`${BASE_URL}/api/project-management/reason-codes/conversation/update/${id}`, {
        sources: selectedProject,
        name : formState.reasonName,
        send_call_list : formState.call,
        email_temp_id : formState.mail,
        sms_temp_id : formState.sms,
        type : formState.type
      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          toast.success(
            <ToastContent
              type={"success"}
              content={"You have successfully update a project."}
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

  const projectIds = (id) => {
    setSelectedProject(id);
  }

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 6, offset: 2 }}>
              <FormGroup>
                <Label for="attached">
                  <FormattedMessage id="Attached Source"> </FormattedMessage> :  <span className="text-danger">*</span>
                </Label>
                <DualList projectList={projects} projectIds={projectIds}/>
              </FormGroup>
              <FormGroup>
              <Label for="reasonName">
                <FormattedMessage id="Reason Name"> </FormattedMessage> : <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="reasonName"
                  value={formState.reasonName}
                  defaultValue={formState.reasonName}
                  name="reasonName"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.reasonName && true}
                />
                {errors && errors.reasonName && (
                  <FormFeedback>{errors.reasonName.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="call">
                  <FormattedMessage id="Send to Call List"> </FormattedMessage> :  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={call}
                  isClearable={false}
                  name="call"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      call: e.val,
                    })
                  }
                />
                {errors && errors.call && (
                  <FormFeedback>{errors.call.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="type">
                  <FormattedMessage id="Reason Code Type"> </FormattedMessage> :  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={types}
                  isClearable={false}
                  name="call"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      type: e.val,
                    })
                  }
                />
                {errors && errors.type && (
                  <FormFeedback>{errors.type.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="sms">
                  <FormattedMessage id="Select SMS Template"> </FormattedMessage> :  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
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
                  <FormattedMessage id="Select Mail Template"> </FormattedMessage> :  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
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
            </Col>

            <Col md={{ size: 6, offset: 2 }}>
              <div className="d-flex">
              <Button.Ripple
                className="btn-block mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
                color="primary"
              >
                <FormattedMessage id="Save Changes"> </FormattedMessage>
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="btn-block mt-0"
                color="secondary"
                outline
              >
                <FormattedMessage id="Cancel"> </FormattedMessage>
              </Button.Ripple>
              </div>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default GeneralInfo;
