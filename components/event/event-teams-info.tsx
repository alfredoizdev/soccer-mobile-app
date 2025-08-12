import { getTeamAbbreviation } from '@/lib/helpers/team-helpers'
import { Image, Text, View } from 'react-native'

interface EventTeamsInfoProps {
  event: any
}

export function EventTeamsInfo({ event }: EventTeamsInfoProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}
    >
      {/* Team 1 */}
      <View style={{ alignItems: 'center', flex: 1 }}>
        {(event as any)?.team1?.avatar || (event as any)?.homeTeam?.avatar ? (
          <Image
            source={{
              uri:
                (event as any)?.team1?.avatar ||
                (event as any)?.homeTeam?.avatar,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginBottom: 4,
            }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {getTeamAbbreviation(
                (event as any)?.team1?.name ||
                  (event as any)?.homeTeam?.name ||
                  'Team 1'
              )}
            </Text>
          </View>
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1F2937',
            textAlign: 'center',
          }}
        >
          {getTeamAbbreviation(
            (event as any)?.team1?.name ||
              (event as any)?.homeTeam?.name ||
              'Team 1'
          )}
        </Text>
      </View>

      {/* VS */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#6B7280',
          marginHorizontal: 16,
        }}
      >
        VS
      </Text>

      {/* Team 2 */}
      <View style={{ alignItems: 'center', flex: 1 }}>
        {(event as any)?.team2?.avatar || (event as any)?.awayTeam?.avatar ? (
          <Image
            source={{
              uri:
                (event as any)?.team2?.avatar ||
                (event as any)?.awayTeam?.avatar,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginBottom: 4,
            }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {getTeamAbbreviation(
                (event as any)?.team2?.name ||
                  (event as any)?.awayTeam?.name ||
                  'Team 2'
              )}
            </Text>
          </View>
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1F2937',
            textAlign: 'center',
          }}
        >
          {getTeamAbbreviation(
            (event as any)?.team2?.name ||
              (event as any)?.awayTeam?.name ||
              'Team 2'
          )}
        </Text>
      </View>
    </View>
  )
}
