import { duration } from "moment";
import { CustomInput } from "reactstrap";

const PricingHeader = ({ duration, setDuration }) => {
  const onChange = (e) => {
    if (e.target.checked) {
      setDuration("yearly");
    } else {
      setDuration("monthly");
    }
  };

  return (
    <div className="text-center">
      <h1 className="mt-5">Pricing Plans</h1>
      <p className="mb-2 pb-75">
        All plans include 40+ advanced tools and features to boost your product.
        Choose the best plan to fit your needs.
      </p>
    </div>
  );
};

export default PricingHeader;
