# Authentication System Guide

Este sistema de autenticación para React Native maneja tokens JWT de forma segura usando `react-native-keychain` y `@react-native-async-storage/async-storage`.

## Características

- ✅ **Almacenamiento seguro**: Tokens guardados en el Keychain del dispositivo
- ✅ **Persistencia**: Los datos de usuario se mantienen entre sesiones
- ✅ **Validación de tokens**: Verificación automática de expiración
- ✅ **Manejo de errores**: Gestión centralizada de errores de autenticación
- ✅ **Zustand**: Estado global con Zustand para mejor rendimiento
- ✅ **TypeScript**: Tipado completo para mejor desarrollo

## Estructura de Archivos

```
app/
├── services/
│   ├── auth-service.ts      # Servicio principal de autenticación
│   └── api-service.ts       # Servicio API con headers automáticos
├── stores/
│   └── auth-store.ts        # Store Zustand para estado de auth
├── components/
│   └── auth/
│       ├── login-form.tsx   # Formulario de login
│       └── register-form.tsx # Formulario de registro
├── screens/
│   ├── auth-screen.tsx      # Pantalla principal de auth
│   └── users-screen.tsx     # Ejemplo de pantalla autenticada
└── index.tsx                # App principal
```

## Cómo Funciona

### 1. Almacenamiento de Tokens

Los tokens JWT se almacenan de forma segura usando:

- **Keychain**: Almacenamiento principal (más seguro)
- **AsyncStorage**: Backup en caso de fallo del Keychain

```typescript
// En auth-service.ts
private async storeToken(token: string): Promise<void> {
  try {
    // Store in Keychain (more secure)
    await Keychain.setGenericPassword('auth_token', token)

    // Also store in AsyncStorage as backup
    await AsyncStorage.setItem(TOKEN_KEY, token)
  } catch (error) {
    // Fallback to AsyncStorage only
    await AsyncStorage.setItem(TOKEN_KEY, token)
  }
}
```

### 2. Estado Global con Zustand

El estado de autenticación se maneja con Zustand:

```typescript
// En auth-store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    // Lógica de login
  },
  register: async (credentials) => {
    // Lógica de registro
  },
  logout: async () => {
    // Lógica de logout
  },
}))
```

### 3. Headers Automáticos

El servicio API incluye automáticamente los headers de autenticación:

```typescript
// En api-service.ts
async request<T = any>(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authService.getAuthHeaders(), // Incluye Authorization: Bearer <token>
    ...options.headers,
  }
  // ... resto de la lógica
}
```

## Uso

### 1. Inicialización

El sistema se inicializa automáticamente al cargar la app:

```typescript
// En auth-screen.tsx
useEffect(() => {
  initialize() // Carga tokens guardados
}, [initialize])
```

### 2. Login

```typescript
import { useAuthStore } from './stores/auth-store'

function LoginComponent() {
  const { login, isLoading, error } = useAuthStore()

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123',
      })
      // Usuario autenticado automáticamente
    } catch (error) {
      // Error manejado por el store
    }
  }
}
```

### 3. Registro

```typescript
const { register, isLoading, error } = useAuthStore()

const handleRegister = async () => {
  try {
    await register({
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    })
    // Usuario registrado y autenticado automáticamente
  } catch (error) {
    // Error manejado por el store
  }
}
```

### 4. Logout

```typescript
const { logout } = useAuthStore()

const handleLogout = async () => {
  try {
    await logout()
    // Token eliminado y usuario desautenticado
  } catch (error) {
    // Error manejado por el store
  }
}
```

### 5. Verificar Autenticación

```typescript
const { isAuthenticated, user } = useAuthStore()

if (isAuthenticated) {
  console.log('Usuario autenticado:', user?.name)
} else {
  console.log('Usuario no autenticado')
}
```

### 6. Llamadas API Autenticadas

```typescript
import { api } from './services/api-service'

// Los headers se incluyen automáticamente
const response = await api.getUsers({ page: 1, limit: 20 })
const user = await api.getUser('user-id')
const players = await api.getPlayers({ organizationId: 'team-id' })
```

## Configuración

### 1. URL de la API

Actualiza la URL base en los servicios:

```typescript
// En auth-service.ts y api-service.ts
const API_BASE_URL = 'https://your-domain.com/api'
```

### 2. Endpoints de Autenticación

Los endpoints deben coincidir con tu API:

```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Register
POST /api/auth/register
{
  "name": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Respuesta Esperada

La API debe devolver:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "avatar": "https://...",
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## Seguridad

### 1. Almacenamiento Seguro

- Los tokens se guardan en el Keychain del dispositivo
- Fallback a AsyncStorage si el Keychain falla
- Limpieza automática al hacer logout

### 2. Validación de Tokens

```typescript
// Verificación automática de expiración
isTokenValid(): boolean {
  if (!this.token) return false

  try {
    const payload = JSON.parse(atob(this.token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp > currentTime
  } catch (error) {
    return false
  }
}
```

### 3. Headers Automáticos

Todos los requests incluyen automáticamente:

```
Authorization: Bearer <token>
Content-Type: application/json
```

## Manejo de Errores

### 1. Errores de Red

```typescript
try {
  await login(credentials)
} catch (error) {
  // Error manejado por el store
  console.error('Login failed:', error.message)
}
```

### 2. Tokens Expirados

```typescript
// El sistema detecta automáticamente tokens expirados
if (!authService.isTokenValid()) {
  // Redirigir a login
  await logout()
}
```

### 3. Errores de Almacenamiento

```typescript
// Fallback automático si Keychain falla
try {
  await Keychain.setGenericPassword('auth_token', token)
} catch (error) {
  // Usar AsyncStorage como backup
  await AsyncStorage.setItem(TOKEN_KEY, token)
}
```

## Dependencias

```json
{
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-keychain": "^8.1.3",
  "zustand": "^4.4.7"
}
```

## Instalación

```bash
npm install @react-native-async-storage/async-storage react-native-keychain zustand
```

## Notas Importantes

1. **No uses cookies**: React Native no soporta cookies como en web
2. **Keychain es más seguro**: Usa el Keychain del dispositivo para tokens
3. **AsyncStorage como backup**: Siempre ten un fallback
4. **Validación de tokens**: Verifica la expiración automáticamente
5. **Headers automáticos**: El servicio API los incluye automáticamente
6. **Estado global**: Usa Zustand para mejor rendimiento que Context

## Ejemplo Completo

```typescript
import { useAuthStore } from './stores/auth-store'
import { api } from './services/api-service'

function App() {
  const { isAuthenticated, user, login, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      {/* Ejemplo de API call */}
      <TouchableOpacity onPress={async () => {
        const users = await api.getUsers()
        console.log(users)
      }}>
        <Text>Fetch Users</Text>
      </TouchableOpacity>
    </View>
  )
}
```

Este sistema proporciona una base sólida y segura para la autenticación en React Native con manejo automático de tokens JWT.
