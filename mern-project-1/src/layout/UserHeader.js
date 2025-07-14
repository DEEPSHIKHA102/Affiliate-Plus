import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Can from "../rbac/Can";

function UserHeader() {
    const userDetails = useSelector((state) => state.userDetails);

    return (
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-secondary shadow-sm">
            <div className="container">
                <Link className="navbar-brand text-warning fw-semibold fs-4" to="/">
                    Affiliate<span className="text-light">++</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* future nav links */}
                    </ul>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <span
                                className="nav-link dropdown-toggle text-capitalize text-light"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {userDetails?.name || "Account"}
                            </span>

                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to="/manage-payments">
                                        💳 Manage Payments
                                    </Link>
                                </li>

                                <Can permission="canViewUser">
                                    <li>
                                        <Link className="dropdown-item" to="/users">
                                            👥 Manage Users
                                        </Link>
                                    </li>
                                </Can>

                                <li>
                                    <Link className="dropdown-item text-danger" to="/logout">
                                        🚪 Logout
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default UserHeader;
