# Mobile API Documentation

Esta documentación describe todos los endpoints de API disponibles para la aplicación móvil.

## Base URL

```
https://your-domain.com/api
```

## Autenticación

### Token JWT

Después del login exitoso, recibirás un token JWT que debes incluir en el header `Authorization` para los endpoints protegidos:

```
Authorization: Bearer <tu_token_jwt>
```

### Endpoints que NO requieren autenticación:

- `POST /api/auth/login`
- `POST /api/auth/register`

### Endpoints que SÍ requieren autenticación:

- Todos los demás endpoints (usuarios, jugadores, partidos, etc.)

## Autenticación

### 1. Login - `POST /api/auth/login`

**Descripción:** Autentica un usuario y devuelve un token JWT.

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "avatar": "https://res.cloudinary.com/...",
    "role": "user",
    "organizationId": "uuid-or-null",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Register - `POST /api/auth/register`

**Descripción:** Registra un nuevo usuario.

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "avatar": "base64_or_file"
}
```

**Response:** Mismo formato que login.

## Usuarios

### 3. Lista de Usuarios - `GET /api/users`

**Descripción:** Obtiene una lista paginada de usuarios.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Número de usuarios por página (default: 20, max: 100)
- `search` (opcional): Término de búsqueda para filtrar por nombre, apellido o email
- `status` (opcional): Filtrar por estado ('active', 'inactive', default: 'active')

**Ejemplo de Request:**

```
GET /api/users?page=1&limit=10&search=john&status=active
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/...",
      "organizationId": "uuid-or-null",
      "status": "active",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "success": true
}
```

### 4. Usuario Específico - `GET /api/users/{id}`

**Descripción:** Obtiene un usuario específico con sus jugadores asociados.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Path:**

- `id`: UUID del usuario

**Ejemplo de Request:**

```
GET /api/users/123e4567-e89b-12d3-a456-426614174000
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/...",
    "organizationId": "uuid-or-null",
    "status": "active",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "players": [
      {
        "id": "player-uuid",
        "name": "John",
        "lastName": "Doe",
        "age": 25,
        "avatar": "https://res.cloudinary.com/...",
        "jerseyNumber": 10,
        "position": "forward",
        "organizationId": "team-uuid",
        "totalGoals": 15,
        "totalAssists": 8,
        "totalPassesCompleted": 120,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  },
  "success": true
}
```

### 5. Búsqueda de Usuarios - `GET /api/users/search`

**Descripción:** Busca usuarios por nombre, apellido o email.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `q` (requerido): Término de búsqueda
- `limit` (opcional): Número máximo de resultados (default: 10)
- `status` (opcional): Filtrar por estado ('active', 'inactive', default: 'active')

**Ejemplo de Request:**

```
GET /api/users/search?q=john&limit=5&status=active
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/...",
      "organizationId": "uuid-or-null",
      "status": "active",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "query": "john",
  "total": 1,
  "success": true
}
```

### 6. Unsubscribe de Usuario del Equipo - `POST /api/users/unsubscribe`

**Descripción:** Permite a un usuario hacer unsubscribe del equipo al que está suscrito.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body:**

```json
{
  "userId": "uuid-del-usuario"
}
```

**Ejemplo de Request:**

```
POST /api/users/unsubscribe
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ejemplo de Response (Éxito):**

```json
{
  "user": {
    "id": "uuid",
    "name": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/...",
    "organizationId": null,
    "status": "active",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "success": true,
  "message": "User successfully unsubscribed from team"
}
```

**Ejemplo de Response (Usuario ya sin equipo):**

```json
{
  "error": "User is not subscribed to any team",
  "success": false
}
```

### 7. Verificar Estado de Suscripción - `GET /api/users/unsubscribe`

**Descripción:** Verifica si un usuario está suscrito a algún equipo.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `userId` (requerido): UUID del usuario

**Ejemplo de Request:**

```
GET /api/users/unsubscribe?userId=123e4567-e89b-12d3-a456-426614174000
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "userId": "uuid",
  "isSubscribed": false,
  "organizationId": null,
  "success": true
}
```

### 8. Suscribirse a un Equipo - `POST /api/users/subscribe`

**Descripción:** Permite a un usuario suscribirse a un equipo/organización.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body:**

```json
{
  "userId": "uuid-del-usuario",
  "organizationId": "uuid-del-equipo"
}
```

**Ejemplo de Request:**

```
POST /api/users/subscribe
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "organizationId": "987fcdeb-51a2-43d1-b456-426614174000"
}
```

**Ejemplo de Response (Éxito):**

```json
{
  "success": true,
  "message": "User successfully subscribed to team",
  "data": {
    "userId": "uuid",
    "organizationId": "uuid",
    "joinedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Ejemplo de Response (Error):**

```json
{
  "error": "User is already subscribed to a team",
  "success": false
}
```

### 9. Verificar Elegibilidad para Unirse - `GET /api/users/subscribe`

**Descripción:** Verifica si un usuario puede unirse a un equipo específico.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `userId` (requerido): UUID del usuario
- `organizationId` (requerido): UUID del equipo

**Ejemplo de Request:**

```
GET /api/users/subscribe?userId=123e4567-e89b-12d3-a456-426614174000&organizationId=987fcdeb-51a2-43d1-b456-426614174000
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "canJoin": true,
  "userId": "uuid",
  "organizationId": "uuid",
  "success": true
}
```

## Jugadores

### 10. Lista de Jugadores - `GET /api/players`

**Descripción:** Obtiene una lista paginada de jugadores.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Número de jugadores por página (default: 20)
- `search` (opcional): Término de búsqueda para filtrar por nombre o apellido
- `organizationId` (opcional): Filtrar por organización/equipo

**Ejemplo de Request:**

```
GET /api/players?page=1&limit=10&search=john&organizationId=team-uuid
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "players": [
    {
      "id": "player-uuid",
      "name": "John",
      "lastName": "Doe",
      "age": 25,
      "avatar": "https://res.cloudinary.com/...",
      "jerseyNumber": 10,
      "position": "forward",
      "organizationId": "team-uuid",
      "totalGoals": 15,
      "totalAssists": 8,
      "totalPassesCompleted": 120,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "user-uuid",
        "name": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "avatar": "https://res.cloudinary.com/..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "success": true
}
```

### 11. Jugador Específico - `GET /api/players/{id}`

**Descripción:** Obtiene un jugador específico con sus estadísticas.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Path:**

- `id`: UUID del jugador

**Ejemplo de Request:**

```
GET /api/players/123e4567-e89b-12d3-a456-426614174000
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "player": {
    "id": "player-uuid",
    "name": "John",
    "lastName": "Doe",
    "age": 25,
    "avatar": "https://res.cloudinary.com/...",
    "jerseyNumber": 10,
    "position": "forward",
    "organizationId": "team-uuid",
    "totalGoals": 15,
    "totalAssists": 8,
    "totalPassesCompleted": 120,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "user": {
      "id": "user-uuid",
      "name": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "avatar": "https://res.cloudinary.com/..."
    },
    "stats": [
      {
        "id": "stat-uuid",
        "minutesPlayed": 90,
        "goals": 2,
        "assists": 1,
        "passesCompleted": 15,
        "goalsAllowed": 0,
        "goalsSaved": 0,
        "match": {
          "id": "match-uuid",
          "date": "2024-01-01T00:00:00Z",
          "team1Id": "team1-uuid",
          "team2Id": "team2-uuid",
          "team1Goals": 3,
          "team2Goals": 1,
          "status": "active"
        }
      }
    ]
  },
  "success": true
}
```

## Organizaciones/Equipos

### 12. Lista de Organizaciones - `GET /api/organizations`

**Descripción:** Obtiene una lista paginada de organizaciones/equipos.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Número de organizaciones por página (default: 20)
- `search` (opcional): Término de búsqueda para filtrar por nombre o descripción

**Ejemplo de Request:**

```
GET /api/organizations?page=1&limit=10&search=team
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "organizations": [
    {
      "id": "org-uuid",
      "name": "Team Alpha",
      "description": "Professional soccer team",
      "avatar": "https://res.cloudinary.com/...",
      "playerCount": 15,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "success": true
}
```

### 13. Organización Específica - `GET /api/organizations/{id}`

**Descripción:** Obtiene una organización específica con sus jugadores.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Path:**

- `id`: UUID de la organización

**Ejemplo de Request:**

```
GET /api/organizations/123e4567-e89b-12d3-a456-426614174000
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "organization": {
    "id": "org-uuid",
    "name": "Team Alpha",
    "description": "Professional soccer team",
    "avatar": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-01T00:00:00Z",
    "players": [
      {
        "id": "player-uuid",
        "name": "John",
        "lastName": "Doe",
        "age": 25,
        "avatar": "https://res.cloudinary.com/...",
        "jerseyNumber": 10,
        "position": "forward",
        "totalGoals": 15,
        "totalAssists": 8,
        "totalPassesCompleted": 120,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "user": {
          "id": "user-uuid",
          "name": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "avatar": "https://res.cloudinary.com/..."
        }
      }
    ]
  },
  "success": true
}
```

## Partidos

### 14. Lista de Partidos - `GET /api/matches`

**Descripción:** Obtiene una lista paginada de partidos.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Número de partidos por página (default: 20)
- `status` (opcional): Filtrar por estado ('active', 'inactive')
- `isLive` (opcional): Filtrar por partidos en vivo ('true', 'false')

**Ejemplo de Request:**

```
GET /api/matches?page=1&limit=10&status=active&isLive=true
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "matches": [
    {
      "id": "match-uuid",
      "date": "2024-01-01T00:00:00Z",
      "team1Id": "team1-uuid",
      "team2Id": "team2-uuid",
      "team1Goals": 2,
      "team2Goals": 1,
      "duration": 5400,
      "status": "active",
      "location": "Stadium A",
      "notes": "Important match",
      "team1": {
        "id": "team1-uuid",
        "name": "Team Alpha",
        "avatar": "https://res.cloudinary.com/..."
      },
      "team2": {
        "id": "team2-uuid",
        "name": "Team Beta",
        "avatar": "https://res.cloudinary.com/..."
      },
      "liveScore": {
        "team1Goals": 2,
        "team2Goals": 1,
        "isLive": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "success": true
}
```

### 15. Partido Específico - `GET /api/matches/{id}`

**Descripción:** Obtiene un partido específico con estadísticas y eventos.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Path:**

- `id`: UUID del partido

**Ejemplo de Request:**

```
GET /api/matches/123e4567-e89b-12d3-a456-426614174000
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "match": {
    "id": "match-uuid",
    "date": "2024-01-01T00:00:00Z",
    "team1Id": "team1-uuid",
    "team2Id": "team2-uuid",
    "team1Goals": 2,
    "team2Goals": 1,
    "duration": 5400,
    "status": "active",
    "location": "Stadium A",
    "notes": "Important match",
    "team1": {
      "id": "team1-uuid",
      "name": "Team Alpha",
      "avatar": "https://res.cloudinary.com/..."
    },
    "team2": {
      "id": "team2-uuid",
      "name": "Team Beta",
      "avatar": "https://res.cloudinary.com/..."
    },
    "liveScore": {
      "team1Goals": 2,
      "team2Goals": 1,
      "isLive": true
    },
    "playerStats": [
      {
        "id": "stat-uuid",
        "minutesPlayed": 90,
        "goals": 2,
        "assists": 1,
        "passesCompleted": 15,
        "goalsAllowed": 0,
        "goalsSaved": 0,
        "player": {
          "id": "player-uuid",
          "name": "John",
          "lastName": "Doe",
          "avatar": "https://res.cloudinary.com/...",
          "jerseyNumber": 10,
          "position": "forward",
          "organizationId": "team-uuid"
        }
      }
    ],
    "events": [
      {
        "id": "event-uuid",
        "eventType": "goal",
        "minute": 15,
        "teamId": "team1-uuid",
        "description": "Beautiful goal!",
        "player": {
          "id": "player-uuid",
          "name": "John",
          "lastName": "Doe",
          "avatar": "https://res.cloudinary.com/..."
        }
      }
    ]
  },
  "success": true
}
```

## Posts/Noticias

### 16. Lista de Posts - `GET /api/posts`

**Descripción:** Obtiene una lista paginada de posts/noticias.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Query:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Número de posts por página (default: 20)
- `search` (opcional): Término de búsqueda para filtrar por título o contenido
- `status` (opcional): Filtrar por estado ('pending', 'approved', 'rejected', default: 'approved')

**Ejemplo de Request:**

```
GET /api/posts?page=1&limit=10&search=news&status=approved
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "posts": [
    {
      "id": "post-uuid",
      "title": "Latest Match Results",
      "slug": "latest-match-results",
      "content": "Team Alpha wins against Team Beta...",
      "mediaUrl": "https://res.cloudinary.com/...",
      "mediaType": "image",
      "status": "approved",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "user-uuid",
        "name": "John",
        "lastName": "Doe",
        "avatar": "https://res.cloudinary.com/..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "success": true
}
```

### 17. Post Específico - `GET /api/posts/{slug}`

**Descripción:** Obtiene un post específico por slug.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros de Path:**

- `slug`: Slug del post

**Ejemplo de Request:**

```
GET /api/posts/latest-match-results
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "post": {
    "id": "post-uuid",
    "title": "Latest Match Results",
    "slug": "latest-match-results",
    "content": "Team Alpha wins against Team Beta...",
    "mediaUrl": "https://res.cloudinary.com/...",
    "mediaType": "image",
    "status": "approved",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "user": {
      "id": "user-uuid",
      "name": "John",
      "lastName": "Doe",
      "avatar": "https://res.cloudinary.com/..."
    }
  },
  "success": true
}
```

## Streaming

### 18. Streams Activos - `GET /api/streaming/active`

**Descripción:** Obtiene todos los streams activos.

**Headers:**

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Ejemplo de Request:**

```
GET /api/streaming/active
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo de Response:**

```json
{
  "streams": [
    {
      "id": "stream-uuid",
      "title": "Live Match: Team Alpha vs Team Beta",
      "description": "Watch the live match",
      "streamKey": "stream_key_here",
      "isActive": true,
      "startedAt": "2024-01-01T00:00:00Z",
      "match": {
        "id": "match-uuid",
        "date": "2024-01-01T00:00:00Z",
        "team1Id": "team1-uuid",
        "team2Id": "team2-uuid",
        "team1Goals": 2,
        "team2Goals": 1,
        "status": "active",
        "location": "Stadium A"
      },
      "team1": {
        "id": "team1-uuid",
        "name": "Team Alpha",
        "avatar": "https://res.cloudinary.com/..."
      },
      "team2": {
        "id": "team2-uuid",
        "name": "Team Beta",
        "avatar": "https://res.cloudinary.com/..."
      },
      "broadcaster": {
        "id": "user-uuid",
        "name": "John",
        "lastName": "Doe",
        "avatar": "https://res.cloudinary.com/..."
      }
    }
  ],
  "total": 1,
  "success": true
}
```

## Códigos de Error

### 400 - Bad Request

```json
{
  "error": "Missing required fields",
  "success": false
}
```

### 401 - Unauthorized

```json
{
  "error": "Invalid email or password",
  "success": false
}
```

### 403 - Forbidden

```json
{
  "error": "Access denied. Token required.",
  "success": false
}
```

### 404 - Not Found

```json
{
  "error": "Resource not found",
  "success": false
}
```

### 409 - Conflict

```json
{
  "error": "User already exists",
  "success": false
}
```

### 500 - Internal Server Error

```json
{
  "error": "Internal server error",
  "success": false
}
```

## Notas de Implementación

1. **Autenticación:** Los endpoints de autenticación devuelven un token JWT que debe incluirse en el header `Authorization: Bearer <token>` para endpoints protegidos.

2. **Rate Limiting:** Considera implementar rate limiting para prevenir abuso de la API.

3. **CORS:** Asegúrate de configurar CORS apropiadamente para permitir requests desde tu app móvil.

4. **Validación:** Los endpoints incluyen validación básica de parámetros.

5. **Paginación:** Los endpoints principales incluyen paginación completa con metadatos útiles.

6. **Búsqueda:** La búsqueda es case-insensitive y busca en múltiples campos.

7. **Normalización:** Todos los datos están normalizados para la app móvil con valores por defecto apropiados.

## Ejemplo de Uso en React Native

```javascript
// Configuración base
const API_BASE_URL = 'https://your-domain.com/api'

// Headers para requests autenticados
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

// Login
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()

    if (data.success) {
      return data
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// Obtener usuarios (requiere autenticación)
const fetchUsers = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders(token) }
    )
    const data = await response.json()

    if (data.success) {
      return data.users
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Obtener partidos (requiere autenticación)
const fetchMatches = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/matches?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders(token) }
    )
    const data = await response.json()

    if (data.success) {
      return data.matches
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error fetching matches:', error)
    throw error
  }
}

// Obtener streams activos (requiere autenticación)
const fetchActiveStreams = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/streaming/active`, {
      headers: getAuthHeaders(token),
    })
    const data = await response.json()

    if (data.success) {
      return data.streams
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error fetching streams:', error)
    throw error
  }
}

// Búsqueda de jugadores (requiere autenticación)
const searchPlayers = async (token, query, organizationId = null) => {
  try {
    const params = new URLSearchParams({ q: query })
    if (organizationId) params.append('organizationId', organizationId)

    const response = await fetch(
      `${API_BASE_URL}/players?${params.toString()}`,
      { headers: getAuthHeaders(token) }
    )
    const data = await response.json()

    if (data.success) {
      return data.players
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error searching players:', error)
    throw error
  }
}

// Unsubscribe de usuario del equipo (requiere autenticación)
const unsubscribeFromTeam = async (token, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/unsubscribe`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ userId }),
    })
    const data = await response.json()

    if (data.success) {
      return data.user
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error unsubscribing from team:', error)
    throw error
  }
}

// Verificar estado de suscripción (requiere autenticación)
const checkSubscriptionStatus = async (token, userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/unsubscribe?userId=${userId}`,
      { headers: getAuthHeaders(token) }
    )
    const data = await response.json()

    if (data.success) {
      return {
        isSubscribed: data.isSubscribed,
        organizationId: data.organizationId,
      }
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error checking subscription status:', error)
    throw error
  }
}

// Suscribirse a un equipo (requiere autenticación)
const subscribeToTeam = async (token, userId, organizationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/subscribe`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ userId, organizationId }),
    })
    const data = await response.json()

    if (data.success) {
      return data.data
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error subscribing to team:', error)
    throw error
  }
}

// Verificar elegibilidad para unirse a un equipo (requiere autenticación)
const checkTeamJoinEligibility = async (token, userId, organizationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/subscribe?userId=${userId}&organizationId=${organizationId}`,
      { headers: getAuthHeaders(token) }
    )
    const data = await response.json()

    if (data.success) {
      return {
        canJoin: data.canJoin,
        userId: data.userId,
        organizationId: data.organizationId,
      }
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error checking team join eligibility:', error)
    throw error
  }
}
```

## Endpoints Disponibles

### Autenticación (NO requiere token)

- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario

### Usuarios (requiere token)

- `GET /api/users` - Lista de usuarios
- `GET /api/users/{id}` - Usuario específico
- `GET /api/users/search` - Búsqueda de usuarios
- `POST /api/users/subscribe` - Suscribirse a un equipo
- `GET /api/users/subscribe` - Verificar elegibilidad para unirse
- `POST /api/users/unsubscribe` - Unsubscribe del equipo
- `GET /api/users/unsubscribe` - Verificar estado de suscripción

### Jugadores (requiere token)

- `GET /api/players` - Lista de jugadores
- `GET /api/players/{id}` - Jugador específico

### Organizaciones/Equipos (requiere token)

- `GET /api/organizations` - Lista de organizaciones
- `GET /api/organizations/{id}` - Organización específica

### Partidos (requiere token)

- `GET /api/matches` - Lista de partidos
- `GET /api/matches/{id}` - Partido específico

### Posts/Noticias (requiere token)

- `GET /api/posts` - Lista de posts
- `GET /api/posts/{slug}` - Post específico

### Streaming (requiere token)

- `GET /api/streaming/active` - Streams activos

Todos los endpoints están optimizados para aplicaciones móviles con respuestas normalizadas y paginación eficiente.
