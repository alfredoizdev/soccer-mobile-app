import { Ionicons } from '@expo/vector-icons'
import { Redirect, Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../stores/auth-store'

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Redirect href='/(auth)/auth' />
  }

  return (
    <SafeAreaView className='flex-1'>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#d7b157',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            headerShown: false,
            title: 'Home',
            tabBarStyle: {
              paddingTop: 10,
              shadowColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='home' size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='teams'
          options={{
            headerShown: false,
            title: 'Teams',
            tabBarStyle: {
              paddingTop: 10,
              shadowColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='people' size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='players'
          options={{
            headerShown: false,
            title: 'Players',
            tabBarStyle: {
              paddingTop: 10,
              shadowColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='person' size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='events'
          options={{
            headerShown: false,
            title: 'Games',
            tabBarStyle: {
              paddingTop: 10,
              shadowColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='football' size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}
