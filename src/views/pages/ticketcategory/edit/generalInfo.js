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
  CustomInput,
  FormFeedback,
} from "reactstrap";
import Avatar from "../../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { TagInput } from "reactjs-tag-input";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";
import { Slide, toast } from "react-toastify";
import { getFilterItems } from "../store/actions";

const GeneralInfo = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState([]);

  const { id } = useParams();

  const [formState, setFormState] = useState({
    title: "",
    call: null,
    request: 1,
    useEffectKey: 0,
    top: null,
    access: null,
    tags: [],
  });

  const { register, errors, handleSubmit, control, setValue, trigger } =
    useForm({
      defaultValues: { gender: "gender-female", dob: null },
      mode: "onSubmit",
    });

  const [category, setCategoryList] = useState([]);
  const store = useSelector((state) => state.users);

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/ticket-management/ticket-category/select/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setFormState({
            ...formState,
            title: response.data.data.title,
          });
          console.log(response.data.data);
        }
      });
  }, []);

  useEffect(async () => {
    await axios
      .get(
        `${BASE_URL}/api/ticket-management/ticket-category/get-all-categories-by-top-category/0`
      )
      .then((response) => {
        if (response.status === 200) {
          //console.log(response)
          let categoryData = [];
          let result = response.data.data;
          for (let i = 0; i < result.length; i++) {
            categoryData.push({
              value: result[i].ticket_category_id,
              label: result[i].title,
            });
          }
          setCategoryList(categoryData);
        }
      });
    dispatch(getFilterItems(id));
  }, [formState.useEffectKey]);

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
    console.log("hello");
    if (1) {
      let array = [];
      let ret = formState.tags;
      for (let i = 0; i < ret.length; i++) {
        array[i] = ret[i].displayValue;
      }
      await axios
        .post(
          `${BASE_URL}/api/ticket-management/ticket-category/update-new-ticket-category/${id}`,
          {
            top_category: formState.top,
            title: formState.title,
            access: formState.access,
            keywords: array,
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully update a ticket category."}
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

  const onTagsChanged = (id) => {
    setFormState({
      ...formState,
      tags: id,
    });
  };

  const setPermission = (e) => {
    setFormState({
      ...formState,
      access: e.target.value,
    });
  };

  return (
    <Row>
      <Col sm="12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={{ size: 6, offset: 2 }}>
              <FormGroup>
                <Label for="title">
                  Title : <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  value={formState.title}
                  defaultValue={formState.title}
                  name="title"
                  onChange={onChanceHandler}
                  innerRef={register({ required: true })}
                  invalid={errors.title && true}
                />
                {errors && errors.title && (
                  <FormFeedback>{errors.title.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="call">
                  Send to Call List : <span className="text-danger">*</span>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  options={category}
                  isClearable={false}
                  name="call"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      call: e.val,
                    })
                  }
                />
                {errors && errors.call && (
                  <FormFeedback>{errors.call.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="access">
                  Access : <span className="text-danger"></span>
                </Label>
                <CustomInput
                  type="radio"
                  id="internal"
                  label="Internal"
                  name="access"
                  value="1"
                  onChange={(e) => setPermission(e)}
                />
                <CustomInput
                  type="radio"
                  id="public"
                  label="Public"
                  name="access"
                  value="2"
                  onChange={(e) => setPermission(e)}
                />
                {errors && errors.access && (
                  <FormFeedback>{errors.access.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="type">
                  Access : <span className="text-danger"></span>
                </Label>
                <TagInput
                  tags={formState.tags}
                  onTagsChanged={onTagsChanged}
                  tagStyle={`
                    background: #7367f0;
                    font-size : 1rem;
                    margin-bottom:10px;
                  `}
                  inputStyle={`
                    background: #FFF;
                    &::-webkit-input-placeholder {
                      color: #6e6b7b;
                      border : 1px solid #d8d6de;
                      background: '#FFF';
                      padding: 0.438rem 1rem;
                      border-radius: 0.357rem;
                      background-clip: padding-box;
                      padding: 0.438rem 1rem;
                      font-size : 1rem;
                      height : 2.714rem;
                      transition : border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                      font-weight : 400;
                      line-height : 1.45;
                      font-family : inherit;
                      font-style: normal;
                      background-clip: padding-box;
                    }
                  `}
                  wrapperStyle={`
                    background: none;
                    box-shadow: none;
                    position : unset;
                    margin-left:275px;
                    margin-top:40px;
                    width : 105%
                  `}
                  placeholder="Write Keywords"
                />
                {errors && errors.type && (
                  <FormFeedback>{errors.type.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>

            <Col md={{ size: 6, offset: 2 }}>
              <div className="d-flex">
              <Button.Ripple
                className="btn-block mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="button"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Save Changes
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="btn-block mt-0"
                color="secondary"
                outline
              >
                Cancel
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
