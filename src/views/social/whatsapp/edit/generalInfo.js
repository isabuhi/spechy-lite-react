import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Coffee, AlertCircle } from "react-feather";
import {
  Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import Avatar from "../../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [imgForRequest, setImageForRequest] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [getProjectName, setProjectName] = useState(null);
  const { id } = useParams();

  const [formState, setFormState] = useState({
    description: "",
    source_name : "",
    request : 1
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const store = useSelector((state) => state.users);

  useEffect(async () => {
    //dispatch(getFilterItems());
    await axios
      .get(`${BASE_URL}/api/conversation-management/whatsapp-account/select/${id}`)
      .then((response) => {
        //console.log("selectamarin", response.data.data.message.data);
        if (response.status === 200) {
          console.log("havij" , response)
          setFormState(response.data.data);
          setProjectName(response.data.data.source_name);
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
      await axios
      .post(`${BASE_URL}/api/conversation-management/whatsapp-account/update/${id}`, {
        source_name: formState.source_name,
        description: formState.description,
      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          toast.success(
            <ToastContent
              type={"success"}
              content={"You have successfully update a company."}
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
                <Label for="source_name">Source Name</Label>
                <Input
                  type="text"
                  id="source_name"
                  value={formState.source_name}
                  defaultValue={formState.source_name}
                  name="source_name"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.source_name && true}
                />
                {errors && errors.source_name && (
                  <FormFeedback>{errors.source_name.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="description ">Description</Label>
                <Input
                  type="text"
                  id="description"
                  value={formState.description}
                  defaultValue={formState.description}
                  name="description"
                  onChange={onChanceHandler}
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
