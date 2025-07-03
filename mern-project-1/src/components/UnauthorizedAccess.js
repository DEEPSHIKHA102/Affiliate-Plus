function UnauthorizedAccess() {
    return (
        <div className="container text-center">
            <h2>Unauthorized Access</h2>
            <p>
                You do not have enough permissions to perform this action.
                Please contact your admin for more details.
            </p>
        </div>
    );
}

export default UnauthorizedAccess;