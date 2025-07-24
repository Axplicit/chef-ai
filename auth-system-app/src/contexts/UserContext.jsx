import React, { createContext, useContext, useReducer } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

const initialState = {
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    }
  },
  settings: {
    twoFactorEnabled: false,
    loginNotifications: true,
    accountDeactivated: false
  },
  loading: false,
  error: null
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
        loading: false,
        error: null
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'RESET_USER_DATA':
      return initialState;
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { token, user } = useAuth();

  const updatePreferences = async (newPreferences) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPreferences)
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: data.preferences });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, error: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update preferences' });
      return { success: false, error: 'Failed to update preferences' };
    }
  };

  const updateSettings = async (newSettings) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: data.settings });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, error: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update settings' });
      return { success: false, error: 'Failed to update settings' };
    }
  };

  const changePassword = async (passwordData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();
      dispatch({ type: 'SET_LOADING', payload: false });

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, error: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to change password' });
      return { success: false, error: 'Failed to change password' };
    }
  };

  const deleteAccount = async (password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'RESET_USER_DATA' });
        return { success: true, message: data.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, error: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete account' });
      return { success: false, error: 'Failed to delete account' };
    }
  };

  const enableTwoFactor = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/user/enable-2fa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ 
          type: 'UPDATE_SETTINGS', 
          payload: { twoFactorEnabled: true } 
        });
        return { success: true, qrCode: data.qrCode, secret: data.secret };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, error: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to enable 2FA' });
      return { success: false, error: 'Failed to enable 2FA' };
    }
  };

  const disableTwoFactor = async (code) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/user/disable-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ 
          type: 'UPDATE_SETTINGS', 
          payload: { twoFactorEnabled: false } 
        });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, error: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to disable 2FA' });
      return { success: false, error: 'Failed to disable 2FA' };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    updatePreferences,
    updateSettings,
    changePassword,
    deleteAccount,
    enableTwoFactor,
    disableTwoFactor,
    clearError
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};