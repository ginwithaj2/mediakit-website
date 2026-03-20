import React, { useState, useMemo } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchBar from '../components/SearchBar'
import Avatar from '../components/Avatar'
import { Colors, GROUP_COLORS } from '../utils/colors'

export default function GroupsScreen({ navigation, groups, people }) {
  const [search, setSearch] = useState('')
  const insets = useSafeAreaInsets()

  const filtered = useMemo(() => {
    return groups.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [groups, search])

  const getMembers = (group) => {
    return people.filter(
      (p) => group.memberIds?.includes(p.id) || p.groupIds?.includes(group.id)
    )
  }

  const renderGroup = ({ item, index }) => {
    const color = GROUP_COLORS[index % GROUP_COLORS.length]
    const members = getMembers(item)
    return (
      <TouchableOpacity
        style={styles.groupCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('GroupDetail', { id: item.id })}
      >
        <View style={[styles.emojiBox, { backgroundColor: color + '18' }]}>
          <Text style={styles.emoji}>{item.emoji || '👥'}</Text>
        </View>
        <Text style={styles.groupName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.memberCount}>
          {members.length} {members.length === 1 ? 'person' : 'people'}
        </Text>
        {members.length > 0 && (
          <View style={styles.avatarRow}>
            {members.slice(0, 4).map((m) => (
              <View key={m.id} style={styles.miniAvatar}>
                <Avatar name={m.name} photo={m.photo} size={24} />
              </View>
            ))}
            {members.length > 4 && (
              <View style={styles.moreAvatar}>
                <Text style={styles.moreText}>+{members.length - 4}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <Text style={styles.subtitle}>Organize people by how you know them</Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search groups" />

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          {groups.length === 0 ? (
            <>
              <View style={styles.emptyIcon}>
                <Ionicons name="add" size={28} color={Colors.purple} />
              </View>
              <Text style={styles.emptyTitle}>No groups yet</Text>
              <Text style={styles.emptyText}>
                Create groups like "Work", "Gym", or "Neighborhood"
              </Text>
            </>
          ) : (
            <Text style={styles.emptyText}>No results found</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddGroup')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 12,
  },
  row: {
    gap: 12,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  groupCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emojiBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 20,
  },
  groupName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  memberCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  miniAvatar: {
    marginLeft: -4,
  },
  moreAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
  },
  moreText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(88,86,214,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
})
