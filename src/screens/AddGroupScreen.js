import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Avatar from '../components/Avatar'
import { Colors } from '../utils/colors'
import { generateId } from '../utils/store'

const EMOJI_OPTIONS = ['👥', '💼', '🏋️', '🏠', '☕', '🎓', '🎉', '⛪', '🏀', '🎵', '✈️', '🍕']

export default function AddGroupScreen({ navigation, people, onSave }) {
  const insets = useSafeAreaInsets()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('👥')
  const [memberIds, setMemberIds] = useState([])

  const handleSave = () => {
    if (!name.trim()) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    onSave({
      id: generateId(),
      name: name.trim(),
      emoji,
      memberIds,
      createdAt: new Date().toISOString(),
    })
    navigation.goBack()
  }

  const toggleMember = (pid) => {
    Haptics.selectionAsync()
    setMemberIds((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.blue} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <TouchableOpacity onPress={handleSave} disabled={!name.trim()}>
          <Text style={[styles.saveBtn, !name.trim() && { opacity: 0.3 }]}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Emoji */}
        <View style={styles.emojiDisplay}>
          <View style={styles.emojiBox}>
            <Text style={styles.emojiLarge}>{emoji}</Text>
          </View>
        </View>
        <View style={styles.emojiGrid}>
          {EMOJI_OPTIONS.map((e) => (
            <TouchableOpacity
              key={e}
              onPress={() => { setEmoji(e); Haptics.selectionAsync() }}
              style={[styles.emojiOption, emoji === e && styles.emojiSelected]}
              activeOpacity={0.7}
            >
              <Text style={styles.emojiText}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Name */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Group name *"
            placeholderTextColor="rgba(142,142,147,0.6)"
            autoFocus
          />
        </View>

        {/* Members */}
        {people.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>ADD MEMBERS</Text>
            <View style={styles.card}>
              {people.map((p, i) => {
                const selected = memberIds.includes(p.id)
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => toggleMember(p.id)}
                    style={[
                      styles.memberRow,
                      i > 0 && styles.memberBorder,
                      selected && { backgroundColor: 'rgba(0,122,255,0.04)' },
                    ]}
                    activeOpacity={0.6}
                  >
                    <Avatar name={p.name} photo={p.photo} size={36} />
                    <Text style={styles.memberName}>{p.name}</Text>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      {selected && (
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  backText: {
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
    width: 80,
    textAlign: 'right',
  },
  content: {
    padding: 16,
    paddingTop: 24,
    gap: 20,
  },
  emojiDisplay: {
    alignItems: 'center',
  },
  emojiBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiLarge: {
    fontSize: 36,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  emojiOption: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiSelected: {
    backgroundColor: 'rgba(0,122,255,0.2)',
    transform: [{ scale: 1.1 }],
  },
  emojiText: {
    fontSize: 20,
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginLeft: 4,
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  memberBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  memberName: {
    flex: 1,
    fontSize: 17,
    color: Colors.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(142,142,147,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
})
