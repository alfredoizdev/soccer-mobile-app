import { Stack } from 'expo-router'
import { useEffect, useRef } from 'react'
import LoadingScreen from '../components/loading-screen'
import { useAuthStore } from '../stores/auth-store'
import './global.css'

export default function RootLayout() {
  const { initialize, isLoading, isAuthenticated } = useAuthStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      initialize()
    }
  }, [initialize])

  // Show loading screen only during initial load, not after login
  if (isLoading && !isAuthenticated) {
    return <LoadingScreen />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  )
}
