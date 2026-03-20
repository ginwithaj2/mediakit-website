import React, { useState, useMemo } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchBar from '../components/SearchBar'
import Avatar from '../components/Avatar'
import Card from '../components/Card'
import { Colors } from '../utils/colors'
import { timeAgo } from '../utils/store'

export default function PeopleScreen({ navigation, people }) {
  const [search, setSearch] = useState('')
  const insets = useSafeAreaInsets()

  const filtered = useMemo(() => {
    return people
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.notes || '').toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.starred && !b.starred) return -1
        if (!a.starred && b.starred) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [people, search])

  const renderPerson = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.row, index > 0 && styles.rowBorder]}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('PersonDetail', { id: item.id })}
    >
      <Avatar name={item.name} photo={item.photo} size={44} />
      <View style={styles.rowContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {item.starred && (
            <Ionicons name="star" size={12} color={Colors.orange} />
          )}
        </View>
        {item.context ? (
          <Text style={styles.context} numberOfLines={1}>{item.context}</Text>
        ) : null}
      </View>
      <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>People</Text>
        <Text style={styles.subtitle}>
          {people.length} {people.length === 1 ? 'person' : 'people'} remembered
        </Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search people" />

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          {people.length === 0 ? (
            <>
              <View style={styles.emptyIcon}>
                <Ionicons name="add" size={28} color={Colors.blue} />
              </View>
              <Text style={styles.emptyTitle}>No people yet</Text>
              <Text style={styles.emptyText}>
                Tap the + button to add someone you've met
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
          renderItem={renderPerson}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddPerson')}
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
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
    flexShrink: 1,
  },
  context: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  time: {
    fontSize: 12,
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
    backgroundColor: 'rgba(0,122,255,0.1)',
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
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
})
