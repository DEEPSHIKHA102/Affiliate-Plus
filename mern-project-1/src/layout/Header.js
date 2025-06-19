import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
	return (
		<header>
			<Navbar bg="light" expand="lg" className="shadow-sm">
				<Container>
					<Navbar.Brand as={Link} to="/" className="fw-bold">
						Deepshikha's App
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="main-navbar" />
					<Navbar.Collapse id="main-navbar">
						<Nav className="ms-auto">
							<Nav.Link as={Link} to="/">Home</Nav.Link>
							<Nav.Link as={Link} to="/login">Login</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
}

export default Header;