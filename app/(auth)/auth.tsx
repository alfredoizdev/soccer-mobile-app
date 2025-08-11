import { Redirect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { LoginForm } from '../../components/auth/login-form'
import { RegisterForm } from '../../components/auth/register-form'
import { useAuthStore } from '../../stores/auth-store'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // If user is authenticated, redirect to main app
  if (isAuthenticated) {
    return <Redirect href='/(tabs)' />
  }

  return (
    <View style={styles.container}>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
})

// Default export for Expo Router
export default Auth
