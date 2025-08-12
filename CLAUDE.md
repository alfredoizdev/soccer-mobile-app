# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `npm start` - Start Expo development server
- `npm run android` - Start with Android emulator/device
- `npm run ios` - Start with iOS simulator/device  
- `npm run web` - Start web version

### Code Quality
- `npm run lint` - Run ESLint for code linting
- `npm run reset-project` - Reset project to blank state (removes starter code)

## Architecture Overview

### Technology Stack
- **Framework**: React Native with Expo (~53.0.20)
- **Routing**: Expo Router v5 with file-based routing
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand for global state
- **Authentication**: JWT with secure token storage (Keychain + AsyncStorage)
- **Language**: TypeScript with strict mode enabled

### Project Structure

```
app/                    # Main application code (file-based routing)
├── (auth)/            # Authentication flow screens
├── (tabs)/            # Tab-based navigation screens  
├── player/            # Dynamic player detail screens
└── _layout.tsx        # Root layout with auth initialization

components/            # Reusable UI components
stores/               # Zustand state management
├── auth-store.ts     # Authentication state
├── events-store.ts   # Events state
└── organization-store.ts

services/             # API and business logic
├── api-service.ts    # Centralized API client with auth headers
├── auth-service.ts   # Authentication service (JWT + secure storage)
├── config.ts         # Environment configuration
└── organization-service.ts

src/                  # Additional source code
screens/              # Screen components  
lib/                  # Utility functions
```

### Key Architectural Patterns

**Authentication Flow**: 
- JWT tokens stored securely in device Keychain with AsyncStorage fallback
- Auth state managed globally via Zustand store with automatic initialization
- Route protection handled in root layout based on authentication status

**API Architecture**:
- Centralized API service with automatic JWT header injection
- Environment-aware configuration (development vs production)
- Typed responses with `ApiResponse<T>` and `PaginatedResponse<T>` interfaces

**Navigation Structure**:
- File-based routing with Expo Router
- Protected route groups: `(auth)` for login/register, `(tabs)` for main app
- Dynamic routes: `player/[id].tsx` for individual player pages

**State Management**:
- Zustand stores for different domains (auth, events, organization)
- Stores handle both local state and API synchronization
- Auth store manages user session persistence and automatic token refresh

### Development Configuration

**Local Development**:
- API base URL configured for local IP (10.0.0.118:3000) in development
- Metro bundler runs on port 8081
- Supports iOS/Android simulators and physical devices

**Styling System**:
- NativeWind provides Tailwind CSS classes for React Native
- Global styles in `app/global.css`
- Tailwind config includes app and components directories

### Important Implementation Details

**Token Management**: Tokens are stored using react-native-keychain for security with AsyncStorage as backup. The auth service handles automatic initialization and token validation.

**Type Safety**: Project uses strict TypeScript with path mapping (`@/*` points to root). All API responses are properly typed.

**Cross-Platform**: App is configured for iOS, Android, and web with platform-specific configurations in app.json.

**Environment Handling**: Development and production configurations are managed through feature flags and environment-specific API URLs.