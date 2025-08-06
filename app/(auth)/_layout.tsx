import { Redirect, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native'

export default function AuthLayout() {
  const isAuthenticated = true

  if (isAuthenticated) {
    return <Redirect href='/(tabs)' />
  }

  return (
    <SafeAreaView>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  )
}
