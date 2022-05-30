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
import Avatar from "../../../../src/@core/components/avatar";
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
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [formState, setFormState] = useState({
    name: "",
    source_id: "",
    request: 1,
    type: 0,
    description: "",
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
      .get(`${BASE_URL}/api/project-management/tag/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.data);
          setFormState({
            ...formState,
            name: response.data.data.title,
            source_id: response.data.data.project_id,
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
          setProjectList(projectItems);
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
        .post(`${BASE_URL}/api/project-management/tag/update/${id}`, {
          name: formState.name,
          source_id: formState.type,
          description: formState.description,
        })
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

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 6, offset: 2 }}>
              <FormGroup>
                <Label for="type">
                  <FormattedMessage id="SelectSource"></FormattedMessage> : <span className="text-danger">*</span>
                </Label>
                <Select
                  defaultValue={projects.filter(
                    (option) => projects.val === formState.project_id
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
                <Label for="name">
                  <FormattedMessage id="name"></FormattedMessage> : <span className="text-danger">*</span>
                </Label>
                <Input
                  autoFocus
                  name="name"
                  id="name"
                  defaultValue={formState.name}
                  placeholder=" Name"
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
                <Label for="description">
                  <FormattedMessage id="description"></FormattedMessage> : <span className="text-danger">*</span>
                </Label>
                <Input
                  autoFocus
                  name="description"
                  id="description"
                  placeholder="Description"
                  className={classnames({
                    "is-invalid": errors["description"],
                  })}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [e.target.name]: e.target.value,
                    })
                  }
                  innerRef={register({ required: true })}
                  invalid={errors.description && true}
                />
                {errors && errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
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
                <FormattedMessage id="Save Changes"></FormattedMessage>
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="btn-block mt-0"
                color="secondary"
                outline
              >
                <FormattedMessage id="Cancel"></FormattedMessage>
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
