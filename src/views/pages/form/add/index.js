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
} from "reactstrap";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import {BASE_URL} from "../../../../@core/auth/jwt/jwtService";
import Select from 'react-select'
import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import {isObjEmpty} from "../../../../utility/Utils"
import { selectThemeColors } from '@utils'
import { min } from "moment";


  function Index() {
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
    const [formState, setFormState] = useState({
      name: "",
      request : 1,
      useEffectKey : 1,
      project_id : null,
      language_id : null,
      type_id : null,
      description : ""
    });
    const [projects, setProjectList] = useState([]);
    const [langs, setLangList] = useState([]);

    const history = useHistory();

    const SignInSchema = yup.object().shape({
      name: yup.string().required("Form Name is a required field.").min(5),
      description: yup.string().required("Desription is a required field.").min(5),
      project_id: yup.string().required("Srouce is a required field."),
      language_id: yup.string().required("Language is a required field."),
      type_id: yup.string().required("Type is a required field."),
    });

    useEffect(async () => {
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
          console.log(response.data.data)
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
    }, [formState.useEffectKey]);

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
      if (!isObjEmpty(errors)) {
          if(formState.request == 1) //
          {
            setFormState({
                ...formState,
                request: 0
            })
            await axios
            .post(`${BASE_URL}/api/project-management/form-builder/create`, {
              name : formState.name,
              source : formState.project_id,
              language : formState.language_id,
              type : formState.type_id,
              description : formState.description
            })
            .then((response) => {
              if (response.status === 200) {
                toast.success(
                  <ToastContent
                    type={"success"}
                    content={"You have successfully added a Form."}
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
      }
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
              <Col xs={8} className="d-flex ml-3">
                <UserPlus/>
                <h3 className="ml-1">New Form</h3>
              </Col>
            </Row>
          </Col>
          <Col md={{ size: 8, offset: 2 }}>
            <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
              <FormGroup>
                <Label for="name">
                    Name : <span className="text-danger">*</span>
                </Label>
                <Input
                  autoFocus
                  name="name"
                  id="name"
                  placeholder="Form Name"
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
                  placeholder="Discrabe About Form"
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
              <Button onClick={onSubmit} type="submit" className="mr-1" color="primary">
                Submit
              </Button>
              <Button
                onClick={history.goBack}
                type="reset"
                color="secondary"
                outline
              >
                Cancel
              </Button>
            </Form>
          </Col>
        </Col>
      </div>
    );
  }

export default Index;
