import React, {useState, useEffect} from "react"
import {useParams, Link} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
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
    Alert
} from "reactstrap"
import {getSMSTemplate} from "../store/actions"
import SMSTemplateInfo from "./editTemplate"

const EditSMSTemplate = () => {


    return (
        <Row className="app-user-edit">
            <Col sm="12">
                <Card>
                    <CardBody className="pt-2">
                        <SMSTemplateInfo/>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}
export default EditSMSTemplate
