import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import styles from '../../styles/Auth.module.css';

const RegisterPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSubtitle}>
            Join us today and get started
          </p>
        </div>

        <div className={styles.authContent}>
          <RegisterForm />
          
          <div className={styles.divider}>
            <span>or</span>
          </div>

          <SocialLoginButtons />

          <div className={styles.termsText}>
            <p>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className={styles.link}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className={styles.link}>
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className={styles.authFooter}>
            <p>
              Already have an account?{' '}
              <Link to="/login" className={styles.primaryLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.authBackground}>
        <div className={styles.backgroundPattern}></div>
      </div>
    </div>
  );
};

export default RegisterPage;