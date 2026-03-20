import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Image, Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Avatar from '../components/Avatar'
import { Colors } from '../utils/colors'
import { generateId } from '../utils/store'

export default function AddPersonScreen({ navigation, route, groups, onSave, onUpdate }) {
  const editPerson = route.params?.editPerson
  const isEdit = !!editPerson
  const insets = useSafeAreaInsets()

  const [name, setName] = useState(editPerson?.name || '')
  const [context, setContext] = useState(editPerson?.context || '')
  const [notes, setNotes] = useState(editPerson?.notes || '')
  const [location, setLocation] = useState(editPerson?.location || '')
  const [photo, setPhoto] = useState(editPerson?.photo || '')
  const [groupIds, setGroupIds] = useState(editPerson?.groupIds || [])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled) {
      setPhoto(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take photos.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled) {
      setPhoto(result.assets[0].uri)
    }
  }

  const handlePhotoPress = () => {
    Alert.alert('Add Photo', 'Choose a source', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const handleSave = () => {
    if (!name.trim()) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (isEdit) {
      onUpdate(editPerson.id, { name: name.trim(), context, notes, location, photo, groupIds })
    } else {
      onSave({
        id: generateId(),
        name: name.trim(),
        context,
        notes,
        location,
        photo,
        groupIds,
        starred: false,
        createdAt: new Date().toISOString(),
      })
    }
    navigation.goBack()
  }

  const toggleGroup = (gid) => {
    Haptics.selectionAsync()
    setGroupIds((prev) =>
      prev.includes(gid) ? prev.filter((id) => id !== gid) : [...prev, gid]
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.blue} />
          <Text style={styles.headerBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Person' : 'New Person'}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!name.trim()}
          style={styles.headerBtn}
        >
          <Text style={[styles.saveBtn, !name.trim() && { opacity: 0.3 }]}>
            {isEdit ? 'Save' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo */}
          <TouchableOpacity style={styles.photoBtn} onPress={handlePhotoPress} activeOpacity={0.7}>
            {photo ? (
              <View>
                <Avatar name={name || 'New'} photo={photo} size={96} />
                <View style={styles.photoRemove}>
                  <Ionicons name="close" size={12} color="#FFF" />
                </View>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={24} color={Colors.gray} />
                <Text style={styles.photoText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Name & Context fields */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name *"
              placeholderTextColor="rgba(142,142,147,0.6)"
              autoFocus
              returnKeyType="next"
            />
            <View style={styles.separator} />
            <TextInput
              style={styles.input}
              value={context}
              onChangeText={setContext}
              placeholder="How did you meet? (e.g. Coffee shop)"
              placeholderTextColor="rgba(142,142,147,0.6)"
              returnKeyType="next"
            />
            <View style={styles.separator} />
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={Colors.gray} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={location}
                onChangeText={setLocation}
                placeholder="Location (optional)"
                placeholderTextColor="rgba(142,142,147,0.6)"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes — details to help you remember..."
              placeholderTextColor="rgba(142,142,147,0.6)"
              multiline
            />
          </View>

          {/* Groups */}
          {groups.length > 0 && (
            <View style={styles.groupSection}>
              <Text style={styles.sectionLabel}>ADD TO GROUPS</Text>
              <View style={styles.groupChips}>
                {groups.map((g) => {
                  const selected = groupIds.includes(g.id)
                  return (
                    <TouchableOpacity
                      key={g.id}
                      onPress={() => toggleGroup(g.id)}
                      style={[
                        styles.chip,
                        selected && { backgroundColor: Colors.blue },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selected && { color: '#FFF' },
                        ]}
                      >
                        {g.emoji} {g.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  headerBtnText: {
    color: Colors.blue,
    fontSize: 17,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  saveBtn: {
    color: Colors.blue,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
    width: 80,
  },
  content: {
    padding: 16,
    paddingTop: 24,
    gap: 20,
  },
  photoBtn: {
    alignSelf: 'center',
  },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoText: {
    fontSize: 11,
    color: Colors.gray,
  },
  photoRemove: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: Colors.text,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    gap: 8,
  },
  groupSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  groupChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
})
