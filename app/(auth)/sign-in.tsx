import { router } from 'expo-router'
import { Button, Text, View } from 'react-native'

const SignIn = () => {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text>Sign In</Text>
      <Button
        title='Sign In'
        onPress={() => router.push('/sign-up')}
        color='blue'
      />
    </View>
  )
}

export default SignIn
