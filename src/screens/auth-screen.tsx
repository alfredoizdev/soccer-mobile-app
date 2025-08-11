import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { LoginForm } from '../components/auth/login-form'
import { RegisterForm } from '../components/auth/register-form'
import { useAuthStore } from '../stores/auth-store'

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, initialize, isLoading } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // If user is authenticated, you can redirect to main app
  // This would typically be handled by navigation
  if (isAuthenticated) {
    return null // or redirect to main app
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
