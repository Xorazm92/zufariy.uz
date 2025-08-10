import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, ListGroup, Badge, Alert, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiRefreshCw, FiMessageCircle, FiUser, FiMail, FiClock, FiCheck } from 'react-icons/fi';
import { FaRobot, FaTelegramPlane } from 'react-icons/fa';
import axios from 'axios';
import './admin.css';

const Admin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/messages`);
      if (response.data.success) {
        setMessages(response.data.messages.reverse()); // Latest first
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setAlert({ type: 'danger', text: 'Xabarlarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (messageId) => {
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/api/reply`, {
        messageId,
        replyText: replyText.trim()
      });

      if (response.data.success) {
        setAlert({ type: 'success', text: 'Javob muvaffaqiyatli yuborildi!' });
        setReplyText('');
        setSelectedMessage(null);
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      setAlert({ type: 'danger', text: 'Javob yuborishda xatolik' });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('uz-UZ');
  };

  return (
    <div className="admin-page">
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="d-flex align-items-center">
                <FaRobot className="me-2 text-primary" />
                Admin Chat Panel
              </h1>
              <p className="text-muted">Telegram bot orqali kelgan xabarlarni boshqaring</p>
            </div>
            <Button 
              variant="outline-primary" 
              onClick={fetchMessages}
              disabled={loading}
              className="d-flex align-items-center"
            >
              <FiRefreshCw className={`me-1 ${loading ? 'spin' : ''}`} />
              Yangilash
            </Button>
          </div>

          {alert && (
            <Alert variant={alert.type} className="d-flex align-items-center">
              <FiCheck className="me-2" />
              {alert.text}
            </Alert>
          )}
        </motion.div>

        <div className="row">
          {/* Messages List */}
          <div className="col-lg-8">
            <Card className="glass-card h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                  <FiMessageCircle className="me-2" />
                  Xabarlar ({messages.length})
                </h5>
                <Badge bg="primary">{messages.filter(m => !m.replied).length} javobsiz</Badge>
              </Card.Header>
              <Card.Body className="p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yuklanmoqda...</span>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center p-4 text-muted">
                    <FiMessageCircle size={48} className="mb-3 opacity-50" />
                    <p>Hozircha xabarlar yo'q</p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListGroup.Item 
                            className={`message-item ${selectedMessage?.id === message.id ? 'selected' : ''} ${!message.replied ? 'unreplied' : ''}`}
                            onClick={() => setSelectedMessage(message)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-2">
                                  <FiUser className="me-2 text-primary" />
                                  <strong>{message.name}</strong>
                                  <Badge bg={message.replied ? 'success' : 'warning'} className="ms-2">
                                    #{message.id}
                                  </Badge>
                                </div>
                                <div className="d-flex align-items-center mb-2 text-muted small">
                                  <FiMail className="me-1" />
                                  {message.email}
                                  <FiClock className="ms-3 me-1" />
                                  {formatTime(message.timestamp)}
                                </div>
                                <p className="mb-2">{message.message}</p>
                                {message.replied && (
                                  <div className="reply-preview">
                                    <small className="text-success">
                                      <FiCheck className="me-1" />
                                      Javob berilgan: {message.replyText}
                                    </small>
                                  </div>
                                )}
                              </div>
                              <div className="message-status">
                                {message.replied ? (
                                  <Badge bg="success">Javob berilgan</Badge>
                                ) : (
                                  <Badge bg="warning">Javob kutilmoqda</Badge>
                                )}
                              </div>
                            </div>
                          </ListGroup.Item>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ListGroup>
                )}
                <div ref={messagesEndRef} />
              </Card.Body>
            </Card>
          </div>

          {/* Reply Panel */}
          <div className="col-lg-4">
            <Card className="glass-card">
              <Card.Header>
                <h5 className="mb-0 d-flex align-items-center">
                  <FaTelegramPlane className="me-2" />
                  Javob berish
                </h5>
              </Card.Header>
              <Card.Body>
                {selectedMessage ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="selected-message mb-3 p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <strong>{selectedMessage.name}</strong>
                        <Badge bg="primary" className="ms-2">#{selectedMessage.id}</Badge>
                      </div>
                      <small className="text-muted d-block mb-2">{selectedMessage.email}</small>
                      <p className="mb-0 small">{selectedMessage.message}</p>
                    </div>

                    {selectedMessage.replied ? (
                      <Alert variant="success">
                        <FiCheck className="me-2" />
                        Bu xabarga allaqachon javob berilgan
                      </Alert>
                    ) : (
                      <Form onSubmit={(e) => { e.preventDefault(); sendReply(selectedMessage.id); }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Javob matni</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Javobingizni yozing..."
                            required
                          />
                        </Form.Group>
                        <div className="d-grid">
                          <Button 
                            type="submit" 
                            variant="primary"
                            disabled={sending || !replyText.trim()}
                          >
                            <FiSend className="me-2" />
                            {sending ? 'Yuborilmoqda...' : 'Javob yuborish'}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center text-muted">
                    <FiMessageCircle size={48} className="mb-3 opacity-50" />
                    <p>Javob berish uchun xabarni tanlang</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Bot Info */}
            <Card className="glass-card mt-3">
              <Card.Body>
                <h6 className="d-flex align-items-center mb-3">
                  <FaRobot className="me-2" />
                  Bot Ma'lumotlari
                </h6>
                <div className="small text-muted">
                  <p><strong>Bot Username:</strong> @ZufarPortfolioBot</p>
                  <p><strong>API Endpoint:</strong> {API_URL}</p>
                  <p><strong>Auto Refresh:</strong> 30 soniya</p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Admin;
