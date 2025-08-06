# 🗄️ Database Setup - Drizzle + Neon

## 🚀 **Configuración Inicial de Base de Datos**

### **1. Instalar Dependencias:**

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### **2. Crear Estructura de Carpetas:**

```bash
mkdir -p database/migrations
mkdir -p database/seed
```

---

## 📝 **Configuración de Drizzle**

### **1. Crear drizzle.config.ts:**

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './database/schema.ts',
  out: './database/migrations',
  dialect: 'postgres',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config
```

### **2. Crear database/drizzle.ts:**

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })
```

---

## 🗃️ **Schema Completa de Base de Datos**

### **database/schema.ts:**

```typescript
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  json,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ===== USERS TABLE =====
export const usersTable = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  role: text('role', { enum: ['user', 'admin'] }).default('user'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== ORGANIZATIONS TABLE =====
export const organizationsTable = pgTable('organizations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),
  location: text('location'),
  website: text('website'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== PLAYERS TABLE =====
export const playersTable = pgTable('players', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  position: text('position'),
  jerseyNumber: integer('jersey_number'),
  avatar: text('avatar'),
  birthDate: timestamp('birth_date'),
  height: integer('height'), // in cm
  weight: integer('weight'), // in kg
  nationality: text('nationality'),
  organizationId: text('organization_id').references(
    () => organizationsTable.id
  ),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== MATCHES TABLE =====
export const matchesTable = pgTable('matches', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  date: timestamp('date').notNull(),
  location: text('location'),
  status: text('status', {
    enum: ['scheduled', 'live', 'finished', 'cancelled'],
  }).default('scheduled'),
  team1Id: text('team1_id').references(() => organizationsTable.id),
  team2Id: text('team2_id').references(() => organizationsTable.id),
  team1Goals: integer('team1_goals').default(0),
  team2Goals: integer('team2_goals').default(0),
  team1Stats: json('team1_stats'),
  team2Stats: json('team2_stats'),
  referee: text('referee'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== POSTS TABLE =====
export const postsTable = pgTable('posts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  excerpt: text('excerpt'),
  authorId: text('author_id').references(() => usersTable.id),
  status: text('status', {
    enum: ['draft', 'published', 'approved'],
  }).default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== STREAMS TABLE =====
export const streamsTable = pgTable('streams', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matchId: text('match_id').references(() => matchesTable.id),
  streamKey: text('stream_key').notNull().unique(),
  status: text('status', {
    enum: ['active', 'inactive', 'ended'],
  }).default('inactive'),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  viewerCount: integer('viewer_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== MATCH EVENTS TABLE =====
export const matchEventsTable = pgTable('match_events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matchId: text('match_id').references(() => matchesTable.id),
  playerId: text('player_id').references(() => playersTable.id),
  eventType: text('event_type', {
    enum: [
      'goal',
      'assist',
      'yellow_card',
      'red_card',
      'substitution',
      'injury',
    ],
  }).notNull(),
  minute: integer('minute'),
  description: text('description'),
  teamId: text('team_id').references(() => organizationsTable.id),
  createdAt: timestamp('created_at').defaultNow(),
})

// ===== PLAYER STATS TABLE =====
export const playerStatsTable = pgTable('player_stats', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matchId: text('match_id').references(() => matchesTable.id),
  playerId: text('player_id').references(() => playersTable.id),
  goals: integer('goals').default(0),
  assists: integer('assists').default(0),
  yellowCards: integer('yellow_cards').default(0),
  redCards: integer('red_cards').default(0),
  minutesPlayed: integer('minutes_played').default(0),
  shots: integer('shots').default(0),
  shotsOnTarget: integer('shots_on_target').default(0),
  passes: integer('passes').default(0),
  passesCompleted: integer('passes_completed').default(0),
  tackles: integer('tackles').default(0),
  interceptions: integer('interceptions').default(0),
  fouls: integer('fouls').default(0),
  foulsSuffered: integer('fouls_suffered').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== TEAM MEMBERS TABLE =====
export const teamMembersTable = pgTable('team_members', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => usersTable.id),
  organizationId: text('organization_id').references(
    () => organizationsTable.id
  ),
  role: text('role', {
    enum: ['player', 'coach', 'manager', 'staff'],
  }).default('player'),
  joinedAt: timestamp('joined_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== NOTIFICATIONS TABLE =====
export const notificationsTable = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => usersTable.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type', {
    enum: ['match', 'team', 'system', 'news'],
  }).default('system'),
  isRead: boolean('is_read').default(false),
  data: json('data'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ===== SETTINGS TABLE =====
export const settingsTable = pgTable('settings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ===== RELATIONS =====
export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  notifications: many(notificationsTable),
  teamMembers: many(teamMembersTable),
}))

export const organizationsRelations = relations(
  organizationsTable,
  ({ many }) => ({
    players: many(playersTable),
    team1Matches: many(matchesTable, { relationName: 'team1' }),
    team2Matches: many(matchesTable, { relationName: 'team2' }),
    teamMembers: many(teamMembersTable),
  })
)

export const playersRelations = relations(playersTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [playersTable.organizationId],
    references: [organizationsTable.id],
  }),
  matchEvents: many(matchEventsTable),
  playerStats: many(playerStatsTable),
}))

export const matchesRelations = relations(matchesTable, ({ one, many }) => ({
  team1: one(organizationsTable, {
    fields: [matchesTable.team1Id],
    references: [organizationsTable.id],
    relationName: 'team1',
  }),
  team2: one(organizationsTable, {
    fields: [matchesTable.team2Id],
    references: [organizationsTable.id],
    relationName: 'team2',
  }),
  streams: many(streamsTable),
  matchEvents: many(matchEventsTable),
  playerStats: many(playerStatsTable),
}))

export const postsRelations = relations(postsTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.id],
  }),
}))

export const streamsRelations = relations(streamsTable, ({ one }) => ({
  match: one(matchesTable, {
    fields: [streamsTable.matchId],
    references: [matchesTable.id],
  }),
}))

export const matchEventsRelations = relations(matchEventsTable, ({ one }) => ({
  match: one(matchesTable, {
    fields: [matchEventsTable.matchId],
    references: [matchesTable.id],
  }),
  player: one(playersTable, {
    fields: [matchEventsTable.playerId],
    references: [playersTable.id],
  }),
  team: one(organizationsTable, {
    fields: [matchEventsTable.teamId],
    references: [organizationsTable.id],
  }),
}))

export const playerStatsRelations = relations(playerStatsTable, ({ one }) => ({
  match: one(matchesTable, {
    fields: [playerStatsTable.matchId],
    references: [matchesTable.id],
  }),
  player: one(playersTable, {
    fields: [playerStatsTable.playerId],
    references: [playersTable.id],
  }),
}))

export const teamMembersRelations = relations(teamMembersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [teamMembersTable.userId],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [teamMembersTable.organizationId],
    references: [organizationsTable.id],
  }),
}))

export const notificationsRelations = relations(
  notificationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [notificationsTable.userId],
      references: [usersTable.id],
    }),
  })
)
```

---

## 🌐 **Configuración de Base de Datos**

### **1. Configuración Local (Desarrollo con Docker):**

#### **Requisitos:**

```bash
# Instalar Docker Desktop
# macOS: https://docs.docker.com/desktop/install/mac-install/
# Ubuntu: https://docs.docker.com/engine/install/ubuntu/
# Windows: https://docs.docker.com/desktop/install/windows-install/
```

#### **Crear docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: soccer-app-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: soccer_app
      POSTGRES_USER: soccer_user
      POSTGRES_PASSWORD: soccer_password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - soccer-network

volumes:
  postgres_data:

networks:
  soccer-network:
    driver: bridge
```

#### **Iniciar base de datos con Docker:**

```bash
# Iniciar PostgreSQL en Docker
docker-compose up -d postgres

# Verificar que está corriendo
docker-compose ps

# Ver logs
docker-compose logs postgres
```

#### **Variables de Entorno para Desarrollo (.env.local):**

```env
# ===== LOCAL DATABASE (DEVELOPMENT) =====
DATABASE_URL=postgresql://soccer_user:soccer_password@localhost:5432/soccer_app
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soccer_app
DB_USER=soccer_user
DB_PASSWORD=soccer_password

# ===== NEON DATABASE (PRODUCTION) =====
NEON_DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require

# ===== APP CONFIGURATION =====
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===== JWT SECRET =====
JWT_SECRET=your-super-secret-jwt-key-for-development

# ===== CLOUDINARY (OPTIONAL FOR DEV) =====
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **2. Configuración de Neon (Producción):**

#### **Crear cuenta en Neon:**

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la connection string

#### **Variables de Entorno para Producción (.env.production):**

```env
# ===== PRODUCTION DATABASE (NEON) =====
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require
NEON_DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require

# ===== DATABASE CONFIGURATION =====
DB_HOST=ep-xxx-xxx-xxx.region.aws.neon.tech
DB_PORT=5432
DB_NAME=database
DB_USER=username
DB_PASSWORD=password

# ===== APP CONFIGURATION =====
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-domain.com

# ===== JWT SECRET =====
JWT_SECRET=your-super-secret-jwt-key-for-production

# ===== CLOUDINARY =====
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **3. Configuración por Entorno:**

#### **Desarrollo Local (.env.local):**

```env
NODE_ENV=development
DATABASE_URL=postgresql://soccer_user:soccer_password@localhost:5432/soccer_app
```

#### **Staging (.env.staging):**

```env
NODE_ENV=staging
DATABASE_URL=postgresql://staging_user:staging_password@staging-host.com/staging_db
```

#### **Producción (.env.production):**

```env
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:prod_password@prod-host.com/prod_db
```

---

## 🔧 **Scripts de Base de Datos**

### **1. Actualizar package.json:**

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx database/seed/index.ts",
    "db:reset": "npm run db:push && npm run db:seed"
  }
}
```

### **2. Crear database/seed/index.ts:**

```typescript
import { db } from '../drizzle'
import { usersTable, organizationsTable, settingsTable } from '../schema'
import { hashPassword } from '@/lib/utils/auth'

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Create admin user
    const adminPassword = await hashPassword('admin123')
    await db.insert(usersTable).values({
      id: 'admin-user-id',
      name: 'Admin User',
      email: 'admin@soccerapp.com',
      password: adminPassword,
      role: 'admin',
    })

    // Create default organization
    await db.insert(organizationsTable).values({
      id: 'default-org-id',
      name: 'Default Soccer Club',
      description: 'Default organization for the soccer app',
    })

    // Create default settings
    await db.insert(settingsTable).values([
      {
        key: 'app_name',
        value: 'Soccer App',
        description: 'Application name',
      },
      {
        key: 'app_version',
        value: '1.0.0',
        description: 'Application version',
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        description: 'Maintenance mode status',
      },
    ])

    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
```

---

## 🚀 **Comandos de Configuración**

### **1. Configuración Inicial (Desarrollo con Docker):**

```bash
# 1. Instalar dependencias
npm install drizzle-orm postgres
npm install -D drizzle-kit tsx

# 2. Iniciar PostgreSQL en Docker
docker-compose up -d postgres

# 3. Verificar que PostgreSQL está corriendo
docker-compose ps
docker-compose logs postgres

# 4. Crear archivos de configuración
# (Copiar los archivos de arriba)

# 5. Configurar variables de entorno (.env.local)
echo "DATABASE_URL=postgresql://soccer_user:soccer_password@localhost:5432/soccer_app" > .env.local

# 6. Generar migraciones
npm run db:generate

# 7. Ejecutar migraciones
npm run db:migrate

# 8. Sembrar datos iniciales
npm run db:seed

# 9. Abrir Drizzle Studio
npm run db:studio
```

### **2. Comandos de Desarrollo:**

```bash
# Generar nueva migración
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Push cambios directamente (desarrollo)
npm run db:push

# Ver datos en Drizzle Studio
npm run db:studio

# Resetear base de datos
npm run db:reset
```

### **3. Verificación de Conexión Local:**

```bash
# Verificar que PostgreSQL está corriendo en Docker
docker-compose ps
docker-compose logs postgres

# Conectar a la base de datos local
psql -h localhost -U soccer_user -d soccer_app

# O conectarse directamente al contenedor
docker-compose exec postgres psql -U soccer_user -d soccer_app

# Verificar tablas creadas
\dt

# Verificar datos sembrados
SELECT * FROM users;
SELECT * FROM organizations;
SELECT * FROM settings;

# Salir de psql
\q
```

### **4. Troubleshooting Local:**

```bash
# Si PostgreSQL no inicia en Docker
docker-compose down
docker-compose up -d postgres

# Si necesitas resetear la base de datos local
docker-compose down -v  # Esto elimina los volúmenes
docker-compose up -d postgres

# Si necesitas acceder al contenedor
docker-compose exec postgres bash

# Si necesitas ver los logs
docker-compose logs -f postgres

# Si necesitas parar todos los servicios
docker-compose down

# Verificar variables de entorno
cat .env.local

# Verificar que el puerto 5432 esté disponible
lsof -i :5432
```

### **5. Comandos Docker Útiles:**

```bash
# Ver todos los contenedores corriendo
docker ps

# Ver logs en tiempo real
docker-compose logs -f postgres

# Ejecutar comandos dentro del contenedor
docker-compose exec postgres psql -U soccer_user -d soccer_app

# Hacer backup de la base de datos
docker-compose exec postgres pg_dump -U soccer_user soccer_app > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U soccer_user -d soccer_app < backup.sql

# Ver uso de recursos
docker stats

# Limpiar contenedores no utilizados
docker system prune -f
```

---

## 🚀 **Guía Completa: Desarrollo con Base de Datos Local**

### **1. Inicio Rápido (Dev Mode):**

```bash
# 1. Iniciar la base de datos local
docker-compose up -d postgres

# 2. Verificar que está corriendo
docker-compose ps

# 3. Configurar variables de entorno para desarrollo
cat > .env.local << 'EOF'
# ===== LOCAL DATABASE (DEVELOPMENT) =====
DATABASE_URL=postgresql://soccer_user:soccer_password@localhost:5432/soccer_app
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soccer_app
DB_USER=soccer_user
DB_PASSWORD=soccer_password

# ===== APP CONFIGURATION =====
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===== JWT SECRET =====
JWT_SECRET=dev-secret-key-change-in-production

# ===== CLOUDINARY (OPTIONAL FOR DEV) =====
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF

# 4. Instalar dependencias (si no están instaladas)
npm install drizzle-orm postgres
npm install -D drizzle-kit tsx

# 5. Generar y ejecutar migraciones
npm run db:generate
npm run db:migrate

# 6. Sembrar datos iniciales
npm run db:seed

# 7. Iniciar el servidor de desarrollo
npm run dev
```

### **2. Verificación de Conexión (Dev Mode):**

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Conectar a la base de datos desde fuera del contenedor
psql -h localhost -U soccer_user -d soccer_app

# O conectarse directamente al contenedor
docker-compose exec postgres psql -U soccer_user -d soccer_app

# Verificar tablas creadas
\dt

# Verificar datos sembrados
SELECT * FROM users;
SELECT * FROM organizations;
SELECT * FROM settings;

# Salir de psql
\q
```

### **3. Desarrollo Diario (Dev Mode):**

```bash
# Iniciar todos los días
docker-compose up -d postgres

# Ver logs en tiempo real
docker-compose logs -f postgres

# Ejecutar migraciones cuando cambies el schema
npm run db:generate
npm run db:migrate

# Ver datos en Drizzle Studio
npm run db:studio

# Resetear base de datos si es necesario
docker-compose down -v
docker-compose up -d postgres
npm run db:migrate
npm run db:seed
```

### **4. Troubleshooting (Dev Mode):**

```bash
# Si la base de datos no inicia
docker-compose down
docker-compose up -d postgres

# Si necesitas resetear completamente
docker-compose down -v
docker-compose up -d postgres
npm run db:migrate
npm run db:seed

# Si el puerto 5432 está ocupado
lsof -i :5432
# Detener el proceso que use el puerto o cambiar el puerto en docker-compose.yml

# Si no puedes conectar
docker-compose logs postgres
# Verificar que el contenedor está corriendo y los logs no muestran errores

# Si necesitas acceder al contenedor para debug
docker-compose exec postgres bash
```

### **5. Comandos de Desarrollo Frecuentes:**

```bash
# Ver estado de la base de datos
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Ejecutar queries directamente
docker-compose exec postgres psql -U soccer_user -d soccer_app -c "SELECT * FROM users;"

# Hacer backup de datos importantes
docker-compose exec postgres pg_dump -U soccer_user soccer_app > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose exec -T postgres psql -U soccer_user -d soccer_app < backup_20241201_143022.sql

# Ver uso de recursos
docker stats soccer-app-postgres
```

### **6. Variables de Entorno para Desarrollo:**

```env
# .env.local - Solo para desarrollo local
NODE_ENV=development
DATABASE_URL=postgresql://soccer_user:soccer_password@localhost:5432/soccer_app
JWT_SECRET=dev-secret-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Variables opcionales para desarrollo
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **7. Workflow de Desarrollo:**

```bash
# 1. Iniciar base de datos
docker-compose up -d postgres

# 2. Verificar conexión
docker-compose ps

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. En otra terminal, abrir Drizzle Studio
npm run db:studio

# 5. Cuando hagas cambios en el schema
npm run db:generate
npm run db:migrate

# 6. Para parar todo al final del día
docker-compose down
```

### **8. Verificación de Funcionamiento:**

```bash
# Verificar que todo funciona
curl http://localhost:3000/api/health

# Verificar base de datos
docker-compose exec postgres psql -U soccer_user -d soccer_app -c "SELECT COUNT(*) FROM users;"

# Verificar que Drizzle Studio funciona
# Abrir http://localhost:4983 en el navegador
```

---

## 🌐 **Guía Completa: Producción con Neon**

### **1. Configuración de Neon (Producción):**

#### **Crear cuenta en Neon:**

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto llamado "soccer-app"
4. Copia la connection string

#### **Configurar variables de entorno para producción:**

```bash
# Crear .env.production
cat > .env.production << 'EOF'
# ===== PRODUCTION DATABASE (NEON) =====
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require
NEON_DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require

# ===== DATABASE CONFIGURATION =====
DB_HOST=ep-xxx-xxx-xxx.region.aws.neon.tech
DB_PORT=5432
DB_NAME=database
DB_USER=username
DB_PASSWORD=password

# ===== APP CONFIGURATION =====
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-domain.com

# ===== JWT SECRET =====
JWT_SECRET=your-super-secret-jwt-key-for-production

# ===== CLOUDINARY =====
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF
```

### **2. Migración a Producción:**

```bash
# 1. Configurar variables de entorno de producción
export DATABASE_URL="postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require"

# 2. Generar migraciones para producción
npm run db:generate

# 3. Ejecutar migraciones en Neon
npm run db:migrate

# 4. Sembrar datos iniciales en producción
npm run db:seed

# 5. Verificar conexión a Neon
npm run db:studio
```

### **3. Verificación de Conexión (Producción):**

```bash
# Verificar que puedes conectar a Neon
psql "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require"

# Verificar tablas creadas
\dt

# Verificar datos sembrados
SELECT * FROM users;
SELECT * FROM organizations;
SELECT * FROM settings;

# Salir de psql
\q
```

### **4. Deployment a Producción:**

#### **Vercel Deployment:**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login a Vercel
vercel login

# 3. Configurar variables de entorno en Vercel
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET

# 4. Deploy
vercel --prod
```

#### **Variables de Entorno en Vercel:**

```env
# En el dashboard de Vercel > Settings > Environment Variables
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-for-production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
```

### **5. Monitoreo de Producción:**

```bash
# Ver logs de la aplicación
vercel logs

# Ver logs de Neon (desde el dashboard de Neon)

# Verificar estado de la base de datos
psql "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" -c "SELECT COUNT(*) FROM users;"

# Backup de producción
pg_dump "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" > production_backup_$(date +%Y%m%d_%H%M%S).sql
```

### **6. Troubleshooting de Producción:**

```bash
# Si no puedes conectar a Neon
# 1. Verificar connection string
echo $DATABASE_URL

# 2. Verificar que Neon está activo
# Ir al dashboard de Neon y verificar el estado

# 3. Verificar SSL
psql "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require"

# Si las migraciones fallan
# 1. Verificar que tienes permisos
# 2. Verificar que la base de datos existe
# 3. Verificar que el usuario tiene permisos de escritura

# Si la aplicación no puede conectar
# 1. Verificar variables de entorno en Vercel
# 2. Verificar que DATABASE_URL está configurada
# 3. Verificar logs de la aplicación
```

### **7. Backup y Restore de Producción:**

```bash
# Backup completo de producción
pg_dump "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" > production_backup_$(date +%Y%m%d_%H%M%S).sql

# Backup de tablas específicas
pg_dump "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" -t users -t organizations > users_orgs_backup.sql

# Restore a base de datos local (para testing)
psql "postgresql://soccer_user:soccer_password@localhost:5432/soccer_app" < production_backup_20241201_143022.sql

# Restore a Neon (cuidado, esto sobrescribirá datos)
psql "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" < production_backup_20241201_143022.sql
```

### **8. Seguridad de Producción:**

```bash
# Cambiar JWT secret en producción
# En Vercel dashboard > Environment Variables
JWT_SECRET=your-new-super-secret-jwt-key-for-production

# Verificar que no hay credenciales en el código
grep -r "password\|secret" . --exclude-dir=node_modules --exclude-dir=.git

# Verificar que .env.production no está en el repositorio
git status .env.production
```

### **9. Performance de Producción:**

```bash
# Verificar conexiones activas en Neon
psql "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" -c "SELECT count(*) FROM pg_stat_activity;"

# Verificar queries lentas
psql "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Verificar uso de espacio
psql "postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require" -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### **10. Workflow de Producción:**

```bash
# 1. Desarrollo local con Docker
docker-compose up -d postgres
npm run dev

# 2. Testing local
npm test
npm run db:studio

# 3. Preparar para producción
npm run build
npm run db:generate

# 4. Deploy a staging (si tienes)
vercel

# 5. Deploy a producción
vercel --prod

# 6. Verificar producción
curl https://your-app-domain.com/api/health
```

### **11. Variables de Entorno por Entorno:**

#### **Desarrollo Local (.env.local):**

```env
NODE_ENV=development
DATABASE_URL=postgresql://soccer_user:soccer_password@localhost:5432/soccer_app
JWT_SECRET=dev-secret-key-change-in-production
```

#### **Staging (.env.staging):**

```env
NODE_ENV=staging
DATABASE_URL=postgresql://staging_user:staging_password@staging-host.com/staging_db
JWT_SECRET=staging-secret-key
```

#### **Producción (.env.production):**

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-for-production
```

---

## 📊 **Tipos TypeScript para la Base de Datos**

### **Crear types/database.ts:**

```typescript
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  usersTable,
  organizationsTable,
  playersTable,
  matchesTable,
  postsTable,
  streamsTable,
  matchEventsTable,
  playerStatsTable,
  teamMembersTable,
  notificationsTable,
  settingsTable,
} from '@/database/schema'

// Select types (para leer datos)
export type User = InferSelectModel<typeof usersTable>
export type Organization = InferSelectModel<typeof organizationsTable>
export type Player = InferSelectModel<typeof playersTable>
export type Match = InferSelectModel<typeof matchesTable>
export type Post = InferSelectModel<typeof postsTable>
export type Stream = InferSelectModel<typeof streamsTable>
export type MatchEvent = InferSelectModel<typeof matchEventsTable>
export type PlayerStats = InferSelectModel<typeof playerStatsTable>
export type TeamMember = InferSelectModel<typeof teamMembersTable>
export type Notification = InferSelectModel<typeof notificationsTable>
export type Setting = InferSelectModel<typeof settingsTable>

// Insert types (para insertar datos)
export type NewUser = InferInsertModel<typeof usersTable>
export type NewOrganization = InferInsertModel<typeof organizationsTable>
export type NewPlayer = InferInsertModel<typeof playersTable>
export type NewMatch = InferInsertModel<typeof matchesTable>
export type NewPost = InferInsertModel<typeof postsTable>
export type NewStream = InferInsertModel<typeof streamsTable>
export type NewMatchEvent = InferInsertModel<typeof matchEventsTable>
export type NewPlayerStats = InferInsertModel<typeof playerStatsTable>
export type NewTeamMember = InferInsertModel<typeof teamMembersTable>
export type NewNotification = InferInsertModel<typeof notificationsTable>
export type NewSetting = InferInsertModel<typeof settingsTable>
```

---

## 🔍 **Queries de Ejemplo**

### **1. Queries Básicas:**

```typescript
// Obtener todos los usuarios
const users = await db.select().from(usersTable)

// Obtener usuario por email
const user = await db.query.usersTable.findFirst({
  where: (users, { eq }) => eq(users.email, 'user@example.com'),
})

// Obtener partidos con equipos
const matches = await db
  .select({
    id: matchesTable.id,
    date: matchesTable.date,
    team1: {
      id: organizationsTable.id,
      name: organizationsTable.name,
    },
    team2: {
      id: organizationsTable.id,
      name: organizationsTable.name,
    },
  })
  .from(matchesTable)
  .leftJoin(organizationsTable, eq(matchesTable.team1Id, organizationsTable.id))
  .leftJoin(organizationsTable, eq(matchesTable.team2Id, organizationsTable.id))
```

### **2. Queries con Relaciones:**

```typescript
// Obtener jugadores con su organización
const players = await db.query.playersTable.findMany({
  with: {
    organization: true,
  },
})

// Obtener partido con eventos
const match = await db.query.matchesTable.findFirst({
  where: (matches, { eq }) => eq(matches.id, matchId),
  with: {
    matchEvents: {
      with: {
        player: true,
        team: true,
      },
    },
    playerStats: {
      with: {
        player: true,
      },
    },
  },
})
```

---

## ✅ **Checklist de Configuración**

- [ ] Docker Desktop instalado y corriendo
- [ ] docker-compose.yml creado
- [ ] Dependencias instaladas (drizzle-orm, postgres, drizzle-kit)
- [ ] Estructura de carpetas creada
- [ ] drizzle.config.ts configurado
- [ ] database/drizzle.ts creado
- [ ] database/schema.ts con todas las tablas
- [ ] Variables de entorno configuradas
- [ ] Scripts en package.json agregados
- [ ] PostgreSQL corriendo en Docker (`docker-compose ps`)
- [ ] Migraciones generadas y ejecutadas
- [ ] Datos iniciales sembrados
- [ ] Drizzle Studio funcionando
- [ ] Tipos TypeScript creados
- [ ] Conexión a base de datos local establecida
- [ ] Conexión a Neon establecida (producción)

---

## 🎯 **Próximos Pasos**

1. **Configurar autenticación** con JWT
2. **Implementar Server Actions** para CRUD
3. **Crear hooks personalizados** para queries
4. **Configurar Socket.io** para real-time
5. **Implementar uploads** con Cloudinary

---

**🎉 ¡Con esta configuración tienes una base de datos completa y funcional para tu mobile app!**
