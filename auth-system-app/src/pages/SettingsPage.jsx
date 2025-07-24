import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import AuthGuard from '../../components/auth/AuthGuard';
import styles from '../../styles/Settings.module.css';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { 
    preferences, 
    settings, 
    updatePreferences, 
    updateSettings, 
    changePassword,
    deleteAccount,
    enableTwoFactor,
    disableTwoFactor,
    loading,
    error 
  } = useUser();

  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePreferenceChange = async (key, value) => {
    const result = await updatePreferences({ [key]: value });
    if (result.success) {
      showMessage('Preferences updated');
    } else {
      showMessage(result.error, true);
    }
  };

  const handleSettingChange = async (key, value) => {
    const result = await updateSettings({ [key]: value });
    if (result.success) {
      showMessage('Settings updated');
    } else {
      showMessage(result.error, true);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('Passwords do not match', true);
      return;
    }

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    if (result.success) {
      showMessage('Password changed successfully');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      showMessage(result.error, true);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount(deletePassword);
    if (result.success) {
      logout();
    } else {
      showMessage(result.error, true);
    }
  };

  const handleToggle2FA = async () => {
    if (settings.twoFactorEnabled) {
      // Show disable form or prompt for verification code
      const code = prompt('Enter your 2FA code to disable:');
      if (code) {
        const result = await disableTwoFactor(code);
        if (result.success) {
          showMessage('Two-factor authentication disabled');
        } else {
          showMessage(result.error, true);
        }
      }
    } else {
      const result = await enableTwoFactor();
      if (result.success) {
        // Show QR code for setup
        alert('2FA enabled! Please save your backup codes.');
      } else {
        showMessage(result.error, true);
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'account', label: 'Account' }
  ];

  return (
    <AuthGuard>
      <div className={styles.settingsContainer}>
        <div className={styles.settingsHeader}>
          <h1>Settings</h1>
          <p>Manage your account preferences and security settings</p>
        </div>

        {message && (
          <div className={`${styles.message} ${message.isError ? styles.error : styles.success}`}>
            {message.text}
          </div>
        )}

        <div className={styles.settingsContent}>
          <div className={styles.settingsTabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.settingsPanel}>
            {activeTab === 'general' && (
              <div className={styles.section}>
                <h2>General Settings</h2>
                
                <div className={styles.setting}>
                  <label>Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className={styles.setting}>
                  <label>Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className={styles.section}>
                <h2>Privacy Settings</h2>
                
                <div className={styles.setting}>
                  <label>Profile Visibility</label>
                  <select
                    value={preferences.privacy?.profileVisibility}
                    onChange={(e) => handlePreferenceChange('privacy', {
                      ...preferences.privacy,
                      profileVisibility: e.target.value
                    })}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className={styles.toggleSetting}>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.privacy?.showEmail}
                      onChange={(e) => handlePreferenceChange('privacy', {
                        ...preferences.privacy,
                        showEmail: e.target.checked
                      })}
                    />
                    Show email in profile
                  </label>
                </div>

                <div className={styles.toggleSetting}>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.privacy?.showPhone}
                      onChange={(e) => handlePreferenceChange('privacy', {
                        ...preferences.privacy,
                        showPhone: e.target.checked
                      })}
                    />
                    Show phone number in profile
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <h2>Notification Settings</h2>
                
                <div className={styles.toggleSetting}>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.notifications?.email}
                      onChange={(e) => handlePreferenceChange('notifications', {
                        ...preferences.notifications,
                        email: e.target.checked
                      })}
                    />
                    Email notifications
                  </label>
                </div>

                <div className={styles.toggleSetting}>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.notifications?.push}
                      onChange={(e) => handlePreferenceChange('notifications', {
                        ...preferences.notifications,
                        push: e.target.checked
                      })}
                    />
                    Push notifications
                  </label>
                </div>

                <div className={styles.toggleSetting}>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.notifications?.sms}
                      onChange={(e) => handlePreferenceChange('notifications', {
                        ...preferences.notifications,
                        sms: e.target.checked
                      })}
                    />
                    SMS notifications
                  </label>
                </div>

                <div className={styles.toggleSetting}>
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.loginNotifications}
                      onChange={(e) => handleSettingChange('loginNotifications', e.target.checked)}
                    />
                    Login notifications
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className={styles.section}>
                <h2>Security Settings</h2>
                
                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <h3>Password</h3>
                    <p>Last changed: Never</p>
                  </div>
                  <button
                    className={styles.button}
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    Change Password
                  </button>
                </div>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value
                      })}
                      required
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value
                      })}
                      required
                    />
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.button} disabled={loading}>
                        Update Password
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setShowPasswordForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <h3>Two-Factor Authentication</h3>
                    <p>
                      {settings.twoFactorEnabled 
                        ? 'Extra security is enabled' 
                        : 'Add an extra layer of security'
                      }
                    </p>
                  </div>
                  <button
                    className={`${styles.button} ${
                      settings.twoFactorEnabled ? styles.dangerButton : ''
                    }`}
                    onClick={handleToggle2FA}
                    disabled={loading}
                  >
                    {settings.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className={styles.section}>
                <h2>Account Management</h2>
                
                <div className={styles.accountInfo}>
                  <h3>Account Information</h3>
                  <p>Email: {user?.email}</p>
                  <p>Account created: {new Date(user?.createdAt).toLocaleDateString()}</p>
                  <p>Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
                </div>

                <div className={styles.dangerZone}>
                  <h3>Danger Zone</h3>
                  <p>Once you delete your account, there is no going back.</p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      className={styles.dangerButton}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className={styles.deleteConfirm}>
                      <p>Enter your password to confirm account deletion:</p>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                      />
                      <div className={styles.formActions}>
                        <button
                          className={styles.dangerButton}
                          onClick={handleDeleteAccount}
                          disabled={!deletePassword || loading}
                        >
                          Confirm Delete
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default SettingsPage;