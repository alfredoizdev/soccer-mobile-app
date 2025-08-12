import React, { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuthStore } from '../stores/auth-store'
import { useOrganizationStore } from '../stores/organization-store'
import { ToastService } from '../services/toast-service'

interface TeamCardProps {
  team: {
    id: string
    name: string
    description: string
    avatar?: string
    playerCount?: number
    createdAt: string
  }
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const { user } = useAuthStore()
  const { userOrganization, subscribeToTeam, unsubscribeFromTeam } =
    useOrganizationStore()

  // Check if user is subscribed to this team
  const isSubscribedToThisTeam = userOrganization?.id === team.id
  // Check if user is subscribed to any team
  const isSubscribedToAnyTeam = !!userOrganization

  const handleSubscribe = async () => {
    if (!user) {
      ToastService.error('You must be logged in to subscribe to a team')
      return
    }

    setIsSubscribing(true)
    try {
      // Subscribe to the team using the store
      await subscribeToTeam(team.id)

      ToastService.success(`You have successfully subscribed to ${team.name}!`)
    } catch (error) {
      console.error('Error subscribing to team:', error)
      ToastService.error(
        error instanceof Error ? error.message : 'Failed to subscribe to team'
      )
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleUnsubscribe = async () => {
    if (!user) {
      ToastService.error('You must be logged in to unsubscribe from a team')
      return
    }

    // Directly unsubscribe without confirmation for better UX with toast feedback
    setIsUnsubscribing(true)
    try {
      await unsubscribeFromTeam()
      ToastService.success(`You have unsubscribed from ${team.name}`)
    } catch (error) {
      console.error('Error unsubscribing from team:', error)
      ToastService.error(
        error instanceof Error
          ? error.message
          : 'Failed to unsubscribe from team'
      )
    } finally {
      setIsUnsubscribing(false)
    }
  }

  // If user is subscribed to this team, show subscribed state
  if (isSubscribedToThisTeam) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          marginBottom: 16,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: '#10B981',
        }}
      >
        {/* Team Logo */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {team.avatar && !imageError ? (
            <View style={{ position: 'relative' }}>
              {imageLoading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f3f4f6',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <ActivityIndicator size='large' color='#10B981' />
                </View>
              )}
              <Image
                source={{ uri: team.avatar }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode='cover'
                onError={(error) => {
                  setImageError(true)
                  setImageLoading(false)
                }}
                onLoad={() => {
                  setImageLoading(false)
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#10B981',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}
              >
                {team.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Team Info */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
            color: '#10B981',
          }}
        >
          {team.name} ✓
        </Text>

        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 20,
            color: '#666',
          }}
        >
          {team.description}
        </Text>

        {/* Subscribed Badge */}
        <View
          style={{
            backgroundColor: '#10B981',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
            ✓ Subscribed
          </Text>
        </View>

        {/* Unsubscribe Button */}
        <TouchableOpacity
          onPress={handleUnsubscribe}
          disabled={isUnsubscribing}
          style={{
            backgroundColor: isUnsubscribing ? '#9CA3AF' : '#EF4444',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
          activeOpacity={0.8}
        >
          {isUnsubscribing ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator
                size='small'
                color='white'
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
              >
                Unsubscribing...
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
              Unsubscribe from Team
            </Text>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  // If user is subscribed to another team, show disabled state
  if (isSubscribedToAnyTeam) {
    return (
      <View
        style={{
          backgroundColor: '#f3f4f6',
          padding: 20,
          marginBottom: 16,
          borderRadius: 16,
          opacity: 0.6,
        }}
      >
        {/* Team Logo */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {team.avatar && !imageError ? (
            <View style={{ position: 'relative' }}>
              {imageLoading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f3f4f6',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <ActivityIndicator size='large' color='#9CA3AF' />
                </View>
              )}
              <Image
                source={{ uri: team.avatar }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode='cover'
                onError={(error) => {
                  setImageError(true)
                  setImageLoading(false)
                }}
                onLoad={() => {
                  setImageLoading(false)
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#9CA3AF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}
              >
                {team.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Team Info */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
            color: '#9CA3AF',
          }}
        >
          {team.name}
        </Text>

        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 20,
            color: '#9CA3AF',
          }}
        >
          {team.description}
        </Text>

        {/* Disabled Message */}
        <View
          style={{
            backgroundColor: '#9CA3AF',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Already Subscribed to Another Team
          </Text>
        </View>
      </View>
    )
  }

  // Default state: user can subscribe to this team
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 16,
        borderRadius: 16,
      }}
    >
      {/* Team Logo - Simplificado */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        {team.avatar && !imageError ? (
          <View style={{ position: 'relative' }}>
            {imageLoading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <ActivityIndicator size='large' color='#EF4444' />
              </View>
            )}
            <Image
              source={{ uri: team.avatar }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode='cover'
              onError={(error) => {
                setImageError(true)
                setImageLoading(false)
              }}
              onLoad={() => {
                setImageLoading(false)
              }}
            />
          </View>
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>
              {team.name.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Team Info */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        {team.name}
      </Text>

      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 20,
          color: '#666',
        }}
      >
        {team.description}
      </Text>

      {/* Subscribe Button */}
      <TouchableOpacity
        onPress={handleSubscribe}
        disabled={isSubscribing}
        style={{
          backgroundColor: isSubscribing ? '#9CA3AF' : '#EF4444',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
        activeOpacity={0.8}
      >
        {isSubscribing ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator
              size='small'
              color='white'
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
              Subscribing...
            </Text>
          </View>
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
            Subscribe to this Team
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default TeamCard
