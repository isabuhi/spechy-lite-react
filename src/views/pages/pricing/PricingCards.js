import React, { useState, useEffect } from "react";
import classnames from "classnames";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Badge,
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";

import PaymentForm from "./cardInfo";

const PricingCards = ({ data, duration }) => {
  const [basicModal, setBasicModal] = useState(false);

  const renderPricingCards = () => {
    if (data !== null) {
      return data.map((item, index) => {
        const monthly_prices =
          duration === "yearly" ? item.yearly_price : item.monthly_price;
        // yearly_price = duration === 'yearly' ? item.yearlyPlan.totalAnnual : item.monthlyPrice,
        // imgClasses = item.title === 'Basic' ? 'mb-2 mt-5' : item.title === 'Standard' ? 'mb-1' : 'mb-2'
        return (
          <Col key={index} md="3" xs="12">
            <Card
              className={classnames("text-center", {
                [`${item.name.toLowerCase()}-pricing`]: item.name,
                popular: item.popular === true,
              })}
            >
              <CardBody>
                {/* <img className={imgClasses} src={item.img} alt='pricing svg' /> */}
                <h3>{item.name}</h3>
                {/* <CardText>{item.subtitle}</CardText> */}
                <div className="annual-plan">
                  <div className="plan-price mt-2">
                    <sup className="font-medium-1 font-weight-bold text-primary mr-25">
                      $
                    </sup>
                    <span
                      className={`pricing-${item.name.toLowerCase()}-value font-weight-bolder text-primary`}
                    >
                      {monthly_prices}
                    </span>
                    <span className="pricing-duration text-body font-medium-1 font-weight-bold ml-25">
                      /{duration}
                    </span>
                  </div>
                  {item.name !== "Basic" && duration === "yearly" ? (
                    <small className="annual-pricing text-muted">
                      USD {item.yearly_price} / year
                    </small>
                  ) : null}
                </div>
                <ListGroup
                  tag="ul"
                  className="list-group-circle text-left mb-2"
                >
                  {item.features.map((benefit, i) => (
                    // console.log("benefit",benefit)
                    <ListGroupItem>{benefit.channel.name}</ListGroupItem>
                  ))}
                </ListGroup>
                <Button.Ripple
                  onClick={() => setBasicModal(!basicModal)}
                  color={item.name === "Basic" ? "success" : "primary"}
                  outline={item.name !== "Standard"}
                  block
                >
                  {item.name === "Basic" ? "Your current plan" : "Upgrade"}
                </Button.Ripple>
              </CardBody>
            </Card>
          </Col>
        );
      });
    }
  };

  return (
    <>
      <div className="basic-modal">
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>
            Card Information
          </ModalHeader>
          <ModalBody>
            <PaymentForm />
          </ModalBody>
        </Modal>
      </div>
      <Row className="pricing-card">
        <Col
          className="mx-auto"
          sm={{ offset: 2, size: 10 }}
          lg={{ offset: 2, size: 10 }}
          md="12"
        >
          <Row>{renderPricingCards()}</Row>
        </Col>
      </Row>
    </>
  );
};

export default PricingCards;
