import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

interface LoadingScreenProps {
  message?: string
  size?: 'small' | 'large'
  color?: string
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  size = 'large',
  color = '#d7b157',
}) => {
  return (
    <View className='flex-1 justify-center items-center bg-gray-50'>
      <ActivityIndicator size={size} color={color} />
      <Text className='text-gray-600 mt-4 text-center'>{message}</Text>
    </View>
  )
}

export default LoadingScreen
