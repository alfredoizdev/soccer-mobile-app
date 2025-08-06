import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CircularProgress } from '../../components/CircularProgress'

export default function Index() {
  // Mock data for team statistics
  const teamStats = {
    wins: 10,
    losses: 9,
    draws: 3,
    totalGames: 22,
    winRate: 45.5, // (10/22) * 100
    drawRate: 13.6, // (3/22) * 100
    lossRate: 40.9, // (9/22) * 100
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className='flex-1 bg-gray-50'
    >
      <ScrollView className='flex-1'>
        <View className='p-6'>
          {/* Team Shield Card */}
          <View className='bg-white rounded-xl shadow-lg p-6 mb-6'>
            <View className='items-center mb-4'>
              <Image
                source={require('../../assets/images/hustoniasfc.png')}
                className='w-24 h-24 rounded-full'
                resizeMode='contain'
              />
            </View>

            <Text className='text-2xl font-roboto-bold text-center text-gray-900 mb-2'>
              Houstonias FC
            </Text>

            {/* Win/Loss/Draw Stats */}
            <View className='flex-row justify-center gap-4'>
              <View className='items-center'>
                <Text className='text-2xl font-roboto-black text-gray-900'>
                  {teamStats.wins}
                </Text>
                <Text className='text-sm font-roboto-light text-gray-500'>
                  Wins
                </Text>
              </View>

              <View className='items-center'>
                <Text className='text-2xl font-roboto-black text-gray-900'>
                  {teamStats.losses}
                </Text>
                <Text className='text-sm font-roboto-light text-gray-500'>
                  Losses
                </Text>
              </View>

              <View className='items-center'>
                <Text className='text-2xl font-roboto-black text-gray-900'>
                  {teamStats.draws}
                </Text>
                <Text className='text-sm font-roboto-light text-gray-500'>
                  Draws
                </Text>
              </View>
            </View>
          </View>

          {/* Win Rate and Draw Rate Charts */}
          <View className='bg-white rounded-xl shadow-lg p-6 mb-6'>
            <Text className='text-xl font-roboto-bold text-gray-900 mb-4'>
              Season Performance
            </Text>

            <View className='flex-row space-x-4'>
              {/* Win Rate Chart */}
              <View className='flex-1 items-center'>
                <CircularProgress
                  percentage={teamStats.winRate}
                  color='#FF6B35'
                  size={100}
                />
                <Text className='text-sm font-roboto-light text-gray-500 mt-2'>
                  Win Rate
                </Text>
              </View>

              {/* Draw Rate Chart */}
              <View className='flex-1 items-center'>
                <CircularProgress
                  percentage={teamStats.drawRate}
                  color='#FF6B35'
                  size={100}
                />
                <Text className='text-sm font-roboto-light text-gray-500 mt-2'>
                  Draw Rate
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
