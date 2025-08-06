import { Redirect, Slot } from 'expo-router'

export default function TabsLayout() {
  const isAuthenticated = true

  if (!isAuthenticated) {
    return <Redirect href='/sign-in' />
  }

  return <Slot />
}
