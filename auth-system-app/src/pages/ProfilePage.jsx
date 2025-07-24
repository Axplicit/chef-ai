import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileEditor from '../../components/auth/ProfileEditor';
import UserAvatar from '../../components/auth/UserAvatar';
import AuthGuard from '../../components/auth/AuthGuard';
import styles from '../../styles/Profile.module.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileUpdate = async (updatedData) => {
    setSaving(true);
    setMessage('');

    const result = await updateUser(updatedData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setMessage(result.error || 'Failed to update profile');
    }
    
    setSaving(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <AuthGuard>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.headerContent}>
            <UserAvatar 
              user={user} 
              size="large"
              editable={isEditing}
            />
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {user?.firstName} {user?.lastName}
              </h1>
              <p className={styles.userEmail}>{user?.email}</p>
              <p className={styles.joinDate}>
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            {!isEditing ? (
              <button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className={styles.editActions}>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setIsEditing(false);
                    setMessage('');
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`${styles.message} ${
            message.includes('success') ? styles.success : styles.error
          }`}>
            {message}
          </div>
        )}

        <div className={styles.profileContent}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h2>Personal Information</h2>
            </div>
            
            <div className={styles.cardContent}>
              {isEditing ? (
                <ProfileEditor
                  user={user}
                  onSave={handleProfileUpdate}
                  saving={saving}
                />
              ) : (
                <div className={styles.profileDetails}>
                  <div className={styles.detailGroup}>
                    <label>First Name</label>
                    <p>{user?.firstName || 'Not provided'}</p>
                  </div>
                  
                  <div className={styles.detailGroup}>
                    <label>Last Name</label>
                    <p>{user?.lastName || 'Not provided'}</p>
                  </div>
                  
                  <div className={styles.detailGroup}>
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>
                  
                  <div className={styles.detailGroup}>
                    <label>Phone</label>
                    <p>{user?.phone || 'Not provided'}</p>
                  </div>
                  
                  <div className={styles.detailGroup}>
                    <label>Bio</label>
                    <p>{user?.bio || 'No bio added yet'}</p>
                  </div>
                  
                  <div className={styles.detailGroup}>
                    <label>Location</label>
                    <p>{user?.location || 'Not provided'}</p>
                  </div>
                  
                  <div className={styles.detailGroup}>
                    <label>Website</label>
                    <p>
                      {user?.website ? (
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.websiteLink}
                        >
                          {user.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.profileStats}>
            <div className={styles.statCard}>
              <h3>Account Status</h3>
              <div className={styles.statusBadge}>
                <span className={`${styles.badge} ${
                  user?.emailVerified ? styles.verified : styles.pending
                }`}>
                  {user?.emailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <h3>Security</h3>
              <div className={styles.securityInfo}>
                <p>Two-factor authentication: {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                <p>Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;