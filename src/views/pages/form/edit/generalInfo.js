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

const GeneralInfo = (props) => {
  const type = [
    {
      val : 1,
      label : "CRM Company Form"
    },
    {
      val : 2,
      label : 'Web Form Contact'
    },
    {
      val : 3,
      label : 'Web Form Company'
    },
    {
      val : 4,
      label : 'Ticket Form'
    }
  ]
  const history = useHistory();
  const dispatch = useDispatch();
  const [projects, setProjectList] = useState([]);
  const [langs, setLangList] = useState([]);
  const { id } = useParams();

  const [formState, setFormState] = useState({
    name: "",
    description : "",
    language_id : null,
    project_id : null,
    type_id : null
  });

  const SignInSchema = yup.object().shape({
    name: yup.string().required("Form Name is a required field.").min(5),
    description: yup.string().required("Desription is a required field.").min(5),
    project_id: yup.string().required("Srouce is a required field."),
    language_id: yup.string().required("Language is a required field."),
    type_id: yup.string().required("Type is a required field."),
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      resolver: yupResolver(SignInSchema),
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/project-management/form-builder/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.data)
          setFormState({
            ...formState,
            name: response.data.data.name,
            description : response.data.data.description,
            language_id : response.data.data.language,
            project_id : response.data.data.project_id,
            type_id : response.data.data.type
          })
        }
      });
      //------------
      await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        if (response.status === 200) {
          let tmp = [];
          let result = response.data.data;
          for(let i = 0;i<result.length;i++)
          {
            tmp.push({
              value : result[i].project_id,
              label : result[i].name
            });
          }
          setProjectList(tmp)
        }
      });
      //--------
      await axios
      .get(`${BASE_URL}/api/general-management/language/get-all-languages`)
      .then((response) => {
        if (response.status === 200) {
          let typeTemp = [];
          let result = response.data.data;
          for(let i = 0;i<result.length;i++)
          {
            typeTemp.push({
              value : result[i].lang,
              label : result[i].name
            });
          }
          setLangList(typeTemp)
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
    if (!isObjEmpty(errors)) {
      await axios
      .post(`${BASE_URL}/api/project-management/form-builder/edit/${id}`, {
        name: formState.name,
        source : formState.project_id,
        language : formState.language_id,
        type : formState.type_id,
        description : formState.description
      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          toast.success(
            <ToastContent
              type={"success"}
              content={"You have successfully update a form."}
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
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={formState.name}
                  defaultValue={formState.name}
                  name="name"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.name && true}
                />
                {errors && errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="project">
                    Srouce List :  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={projects}
                  isClearable={false}
                  name="project"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      project_id : e.value,
                    })
                  }
                />
                {errors && errors.project && (
                  <FormFeedback>{errors.project.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="lang">
                    Language List :  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={langs}
                  isClearable={false}
                  name="lang"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      language_id : e.value,
                    })
                  }
                />
                {errors && errors.lang && (
                  <FormFeedback>{errors.lang.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="type">
                    Type :  <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={type}
                  isClearable={false}
                  name="type"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      type_id : e.val,
                    })
                  }
                />
                {errors && errors.type && (
                  <FormFeedback>{errors.type.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="description">
                    Description : <span className="text-danger">*</span>
                </Label>
                <Input
                  autoFocus
                  name="description"
                  id="description"
                  value={formState.description}
                  defaultValue={formState.description}
                  className={classnames({ "is-invalid": errors["namedescription"] })}
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
              <Button.Ripple
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
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
