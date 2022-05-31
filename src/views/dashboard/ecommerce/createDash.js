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
  Card,
  CardHeader,
  CardTitle,
  CardText,
  Table,
  CustomInput,
} from "reactstrap";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import Select from "react-select";
import { Slide, toast } from "react-toastify";

import Avatar from "../../../../src/@core/components/avatar";

function CreateDash(props) {
  const { dashData, onClose, toUpdate } = props;
  console.log("props", props.onClose);

  const [formState, setFormState] = useState({
    templateId: 1,
    name: "",
    keys: [],
    request: 1,
  });
  const [newMenu, setNewMenu] = useState([]);
  const [menu, setMenu] = useState([]);
  const [basicModal, setBasicModal] = useState(false);

  //   const [checked, setChecked] = useState(true);

  const history = useHistory();

  const SignInSchema = yup.object().shape({
    name: yup.string().required("Role Name is a required field.").min(5),
    description: yup
      .string()
      .required("Please discribe of your role.It is a required field.")
      .min(5),
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

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const setPermission = (param, e) => {
    let tempMenu;
    tempMenu = newMenu;
    console.log("checked", param);

    if (e.target.checked === true) {
      tempMenu.push(param);
    }
  };

  const onSubmit = async () => {
    if (1) {
      console.log("submited");
      //newMenu[0] = null;
      await axios
        .post(`${BASE_URL}/api/dashboard/1/create-template`, {
          name: formState.name,
          keys: newMenu,
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully update a role management."}
                header={"Congratulations !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            );
            toUpdate();
            // history.goBack();
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
  const onChanceHandler = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Col md={{ size: 6, offset: 2 }}>
      <Row className="mb-2 d-flex " md={12}>
        <Form md={10} className="mb-12" onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label for="name">
              name : <span className="text-danger">*</span>
            </Label>
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
          <Table striped borderless responsive>
            <tbody>
              {dashData.map((object, i) => (
                <tr>
                  <td>{object.label}</td>
                  <td>
                    <input
                      type="checkbox"
                      id={object.val}
                      value={object.label}
                      label=""
                      onChange={(e) => setPermission(object.field_id, e)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            type="submit"
            className="mr-1"
            color="primary"
            onClick={onClose}
          >
            Submit
          </Button>
        </Form>
      </Row>
    </Col>
  );
}

export default CreateDash;
