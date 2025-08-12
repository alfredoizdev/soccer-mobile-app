import { getTeamAbbreviation } from '@/lib/helpers/team-helpers'
import { Image, Text, View } from 'react-native'

interface EventScoreProps {
  event: any
}

export function EventScore({ event }: EventScoreProps) {
  if (event?.status !== 'inactive') {
    return null
  }

  return (
    <View
      style={{
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center', flex: 1 }}>
        {(event as any)?.team1?.avatar || (event as any)?.homeTeam?.avatar ? (
          <Image
            source={{
              uri:
                (event as any)?.team1?.avatar ||
                (event as any)?.homeTeam?.avatar,
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginBottom: 8,
            }}
          />
        ) : (
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {getTeamAbbreviation(
                (event as any)?.team1?.name ||
                  (event as any)?.homeTeam?.name ||
                  'H'
              )}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937' }}>
          {(event as any)?.team1Goals || (event as any)?.homeTeam?.score || 0}
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6B7280' }}>
        VS
      </Text>

      <View style={{ alignItems: 'center', flex: 1 }}>
        {(event as any)?.team2?.avatar || (event as any)?.awayTeam?.avatar ? (
          <Image
            source={{
              uri:
                (event as any)?.team2?.avatar ||
                (event as any)?.awayTeam?.avatar,
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginBottom: 8,
            }}
          />
        ) : (
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {getTeamAbbreviation(
                (event as any)?.team2?.name ||
                  (event as any)?.awayTeam?.name ||
                  'A'
              )}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937' }}>
          {(event as any)?.team2Goals || (event as any)?.awayTeam?.score || 0}
        </Text>
      </View>
    </View>
  )
}
