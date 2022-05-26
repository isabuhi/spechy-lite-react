import React, { Fragment, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
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
  CustomInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { TagInput } from "reactjs-tag-input";
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
import { FormattedMessage } from "react-intl";

// const useDebounce = (callback, delay) => {
//   const latestCallback = useRef();
//   const [lastCalledAt, setLastCalledAt] = useState(null);

//   useEffect(() => {
//     latestCallback.current = callback;
//   }, [callback]);

//   useEffect(() => {
//     if (lastCalledAt) {
//       const fire = () => {
//         setLastCalledAt(null);
//         latestCallback.current();
//       };
//       const fireAt = lastCalledAt + delay;
//       const fireIn = Math.max(fireAt - Date.now(), 0);
//       const id = setTimeout(fire, fireIn);
//       console.log("lass", id);
//       return () => clearTimeout(id);
//     }
//   }, [lastCalledAt, delay]);

//   return () => setLastCalledAt(Date.now());
// };

function Index() {
  const KeyCodes = {
    comma: 188,
    enter: [10, 13],
  };

  const delimiters = [...KeyCodes.enter, KeyCodes.comma];
  const ReactTags = require("react-tag-input").WithOutContext;

  const [formState, setFormState] = useState({
    title: "",
    call: null,
    request: true,
    useEffectKey: 0,
    top: null,
    access: null,
    tags: [],
  });
  const [category, setCategoryList] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [count, setCount] = useState(1);
  const [delay, setDelay] = useState(500);
  const history = useHistory();
  const[disabled, setDisabled] = useState(true)

  const SignInSchema = yup.object().shape({
    title: yup.string().required("Title is a required field.").min(5),
    // access: yup.string().required("Access is a required field."),
  });

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

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
          console.log(response.data.data);
          setCategoryList(categoryData);
        }
      });
  }, [formState.useEffectKey]);

  useEffect(()=>{
    if(
      formState.title &&
      formState.access
    ){
      setDisabled(false)
    }else{
      setDisabled(true)
    }
  },[formState])

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

  const onSubmit = async () => {
    // console.log("errprrr", errors);
    if (isObjEmpty(errors)) {
      const btn = document.getElementById("submit-data");
      btn.setAttribute("disabled", true);
      btn.innerText = "Submitting..";

      setTimeout(() => {
        btn.removeAttribute("disabled");
        btn.innerText = "Submit";
      }, 3000);
      let array = [];
      let ret = formState.tags;
      for (let i = 0; i < ret.length; i++) {
        array[i] = ret[i].displayValue;
      }
      await axios
        .post(
          `${BASE_URL}/api/ticket-management/ticket-category/create-new-ticket-category`,
          {
            title: formState.title,
            access: formState.access,
            keywords: array,
            top_category: formState.top,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully added a Ticket Category."}
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
    }
  };

  const onTagsChanged = (id) => {
    setFormState({
      ...formState,
      tags: id,
    });
    console.log(id);
  };

  const setPermission = (e) => {
    setFormState({
      ...formState,
      access: e.target.value,
    });
  };

  return (
    <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
      <Col md={9}>
        <Col className="mb-2 d-flex " md={12}>
          <Row md={12}>
            <Col xs={2} style={{paddingTop: "7px"}}>
              <ArrowLeftCircle
                size={28}
                onClick={history.goBack}
                style={{ cursor: "pointer" }}
              />
            </Col>
            <Col xs={9} className="d-flex mr-1">
              <UserPlus size="50px" style={{paddingBottom : "5px"}}/>
              <h3 className="ml-1 text-nowrap" style={{paddingTop: "11px", paddingRight: "5px"}}>
                New Ticket Category
              </h3>
            </Col>
          </Row>
        </Col>
        <Col md={8} style={{ paddingLeft:"100px" }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-5">
            <FormGroup>
              <Label for="title">
                <FormattedMessage id="Reason Name"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="title"
                id="title"
                placeholder="Title"
                className={classnames({ "is-invalid": errors["title"] })}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.title && true}
              />

              {errors && errors.title && (
                <FormFeedback>{errors.title.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="top">
                <FormattedMessage id="Top Category"></FormattedMessage> :{" "}
                <span className="text-danger"></span>
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                options={category}
                isClearable={false}
                name="top"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    top: e.val,
                  })
                }
              />
              {/* {errors && errors.type && (
                <FormFeedback>{errors.top.message}</FormFeedback>
              )} */}
            </FormGroup>
            <FormGroup>
              <Label for="access">
                <FormattedMessage id="Access"></FormattedMessage> :{" "}
                <span className="text-danger">*</span>
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
              {/* {errors && errors.access && (
                <FormFeedback>{errors.access.message}</FormFeedback>
              )} */}
            </FormGroup>
            <FormGroup>
              
              <Button
                color="primary"
                outline
                onClick={() => setBasicModal(!basicModal)}
              >
                Add Tag Input
              </Button>
              <Modal
                centered
                isOpen={basicModal}
                toggle={() => setBasicModal(!basicModal)}
              >
                {/* <ModalHeader toggle={() => setBasicModal(!basicModal)}>
                Add Tag Input
              </ModalHeader> */}
                <ModalBody>
                  <FormGroup>
                    <Label for="type">
                      <FormattedMessage id="Access"></FormattedMessage> :{" "}
                      <span className="text-danger"></span>
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
                    margin-left:230px;
                    margin-top:40px;
                    width : 104%
                  `}
                      placeholder="Write Keywords"
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => setBasicModal(!basicModal)}
                  >
                    Accept
                  </Button>
                </ModalFooter>
              </Modal>
            </FormGroup>
            <div class="d-flex justify-content-center" >
            <Button
              type="submit"
              className="btn-block mr-1 mt-0"
              color="primary"
              id="submit-data"
              disabled={disabled}
            >
              <FormattedMessage id="submit"></FormattedMessage>
            </Button>
            <Button
              onClick={history.goBack}
              type="reset"
              color="secondary"
              className="btn-block mt-0"
              outline
            >
              <FormattedMessage id="Cancel"></FormattedMessage>
            </Button>
            </div>
          </Form>
        </Col>
      </Col>
    </div>
  );
}

export default Index;
