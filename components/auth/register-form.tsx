import React, { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuthStore } from '../../stores/auth-store'
import { ToastService } from '../../services/toast-service'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { register, isLoading, error, clearError } = useAuthStore()

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      ToastService.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      ToastService.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      ToastService.error('Password must be at least 6 characters long')
      return
    }

    try {
      clearError()
      await register({
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      })
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
            Create Account
          </Text>
          <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>
            Sign up to get started
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            First Name
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
            placeholder='Enter your first name'
            value={name}
            onChangeText={setName}
            autoCapitalize='words'
            autoCorrect={false}
          />
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Last Name
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
            placeholder='Enter your last name'
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize='words'
            autoCorrect={false}
          />
        </View>

        <View style={{ marginBottom: 15 }}>
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

        <View style={{ marginBottom: 15 }}>
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
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Confirm Password
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
            placeholder='Confirm your password'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
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
          onPress={handleRegister}
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
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: '#666', fontSize: 14 }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={{ color: '#d7b157', fontSize: 14, fontWeight: '600' }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
