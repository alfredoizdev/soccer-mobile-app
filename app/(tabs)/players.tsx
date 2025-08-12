import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Player } from '../../services/organization-service'
import { useAuthStore } from '../../stores/auth-store'
import { useOrganizationStore } from '../../stores/organization-store'

export default function PlayersScreen() {
  const { user, isAuthenticated } = useAuthStore()
  const { userOrganization, isLoading, error, fetchUserOrganization } =
    useOrganizationStore()
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrganization()
    }

    // Subscribe to user changes to auto-refresh when organizationId changes
    const unsubscribe = useOrganizationStore.getState().subscribeToUserChanges()

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user])

  // Additional effect to handle user organizationId changes
  useEffect(() => {
    if (user?.organizationId) {
      console.log(
        'Players page: User organizationId changed, fetching organization...'
      )
      fetchUserOrganization()
    }
  }, [user?.organizationId, fetchUserOrganization])

  // Filter players based on search query
  useEffect(() => {
    if (userOrganization?.players) {
      const filtered = userOrganization.players.filter(
        (player) =>
          `${player.name} ${player.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.jerseyNumber.toString().includes(searchQuery)
      )
      setFilteredPlayers(filtered)
    } else {
      setFilteredPlayers([])
    }
  }, [userOrganization?.players, searchQuery])

  const handleRefresh = async () => {
    setRefreshing(true)
    if (isAuthenticated && user) {
      await fetchUserOrganization()
    }
    setRefreshing(false)
  }

  const handlePlayerPress = (playerId: string) => {
    router.push(`/player/${playerId}`)
  }

  const renderPlayerCard = ({ item: player }: { item: Player }) => (
    <TouchableOpacity
      onPress={() => handlePlayerPress(player.id)}
      className='bg-white rounded-xl shadow-lg mx-4 mb-4 overflow-hidden'
    >
      <View className='flex-row p-4'>
        {/* Player Avatar */}
        <View className='relative mr-4'>
          {player.avatar ? (
            <Image
              source={{ uri: player.avatar }}
              className='w-16 h-16 rounded-lg'
              resizeMode='cover'
            />
          ) : (
            <View className='w-16 h-16 rounded-lg bg-gray-200 items-center justify-center'>
              <Ionicons name='person' size={24} color='#9CA3AF' />
            </View>
          )}
          {/* Jersey Number Badge */}
          <View className='absolute -top-1 -right-1 bg-gray-700 rounded w-6 h-6 items-center justify-center'>
            <Text className='text-white text-xs font-bold'>
              #{player.jerseyNumber}
            </Text>
          </View>
        </View>

        {/* Player Info */}
        <View className='flex-1'>
          <View className='flex-row items-center justify-between mb-1'>
            <Text className='text-gray-800 text-lg font-bold'>
              {player.name} {player.lastName}
            </Text>
            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
          </View>

          <Text className='text-gray-600 text-sm mb-2 capitalize'>
            {player.position}
          </Text>

          {/* Player Stats */}
          <View className='flex-row justify-between'>
            <View className='items-center'>
              <Text className='text-gray-500 text-xs'>GOALS</Text>
              <Text className='text-gray-800 font-bold'>
                {player.totalGoals || 0}
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-500 text-xs'>ASSISTS</Text>
              <Text className='text-gray-800 font-bold'>
                {player.totalAssists || 0}
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-500 text-xs'>PASSES</Text>
              <Text className='text-gray-800 font-bold'>
                {player.totalPassesCompleted || 0}
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-500 text-xs'>AGE</Text>
              <Text className='text-gray-800 font-bold'>{player.age}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  // Show loading state
  if (isLoading) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center'>
          <Text className='text-white text-lg'>Loading players...</Text>
        </View>
      </LinearGradient>
    )
  }

  // Show error state
  if (error) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center px-4'>
          <Text className='text-white text-lg text-center mb-4'>
            Error loading players
          </Text>
          <Text className='text-white/80 text-sm text-center mb-6'>
            {error}
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            className='bg-white/20 px-6 py-3 rounded-lg'
          >
            <Text className='text-white font-semibold'>Try Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  // Show no team state
  if (!userOrganization) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center px-4'>
          <Text className='text-white text-lg text-center mb-4'>
            No team assigned
          </Text>
          <Text className='text-white/80 text-sm text-center'>
            Contact your administrator to join a team.
          </Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
      <View className='flex-1'>
        {/* Header */}
        <View className='px-4 py-9'>
          <View className='flex-row items-center justify-between mb-4'>
            <View>
              <Text className='text-white text-2xl font-bold mb-2'>
                <Ionicons name='people' size={24} color='white' /> Team Players
              </Text>
              <Text className='text-white/80 text-sm'>
                {userOrganization.name} • {filteredPlayers.length} players
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className='bg-white/20 rounded-lg px-4 py-3 flex-row items-center'>
            <Ionicons name='search' size={20} color='white' />
            <TextInput
              placeholder='Search players by name, position, or number...'
              placeholderTextColor='rgba(255,255,255,0.7)'
              value={searchQuery}
              onChangeText={setSearchQuery}
              className='flex-1 ml-3 text-white'
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name='close-circle' size={20} color='white' />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Players List */}
        <View className='flex-1 bg-white rounded-t-3xl pt-6'>
          {filteredPlayers.length > 0 ? (
            <FlatList
              data={filteredPlayers}
              renderItem={renderPlayerCard}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor='#EF4444'
                  colors={['#EF4444']}
                />
              }
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className='flex-1 items-center justify-center px-4'>
              <Ionicons name='people-outline' size={64} color='#9CA3AF' />
              <Text className='text-gray-600 text-lg font-semibold mt-4 mb-2'>
                {searchQuery ? 'No players found' : 'No players in this team'}
              </Text>
              <Text className='text-gray-400 text-sm text-center'>
                {searchQuery
                  ? `No players match "${searchQuery}". Try a different search.`
                  : 'Contact your administrator to add players to the team.'}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  className='bg-red-500 px-4 py-2 rounded-lg mt-4'
                >
                  <Text className='text-white font-semibold'>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  )
}
