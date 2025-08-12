import React from 'react'
import { Text, View } from 'react-native'
import { BaseToast, ErrorToast } from 'react-native-toast-message'

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#10B981',
        backgroundColor: '#F0FDF4',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#065F46',
      }}
      text2Style={{
        fontSize: 14,
        color: '#047857',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#EF4444',
        backgroundColor: '#FEF2F2',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#991B1B',
      }}
      text2Style={{
        fontSize: 14,
        color: '#DC2626',
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#1E40AF',
      }}
      text2Style={{
        fontSize: 14,
        color: '#2563EB',
      }}
    />
  ),
  // Toast personalizado con NativeWind
  custom: ({ text1, text2, ...props }: any) => (
    <View className="mx-4 mt-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <View className="p-4">
        <Text className="text-gray-900 font-semibold text-base mb-1">
          {text1}
        </Text>
        {text2 && (
          <Text className="text-gray-600 text-sm">
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
}