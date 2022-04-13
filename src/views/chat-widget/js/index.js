import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link  , useHistory} from "react-router-dom";
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
  Button,
} from "reactstrap";
import { getCompany } from "../store/actions";
import { User, Info, Share2 } from "react-feather";
// import LoginInfo from "./LoginInfo";

const EditCompany = () => {
  const [activeTab, setActiveTab] = useState("1");
  const history = useHistory();
  const toggle = (tab) => setActiveTab(tab);
  const { id , file } = useParams();

  return (
    <Row className="app-user-edit">
        <br/>
        <br/>
      <Col sm="12">
        <br/>
        <Card>
        <br/>
          <CardBody className="pt-2">
                <h4>JS Code</h4>
                <p>Put this code into your website and widget will be show up</p>
              <div style={{width : '100%' , backgroundColor : '#eee' , padding : '20px'}}>
              <code style={{width : '80%' , color : '#000'}}>
                {`<script type="text/javascript">
                $spechyConfig = {request : {params:''},autoChatRequest: 1};
                (function (d, t) {var e, s = d.getElementsByTagName(t)[0];e = d.createElement(t), e.async = true, e.charset = 'UTF8';
                e.src = 'https://app.spechy.com/js/spcwg.js?w=${file}&widget=${id}&lang=en';
                s.parentNode.insertBefore(e, s);
                })(document, 'script');
                </script>`
                }
            </code>
              </div>
              <Col md={{ size: 10, offset: 0 }}>
              <br/>
              <br/>
              <Button.Ripple
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                type="submit"
                color="primary"
                onClick={() => {
                    navigator.clipboard.writeText(`<script type="text/javascript">
                    $spechyConfig = {request : {params:''},autoChatRequest: 1};
                    (function (d, t) {var e, s = d.getElementsByTagName(t)[0];e = d.createElement(t), e.async = true, e.charset = 'UTF8';
                    e.src = 'https://app.spechy.com/js/spcwg.js?w=${file}&widget=${id}&lang=en';
                    s.parentNode.insertBefore(e, s);
                    })(document, 'script');
                    </script>`)
                }}
              >
                Copy to Clipboard
              </Button.Ripple>
              <Button.Ripple
                onClick={() => history.goBack()}
                className="mb-1 mb-sm-0 mr-0 mr-sm-1"
                color="secondary"
                outline
              >
                Go Back
              </Button.Ripple>
            </Col>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default EditCompany;
