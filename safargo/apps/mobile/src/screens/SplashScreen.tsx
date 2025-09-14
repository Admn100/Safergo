import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export function SplashScreen() {
  return (
    <LinearGradient
      colors={['#006233', '#004422']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo-white.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
})