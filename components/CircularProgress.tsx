import { Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

interface CircularProgressProps {
  percentage: number
  color: string
  size?: number
}

export function CircularProgress({
  percentage,
  color,
  size = 80,
}: CircularProgressProps) {
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <View className='items-center'>
      <View
        style={{ width: size, height: size }}
        className='relative items-center justify-center'
      >
        <Svg width={size} height={size}>
          {/* Background circle - black */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='#000000'
            strokeWidth={8}
            fill='transparent'
          />
          {/* Progress circle - modern orange */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='#FF6B35'
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            fill='transparent'
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {/* Percentage text - black */}
        <Text className='text-xl font-roboto-bold text-black absolute'>
          {percentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  )
}
