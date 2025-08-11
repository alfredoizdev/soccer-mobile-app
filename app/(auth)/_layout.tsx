import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
  const isAuthenticated = false

  // Use Redirect component instead of router.replace
  if (isAuthenticated) {
    return <Redirect href='/(tabs)' />
  }

  return (
    <Stack>
      <Stack.Screen name='auth' options={{ headerShown: false }} />
      <Stack.Screen name='users' options={{ headerShown: false }} />
    </Stack>
  )
}
