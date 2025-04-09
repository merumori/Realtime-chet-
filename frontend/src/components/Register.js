import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import './CSS/Register.css'; // Link to the CSS file for styling

export default function Register({ setPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async () => {
    try {
      await axios.post('https://realtime-chet.onrender.com/api/auth/register', { username, password });
      setPage('login');
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="register-bg">
      <div className="register-container">
        <Card className="register-card shadow p-4">
          <Card.Body>
            <Card.Title className="text-center mb-4">Create an Account</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="success" onClick={register}>Register</Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <span className="account-text">Already have an account? </span>
              <span
                className="login-link"
                onClick={() => setPage('login')}
              >
                Login here
              </span>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
