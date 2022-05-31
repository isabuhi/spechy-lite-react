import React, { Fragment, useEffect, useState, useContext } from "react";

// ** Third Party Components
import classnames from "classnames";
import { useForm } from "react-hook-form";

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Input,
  FormGroup,
  CardBody,
  CardSubtitle,
  CardText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AlertCircle, ArrowLeftCircle, Coffee, UserPlus } from "react-feather";
import axios from "axios";
import { BASE_URL } from "../../../../src/@core/auth/jwt/jwtService";
import Select from "react-select";
import ModalPop from "./modalPop";
import CreateDash from "./createDash";
import { IntlContext } from "../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";
import Breadcrumbs from "../subComponents/breadCrumbs";

import Avatar from "../../../../src/@core/components/avatar";
import { Slide, toast } from "react-toastify";

function EcommerceDashboard(props) {
  const context = useContext(IntlContext);

  const call = [
    {
      value: 1,
      label: "Yes",
    },
    {
      value: 0,
      label: "No",
    },
  ];
  const [formState, setFormState] = useState({
    templateId: 3,
    dashData: [],
    selectTemplates: [],
  });
  const [basicModal, setBasicModal] = useState(false);
  const [disabledModal, setDisabledModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesUpdated, setTemplatesUpdated] = useState(1);

  const [dashData, setDashData] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showDash, setShowDash] = useState(false);
  const [centeredModal, setCenteredModal] = useState(false);
  const SignInSchema = yup.object().shape({
    title: yup
      .string()
      .required("Ready Answer Title is a required field.")
      .min(5),
  });

  useEffect(async () => {
    await axios
      .get(`${BASE_URL}/api/dashboard/1/get-all-templates`)
      .then((response) => {
        if (response.status === 200) {
          var result = Object.values(response.data.data.templates);
          var templatesItems = [{}];
          for (var j = 0; j < result.length; j++) {
            templatesItems[j] = {
              val: result[j].template_id,
              label: result[j].name,
            };
          }
          const savedDash =
            localStorage.getItem("my-Dash") > 0
              ? localStorage.getItem("my-Dash")
              : result[0].template_id;
          if (result[0].template_id !== "undefined") {
            axios
              .get(`${BASE_URL}/api/dashboard/1/select/${savedDash}`)
              .then((response) => {
                console.log("somthisssngelse", response.data.data);
                if (response.status === 200) {
                  var dashResult = Object.values(response.data.data);

                  var dashItems = [{}];
                  for (var j = 0; j < dashResult.length; j++) {
                    dashItems[j] = {
                      val: dashResult[j].value,
                      label: dashResult[j].name,
                      show: dashResult[j].show,
                      field_id: dashResult[j].field_id,
                    };
                  }
                  setDashData(dashItems);
                  setShowDash(true);
                }
              });
          }
          setTemplates(templatesItems);
        }
      });
  }, [templatesUpdated]);

  useEffect(() => {
    let templatesIds = [];

    templates.length > 0
      ? templates.map((i) => {
          templatesIds.push(i.val);
        })
      : "";

    setCurrentId(templatesIds);
  }, [templates]);

  useEffect(async () => {}, [currentId, templates]);

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

  const onChange = async (e) => {
    console.log("eee", e);
    await axios
      .get(`${BASE_URL}/api/dashboard/1/select/${e.val}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("effect", response.data.data);
          var dashResult = Object.values(response.data.data);

          var dashItems = [{}];
          for (var j = 0; j < dashResult.length; j++) {
            dashItems[j] = {
              val: dashResult[j].value,
              label: dashResult[j].name,
              show: dashResult[j].show,
              field_id: dashResult[j].field_id,
            };
          }
          setDashData(dashItems);
        }
      });
    localStorage.setItem("my-Dash", e.val);
    setShowDash(true);
  };

  const { register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(SignInSchema),
  });

  return (
    <div>
      <div className="d-flex justify-content-start breadcrumb-wrapper">
        <Breadcrumbs />
      </div>
      <Card>
        <CardBody>
          <div className="invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75">
            <Row>
              <Col xl="6" className="d-flex align-items-center p-0">
                <div className="d-flex align-items-center w-100">
                  {/* <Label> */}
                  <FormattedMessage id="Selectdashboard" />
                  {/* </Label> */}
                  <Select
                    name="type"
                    className="ml-50 w-50"
                    classNamePrefix="select"
                    options={templates}
                    onChange={(e) => onChange(e)}
                    innerRef={register({ required: true })}
                    invalid={errors.type && true}
                  />
                </div>
              </Col>

              <Col
                xl="6"
                className="d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1"
              >
                <div className="d-flex align-items-center mb-sm-0 mb-1 mr-2">
                  <div
                    style={{ cursor: "pointer" }}
                    className="d-flex align-items-center justify-content-center mb-sm-0 mb-1 ml-1"
                  ></div>
                </div>

                <div className="basic-modal">
                  <Button
                    color="primary"
                    outline
                    onClick={() => setBasicModal(!basicModal)}
                  >
                    <FormattedMessage id="customizedashboard"></FormattedMessage>
                  </Button>
                  <Modal
                    isOpen={basicModal}
                    toggle={() => setBasicModal(!basicModal)}
                  >
                    <ModalHeader toggle={() => setBasicModal(!basicModal)}>
                      <FormattedMessage id="PassiveWidgets"></FormattedMessage>
                    </ModalHeader>
                    <ModalBody>
                      <ModalPop dashData={dashData} />
                    </ModalBody>
                  </Modal>
                </div>

                <div className="vertically-centered-modal p-2">
                  <Button
                    color="primary"
                    outline
                    onClick={() => setDisabledModal(!disabledModal)}
                  >
                    <FormattedMessage id="createdashboard"></FormattedMessage>
                  </Button>
                  <Modal
                    isOpen={disabledModal}
                    toggle={() => setDisabledModal(!disabledModal)}
                    className="modal-dialog-centered"
                  >
                    <ModalHeader
                      toggle={() => setDisabledModal(!disabledModal)}
                    >
                      Vertically Centered
                    </ModalHeader>
                    <ModalBody>
                      <CreateDash
                        dashData={dashData}
                        onClose={() => setDisabledModal(!disabledModal)}
                        toUpdate={() =>
                          setTemplatesUpdated(templatesUpdated + 1)
                        }
                      />
                    </ModalBody>
                  </Modal>
                </div>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
      {showDash ? (
        <div id="dashboard-ecommerce">
          <Row className="match-height">
            <Col>
              <Row xs={4}>
                {dashData.map((x) =>
                  x.show === true ? (
                    <Col>
                      <Card>
                        <CardBody>
                          <CardTitle style={{ textAlign: "center" }} tag="h5">
                            {x.label}
                          </CardTitle>
                          <CardSubtitle
                            tag="h6"
                            className="mb-2 text-muted"
                          ></CardSubtitle>
                          {}
                          <CardText tag="h3" style={{ textAlign: "center" }}>
                            {x.val}
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>
                  ) : (
                    ""
                  )
                )}
              </Row>
            </Col>
          </Row>
        </div>
      ) : null}
    </div>
  );
}

export default EcommerceDashboard;
