import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import Breadcrumbs from "../subComponents/breadCrumbs"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
} from "reactstrap";
import EditTag from "./editTag";

const EditEmailTemplate = () => {
  return (
    <Row className="app-user-edit">
      <Col sm="12">
        <Card>
          <CardBody className="pt-2">
            {/*<Breadcrumbs />*/}
            <EditTag />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default EditEmailTemplate;
