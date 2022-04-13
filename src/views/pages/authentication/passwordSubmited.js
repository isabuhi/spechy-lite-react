import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "react-feather";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import { Alert } from "reactstrap";

const ForgotPasswordV1 = () => {
  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="auth-inner py-2">
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              <h2 className="brand-text text-primary ml-1">Spechy</h2>
            </Link>
            <CardTitle tag="h4" className="mb-1">
              Forgot Password? 🔒
            </CardTitle>
            <CardText className="mb-2">
              A request has been received to change the password for your Spechy
              account.
            </CardText>
            <React.Fragment>
              <Alert color="primary">
                <div className="alert-body">
                  <span> Please check your email</span>
                </div>
              </Alert>
            </React.Fragment>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="mr-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordV1;
