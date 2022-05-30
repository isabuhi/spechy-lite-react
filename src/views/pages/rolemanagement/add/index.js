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
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import Select from "react-select";

import Avatar from "../../../../@core/components/avatar";
import { Slide, toast } from "react-toastify";
import { isObjEmpty } from "../../../../utility/Utils";
import { selectThemeColors } from "@utils";
import { map } from "jquery";
import { array, object } from "prop-types";
import { FormattedMessage } from "react-intl";

function Index() {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    request: 1,
  });
  const [newMenu, setNewMenu] = useState();
  const [menu, setMenu] = useState([]);
  const [disabled, setDisabled] = useState(true)

  const history = useHistory();

  const SignInSchema = yup.object().shape({
    name: yup.string().required("Role Name is a required field.").min(5),
    description: yup
      .string()
      .required("Please discribe of your role.It is a required field.")
      .min(5),
  });

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/general-management/menu/get-all-menus`)
      .then((response) => {
        if (response.status === 200) {
          //console.log(response.data.data)
          setMenu(response.data.data);
          let tmp = [];
          //tmp[0] = null;
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            let tmp_id = result[i].menu_id;
            tmp[tmp_id] = {};
            if (result[i].top_id == 0) {
              tmp[tmp_id]["read"] = 1;
              tmp[tmp_id]["create"] = 0;
              tmp[tmp_id]["update"] = 0;
              tmp[tmp_id]["delete"] = 0;
              tmp[tmp_id]["menu_id"] = tmp_id;
            } else {
              tmp[tmp_id]["read"] = 0;
              tmp[tmp_id]["create"] = 0;
              tmp[tmp_id]["update"] = 0;
              tmp[tmp_id]["delete"] = 0;
              tmp[tmp_id]["menu_id"] = tmp_id;
            }
          }
          setNewMenu([...tmp]);
        }
      });
  }, [formState.useEffectKey]);

  useEffect(()=>{
    if(
      formState.name&&
      formState.description &&
      newMenu
      ){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
  },[formState])

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
      if (formState.request == 1) {
        setFormState({
          ...formState,
          request: 0,
        });

        newMenu[0] = null;

        await axios
          .post(`${BASE_URL}/api/user-management/user-roles/create`, {
            name: formState.name,
            description: formState.description,
            permissions: newMenu,
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success(
                <ToastContent
                  type={"success"}
                  content={"You have successfully added a Role Management."}
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

  const setPermission = (id, param, e) => {
    let tempMenu;
    tempMenu = newMenu;
    tempMenu.map(function (array, i) {
      //console.log(array)
      if (e.target.checked === true) {
        if (id === array.menu_id) {
          if (param === "read") {
            tempMenu[array.menu_id].read = 1;
          } else if (param === "update") {
            tempMenu[array.menu_id].update = 1;
          } else if (param === "delete") {
            tempMenu[array.menu_id].delete = 1;
          } else if (param === "create") {
            tempMenu[array.menu_id].create = 1;
          }
        }
      } else {
        if (id === array.menu_id) {
          if (param === "read") {
            tempMenu[array.menu_id].read = 0;
          } else if (param === "update") {
            tempMenu[array.menu_id].update = 0;
          } else if (param === "delete") {
            tempMenu[array.menu_id].delete = 0;
          } else if (param === "create") {
            tempMenu[array.menu_id].create = 0;
          }
        }
      }
    });

    //setNewMenu([...tempMenu]);
    console.log("set ?", tempMenu);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4"><FormattedMessage id="Permissions"></FormattedMessage></CardTitle>

        <ArrowLeftCircle
          size={28}
          onClick={history.goBack}
          style={{ cursor: "pointer" }}
        />
      </CardHeader>
      <CardText className="ml-2"><FormattedMessage id="Permission according to roles"></FormattedMessage></CardText>
      <Col md={{ size: 6, offset: 2 }}>
        <Row className="mb-2 d-flex " md={12}>
          <Form onSubmit={handleSubmit(onSubmit)} md={10} className="mb-12">
            <FormGroup>
              <Label for="name">
                <FormattedMessage id="Role Name"></FormattedMessage> : <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="name"
                id="name"
                placeholder="Role Name"
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
                placeholder="Description About the Role"
                className={classnames({ "is-invalid": errors["description"] })}
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
            <Table striped borderless responsive>
              <thead className="thead-light">
                <tr>
                  <th><FormattedMessage id="Module"></FormattedMessage></th>
                  <th><FormattedMessage id="Read"></FormattedMessage></th>
                  <th><FormattedMessage id="Update"></FormattedMessage></th>
                  <th><FormattedMessage id="create"></FormattedMessage></th>
                  <th><FormattedMessage id="Delete"></FormattedMessage></th>
                </tr>
              </thead>
              <tbody>
                {menu.map(function (object, i) {
                  let status = 0;
                  if (object.top_id !== 0) {
                    return (
                      <tr>
                        <td>{object.name}</td>
                        <td>
                          <CustomInput
                            type="checkbox"
                            id={object.menu_id + "_read"}
                            label=""
                            onChange={(e) =>
                              setPermission(object.menu_id, "read", e)
                            }
                          />
                        </td>
                        <td>
                          <CustomInput
                            type="checkbox"
                            id={object.menu_id + "_update"}
                            label=""
                            onChange={(e) =>
                              setPermission(object.menu_id, "update", e)
                            }
                          />
                        </td>
                        <td>
                          <CustomInput
                            type="checkbox"
                            id={object.menu_id + "_create"}
                            label=""
                            onChange={(e) =>
                              setPermission(object.menu_id, "create", e)
                            }
                          />
                        </td>
                        <td>
                          <CustomInput
                            type="checkbox"
                            id={object.menu_id + "_delete"}
                            label=""
                            onChange={(e) =>
                              setPermission(object.menu_id, "delete", e)
                            }
                          />
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-3" >
            <Button 
              type="submit"
              className="btn-block mr-1 mt-0"
              color="primary"
              disabled={disabled}
              >
              <FormattedMessage id="submit"></FormattedMessage>
            </Button>
            <Button
              onClick={history.goBack}
              type="reset"
              color="secondary"
              outline
              className="btn-block mt-0"
            >
              <FormattedMessage id="Cancel"></FormattedMessage>
            </Button>
            </div>
          </Form>
        </Row>
      </Col>
    </Card>
  );
}

export default Index;
