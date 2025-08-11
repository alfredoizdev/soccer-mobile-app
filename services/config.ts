import { Platform } from 'react-native'

/**
 * Get the appropriate API base URL for Expo development
 */
export const getApiBaseUrl = (): string => {
  if (__DEV__) {
    // Development environment
    const LOCAL_IP = '10.0.0.118' // Your machine's local IP
    const PORT = 3000

    if (Platform.OS === 'android') {
      return `http://${LOCAL_IP}:${PORT}/api` // Android emulator and physical devices
    } else {
      return `http://${LOCAL_IP}:${PORT}/api` // iOS simulator and physical devices
    }
  } else {
    // Production environment
    return 'https://your-domain.com/api'
  }
}

/**
 * API configuration constants
 */
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: __DEV__ ? 15000 : 10000, // Longer timeout for development
  RETRY_ATTEMPTS: __DEV__ ? 2 : 3,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const

/**
 * Storage keys for authentication
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  USER_PREFERENCES: 'user_preferences',
} as const

/**
 * Feature flags for environment-specific features
 */
export const FEATURE_FLAGS = {
  ENABLE_DEBUG_LOGGING: __DEV__,
  ENABLE_ANALYTICS: !__DEV__,
  ENABLE_ERROR_REPORTING: !__DEV__,
} as const
