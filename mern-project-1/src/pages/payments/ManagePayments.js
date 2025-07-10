// ✅ ManagePayments.js
import { useSelector } from "react-redux";
import PurchaseCredit from "./PurchaseCredit";
import Subscription from "./Subscription";

function ManagePayments() {
  const userDetails = useSelector((state) => state.userDetails);
  const status = userDetails.subscription?.status;

  if (status === 'active') {
    return <Subscription />;
  } else if (status === 'created' || status === 'authenticated' || status === 'pending') {
    return (
      <div className="container py-5">
        <div className="alert alert-info text-center">
          We're confirming the status of your payment. This may take up to 5 minutes.
        </div>
      </div>
    );
  } else {
    return <PurchaseCredit />;
  }
}

export default ManagePayments;
