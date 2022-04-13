import React, { Fragment, useEffect, useState } from "react";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import {
  Button,
  FormGroup,
  Label,
  FormText,
  Form,
  Input,
  Col,
  FormFeedback,
  Row,
  CustomInput,
} from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";
import { useDispatch, useSelector } from "react-redux";

import Select from "react-select";
import {
  isObjEmpty,
  getHomeRouteForLoggedInUser,
} from "../../../../src/utility/Utils";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeftCircle,
  Coffee,
  FolderPlus,
} from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import Avatar from "../../../../src/@core/components/avatar";
import { Slide, toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

const AddNote = (props) => {
  const { customer_id, log_id, channel_id } = props;
  const [formState, setFormState] = useState({
    name: "",
    notecontent: "",
  });
  const [value, setValue] = useState(EditorState.createEmpty());
  const [editorContent, setEditorContent] = useState("");
  const updateTextDescription = async (state) => {
    await setValue(state);
    const data = convertToRaw(value.getCurrentContent());

    setEditorContent(data.blocks.map((x) => x.text));
  };
  const dispatch = useDispatch();

  const history = useHistory();

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
    defaultValues: {},
  });

  const onSubmit = async () => {
    if (isObjEmpty(errors)) {
      await axios
        .post(
          `${BASE_URL}/api/customer-management/customer/notes/create-new-note`,
          {
            name: formState.name,
            notecontent: editorContent.toString(),
            customer_id: customer_id,
            channel_id: channel_id,
            log_id: log_id,
          }
        )

        .then((response) => {
          if (response.status === 200) {
            toast.success(
              <ToastContent
                type={"success"}
                content={"You have successfully added a user."}
                header={"Congratulations !!"}
              />,
              { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            );
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

            <Col xs={22} className="d-flex ml-3">
              <h3 className="m1-1">Add Note</h3>
            </Col>
          </Row>
        </Col>
        <Col md={{ size: 6, offset: 2 }}>
          <Form className="mb-5 pb-5" onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="name">
                Note Name <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="name"
                id="name"
                placeholder="title"
                className={classnames({ "is-invalid": errors["full-name"] })}
                defaultValue={formState.name}
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
              <Label for="templateContent">
                Content : <span className="text-danger">*</span>
              </Label>
              <Editor
                name="templateContent"
                editorState={value}
                // onEditorStateChange={(data) => setValue(data)}
                // defaultValue={formState.templateContent}
                onEditorStateChange={updateTextDescription}
              />
            </FormGroup>

            {/* <FormGroup>
              <Label for="notecontent">
                note content <span className="text-danger">*</span>
              </Label>
              <Input
                autoFocus
                name="notecontent"
                id="notecontent"
                placeholder="notecontent"
                className={classnames({ "is-invalid": errors["full-name"] })}
                defaultValue={formState.notecontent}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    [e.target.name]: e.target.value,
                  })
                }
                innerRef={register({ required: true })}
                invalid={errors.notecontent && true}
              />
              {errors && errors.notecontent && (
                <FormFeedback>{errors.notecontent.message}</FormFeedback>
              )}
            </FormGroup> */}

            <Button type="submit" className="mr-1" color="primary">
              Save
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
};

export default AddNote;
