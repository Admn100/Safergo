import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Rect, Path, G } from 'react-native-svg'

interface AlgeriaFlagProps {
  size?: number
}

export function AlgeriaFlag({ size = 40 }: AlgeriaFlagProps) {
  const width = size * 1.5
  const height = size

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 60 40">
        {/* Green half */}
        <Rect x="0" y="0" width="30" height="40" fill="#006233" />
        
        {/* White half */}
        <Rect x="30" y="0" width="30" height="40" fill="#FFFFFF" />
        
        {/* Star and crescent */}
        <G transform="translate(30,20)">
          {/* Crescent */}
          <Path
            d="M 0,-12 A 12,12 0 1,1 0,12 A 9.6,9.6 0 1,0 0,-12"
            fill="#D21034"
          />
          {/* Star */}
          <Path
            d="M 5,0 L 6.5,4.5 L 11,4.5 L 7.5,7.5 L 9,12 L 5,9 L 1,12 L 2.5,7.5 L -1,4.5 L 3.5,4.5 Z"
            fill="#D21034"
            transform="translate(4,0) scale(0.7)"
          />
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
})