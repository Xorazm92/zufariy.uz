import React, { useState } from 'react';
import { Container, Form, Button, FloatingLabel, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMail, FiCopy, FiCheck, FiSend, FiMessageCircle } from 'react-icons/fi';
import { FaTelegramPlane, FaRobot } from 'react-icons/fa';
import axios from 'axios';
import Links from '../components/links';
import './contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTg, setCopiedTg] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', text: '' });
  const [botResponse, setBotResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setBotResponse(null);

    try {
      // Validate form
      if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
        throw new Error('Barcha maydonlar to\'ldirilishi shart');
      }

      // Send to Telegram Bot API
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/contact`, {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim()
      });

      if (response.data.success) {
        setToast({
          show: true,
          type: 'success',
          text: 'Xabar muvaffaqiyatli yuborildi! Tez orada javob beramiz.'
        });
        setBotResponse({
          messageId: response.data.messageId,
          text: 'Xabaringiz Telegram botga yuborildi va admin ko\'rib chiqadi.'
        });
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error(response.data.error || 'Xabar yuborishda xatolik');
      }

    } catch (error) {
      console.error('Contact form error:', error);

      // Fallback to Formspree if bot fails
      const FORMSPREE_ID = process.env.REACT_APP_FORMSPREE_ID;
      if (FORMSPREE_ID) {
        try {
          const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: form.name, email: form.email, message: form.message })
          });

          if (res.ok) {
            setToast({ show: true, type: 'success', text: 'Xabar yuborildi (email orqali)' });
            setForm({ name: '', email: '', message: '' });
          } else {
            throw new Error('Formspree failed');
          }
        } catch (formspreeError) {
          setToast({
            show: true,
            type: 'error',
            text: 'Xabar yuborishda xatolik. Iltimos, to\'g\'ridan-to\'g\'ri email yoki Telegram orqali murojaat qiling.'
          });
        }
      } else {
        setToast({
          show: true,
          type: 'error',
          text: error.response?.data?.error || error.message || 'Xabar yuborishda xatolik yuz berdi'
        });
      }
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setToast((s) => ({ ...s, show: false }));
        setBotResponse(null);
      }, 5000);
    }
  };

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div id="contact" className="page-section">
      <Container className="py-5">
        {toast.show && (
          <div className={`toast-lite ${toast.type}`}>
            {toast.text}
          </div>
        )}

        {botResponse && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert variant="info" className="d-flex align-items-center">
              <FaRobot className="me-2" size={20} />
              <div>
                <strong>Bot Javob #{botResponse.messageId}</strong>
                <div className="small">{botResponse.text}</div>
              </div>
            </Alert>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4"
        >
          <h1 className="section-title contact-title">{t('contact.title')}</h1>
          <p className="text-muted">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="glass-card contact-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h5 className="mb-3">{t('contact.prefer')}</h5>
            <div className="quick-actions">
              <div className="quick-action glass-card">
                <div className="left">
                  <FiMail size={20} />
                  <div>
                    <div className="fw-semibold">Email</div>
                    <div className="label">zufar.bobojonov.dev@gmail.com</div>
                  </div>
                </div>
                <div className="right">
                  <Button size="sm" variant="outline-primary" href="mailto:zufar.bobojonov.dev@gmail.com">
                    <FiSend className="me-1" /> {t('contact.form.send')}
                  </Button>
                  <Button
                    size="sm"
                    variant={copiedEmail ? 'success' : 'outline-secondary'}
                    onClick={async () => {
                      await navigator.clipboard.writeText('zufar.bobojonov.dev@gmail.com');
                      setCopiedEmail(true);
                      setTimeout(() => setCopiedEmail(false), 1500);
                    }}
                  >
                    {copiedEmail ? <FiCheck /> : <FiCopy />}
                  </Button>
                </div>
              </div>

              <div className="quick-action glass-card">
                <div className="left">
                  <FaTelegramPlane size={20} />
                  <div>
                    <div className="fw-semibold">Telegram</div>
                    <div className="label">@Zufar_Xorazmiy</div>
                  </div>
                </div>
                <div className="right">
                  <Button size="sm" variant="outline-primary" href="https://t.me/Zufar_Xorazmiy" target="_blank" rel="noreferrer">
                    <FiSend className="me-1" /> {t('contact.form.send')}
                  </Button>
                  <Button
                    size="sm"
                    variant={copiedTg ? 'success' : 'outline-secondary'}
                    onClick={async () => {
                      await navigator.clipboard.writeText('@Zufar_Xorazmiy');
                      setCopiedTg(true);
                      setTimeout(() => setCopiedTg(false), 1500);
                    }}
                  >
                    {copiedTg ? <FiCheck /> : <FiCopy />}
                  </Button>
                </div>
              </div>

              <div className="quick-action glass-card">
                <div className="left">
                  <FaRobot size={20} />
                  <div>
                    <div className="fw-semibold">Telegram Bot</div>
                    <div className="label">Avtomatik javob</div>
                  </div>
                </div>
                <div className="right">
                  <Button size="sm" variant="outline-info" href="https://t.me/ZufarPortfolioBot" target="_blank" rel="noreferrer">
                    <FiMessageCircle className="me-1" /> Bot
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <Links />
            </div>
          </motion.div>

          <motion.div
            className="glass-card contact-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <h5 className="mb-3">{t('contact.form.title')}</h5>
            <div className="mb-3">
              <Alert variant="info" className="d-flex align-items-start">
                <FaRobot className="me-2 mt-1" size={16} />
                <div className="small">
                  <strong>Telegram Bot orqali:</strong> Xabaringiz to'g'ridan-to'g'ri mening Telegram botimga yuboriladi va men tezda javob beraman.
                </div>
              </Alert>
            </div>
            <Form onSubmit={handleSubmit} noValidate>
              <FloatingLabel controlId="contactName" label={t('contact.form.name')} className="mb-3">
                <Form.Control name="name" value={form.name} onChange={onChange} type="text" placeholder={t('contact.form.name')} required />
                <Form.Control.Feedback type="invalid">{t('contact.form.name')} required</Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel controlId="contactEmail" label={t('contact.form.email')} className="mb-3">
                <Form.Control name="email" value={form.email} onChange={onChange} type="email" placeholder="name@example.com" required />
                <Form.Control.Feedback type="invalid">{t('contact.form.email')} required</Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel controlId="contactMsg" label={t('contact.form.message')} className="mb-3">
                <Form.Control as="textarea" name="message" value={form.message} onChange={onChange} placeholder={t('contact.form.message')} style={{ height: 140 }} required />
                <Form.Control.Feedback type="invalid">{t('contact.form.message')} required</Form.Control.Feedback>
              </FloatingLabel>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit" disabled={submitting}>
                  <FiSend className="me-1" /> {submitting ? t('contact.form.sending') || 'Sending...' : t('contact.form.send')}
                </Button>
                <Button variant="outline-secondary" type="reset">Reset</Button>
              </div>
            </Form>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
