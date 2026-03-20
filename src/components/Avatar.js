import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { getInitials, getAvatarColor } from '../utils/store'

export default function Avatar({ name, photo, size = 44 }) {
  const initials = getInitials(name)
  const color = getAvatarColor(name)

  if (photo) {
    return (
      <Image
        source={{ uri: photo }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    )
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
