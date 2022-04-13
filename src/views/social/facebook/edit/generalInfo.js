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
      console.log("id", id);
      await axios
        .post(`${BASE_URL}/api/facebook-management/account/edit/${id}`, {
          source_id: formState.type,
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
                  Select Source : <span className="text-danger">*</span>
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
