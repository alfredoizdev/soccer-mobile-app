// Organization Types
export interface Organization {
  id: string
  name: string
  description: string
  avatar?: string
  playerCount?: number
  createdAt: string
  players?: Player[]
}

export interface Player {
  id: string
  name: string
  lastName: string
  age: number
  avatar?: string
  jerseyNumber: number
  position: string
  organizationId: string
  totalGoals: number
  totalAssists: number
  totalPassesCompleted: number
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    lastName: string
    email: string
    avatar?: string
  }
}

// User Types
export interface User {
  id: string
  name: string
  lastName: string
  email: string
  avatar?: string
  role: string
  organizationId?: string
  status: string
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  success: boolean
}
