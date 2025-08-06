import { usePathname } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface NavbarProps {
  title?: string
}

export function Navbar({ title }: NavbarProps) {
  const pathname = usePathname()

  // Get page title based on pathname
  const getPageTitle = () => {
    if (title) return title

    switch (pathname) {
      case '/':
      case '/index':
        return 'Home'
      case '/profile':
        return 'Profile'
      case '/matches':
        return 'Matches'
      case '/stats':
        return 'Statistics'
      default:
        // Capitalize first letter and remove slashes
        return pathname
          .replace('/', '')
          .replace('-', ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
    }
  }

  return (
    <SafeAreaView edges={['top']} className='bg-white'>
      <View className='border-b border-gray-200 px-6 py-4'>
        <Text className='text-2xl font-roboto-bold text-gray-900'>
          {getPageTitle()}
        </Text>
      </View>
    </SafeAreaView>
  )
}
