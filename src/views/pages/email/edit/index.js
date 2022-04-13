import React, {useState, useEffect} from "react"

// import Breadcrumbs from "../subComponents/breadCrumbs"
import {
    Card,
    CardBody,
    Row,
    Col,
} from "reactstrap"
import EmailTemplateInfo from "./editTemplate"

const EditEmailTemplate = () => {
    return (
        <Row className="app-user-edit">
            <Col sm="12"><br/>
                <Card>
                    <CardBody className="pt-2">
                        {/*<Breadcrumbs />*/}
                        <EmailTemplateInfo />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}
export default EditEmailTemplate
