# 🚀 Soccer App - Mobile Development Guideline

## 📋 **Resumen del Proyecto Actual**

### **Funcionalidades Principales:**

- ✅ **Live Match Streaming** - Sistema de streaming en tiempo real
- ✅ **Player Management** - Gestión de jugadores y equipos
- ✅ **Match Calendar** - Calendario de partidos
- ✅ **Real-time Updates** - Actualizaciones en vivo
- ✅ **Admin Dashboard** - Panel de administración
- ✅ **User Authentication** - Sistema de autenticación
- ✅ **Team Management** - Gestión de equipos y organizaciones

---

## 🏗️ **Arquitectura del Proyecto**

### **Stack Tecnológico:**

- **Frontend**: Next.js 15 + React + TypeScript
- **Backend**: Next.js Server Actions + Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Real-time**: Socket.io
- **Streaming**: WebRTC + Peer-to-Peer
- **UI**: Tailwind CSS + Shadcn UI
- **State Management**: Redux Toolkit + Zustand
- **Testing**: Vitest + React Testing Library

### **Estructura de Carpetas:**

```
soccer-app/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Rutas de administración
│   ├── (auth)/            # Rutas de autenticación
│   ├── (root)/            # Rutas públicas
│   └── api/               # API endpoints
├── components/            # Componentes React
│   ├── admin/            # Componentes de admin
│   ├── members/          # Componentes de usuarios
│   └── ui/               # Componentes de UI
├── lib/                  # Utilidades y configuraciones
│   ├── actions/          # Server Actions
│   ├── stores/           # State Management
│   └── utils/            # Utilidades
├── database/             # Configuración de base de datos
├── hooks/                # Custom hooks
└── types/                # TypeScript types
```

---

## 🔧 **Configuración Inicial**

### **1. Dependencias Principales:**

```json
{
  "dependencies": {
    "next": "15.3.5",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "drizzle-orm": "^0.44.2",
    "postgres": "^8.16.3",
    "socket.io-client": "^4.7.4",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "sonner": "^1.4.0",
    "lucide-react": "^0.525.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "cloudinary": "^2.7.0",
    "bcryptjs": "^3.0.2",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "15.3.5",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "typescript": "^5",
    "vitest": "^3.2.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.5"
  }
}
```

### **2. Configuración de Base de Datos:**

```typescript
// database/schema.ts
import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const organizationsTable = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const playersTable = pgTable('players', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  position: text('position'),
  jerseyNumber: integer('jersey_number'),
  avatar: text('avatar'),
  organizationId: text('organization_id').references(
    () => organizationsTable.id
  ),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const matchesTable = pgTable('matches', {
  id: text('id').primaryKey(),
  date: timestamp('date').notNull(),
  location: text('location'),
  status: text('status').default('scheduled'),
  team1Id: text('team1_id').references(() => organizationsTable.id),
  team2Id: text('team2_id').references(() => organizationsTable.id),
  team1Goals: integer('team1_goals').default(0),
  team2Goals: integer('team2_goals').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

---

## 🎯 **Funcionalidades Críticas a Implementar**

### **1. Sistema de Autenticación:**

```typescript
// lib/actions/auth.action.ts
export const loginAction = async (email: string, password: string) => {
  // Lógica de autenticación
}

export const registerAction = async (userData: RegisterData) => {
  // Lógica de registro
}
```

### **2. Live Match System:**

```typescript
// hooks/useLiveMatch.ts
export function useLiveMatch(matchId: string) {
  // Hook para manejo de partidos en vivo
  // - Actualización de scores
  // - Stats de jugadores
  // - Timer del partido
  // - Estado de jugadores
}
```

### **3. Streaming System:**

```typescript
// hooks/useVideoStream.ts
export function useVideoStream(sessionId: string, user: User) {
  // Hook para streaming de video
  // - WebRTC peer connection
  // - Socket.io para signaling
  // - Audio/Video controls
}
```

### **4. Real-time Updates:**

```typescript
// hooks/useLiveMatchSocket.ts
export function useLiveMatchSocket(matchId: string) {
  // Socket.io para actualizaciones en tiempo real
  // - Score updates
  // - Player stats
  // - Match events
}
```

---

## 📱 **Componentes Principales**

### **1. Live Match Components:**

```typescript
// components/members/LiveMatchViewer.tsx
// components/members/LiveMatchScoreCard.tsx
// components/members/LiveMatchTimeline.tsx
// components/members/LiveMatchVideoStream.tsx
```

### **2. Player Management:**

```typescript
// components/admin/PlayerForm.tsx
// components/admin/PlayerTable/
// components/members/PlayerStats.tsx
```

### **3. Match Management:**

```typescript
// components/admin/MatchForm.tsx
// components/members/MatchCalendar.tsx
// components/members/MatchVideoSection.tsx
```

### **4. Team Management:**

```typescript
// components/admin/TeamTable/
// components/members/TeamPlayersSection.tsx
// components/ClubRanking.tsx
```

---

## 🔄 **Server Actions Principales**

### **1. Match Actions:**

```typescript
// lib/actions/matches.action.ts
export const getLiveMatchData = async (matchId: string)
export const updateLiveMatchScore = async (matchId: string, score: Score)
export const updateLivePlayerStats = async (matchId: string, playerId: string, stats: PlayerStats)
export const endLiveMatch = async (matchId: string)
```

### **2. Player Actions:**

```typescript
// lib/actions/player.action.ts
export const createPlayerAction = async (player: PlayerData)
export const updatePlayerAction = async (id: string, data: Partial<PlayerData>)
export const getPlayersByOrganizationAction = async (organizationId: string)
```

### **3. Streaming Actions:**

```typescript
// lib/actions/streaming.action.ts
export const createStreamAction = async (matchId: string)
export const endStreamAction = async (streamId: string)
export const getStreamStatusAction = async (streamId: string)
```

---

## 🎨 **UI/UX Guidelines**

### **1. Design System:**

- **Colors**: Tailwind CSS con tema personalizado
- **Typography**: Geist Sans para texto, Geist Mono para código
- **Components**: Shadcn UI como base
- **Icons**: Lucide React

### **2. Responsive Design:**

- **Mobile-first** approach
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch-friendly** interfaces
- **Gesture support** para mobile

### **3. Accessibility:**

- **ARIA labels** en todos los elementos interactivos
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** compliance

---

## 🧪 **Testing Strategy**

### **1. Unit Tests:**

```typescript
// __tests__/hooks/useLiveMatch.test.tsx
// __tests__/components/LiveMatchPageClient.test.tsx
// __tests__/lib/actions/matches.action.test.ts
```

### **2. Component Tests:**

- **Render testing** para todos los componentes
- **User interaction** testing
- **State management** testing
- **Error handling** testing

### **3. Integration Tests:**

- **API integration** testing
- **Socket.io** testing
- **Database** operations testing

---

## 🚀 **Deployment & Environment**

### **1. Environment Variables:**

```env
# Database
DATABASE_URL=postgresql://...
NEON_DATABASE_URL=postgresql://...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# JWT
JWT_SECRET=...

# Socket.io
NEXT_PUBLIC_SOCKET_URL=...
```

### **2. Build Configuration:**

```json
// next.config.ts
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['drizzle-orm'],
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}
```

---

## 📱 **Mobile App Considerations**

### **1. PWA Implementation:**

```json
// public/manifest.json
{
  "name": "Soccer App",
  "short_name": "Soccer",
  "description": "Live soccer matches and team management",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### **2. Service Worker:**

```javascript
// public/sw.js
// Offline functionality
// Push notifications
// Background sync
```

### **3. Mobile Optimizations:**

- **Touch targets** mínimo 44px
- **Swipe gestures** para navegación
- **Pull-to-refresh** functionality
- **Offline-first** approach
- **Push notifications** para partidos

---

## 🔧 **Development Workflow**

### **1. Setup Commands:**

```bash
# Install dependencies
npm install

# Setup database
npm run db:setup
npm run db:migrate
npm run db:seed

# Development
npm run dev

# Testing
npm test
npm run test:coverage

# Build
npm run build
npm start
```

### **2. Database Commands:**

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database
npm run db:reset

# Open Drizzle Studio
npm run db:studio
```

### **3. Testing Commands:**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

---

## 📊 **Performance Metrics**

### **1. Core Web Vitals:**

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### **2. Mobile Performance:**

- **Bundle size**: < 500KB
- **First load**: < 3s
- **Interactive time**: < 1s

### **3. Real-time Performance:**

- **Socket connection**: < 100ms
- **Video streaming**: < 500ms latency
- **Score updates**: < 200ms

---

## 🔒 **Security Considerations**

### **1. Authentication:**

- **JWT tokens** con expiración
- **Password hashing** con bcrypt
- **Session management**
- **Role-based access** control

### **2. Data Protection:**

- **Input validation** en todos los endpoints
- **SQL injection** prevention
- **XSS protection**
- **CSRF protection**

### **3. API Security:**

- **Rate limiting**
- **Request validation**
- **Error handling** sin información sensible
- **HTTPS only** en producción

---

## 📈 **Monitoring & Analytics**

### **1. Error Tracking:**

- **Sentry** para error tracking
- **Performance monitoring**
- **User session** tracking

### **2. Analytics:**

- **Google Analytics** para user behavior
- **Custom events** para features específicas
- **Conversion tracking**

### **3. Real-time Monitoring:**

- **Socket.io** connection monitoring
- **Streaming performance** metrics
- **Database performance** monitoring

---

## 🎯 **Next Steps for Mobile App**

### **1. PWA Implementation:**

1. Crear `manifest.json`
2. Implementar Service Worker
3. Configurar offline functionality
4. Agregar push notifications

### **2. Mobile Optimizations:**

1. Optimizar para touch interfaces
2. Implementar gesture navigation
3. Optimizar imágenes para mobile
4. Implementar lazy loading

### **3. Native App Features:**

1. Camera integration para fotos
2. GPS para ubicación de partidos
3. Push notifications nativas
4. Background sync

---

## 📚 **Recursos Adicionales**

### **1. Documentación:**

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Socket.io](https://socket.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **2. Herramientas:**

- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### **3. Deployment:**

- [Vercel](https://vercel.com/) para hosting
- [Neon](https://neon.tech/) para database
- [Cloudinary](https://cloudinary.com/) para media

---

## ✅ **Checklist de Implementación**

### **Backend:**

- [ ] Database schema setup
- [ ] Server actions implementation
- [ ] Authentication system
- [ ] Real-time socket integration
- [ ] File upload system
- [ ] API endpoints

### **Frontend:**

- [ ] Component library setup
- [ ] State management
- [ ] Routing configuration
- [ ] UI/UX implementation
- [ ] Responsive design
- [ ] Accessibility features

### **Testing:**

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

### **Deployment:**

- [ ] Environment configuration
- [ ] Build optimization
- [ ] CI/CD pipeline
- [ ] Monitoring setup

---

**🎉 ¡Con esta guía tienes todo lo necesario para replicar el proyecto en una mobile app!**
