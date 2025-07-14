import React from 'react';
import './Home.css'; // Create this CSS file for custom styles
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="hero-section d-flex align-items-center justify-content-center text-center">
            <div>
                <h1 className="display-4 fw-bold text-white">Welcome to <span className="highlight">Affiliate++</span></h1>
                <p className="lead text-white mt-3 mb-4">
                    A MERN-based platform to explore affiliate marketing tools and projects.
                </p>
                <Link to="/dashboard">
                    <Button variant="light" size="lg" className="rounded-pill shadow">
                        Go to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
