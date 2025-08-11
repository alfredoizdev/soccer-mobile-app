import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuthStore } from '../../stores/auth-store'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login, isLoading, error, clearError } = useAuthStore()

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    try {
      clearError()
      await login({ email: email.trim(), password })
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            Welcome Back
          </Text>
          <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>
            Sign in to your account
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Email
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 15,
              fontSize: 16,
              backgroundColor: '#fff',
            }}
            placeholder='Enter your email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Password
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 15,
              fontSize: 16,
              backgroundColor: '#fff',
            }}
            placeholder='Enter your password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        {error && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{ color: '#ff4444', textAlign: 'center', fontSize: 14 }}
            >
              {error}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: '#d7b157',
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
            opacity: isLoading ? 0.7 : 1,
          }}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: '#666', fontSize: 14 }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={onSwitchToRegister}>
            <Text style={{ color: '#d7b157', fontSize: 14, fontWeight: '600' }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
