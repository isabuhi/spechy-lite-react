// import { useContext } from 'react'
// import { List } from 'react-feather'
// import { kFormatter } from '@utils'
// import Avatar from '@components/avatar'
// import Timeline from '@components/timeline'
// import AvatarGroup from '@components/avatar-group'
// import jsonImg from '@src/assets/images/icons/json.png'
// import InvoiceList from '@src/views/apps/invoice/list'
// import ceo from '@src/assets/images/portrait/small/avatar-s-9.jpg'
// import { ThemeColors } from '@src/utility/context/ThemeColors'
// import Sales from '@src/views/ui-elements/cards/analytics/Sales'
// import AvgSessions from '@src/views/ui-elements/cards/analytics/AvgSessions'
// import CardAppDesign from '@src/views/ui-elements/cards/advance/CardAppDesign'
// import SupportTracker from '@src/views/ui-elements/cards/analytics/SupportTracker'
// import { Row, Col, Card, CardHeader, CardTitle, CardBody, Media } from 'reactstrap'
// import OrdersReceived from '@src/views/ui-elements/cards/statistics/OrdersReceived'
// import CardCongratulations from '@src/views/ui-elements/cards/advance/CardCongratulations'
// import SubscribersGained from '@src/views/ui-elements/cards/statistics/SubscribersGained'

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
} from "reactstrap";
import { Fragment, useEffect, useContext } from "react";
import { getSidebarMenu } from "../../../redux/actions/sidebarMenu";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../auth/utils";
import ExtensionsHeader from "@components/extensions-header";
import { IntlContext } from "../../../utility/context/Internationalization";
import { FormattedMessage } from "react-intl";

import "@styles/react/libs/charts/apex-charts.scss";

const Home = () => {
  const dispatch = useDispatch();
  const context = useContext(IntlContext);
  // const store = useSelector(state => console.log("states", state))
  // console.log("storingthesidebar",store)
  useEffect(() => {
    dispatch(getSidebarMenu(getUserData()));
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <FormattedMessage id="text"> 🚀</FormattedMessage>
        </CardHeader>
        <CardBody>
          <CardText>All the best for your new project.</CardText>
          <CardText>
            Please make sure to read our{" "}
            <CardLink
              href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/"
              target="_blank"
            >
              Template Documentation
            </CardLink>{" "}
            to understand where to go from here and how to use our template.
          </CardText>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Want to integrate JWT? 🔒</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            We carefully crafted JWT flow so you can implement JWT with ease and
            with minimum efforts.
          </CardText>
          <CardText>
            Please read our{" "}
            <CardLink
              href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/development/auth"
              target="_blank"
            >
              JWT Documentation
            </CardLink>{" "}
            to get more out of JWT authentication.
          </CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
