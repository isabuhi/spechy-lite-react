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
import { useHistory  , useParams} from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import {BASE_URL} from "../../../../@core/auth/jwt/jwtService";

import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import {isObjEmpty} from "../../../../utility/Utils"
import FormBuilder from "azlan-form-builder";


  function Index() {
    const { id } = useParams();
    const [formState, setFormState] = useState({
      projectName: "",
      request : 1,
    });
    const [items, setItems] = useState([]);
    const [newItems, setItemsNew] = useState([]);

    useEffect(async () => {
      await axios
        .get(`${BASE_URL}/api/project-management/form-builder/select-design/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setItems(response.data.data.design)
          }
        });
    }, []);

    const history = useHistory();

    const SignInSchema = yup.object().shape({
      newItems: yup.string().required("Project Name is a required field."),
    });


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
      if (isObjEmpty(errors)) {
          if(formState.request == 1)
          {
            setFormState({
                ...formState,
                request: 0
            })
            await axios
            .post(`${BASE_URL}/api/project-management/form-builder/edit-design/${id}`, {
              items : newItems
            })
            .then((response) => {
              if (response.status === 200) {
                toast.success(
                  <ToastContent
                    type={"success"}
                    content={"You have successfully added a Project."}
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

    const formUpdate = (newItemsList) => {
      console.log(newItemsList);
      setItemsNew(newItemsList)
      /// you can call an API to save form elements as soon as they are updated
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
          <Col md={{ size: 12, offset: 0 }}>
            <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
              <FormBuilder onUpdate={formUpdate} items={items} />
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
