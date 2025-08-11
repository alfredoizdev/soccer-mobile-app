import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { api } from '../services/api-service'
import { useAuthStore } from '../stores/auth-store'

interface User {
  id: string
  name: string
  lastName: string
  email: string
  avatar?: string
  role: string
  status: string
  organizationId?: string
  createdAt: string
  updatedAt: string
}

export function UsersScreen() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)

  const { logout } = useAuthStore()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.getUsers({ page, limit: 20 })

      if (response.success) {
        setUsers(response.data || [])
        setPagination(response.pagination)
      } else {
        throw new Error(response.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchUsers(1)
    setIsRefreshing(false)
  }

  const renderUserItem = ({ item }: { item: User }) => (
    <View className='bg-white border border-gray-200 p-4 rounded-lg mb-3 shadow-sm'>
      <View className='flex-row items-center mb-3'>
        <View className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-4 items-center justify-center shadow-sm'>
          <Text className='text-white font-bold text-sm'>
            {item.name.charAt(0)}
            {item.lastName.charAt(0)}
          </Text>
        </View>
        <View className='flex-1'>
          <Text className='font-semibold text-gray-800 text-base'>
            {item.name} {item.lastName}
          </Text>
          <Text className='text-gray-600 text-sm'>{item.email}</Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            item.role === 'admin' ? 'bg-purple-100' : 'bg-green-100'
          }`}
        >
          <Text
            className={`text-xs font-medium capitalize ${
              item.role === 'admin' ? 'text-purple-700' : 'text-green-700'
            }`}
          >
            {item.role}
          </Text>
        </View>
      </View>
      <View className='flex-row justify-between items-center'>
        <View className='flex-row items-center'>
          <View
            className={`w-2 h-2 rounded-full mr-2 ${
              item.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <Text className='text-gray-500 text-xs capitalize'>
            {item.status}
          </Text>
        </View>
        <Text className='text-gray-400 text-xs'>
          ID: {item.id.slice(0, 8)}...
        </Text>
      </View>
    </View>
  )

  if (isLoading && !isRefreshing) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <ActivityIndicator size='large' color='#d7b157' />
        <Text className='text-gray-600 mt-2'>Loading users...</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-200'>
        <Text className='text-xl font-bold text-gray-800'>Users</Text>
        <TouchableOpacity
          onPress={logout}
          className='bg-red-500 px-4 py-2 rounded-lg'
        >
          <Text className='text-white font-semibold'>Logout</Text>
        </TouchableOpacity>
      </View>

      {pagination && (
        <View className='bg-white border-b border-gray-200 px-4 py-2'>
          <Text className='text-sm text-gray-600'>
            {pagination.total} total users • Page {pagination.page} of{' '}
            {pagination.totalPages}
          </Text>
        </View>
      )}

      {error && (
        <View className='bg-red-50 border border-red-200 p-4 m-4 rounded-lg'>
          <Text className='text-red-800 text-center'>{error}</Text>
        </View>
      )}

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor='#d7b157'
          />
        }
        ListEmptyComponent={
          !isLoading && !error ? (
            <View className='items-center justify-center py-8'>
              <Text className='text-gray-600 text-center'>No users found</Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}
