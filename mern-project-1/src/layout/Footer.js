import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row className="text-center">
          <Col>
            <p className="mb-1">&copy; {new Date().getFullYear()} Deepshikha's Website</p>
            <p className="mb-0">All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
