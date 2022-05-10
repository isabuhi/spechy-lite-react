import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import PricingFaqs from "./PricingFaqs";
import PricingCards from "./PricingCards";
import PricingTrial from "./PricingTrial";
import PricingHeader from "./PricingHeader";
import { BASE_URL } from "../../../@core/auth/jwt/jwtService";
import "@styles/base/pages/page-pricing.scss";

const Pricing = () => {
  const [data, setData] = useState(null),
    [faq, setFaq] = useState(null),
    [duration, setDuration] = useState("monthly");

  useEffect(() => {
    const fetchPricing = async () => {
      await axios
        .get(
          `${BASE_URL}/api/plan-management/plan/get-all-plans-with-current-plan/tr`
        )
        .then((res) => {
          setData(res.data.data);
        });
    };
    fetchPricing();
  }, []);

  return (
    <div id="pricing-table">
      <PricingHeader duration={duration} setDuration={setDuration} />

      <Fragment>
        <PricingCards data={data} duration={duration} />
        <PricingTrial />
      </Fragment>
    </div>
  );
};

export default Pricing;
