import { Fragment, useContext } from "react";
import { Row, Col } from "reactstrap";
import CardJob from "./CardJob";
import CardChat from "./CardChat";
import CardMedal from "./CardMedal";
import CardMeetup from "./CardMeetup";
import CardPayment from "./CardPayment";
import CardProfile from "./CardProfile";
import CardBusiness from "./CardBusiness";
import CardAppDesign from "./CardAppDesign";
import CardUserTimeline from "./CardUserTimeline";
import CardBrowserState from "./CardBrowserState";
import Breadcrumbs from "@components/breadcrumbs";
import CardTransactions from "./CardTransactions";
import CardEmployeesTasks from "./CardEmployeesTask";
import CardCongratulations from "./CardCongratulations";
import { ThemeColors } from "@src/utility/context/ThemeColors";

const Cards = () => {
  const { colors } = useContext(ThemeColors),
    trackBgColor = "#e9ecef";
  return (
    <Fragment>
      <Row className="match-height">
        <Col lg="12" md="12">
          <br/>
          <CardBrowserState colors={colors} trackBgColor={trackBgColor} />
        </Col>
      </Row>
    </Fragment>
  );
};

export default Cards;
