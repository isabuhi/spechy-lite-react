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
import { FormattedMessage } from "react-intl";

const SelectData = (props) => {
  const { heading, body, dataTypes } = props;
  console.log("props", props);
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

  var technologyList = [];
  dataTypes.forEach(function (element) {
    technologyList.push({ label: element, value: element });
    console.log("araba", technologyList);
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

  const selectStyling = {
    margin: "20px",
    width: "180px",
    borderRadius: "5px",
  };

  return (
    <Row>
      <Col sm="12">
        <Row>
          <Col sm='6' className="form-inline">
            <FormGroup className="ml-1">
              <Label for="type">
                <FormattedMessage id="SelectDataType"></FormattedMessage> : <span className="text-danger">*</span>
              </Label>

              <select style={selectStyling}>
                {technologyList.map((option) => (
                  <option value={option.label.data_type}>
                    {option.label.data_type}
                  </option>
                ))}
              </select>
            </FormGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SelectData;
