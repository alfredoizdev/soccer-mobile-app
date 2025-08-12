import { Text, View } from 'react-native'
import { Player } from '../../services/organization-service'

interface PlayerPerformanceProps {
  player: Player
  averageRating: string
  conversionRate: number
}

export function PlayerPerformance({ player, averageRating, conversionRate }: PlayerPerformanceProps) {
  return (
    <View className='px-6 mb-8'>
      <View className='flex-row items-center justify-between mb-6'>
        {/* Average Rating Circle */}
        <View className='items-center'>
          <View className='relative w-32 h-32 items-center justify-center mb-8'>
            {/* Background circle */}
            <View className='absolute w-32 h-32 rounded-full border-8 border-gray-700' />

            {/* Progress circle based on average rating */}
            <View
              className='absolute w-32 h-32 rounded-full border-8'
              style={{
                borderTopColor: '#10B981', // Green color
                borderRightColor:
                  parseFloat(averageRating) > 1.5
                    ? '#10B981'
                    : '#374151',
                borderBottomColor:
                  parseFloat(averageRating) > 3.0
                    ? '#10B981'
                    : '#374151',
                borderLeftColor:
                  parseFloat(averageRating) > 4.5
                    ? '#10B981'
                    : '#374151',
              }}
            />

            <View className='items-center'>
              <Text className='text-white text-xs mb-1'>AVERAGE</Text>
              <Text className='text-white text-4xl font-bold'>
                {averageRating}
              </Text>
            </View>
          </View>

          {/* Goal Conversion Rate Circle - Below Average */}
          <View className='relative w-32 h-32 items-center justify-center'>
            {/* Background circle */}
            <View className='absolute w-32 h-32 rounded-full border-8 border-gray-700' />

            {/* Progress circle based on conversion rate */}
            <View
              className='absolute w-32 h-32 rounded-full border-8'
              style={{
                borderTopColor: '#d7b157', // Yellow color
                borderRightColor:
                  conversionRate > 25 ? '#d7b157' : '#374151',
                borderBottomColor:
                  conversionRate > 50 ? '#d7b157' : '#374151',
                borderLeftColor:
                  conversionRate > 75 ? '#d7b157' : '#374151',
              }}
            />

            <View className='items-center'>
              <Text className='text-white text-xs mb-1'>CONVERSION</Text>
              <Text className='text-white text-4xl font-bold'>
                {conversionRate.toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Column */}
        <View className='flex-1 ml-8'>
          {/* Goals */}
          <View className='mb-4'>
            <Text className='text-white text-xs mb-2'>GOALS</Text>
            <View className='flex-row items-center'>
              <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                <View
                  className='h-2 bg-green-400 rounded-full'
                  style={{
                    width: `${Math.min(100, (player.totalGoals || 0) * 5)}%`,
                  }}
                />
              </View>
              <View className='w-8 h-6 bg-green-400 rounded items-center justify-center'>
                <Text className='text-white text-xs font-bold'>
                  {player.totalGoals || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Assists */}
          <View className='mb-4'>
            <Text className='text-white text-xs mb-2'>ASSISTS</Text>
            <View className='flex-row items-center'>
              <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                <View
                  className='h-2 bg-green-400 rounded-full'
                  style={{
                    width: `${Math.min(100, (player.totalAssists || 0) * 8)}%`,
                  }}
                />
              </View>
              <View className='w-8 h-6 bg-green-400 rounded items-center justify-center'>
                <Text className='text-white text-xs font-bold'>
                  {player.totalAssists || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Passes */}
          <View className='mb-4'>
            <Text className='text-white text-xs mb-2'>PASSES</Text>
            <View className='flex-row items-center'>
              <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                <View
                  className='h-2 bg-yellow-400 rounded-full'
                  style={{
                    width: `${Math.min(100, (player.totalPassesCompleted || 0) * 2)}%`,
                  }}
                />
              </View>
              <View className='w-8 h-6 bg-yellow-400 rounded items-center justify-center'>
                <Text className='text-black text-xs font-bold'>
                  {player.totalPassesCompleted || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Performance Rating */}
          <View className='mb-4'>
            <Text className='text-white text-xs mb-2'>PERFORMANCE</Text>
            <View className='flex-row items-center'>
              <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                <View
                  className='h-2 bg-green-400 rounded-full'
                  style={{
                    width: `${parseFloat(averageRating) * 20}%`,
                  }}
                />
              </View>
              <View className='w-8 h-6 bg-green-400 rounded items-center justify-center'>
                <Text className='text-white text-xs font-bold'>
                  {Math.round(parseFloat(averageRating) * 20)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}