import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Auth.module.css';

const AuthGuard = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authentication is not required but user is authenticated (like login/register pages)
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Render children if authentication requirements are met
  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withAuthGuard = (Component, options = {}) => {
  return (props) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
};

// Component for role-based access control
export const RoleGuard = ({ children, allowedRoles = [], user, fallback = null }) => {
  if (!user) {
    return fallback || <div>Access denied</div>;
  }

  const userRoles = user.roles || [];
  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    return fallback || (
      <div className={styles.accessDenied}>
        <h2>Access Denied</h2>
        <p>You don't have permission to view this content.</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Component for feature flag protection
export const FeatureGuard = ({ children, feature, user, fallback = null }) => {
  if (!user || !user.features || !user.features[feature]) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;