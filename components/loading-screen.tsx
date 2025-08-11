import { View, Text, ActivityIndicator } from 'react-native'

export default function LoadingScreen() {
  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <ActivityIndicator size='large' color='#d7b157' />
      <Text className='mt-4 text-gray-600 text-lg'>Loading...</Text>
    </View>
  )
}
