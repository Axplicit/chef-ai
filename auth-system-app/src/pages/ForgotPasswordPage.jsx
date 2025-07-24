import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PasswordResetForm from '../../components/auth/PasswordResetForm';
import styles from '../../styles/Auth.module.css';

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();

  const handlePasswordReset = async (emailAddress) => {
    const result = await resetPassword(emailAddress);
    if (result.success) {
      setEmail(emailAddress);
      setEmailSent(true);
    }
    return result;
  };

  if (emailSent) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12l2 2 4-4"/>
              </svg>
            </div>
            <h1 className={styles.authTitle}>Check Your Email</h1>
            <p className={styles.authSubtitle}>
              We've sent a password reset link to{' '}
              <strong>{email}</strong>
            </p>
          </div>

          <div className={styles.authContent}>
            <div className={styles.emailInstructions}>
              <p>
                Please check your email and click the link to reset your password.
                If you don't see the email, check your spam folder.
              </p>
            </div>

            <div className={styles.resendSection}>
              <p>Didn't receive the email?</p>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => setEmailSent(false)}
              >
                Try again
              </button>
            </div>

            <div className={styles.authFooter}>
              <Link to="/login" className={styles.primaryLink}>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.authBackground}>
          <div className={styles.backgroundPattern}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Reset Password</h1>
          <p className={styles.authSubtitle}>
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className={styles.authContent}>
          <PasswordResetForm onSubmit={handlePasswordReset} />

          <div className={styles.authFooter}>
            <Link to="/login" className={styles.primaryLink}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.authBackground}>
        <div className={styles.backgroundPattern}></div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;