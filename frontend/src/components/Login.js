import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import './CSS/Login.css'; // Ensure this path is correct

export default function Login({ setUser, setPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setUser(res.data);
      setPage('chat');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-bg">
      <div className="form-container">
        <Card className="login-card shadow p-4">
          <Card.Body>
            <Card.Title className="text-center mb-4">RealTime Chat Login</Card.Title>
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
                <Button variant="primary" onClick={login}>Login</Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <span className="no-account-text">Don't have an account? </span>
              <span
                className="register-link"
                onClick={() => setPage('register')}
              >
                Register here
              </span>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
