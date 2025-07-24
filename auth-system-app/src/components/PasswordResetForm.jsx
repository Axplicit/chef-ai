import React, { useState } from 'react';
import styles from '../../styles/Auth.module.css';

const PasswordResetForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await onSubmit(email.trim());
      
      if (!result.success) {
        setError(result.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className={styles.input}
          placeholder="Enter your email address"
          required
          autoComplete="email"
          disabled={isSubmitting}
        />
        <div className={styles.inputHelp}>
          We'll send you a link to reset your password
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!email.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <div className={styles.buttonLoading}>
            <div className={styles.spinner}></div>
            Sending...
          </div>
        ) : (
          'Send Reset Link'
        )}
      </button>
    </form>
  );
};

export default PasswordResetForm;