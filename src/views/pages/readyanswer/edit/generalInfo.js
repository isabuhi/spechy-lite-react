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
import { FormattedMessage } from "react-intl";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [formState, setFormState] = useState({
    title: "",
    project_id: "",
    request: 1,
    type: 0,
    answer: [""],
    ready_answer_id: "",
  });
  const [projects, setProjectList] = useState([]);
  const [lang, setLangs] = useState([]);
  const [basicModal, setBasicModal] = useState(false);

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/ready-answer/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("selected", response.data.data);
          setFormState({
            ...formState,
            title: response.data.data.title,
            project_id: response.data.data.project_id,
            ready_answer_id: response.data.data.ready_answer_id,
          });
        }
      });
    //------------
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
          console.log("projectItems", projectItems);
          setProjectList(projectItems);
        }
      });
    //----------
    await axios
      .get(`${BASE_URL}/api/general-management/language/get-all-languages`)
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data);
          console.log(result);
          setLangs(result);
        }
      });
  }, []);

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
    if (formState.request == 1) {
      setFormState({
        ...formState,
        request: 0,
      });

      await axios
        .post(
          `${BASE_URL}/api/project-management/ready-answer/update-answer/${id}`,
          {
            title: formState.title,
            source: formState.type,
            answer: formState.answer,
          }
        )
        .then((response) => {
          console.log(response);
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

  const setLanguages = (id, value) => {
    let some = formState.answer;
    some[id] = value;
    setFormState({
      ...formState,
      answer: some,
    });
    console.log(some);
  };

  return (
    <Row>
      <Col sm="8">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 6, offset: 2 }}>
              <FormGroup>
                <Label for="type">
                  <FormattedMessage id="Select Source"> </FormattedMessage> :{" "}
                  <span className="text-danger">*</span>
                </Label>
                <Select
                  value={projects.filter(
                    (option) => option.val == formState.project_id
                  )}
                  isClearable={true}
                  name="type"
                  className="react-select"
                  classNamePrefix="select"
                  options={projects}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      type: e.val,
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
                  defaultValue={formState.title}
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
                  className="btn-block"
                  color="primary"
                  outline
                  onClick={() => setBasicModal(!basicModal)}
                >
                  <FormattedMessage id="Set Answers"> </FormattedMessage>
                </Button.Ripple>
                <Modal centered isOpen={basicModal} toggle={() => !basicModal}>
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
                      onClick={() => setBasicModal(!basicModal)}
                    >
                      <FormattedMessage id="Accept & Set"> </FormattedMessage>
                    </Button>
                  </ModalFooter>
                </Modal>
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
