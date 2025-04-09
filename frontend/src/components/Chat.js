import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {
  Button, Form, InputGroup, Container, Row, Col, ListGroup, Badge,
} from 'react-bootstrap';
import {
  FaPaperPlane, FaUserCircle, FaSignOutAlt, FaTrash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CSS/Chat.css';

const socket = io('http://localhost:5000');

export default function Chat({ user }) {
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit('join', user._id);

    axios.get(`http://localhost:5000/api/auth/users/${user._id}`).then((res) => {
      setUsers(res.data);
    });

    socket.on('receiveMessage', (msg) => {
      if (
        (msg.senderId === user._id && msg.receiverId === receiver?._id) ||
        (msg.receiverId === user._id && msg.senderId === receiver?._id)
      ) {
        setChat((prev) => [...prev, msg]);
      }
    });

    socket.on('onlineUsers', (online) => {
      setOnlineUsers(online);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('onlineUsers');
    };
  }, [user, receiver]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const loadChat = async (r) => {
    setReceiver(r);
    const res = await axios.get(`http://localhost:5000/api/chat/${user._id}/${r._id}`);
    setChat(res.data);
  };

  const send = async () => {
    if (!message.trim()) return;

    const newMsg = {
      senderId: user._id,
      receiverId: receiver._id,
      text: message,
      timestamp: new Date(),
    };

    setChat((prev) => [...prev, newMsg]);
    socket.emit('sendMessage', newMsg);
    await axios.post('http://localhost:5000/api/chat/send', newMsg);
    setMessage('');
  };

  const deleteChat = async () => {
    await axios.delete(`http://localhost:5000/api/chat/all/${user._id}/${receiver._id}`);
    setChat([]);
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <Container fluid className="whatsapp-container">
      <Row className="vh-100">
        {/* Sidebar */}
        <Col md={3} className="sidebar">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="m-0">Chats</h5>
            <Button variant="outline-danger" size="sm" className="animated-icon" onClick={logout}>
              <FaSignOutAlt />
            </Button>
          </div>
          <ListGroup variant="flush" className="chat-user-list">
            {users.map((u) => (
              <ListGroup.Item
                key={u._id}
                action
                onClick={() => loadChat(u)}
                active={receiver?._id === u._id}
                className="d-flex justify-content-between align-items-center chat-user"
              >
                <div>
                  <FaUserCircle size={20} className="me-2" />
                  {u.username}
                </div>
                {onlineUsers.includes(u._id) && (
                  <Badge pill bg="success">
                    •
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Chat Panel */}
        <Col md={9} className="chat-panel">
          {receiver ? (
            <>
              {/* Chat Header */}
              <div className="chat-header d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center">
                  <FaUserCircle size={30} className="me-2" />
                  <strong>{receiver.username}</strong>
                </div>
                <Button variant="outline-danger" size="sm" className="animated-icon" onClick={deleteChat}>
                  <FaTrash />
                </Button>
              </div>

              {/* Chat Body */}
              <div className="chat-body">
                {chat.map((c, i) => {
                  const date = new Date(c.timestamp);
                  const isSender = c.senderId === user._id;
                  return (
                    <div key={i} className={`message ${isSender ? 'sent' : 'received'} fade-in`}>
                      <div className="message-text">
                        {c.text}
                        <div className="message-time">
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Footer */}
              <div className="chat-footer p-3 border-top">
                <InputGroup>
                  <Form.Control
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                  />
                  <Button onClick={send} disabled={!message.trim()} className="send-btn animated-icon">
                    <FaPaperPlane />
                  </Button>
                </InputGroup>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              Select a user to start chatting
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
