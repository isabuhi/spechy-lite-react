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
  ListGroup,
  ListGroupItem,
  Container,
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

const ListData = (props) => {
  const { heading, body, dataTypes } = props;
  console.log("props", props);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  console.log("object", heading);

  const dataTypesFields = dataTypes.map((x) => {
    return x.fields;
  });

  console.log("object22", dataTypesFields[0]);

  var technologyList = [];
  heading.forEach(function (element) {
    technologyList.push({ label: element, value: element });

    console.log("technologyList", technologyList);
  });

  var fieldsList = [];
  const customerDataType = dataTypesFields[0];
  if (dataTypesFields.length > 0) {
    customerDataType.forEach(function (element) {
      fieldsList.push({ label: element });

      console.log("fieldsList", fieldsList);
    });
  }

  return (
    <Container>
      <Label for="type">
        <FormattedMessage id="Excell Fields"></FormattedMessage> :{" "}
        <span className="text-danger">*</span>
      </Label>
      <Row xs="2">
        <Col>
          {technologyList.map((option) => (
            <ListGroup>
              <ListGroupItem>{option.label}</ListGroupItem>
            </ListGroup>
          ))}
        </Col>
        <Col>
          {fieldsList.map((option) => (
            <ListGroup>
              <ListGroupItem style={{ border: "none" }}>
                <select>
                  <option>{option.label}</option>
                </select>
              </ListGroupItem>
            </ListGroup>
          ))}
        </Col>
      </Row>
    </Container>
    // <Row>
    //   <Col sm="12">
    //     <Row>
    //       <Col md={{ size: 6, offset: 2 }}>
    //         <FormGroup>
    //           <div style={excellFIelds}>
    //             <Label for="type">
    //               <FormattedMessage id="Excell Fields"></FormattedMessage> :{" "}
    //               <span className="text-danger">*</span>
    //             </Label>
    //             <div style={unordardList}>
    //               {technologyList.map((option) => (
    //                 <ul style={listDots}>
    //                   <li>{option.label}</li>
    //                   <hr></hr>
    //                 </ul>
    //               ))}
    //             </div>
    //             <div style={selectList}>
    //               {fieldsList.map((option) => (
    //                 <ul style={listDots}>
    //                   <li>
    //                     <select>
    //                       <option>{option.label}</option>
    //                     </select>
    //                   </li>
    //                   <hr></hr>
    //                 </ul>
    //               ))}
    //             </div>
    //           </div>
    //         </FormGroup>
    //       </Col>
    //     </Row>
    //   </Col>
    // </Row>
  );
};

export default ListData;
