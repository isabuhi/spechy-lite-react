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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";

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
import { FormattedMessage } from "react-intl";

function Index() {
  const [formState, setFormState] = useState({
    title: "",
    request: 0,
    type: 0,
    answer: [""],
  });
  const [basicModal, setBasicModal] = useState(false);
  const [projects, setProjectList] = useState([]);
  const [lang, setLangs] = useState([]);
  const history = useHistory();
  const [disabled, setDisabled] = useState(true)
  const [disabledModal, setDisabledModal] = useState(true)

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

  const SignInSchema = yup.object().shape({
    title: yup
      .string()
      .required("Ready Answer Title is a required field.")
      .min(5, "Ready Answer Title  must be at least 5 characters."),
  });

  console.log("SignInSchema", SignInSchema);

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data);
          var projectItems = [{}];
          for (var j = 0; j < result.length; j++) {
            projectItems[j] = {
              val: result[j].project_id,
              label: result[j].name,
            };
          }
          setProjectList(projectItems);
        }
      });
    //----------
    await axios
      .get(`${BASE_URL}/api/general-management/language/get-all-languages`)
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data);
          setLangs(result);
        }
      });
  }, []);

  useEffect(()=>{
    if(
      formState.title &&
      formState.type       
      ){
        setDisabled(false)
    }else {
      setDisabled(true)
    }
  },[formState])



  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      if (formState.request === 0) {
        const btn = document.getElementById("submit-data");
        btn.setAttribute("disabled", true);
        btn.innerText = "Submitting..";

        setTimeout(() => {
          btn.removeAttribute("disabled");
          btn.innerText = "Submit";
        }, 3000);
        setFormState({
          ...formState,
          request: 0,
        });
        await axios
          .post(
            `${BASE_URL}/api/project-management/ready-answer/create-new-answer`,
            {
              title: formState.title,
              source: formState.type,
              answer: formState.answer,
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
      } else {
        console.log("don't click!");
      }
    }
  };

  const setLanguages = (id, value) => {
    let some = formState.answer;
    some[id] = value;
    setFormState({
      ...formState,
      answer: some,
    });
    console.log(formState.answer);
  };

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={12}>
        <Col className="mb-2 d-flex " md={12}>
          <Row md={12}>
            <Col xs={2} style={{paddingTop: "7px"}}>
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={9} className="d-flex mr-1">
              <UserPlus size="45px"/>
              <h3 className="ml-1 text-nowrap" style={{paddingTop: "10px", paddingRight: "5px"}}>
                New Ready  Answer
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={6} style={{ paddingLeft:"100px" }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="type">
                <FormattedMessage id="Select Source"> </FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Select
                isClearable={true}
                name="type"
                className="react-select"
                classNamePrefix="select"
                options={projects}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    type : e.val,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.type && true}
              />
            </FormGroup>
            <FormGroup>
              <Label for="title">
                <FormattedMessage id="title"> </FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="title"
                id="title"
                placeholder="Title Name"
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
              <Button.Ripple
                color="primary"
                outline
                onClick={() => setBasicModal(!basicModal)}
              >
                <FormattedMessage id="Set Answers"> </FormattedMessage>
              </Button.Ripple>
              <Modal
                centered
                isOpen={basicModal}
                toggle={() => setBasicModal(!basicModal)}
              >
                <ModalHeader toggle={() => setBasicModal(!basicModal)}>
                  <FormattedMessage id="Auto Answers Messages">
                    {" "}
                  </FormattedMessage>
                </ModalHeader>
                <ModalBody>
                  {lang.map(function (object, i) {
                    return (
                      <FormGroup>
                        <Label for={object.lang}>{object.name} : </Label>
                        <Input
                          autoFocus
                          name={object.lang}
                          id={object.lang}
                          placeholder="Auto Answers Message "
                          className={classnames({
                            "is-invalid": errors[object.lang],
                          })}
                          onChange={(e) =>
                            setLanguages(e.target.name, e.target.value)
                          }
                        />
                      </FormGroup>
                    );
                  })}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    // disabled={disabledModal}
                    onClick={() => setBasicModal(!basicModal)}
                  >
                    <FormattedMessage id="Accept & Set"> </FormattedMessage>
                  </Button>
                </ModalFooter>
              </Modal>
            </FormGroup>
            <div class="d-flex justify-content-center" >
            <Button
              type="submit"
              className="btn-block mr-1 mt-0"
              color="primary"
              id="submit-data"
              disabled={disabled}
            >
              <FormattedMessage id="submit"> </FormattedMessage>
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
