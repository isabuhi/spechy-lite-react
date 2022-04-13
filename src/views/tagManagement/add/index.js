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
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import Select from "react-select";

import Avatar from "../../../../src/@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../src/utility/Utils";
import { FormattedMessage } from "react-intl";

function Index() {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    source_id: "",
    type: 0,
    request: 1,
    source_id: "",
  });
  const [basicModal, setBasicModal] = useState(false);
  const [projects, setProjectList] = useState([]);
  const [lang, setLangs] = useState([]);
  const history = useHistory();

  const SignInSchemas = yup.object().shape({
    name: yup
      .string()
      .required("Ready Answer Title is a required field.")
      .min(5),
  });

  useEffect(async (e) => {
    await axios
      .get(`${BASE_URL}/api/project-management/project/get-all-projects`)
      .then((response) => {
        console.log("theprojects", response);
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
    resolver: yupResolver(SignInSchemas),
  });

  const onSubmit = async () => {
    console.log(formState);
    if (isObjEmpty(errors)) {
      console.log("here");
      const btn = document.getElementById("submit-data");
      btn.setAttribute("disabled", true);
      btn.innerText = "Submitting..";

      setTimeout(() => {
        btn.removeAttribute("disabled");
        btn.innerText = "Submit";
      }, 3000);
      await axios
        .post(`${BASE_URL}/api/project-management/tag/create`, {
          name: formState.name,
          description: formState.type,
          description: formState.description,
          type: formState.type,
          source_id: formState.source_id,
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
              <UserPlus />
              <h3 className="ml-1">
                <FormattedMessage id="Add New Tag"></FormattedMessage>
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={{ size: 6, offset: 2 }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="source_id">
                <FormattedMessage id="SelectSource"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Select
                isClearable={true}
                name="source_id"
                className="react-select"
                classNamePrefix="select"
                options={projects}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    source_id: e.val,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">
                <FormattedMessage id="Tagname"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="name"
                id="name"
                placeholder="Title Name"
                className={classnames({ "is-invalid": errors["title"] })}
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
                <FormattedMessage id="description"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="description"
                id="description"
                placeholder="Description"
                className={classnames({ "is-invalid": errors["description"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </FormGroup>

            <Button
              // onClick={onSubmit}
              type="submit"
              className="mr-1"
              color="primary"
              id="submit-data"
            >
              <FormattedMessage id="submit"></FormattedMessage>
            </Button>
            <Button
              onClick={history.goBack}
              type="reset"
              color="secondary"
              outline
            >
              <FormattedMessage id="Cancel"></FormattedMessage>
            </Button>
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default Index;
