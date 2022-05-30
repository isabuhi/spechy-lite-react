import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Coffee, AlertCircle} from "react-feather";
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
} from "reactstrap";
import Avatar from "../../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import classnames from "classnames";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState([]);;
  const { id } = useParams();

  const [formState, setFormState] = useState({
    request : 1,
    serverMenu : [],
    name : '',
    description : ''
  });
  const [newMenu, setNewMenu] = useState([]);
  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/user-management/user-roles/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          let serverMenu = response.data.data.menu_permission;
          let array = [];
          console.log("here" , response.data.data)
          for(let i=0;i<100;i++)
          {
            if((String(serverMenu[i]) != "undefined"))
            {
              array.push({
                read : serverMenu[i].read,
                create : serverMenu[i].create,
                delete : serverMenu[i].delete,
                update : serverMenu[i].update,
                menu_id : i
              });
            }
          }
          setFormState({
            ...formState,
            name: response.data.data.name,
            serverMenu: response.data.data.menu_permission,
            description : response.data.data.description
          })
          //-----------------------
          axios
          .get(`${BASE_URL}/api/general-management/menu/get-all-menus`)
          .then((response) => {
            if (response.status === 200) {
              let tmp = [];
              let result = response.data.data;
              for(let i=0;i<result.length;i++)
              {
                let tmp_id = result[i].menu_id;
                tmp[tmp_id] = {};
                for(let j=0;j<array.length;j++)
                {
                  if(result[i].menu_id == array[j].menu_id)
                  {
                    tmp[tmp_id]['read'] = array[j].read
                    tmp[tmp_id]['create'] = array[j].create
                    tmp[tmp_id]['update'] = array[j].update
                    tmp[tmp_id]['delete'] = array[j].delete
                    tmp[tmp_id]['menu_id'] = tmp_id,
                    tmp[tmp_id]['name'] = result[i].name
                    tmp[tmp_id]['top_id'] = result[i].top_id
                  }
                }
                //console.log(tmp)
              }
              setNewMenu([...tmp]);
            }
          });
          //-------------------------
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
    if (1) {
      //newMenu[0] = null;
      await axios
      .post(`${BASE_URL}/api/user-management/user-roles/update/${id}`, {
        name: formState.name,
        description : formState.description,
        permissions : newMenu,

      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          toast.success(
            <ToastContent
              type={"success"}
              content={"You have successfully update a role management."}
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

  const setPermission = (id , param , e) => {
    let tempMenu;
    tempMenu = newMenu
    tempMenu.map(function(array , i){
      //console.log(array)
      if(e.target.checked === true)
      {
        if(id === array.menu_id)
        {
          if(param === "read"){
            tempMenu[array.menu_id].read = 1;
          } else if(param === "update"){
            tempMenu[array.menu_id].update = 1;
          }else if(param === "delete"){
            tempMenu[array.menu_id].delete = 1;
          }else if(param === "create"){
            tempMenu[array.menu_id].create = 1;
          }
        }
      }
      else
      {
        if(id === array.menu_id)
        {
          if(param === "read"){
            tempMenu[array.menu_id].read = 0;
          } else if(param === "update"){
            tempMenu[array.menu_id].update = 0;
          }else if(param === "delete"){
            tempMenu[array.menu_id].delete = 0;
          }else if(param === "create"){
            tempMenu[array.menu_id].create = 0;
          }
        }
      }
    });
    
    //setNewMenu([...tempMenu]);
    console.log("set ?" , tempMenu);
  }
  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <FormGroup>
                <Label for="name">
                  <FormattedMessage id="Role Name"></FormattedMessage> : <span className="text-danger">*</span>
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
              <FormGroup>
                <Label for="description">
                  <FormattedMessage id="description"></FormattedMessage> : <span className="text-danger">*</span>
                </Label>
                <Input
                  autoFocus
                  name="description"
                  id="description"
                  value={formState.description}
                  defaultValue={formState.description}
                  placeholder="Description about the role"
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
            <thead className='thead-light'>
              <tr>
                <th><FormattedMessage id="Module"></FormattedMessage></th>
                <th><FormattedMessage id="Read"></FormattedMessage></th>
                <th><FormattedMessage id="Update"></FormattedMessage></th>
                <th><FormattedMessage id="create"></FormattedMessage></th>
                <th><FormattedMessage id="Delete"></FormattedMessage></th>
              </tr>
            </thead>
            <tbody>
              {newMenu.map(function(object, i){
                let status1 = ""
                let status2 = ""
                let status3 = ""
                let status4 = ""
                  if(object.top_id !== 0)
                  {
                    if(object.read == 1)
                    { 
                      status1 = "checked='true'"
                    }
                    if(object.update == 1)
                    { 
                      status2 = "checked"
                    }
                    if(object.create == 1)
                    { 
                      status3 = "checked"
                    }
                    if(object.delete == 1)
                    { 
                      status4 = "checked"
                    }
                    return<tr>  
                    <td>{object.name}</td>
                    <td><CustomInput type='checkbox' defaultChecked={status1} id={object.menu_id+"_read"} label='' onChange={(e) => setPermission(object.menu_id , 'read' , e)} /></td>
                    <td><CustomInput type='checkbox' defaultChecked={status2} id={object.menu_id+"_update"} label='' onChange={(e) => setPermission(object.menu_id , "update" , e)} /></td>
                    <td><CustomInput type='checkbox' defaultChecked={status3} id={object.menu_id+"_create"} label='' onChange={(e) => setPermission(object.menu_id , "create" , e)}/></td>
                    <td><CustomInput type='checkbox' defaultChecked={status4} id={object.menu_id+"_delete"} label='' onChange={(e) => setPermission(object.menu_id , "delete" , e)} /></td>
                  </tr>
                  }
              })}
            </tbody>
          </Table>
            </Col>
            <Col md={{ size: 8, offset: 2 }}>
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
