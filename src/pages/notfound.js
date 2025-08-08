import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Container className="py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="lead mb-4">{t('notfound.title')}</p>
      <Button as={Link} to="/" variant="primary">{t('notfound.back')}</Button>
    </Container>
  );
};

export default NotFound;
