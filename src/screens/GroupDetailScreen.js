import React from 'react'
import {
  View, Text, FlatList, TouchableOpacity, Alert, StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Avatar from '../components/Avatar'
import { Colors } from '../utils/colors'

export default function GroupDetailScreen({ navigation, route, groups, people, onDelete }) {
  const insets = useSafeAreaInsets()
  const group = groups.find((g) => g.id === route.params.id)

  if (!group) {
    navigation.goBack()
    return null
  }

  const members = people.filter(
    (p) => group.memberIds?.includes(p.id) || p.groupIds?.includes(group.id)
  )

  const handleDelete = () => {
    Alert.alert(
      `Delete "${group.name}"?`,
      'Members will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Group',
          style: 'destructive',
          onPress: () => {
            onDelete(group.id)
            navigation.goBack()
          },
        },
      ]
    )
  }

  const renderMember = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.memberRow, index > 0 && styles.memberBorder]}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('PersonDetail', { id: item.id })}
    >
      <Avatar name={item.name} photo={item.photo} size={44} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName} numberOfLines={1}>{item.name}</Text>
        {item.context ? (
          <Text style={styles.memberContext} numberOfLines={1}>{item.context}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.lightGray} />
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.blue} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={Colors.red} />
        </TouchableOpacity>
      </View>

      {/* Group info */}
      <View style={styles.groupInfo}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{group.emoji || '👥'}</Text>
        </View>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.memberCount}>
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </Text>
      </View>

      {members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No members yet. Add people and assign them to this group.
          </Text>
        </View>
      )}
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
  groupInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emojiBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 36,
  },
  groupName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  memberCount: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  memberBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
  memberContext: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
})
