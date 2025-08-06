import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Navbar } from '../components/Navbar'
import './global.css'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          header: () => <Navbar />,
        }}
      />
    </SafeAreaProvider>
  )
}
