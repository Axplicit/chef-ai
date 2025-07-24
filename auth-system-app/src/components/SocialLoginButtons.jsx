import React, { useState } from 'react';
import styles from '../../styles/Auth.module.css';

const SocialLoginButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    
    try {
      // Redirect to social auth endpoint
      window.location.href = `/api/auth/${provider}`;
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setLoadingProvider(null);
    }
  };

  const socialProviders = [
    {
      name: 'google',
      label: 'Continue with Google',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: '#4285F4'
    },
    {
      name: 'facebook',
      label: 'Continue with Facebook',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#1877F2'
    },
    {
      name: 'github',
      label: 'Continue with GitHub',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      color: '#333'
    },
    {
      name: 'apple',
      label: 'Continue with Apple',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.017 1.985c-.905 0-1.813.367-2.425 1.086-.548.644-.969 1.535-.805 2.426.905.07 1.883-.453 2.478-1.086.548-.644.899-1.535.752-2.426zm3.644 3.162c-1.357 0-2.595.817-3.267.817-.695 0-1.742-.747-2.872-.722-1.48.024-2.849.86-3.597 2.192-1.548 2.69-.395 6.669 1.097 8.85.741 1.062 1.599 2.263 2.753 2.215 1.106-.048 1.527-.722 2.872-.722 1.345 0 1.718.722 2.872.698 1.202-.024 1.94-1.058 2.658-2.144.834-1.25 1.154-2.475 1.178-2.547-.024-.024-2.263-.864-2.287-3.435-.024-2.144 1.742-3.172 1.813-3.22-.993-1.463-2.549-1.63-3.096-1.654-.548-.024-1.081-.048-1.621-.048z"/>
        </svg>
      ),
      color: '#000'
    }
  ];

  return (
    <div className={styles.socialButtons}>
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          className={styles.socialButton}
          onClick={() => handleSocialLogin(provider.name)}
          disabled={loadingProvider !== null}
          style={{ '--provider-color': provider.color }}
        >
          {loadingProvider === provider.name ? (
            <div className={styles.socialButtonLoading}>
              <div className={styles.spinner}></div>
              Connecting...
            </div>
          ) : (
            <>
              <span className={styles.socialIcon}>
                {provider.icon}
              </span>
              {provider.label}
            </>
          )}
        </button>
      ))}
      
      <div className={styles.socialDisclaimer}>
        <p>
          By continuing, you agree to our Terms of Service and acknowledge 
          our Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SocialLoginButtons;