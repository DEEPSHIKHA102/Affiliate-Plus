import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="container text-center mt-5">
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
      <Link to="/logout">Logout</Link>
    </div>
  );
}

export default Dashboard;