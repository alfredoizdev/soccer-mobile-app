import { router } from 'expo-router'
import { Button, Text, View } from 'react-native'

const SignUp = () => {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text>Sign Up</Text>
      <Button
        title='Sign Up'
        onPress={() => router.push('/sign-in')}
        color='blue'
      />
    </View>
  )
}

export default SignUp
