import React, { useState, useEffect } from 'react';
import styles from '../../styles/Profile.module.css';

const ProfileEditor = ({ user, onSave, saving }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.profileForm}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
            disabled={saving}
            required
          />
          {errors.firstName && (
            <div className={styles.errorText}>{errors.firstName}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
            disabled={saving}
            required
          />
          {errors.lastName && (
            <div className={styles.errorText}>{errors.lastName}</div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          disabled={saving}
          required
        />
        {errors.email && (
          <div className={styles.errorText}>{errors.email}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.label}>
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
          placeholder="+1 (555) 123-4567"
          disabled={saving}
        />
        {errors.phone && (
          <div className={styles.errorText}>{errors.phone}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="bio" className={styles.label}>
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.bio ? styles.inputError : ''}`}
          placeholder="Tell us a little about yourself..."
          rows={4}
          maxLength={500}
          disabled={saving}
        />
        <div className={styles.charCount}>
          {formData.bio.length}/500 characters
        </div>
        {errors.bio && (
          <div className={styles.errorText}>{errors.bio}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location" className={styles.label}>
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={styles.input}
          placeholder="City, Country"
          disabled={saving}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="website" className={styles.label}>
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`${styles.input} ${errors.website ? styles.inputError : ''}`}
          placeholder="https://www.example.com"
          disabled={saving}
        />
        {errors.website && (
          <div className={styles.errorText}>{errors.website}</div>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className={styles.spinner}></div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditor;