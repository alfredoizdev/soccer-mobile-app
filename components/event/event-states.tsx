import { LinearGradient } from 'expo-linear-gradient'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface EventStatesProps {
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onBack: () => void
}

export function EventStates({
  isLoading,
  error,
  onRetry,
  onBack,
}: EventStatesProps) {
  if (isLoading) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <SafeAreaView className='flex-1'>
          <View className='flex-1 items-center justify-center'>
            <Text className='text-white text-lg'>Loading event...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  if (error) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <SafeAreaView className='flex-1'>
          <View className='flex-1 items-center justify-center px-4'>
            <Text className='text-white text-lg text-center mb-4'>
              Error loading event
            </Text>
            <Text className='text-white/80 text-sm text-center mb-6'>
              {error}
            </Text>
            <TouchableOpacity
              onPress={onRetry}
              className='bg-white/20 px-6 py-3 rounded-lg'
            >
              <Text className='text-white font-semibold'>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  return null
}
