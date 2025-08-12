import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useOrganizationStore } from '../stores/organization-store'
import { ToastService } from '../services/toast-service'

interface TeamHeaderProps {
  organization: {
    id: string
    name: string
    description: string
    avatar?: string
    playerCount?: number
    createdAt: string
  }
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ organization }) => {
  const { unsubscribeFromTeam, isLoading } = useOrganizationStore()

  const handleUnsubscribe = async () => {
    try {
      await unsubscribeFromTeam()
      ToastService.success(`You have unsubscribed from ${organization.name}`)
    } catch (error) {
      ToastService.error(
        error instanceof Error
          ? error.message
          : 'Failed to unsubscribe from team'
      )
    }
  }

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: '#F3F4F6'
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        {/* Team Logo - Large and prominent */}
        {organization.avatar ? (
          <Image
            source={{ uri: organization.avatar }}
            style={{ width: 112, height: 112, borderRadius: 24, marginRight: 24 }}
            resizeMode='cover'
          />
        ) : (
          <LinearGradient
            colors={['#EF4444', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 112,
              height: 112,
              borderRadius: 24,
              marginRight: 24,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8
            }}
          >
            <Text style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>
              {organization.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 }}>
            {organization.name}
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 18, lineHeight: 28, marginBottom: 16 }}>
            {organization.description}
          </Text>
          {organization.playerCount && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 25
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  {organization.playerCount}{' '}
                  {organization.playerCount === 1 ? 'Player' : 'Players'}
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </View>

      {/* Unsubscribe Button */}
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        <TouchableOpacity
          onPress={handleUnsubscribe}
          disabled={isLoading}
          activeOpacity={0.8}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {isLoading ? 'Unsubscribing...' : 'Unsubscribe from Team'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default TeamHeader
