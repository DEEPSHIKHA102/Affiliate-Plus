import { useSelector } from "react-redux";
import { ROLE_PERMISSIONS } from "./userPermissions";

// Check if the logged in user has the permission coming as prop.
// Return the children is true, otherwise return null
function Can({ permission, children }) {
    const user = useSelector((state) => state.userDetails);
    const permissions = ROLE_PERMISSIONS[user?.role] || {};
    return permissions[permission] ? children : null;
}

export default Can;