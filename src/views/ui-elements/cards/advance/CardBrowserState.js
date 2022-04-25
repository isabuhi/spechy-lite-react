import Chart from "react-apexcharts";
import { Check, X, Link } from "react-feather";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
  Input,
  Button,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";

const CardBrowserState = ({ colors, trackBgColor }) => {
  const statesArr = [
    {
      avatar: require("@src/assets/images/icons/1260673.png").default,
      title: "Facebook",
      value: "54.4%",
      url: "/media/reactfacebook",
      linked: false,
      name: "@spechycom",
    },
    {
      avatar: require("@src/assets/images/icons/Instagram_icon.png").default,
      title: "Instagram",
      value: "6.1%",
      url: "/media/instagram/list",
      linked: false,
      name: "@spechy",
    },
    {
      avatar: require("@src/assets/images/icons/viber.png").default,
      title: "Viber",
      value: "4.2%",
      url: "#",
      linked: false,
      name: "@spechy",
    },
    {
      avatar: require("@src/assets/images/icons/telegram.png").default,
      title: "Telegram",
      value: "8.4%",
      url: "#",
      linked: false,
      name: "@spechyBot",
    },
    {
      avatar: require("@src/assets/images/icons/line.png").default,
      title: "Line",
      value: "8.4%",
      url: "#",
      linked: false,
      name: "@spechy",
    },
  ];

  const statesArr1 = [
    {
      avatar: require("@src/assets/images/icons/e-mail-icon-11.jpg").default,
      title: "E-Mail",
      value: "4.2%",
      url: "/settings/mail-management",
      linked: false,
      name: "info@spechy.com",
    },
    {
      avatar: require("@src/assets/images/icons/live-chat-icon.png").default,
      title: "Live Chat",
      value: "8.4%",
      url: "/chat-widget/list",
      linked: false,
      name: "",
    },
    {
      avatar: require("@src/assets/images/icons/WhatsApp.svg.png").default,
      title: "Whatsapp",
      value: "8.4%",
      url: "/social/whatsapp/index",
      linked: false,
      name: "@spechy",
    },
    {
      avatar: require("@src/assets/images/icons/124021.png").default,
      title: "Twitter",
      value: "8.4%",
      url: "#",
      linked: false,
      name: "@spechycom",
    },
    {
      avatar: require("@src/assets/images/icons/live-chat-icon.png").default,
      title: "Vedio Chat",
      value: "8.4%",
      url: "/vedio-chat-widget/list",
      linked: false,
      name: "@spechycom",
    },
  ];

  const renderStates1 = () => {
    let history = useHistory();
    const handleClick = (e, param) => {
      e.preventDefault();
      history.push(param);
    };
    return statesArr1.map((item) => {
      return (
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <img
              className="me-1"
              src={item.avatar}
              alt={item.title}
              height="38"
              width="38"
            />
          </div>
          <div className="d-flex align-item-center justify-content-between flex-grow-1">
            <div className="me-1">
              <p
                className="fw-bolder mb-0"
                style={{ marginTop: "10px", marginLeft: "5px" }}
              >
                {item.title}
              </p>
            </div>
            <div className="mt-50 mt-sm-0">
              <Button outline className="btn-icon">
                {item.linked ? (
                  <X className="font-medium-3" />
                ) : (
                  <Link
                    className="font-medium-3"
                    onClick={(e) => handleClick(e, item.url)}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderStates = () => {
    let history = useHistory();
    const handleAddClick = (e, param) => {
      e.preventDefault();
      history.push(param);
    };

    return statesArr.map((item) => {
      return (
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <img
              className="me-1"
              src={item.avatar}
              alt={item.title}
              height="38"
              width="38"
            />
          </div>
          <div className="d-flex align-item-center justify-content-between flex-grow-1">
            <div className="me-1">
              <p
                className="fw-bolder mb-0"
                style={{ marginTop: "10px", marginLeft: "5px" }}
              >
                {item.title}
              </p>
            </div>
            <div className="mt-50 mt-sm-0">
              <Button outline className="btn-icon">
                {item.linked ? (
                  <X className="font-medium-3" />
                ) : (
                  // <a href={item.url}>
                  <Link
                    className="font-medium-3"
                    onClick={(e) => handleAddClick(e, item.url)}
                  />
                  // </a>
                )}
              </Button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Card className="card-browser-states">
      <CardHeader>
        <div>
          <CardTitle tag="h4">
            <FormattedMessage id="Activate Your Communication Channel"></FormattedMessage>
          </CardTitle>
          <CardText className="font-small-2">
            <FormattedMessage id="Please Select Your Communication Channel"></FormattedMessage>
          </CardText>
        </div>
      </CardHeader>
      <Row className="match-height" style={{ marginTop: "-50px" }}>
        <Col lg="6" md="6">
          <CardBody>{renderStates()}</CardBody>
        </Col>
        <Col lg="6" md="6">
          <CardBody>{renderStates1()}</CardBody>
        </Col>
      </Row>
    </Card>
  );
};

export default CardBrowserState;
