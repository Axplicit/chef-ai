import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Profile.module.css';

const UserAvatar = ({ user, size = 'medium', editable = false, onClick }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const { updateUser } = useAuth();

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || '?';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.avatarSmall;
      case 'large': return styles.avatarLarge;
      case 'xlarge': return styles.avatarXLarge;
      default: return styles.avatarMedium;
    }
  };

  const handleAvatarClick = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Update user data with new avatar URL
        updateUser({ avatar: data.avatarUrl });
      } else {
        setUploadError(data.message || 'Failed to upload avatar');
      }
    } catch (error) {
      setUploadError('Failed to upload avatar');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const avatarContent = user?.avatar ? (
    <img
      src={user.avatar}
      alt={`${user.firstName} ${user.lastName}`}
      className={styles.avatarImage}
      onError={(e) => {
        // Fallback to initials if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  ) : (
    <div className={styles.avatarInitials}>
      {getInitials(user?.firstName, user?.lastName)}
    </div>
  );

  return (
    <div className={styles.avatarWrapper}>
      <div
        className={`
          ${styles.avatar} 
          ${getSizeClass()} 
          ${editable ? styles.avatarEditable : ''}
          ${isUploading ? styles.avatarUploading : ''}
        `}
        onClick={handleAvatarClick}
        role={editable ? 'button' : 'img'}
        tabIndex={editable ? 0 : -1}
        onKeyDown={(e) => {
          if (editable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleAvatarClick();
          }
        }}
        aria-label={editable ? 'Click to change avatar' : `${user?.firstName} ${user?.lastName} avatar`}
      >
        {isUploading ? (
          <div className={styles.uploadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          avatarContent
        )}
        
        {editable && !isUploading && (
          <div className={styles.avatarOverlay}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        )}
      </div>

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.hiddenFileInput}
        />
      )}

      {uploadError && (
        <div className={styles.uploadError}>
          {uploadError}
        </div>
      )}

      {user?.isOnline && size !== 'small' && (
        <div className={styles.onlineIndicator}></div>
      )}
    </div>
  );
};

export default UserAvatar;