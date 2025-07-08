import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../../config/config";

function formatDate(isoDateString) {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Invalid date:', isoDateString);
    return '';
  }
}

function Subscription() {
  const userDetails = useSelector((state) => state.userDetails);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const subscription = userDetails.subscription;

  const handleCancel = async () => {
    setIsCancelling(true);
    setMessage("We're cancelling your subscription. This may take up to 5 minutes.");
    try {
      await axios.post(
        `${serverEndpoint}/payments/cancelsubscription`,
        { subscription_id: userDetails.subscription?.id },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Cancellation error:", error);
      setErrors({ message: error.response?.data?.message || 'Unable to cancel subscription' });
    } finally {
      setTimeout(() => setIsCancelling(false), 300000);
    }
  };

  return (
    <div className="container py-5">
      {errors.message && <div className="alert alert-danger">{errors.message}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row justify-content-center">
        <div className="col-5">
          <div className="card w-100 mb-3">
            <div className="card-body">
              <h3 className="card-title">Subscription Summary</h3>
              <hr />
              <p className="card-text">
                <div className="pb-2"><strong>Start Date: </strong>{formatDate(subscription.start)}</div>
                <div className="pb-2"><strong>End Date: </strong>{formatDate(subscription.end)}</div>
                <div className="pb-2"><strong>Last Payment Date: </strong>{formatDate(subscription.lastBillDate)}</div>
                <div className="pb-2"><strong>Next Payment Date: </strong>{formatDate(subscription.nextBillDate)}</div>
                <div className="pb-2"><strong>Total Payments Made: </strong>{subscription.paymentsMade}</div>
                <div className="pb-2"><strong>Payments Remaining: </strong>{subscription.paymentsRemaining}</div>
              </p>
              <hr />
              <div className="text-center">
                <button
                  className="btn btn-danger w-50"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
