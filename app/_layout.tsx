import { Stack } from 'expo-router'
import { useEffect, useRef } from 'react'
import Toast from 'react-native-toast-message'
import LoadingScreen from '../components/loading-screen'
import { useAuthStore } from '../stores/auth-store'
import { toastConfig } from '../components/ui/toast-config'
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
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  )
}
