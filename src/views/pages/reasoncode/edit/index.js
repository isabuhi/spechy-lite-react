import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { getCompany } from "../store/actions";
import { User, Info, Share2 } from "react-feather";
import GeneralInfo from "./generalInfo";
// import LoginInfo from "./LoginInfo";

const EditCompany = () => {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => setActiveTab(tab);
  const { id } = useParams();

  return (
    <Row className="app-user-edit">
      <Col sm="12">
        <Card>
          <CardBody className="pt-2">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <GeneralInfo />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default EditCompany;
