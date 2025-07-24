import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Auth.module.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { register, error, clearError } = useAuth();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/(?=.*[a-z])/.test(password)) errors.push('One lowercase letter');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('One uppercase letter');
    if (!/(?=.*\d)/.test(password)) errors.push('One number');
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push('One special character');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation errors for the field being edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const result = await register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password
    });

    setIsSubmitting(false);
    
    // Form will redirect on success via AuthContext
  };

  const isFormValid = 
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.acceptTerms &&
    formData.password === formData.confirmPassword &&
    validatePassword(formData.password).length === 0;

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.nameFields}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.firstName ? styles.inputError : ''}`}
            placeholder="Enter your first name"
            required
            autoComplete="given-name"
            disabled={isSubmitting}
          />
          {validationErrors.firstName && (
            <div className={styles.fieldError}>{validationErrors.firstName}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.lastName ? styles.inputError : ''}`}
            placeholder="Enter your last name"
            required
            autoComplete="family-name"
            disabled={isSubmitting}
          />
          {validationErrors.lastName && (
            <div className={styles.fieldError}>{validationErrors.lastName}</div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
          placeholder="Enter your email"
          required
          autoComplete="email"
          disabled={isSubmitting}
        />
        {validationErrors.email && (
          <div className={styles.fieldError}>{validationErrors.email}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.passwordInput}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.password ? styles.inputError : ''}`}
            placeholder="Create a password"
            required
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        {validationErrors.password && (
          <div className={styles.fieldError}>
            Password must include:
            <ul className={styles.passwordRequirements}>
              {validationErrors.password.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
        {formData.password && !validationErrors.password && (
          <div className={styles.passwordStrength}>
            <div className={styles.strengthMeter}>
              <div 
                className={`${styles.strengthBar} ${
                  validatePassword(formData.password).length === 0 ? styles.strong : 
                  validatePassword(formData.password).length <= 2 ? styles.medium : styles.weak
                }`}
              ></div>
            </div>
            <span className={styles.strengthText}>
              {validatePassword(formData.password).length === 0 ? 'Strong' : 
               validatePassword(formData.password).length <= 2 ? 'Medium' : 'Weak'}
            </span>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <div className={styles.passwordInput}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.confirmPassword ? styles.inputError : ''}`}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <div className={styles.fieldError}>{validationErrors.confirmPassword}</div>
        )}
      </div>

      <div className={styles.formOptions}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          <span className={styles.checkmark}></span>
          I agree to the Terms of Service and Privacy Policy
        </label>
        {validationErrors.acceptTerms && (
          <div className={styles.fieldError}>{validationErrors.acceptTerms}</div>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <div className={styles.buttonLoading}>
            <div className={styles.spinner}></div>
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;