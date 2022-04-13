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

import Avatar from "../../../../src/@core/components/avatar";

function ModalPop(props) {
  const { dashData } = props;
  console.log("props", props.dashData);

  const [formState, setFormState] = useState({
    templateId: 1,
    name: "",
    description: "",
    request: 1,
  });
  const [newMenu, setNewMenu] = useState();
  const [menu, setMenu] = useState([]);
  const [checked, setChecked] = useState(true);

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

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  return (
    <Col md={{ size: 6, offset: 2 }}>
      <Row className="mb-2 d-flex " md={12}>
        <Form md={10} className="mb-12">
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
                      defaultChecked={object.show === true ? checked : !checked}
                      // onChange={(e) => console.log("eeee", e.target)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button type="submit" className="mr-1" color="primary">
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
      </Row>
    </Col>
  );
}

export default ModalPop;
