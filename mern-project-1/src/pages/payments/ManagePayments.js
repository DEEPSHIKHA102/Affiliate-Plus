import { useSelector } from "react-redux";
import PurchaseCredit from "./PurchaseCredit";
import Subscription from "./Subscription";

function ManagePayments() {
const userDetails = useSelector((state) => state.userDetails);

if (userDetails.subscription?.status === 'active') {
return <Subscription />;
} else {
 return <PurchaseCredit />;
 }
 }

 export default ManagePayments;