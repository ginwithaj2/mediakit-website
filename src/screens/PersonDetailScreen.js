import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Avatar from '../components/Avatar'
import Card from '../components/Card'
import { Colors } from '../utils/colors'
import { timeAgo } from '../utils/store'

export default function PersonDetailScreen({ navigation, route, people, groups, onUpdate, onDelete }) {
  const insets = useSafeAreaInsets()
  const person = people.find((p) => p.id === route.params.id)

  if (!person) {
    navigation.goBack()
    return null
  }

  const personGroups = groups.filter(
    (g) => g.memberIds?.includes(person.id) || person.groupIds?.includes(g.id)
  )

  const handleStar = () => {
    Haptics.selectionAsync()
    onUpdate(person.id, { starred: !person.starred })
  }

  const handleDelete = () => {
    Alert.alert(
      `Delete ${person.name}?`,
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(person.id)
            navigation.goBack()
          },
        },
      ]
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
        <TouchableOpacity onPress={handleStar}>
          <Ionicons
            name={person.starred ? 'star' : 'star-outline'}
            size={22}
            color={person.starred ? Colors.orange : Colors.gray}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={styles.profile}>
          <Avatar name={person.name} photo={person.photo} size={96} />
          <Text style={styles.name}>{person.name}</Text>
          {person.context ? (
            <Text style={styles.contextText}>{person.context}</Text>
          ) : null}
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.timeText}>Added {timeAgo(person.createdAt)}</Text>
          </View>
        </View>

        {/* Location */}
        {person.location ? (
          <Card style={styles.infoCard}>
            <View style={styles.cardLabel}>
              <Ionicons name="location" size={16} color={Colors.blue} />
              <Text style={styles.labelText}>LOCATION</Text>
            </View>
            <Text style={styles.cardValue}>{person.location}</Text>
          </Card>
        ) : null}

        {/* Notes */}
        {person.notes ? (
          <Card style={styles.infoCard}>
            <Text style={styles.labelText}>NOTES</Text>
            <Text style={styles.cardValue}>{person.notes}</Text>
          </Card>
        ) : null}

        {/* Groups */}
        {personGroups.length > 0 && (
          <Card style={styles.infoCard}>
            <Text style={styles.labelText}>GROUPS</Text>
            <View style={styles.groupChips}>
              {personGroups.map((g) => (
                <View key={g.id} style={styles.chip}>
                  <Text style={styles.chipText}>{g.emoji} {g.name}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Actions */}
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AddPerson', { editPerson: person })}
        >
          <Ionicons name="pencil" size={18} color={Colors.blue} />
          <Text style={styles.actionText}>Edit Person</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.red} />
          <Text style={[styles.actionText, { color: Colors.red }]}>Delete</Text>
        </TouchableOpacity>

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
  },
  backText: {
    color: Colors.blue,
    fontSize: 17,
  },
  content: {
    padding: 16,
    paddingTop: 24,
    gap: 12,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  contextText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoCard: {
    padding: 16,
    gap: 6,
  },
  cardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  cardValue: {
    fontSize: 17,
    color: Colors.text,
    lineHeight: 24,
  },
  groupChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blue,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.blue,
  },
})
