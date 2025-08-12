import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import LoadingScreen from '../../components/loading-screen'
import TeamCard from '../../components/team-card'
import TeamHeader from '../../components/team-header'
import { useAuthStore } from '../../stores/auth-store'
import { useOrganizationStore } from '../../stores/organization-store'

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const { user } = useAuthStore()
  const {
    userOrganization,
    allOrganizations,
    isLoading,
    isLoadingOrganizations,
    error,
    isInitialized,
    fetchUserOrganization,
    fetchAllOrganizations,
    clearError,
  } = useOrganizationStore()

  useEffect(() => {
    loadData()

    // Subscribe to user changes to auto-refresh when organizationId changes
    const unsubscribe = useOrganizationStore.getState().subscribeToUserChanges()

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Additional effect to handle userOrganization changes
  useEffect(() => {
    if (userOrganization) {
      // Clear available organizations when user is subscribed
      useOrganizationStore.getState().refreshAndClearAvailable()
    }
  }, [userOrganization])

  // Additional effect to handle user authentication changes
  useEffect(() => {
    if (user?.organizationId) {
      fetchUserOrganization()
    }
  }, [user?.organizationId, fetchUserOrganization])

  const loadData = async () => {
    try {
      // Always fetch user organization first to check subscription status
      await fetchUserOrganization()

      // Get the current state from the store to check if user has organization
      const currentState = useOrganizationStore.getState()

      // Only fetch all organizations if user is not subscribed to any team
      if (!currentState.userOrganization) {
        await fetchAllOrganizations()
      } else {
        // Clear the list since user is already subscribed
        useOrganizationStore.setState({ allOrganizations: [] })
      }
    } catch (error) {
      console.error('Error loading teams data:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await fetchAllOrganizations()
      return
    }

    setIsSearching(true)
    try {
      await fetchAllOrganizations(1, 20, searchQuery.trim())
    } catch (error) {
      console.error('Error searching teams:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleRefresh = async () => {
    await loadData()
  }

  const renderContent = () => {
    // Show loading when fetching user organization
    if (isLoading && !isInitialized) {
      return <LoadingScreen message='Loading teams...' />
    }

    // Show loading when fetching all organizations
    if (isLoadingOrganizations && allOrganizations.length === 0) {
      return <LoadingScreen message='Loading available teams...' />
    }

    // User is subscribed to a team
    if (userOrganization) {
      return (
        <View className='flex-1'>
          <TeamHeader organization={userOrganization} />

          <View className='bg-white rounded-lg p-4 shadow-sm'>
            <Text className='text-lg font-semibold text-gray-800 mb-3'>
              Team Information
            </Text>
            <Text className='text-gray-600 mb-2'>
              You are currently subscribed to {userOrganization.name}
            </Text>
            <Text className='text-gray-600'>
              You can view team details, players, and upcoming events here.
            </Text>
          </View>
        </View>
      )
    }

    // User is not subscribed - show available teams
    if (allOrganizations.length > 0) {
      return (
        <View className='flex-1'>
          <View className='bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-6 mb-6 border border-blue-200/30'>
            <Text className='text-2xl font-bold text-gray-800 mb-3 text-center'>
              Available Teams
            </Text>
            <Text className='text-gray-600 text-base text-center leading-6'>
              You are not currently subscribed to any team. Choose a team below
              to subscribe.
            </Text>
          </View>

          {allOrganizations.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </View>
      )
    }

    // No teams found
    return (
      <View className='flex-1 justify-center items-center px-6'>
        <View className='bg-white/90 rounded-3xl p-8 items-center shadow-xl'>
          <View className='w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full items-center justify-center mb-6'>
            <Ionicons name='people-outline' size={48} color='white' />
          </View>
          <Text className='text-2xl font-bold text-gray-800 mb-3 text-center'>
            No Teams Found
          </Text>
          <Text className='text-gray-600 text-center leading-6'>
            There are currently no teams available. Please check back later or
            contact support.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
      <View className='flex-1'>
        {/* Header Section */}
        <View className='bg-white/10 px-4 pb-4 pt-10'>
          <Text className='text-2xl font-bold text-white mb-4'>Teams</Text>

          {/* Search Bar - Only show when user is not subscribed */}
          {!userOrganization && (
            <View className='flex-row items-center bg-white/20 rounded-lg px-3 py-2'>
              <TextInput
                className='flex-1 text-white'
                placeholder='Search teams...'
                placeholderTextColor='rgba(255, 255, 255, 0.7)'
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType='search'
              />
              <TouchableOpacity
                onPress={handleSearch}
                disabled={isSearching}
                className='ml-2'
              >
                {isSearching ? (
                  <ActivityIndicator size='small' color='white' />
                ) : (
                  <Ionicons name='search' size={20} color='white' />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View className='flex-1 bg-white rounded-t-3xl'>
          <ScrollView
            className='flex-1 px-4 pt-6'
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                tintColor='#EF4444'
              />
            }
          >
            {error && (
              <View className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
                <Text className='text-red-800 text-center'>{error}</Text>
                <TouchableOpacity
                  onPress={clearError}
                  className='mt-2 bg-red-100 py-2 px-4 rounded-lg items-center'
                >
                  <Text className='text-red-800 font-semibold'>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}

            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  )
}

export default Teams
