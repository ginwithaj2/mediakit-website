import React, { useState, useEffect, useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { loadData, saveData } from './src/utils/store'
import { Colors } from './src/utils/colors'

import PeopleScreen from './src/screens/PeopleScreen'
import AddPersonScreen from './src/screens/AddPersonScreen'
import PersonDetailScreen from './src/screens/PersonDetailScreen'
import GroupsScreen from './src/screens/GroupsScreen'
import AddGroupScreen from './src/screens/AddGroupScreen'
import GroupDetailScreen from './src/screens/GroupDetailScreen'
import PracticeScreen from './src/screens/PracticeScreen'

const Tab = createBottomTabNavigator()

function PeopleStack({ people, groups, addPerson, updatePerson, deletePerson }) {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PeopleList">
        {(props) => <PeopleScreen {...props} people={people} />}
      </Stack.Screen>
      <Stack.Screen name="PersonDetail">
        {(props) => (
          <PersonDetailScreen
            {...props}
            people={people}
            groups={groups}
            onUpdate={updatePerson}
            onDelete={deletePerson}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddPerson">
        {(props) => (
          <AddPersonScreen
            {...props}
            groups={groups}
            onSave={addPerson}
            onUpdate={updatePerson}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

function GroupsStack({ groups, people, addGroup, updateGroup, deleteGroup }) {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GroupsList">
        {(props) => <GroupsScreen {...props} groups={groups} people={people} />}
      </Stack.Screen>
      <Stack.Screen name="GroupDetail">
        {(props) => (
          <GroupDetailScreen
            {...props}
            groups={groups}
            people={people}
            onUpdate={updateGroup}
            onDelete={deleteGroup}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddGroup">
        {(props) => <AddGroupScreen {...props} people={people} onSave={addGroup} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default function App() {
  const [data, setData] = useState({ people: [], groups: [] })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadData().then((d) => {
      setData(d)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (loaded) saveData(data)
  }, [data, loaded])

  const addPerson = useCallback((person) => {
    setData((d) => ({ ...d, people: [...d.people, person] }))
  }, [])

  const updatePerson = useCallback((id, updates) => {
    setData((d) => ({
      ...d,
      people: d.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }, [])

  const deletePerson = useCallback((id) => {
    setData((d) => ({
      ...d,
      people: d.people.filter((p) => p.id !== id),
      groups: d.groups.map((g) => ({
        ...g,
        memberIds: (g.memberIds || []).filter((mid) => mid !== id),
      })),
    }))
  }, [])

  const addGroup = useCallback((group) => {
    setData((d) => ({ ...d, groups: [...d.groups, group] }))
  }, [])

  const updateGroup = useCallback((id, updates) => {
    setData((d) => ({
      ...d,
      groups: d.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }))
  }, [])

  const deleteGroup = useCallback((id) => {
    setData((d) => ({ ...d, groups: d.groups.filter((g) => g.id !== id) }))
  }, [])

  if (!loaded) return null

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName
              if (route.name === 'People') iconName = focused ? 'people' : 'people-outline'
              else if (route.name === 'Groups') iconName = focused ? 'folder' : 'folder-outline'
              else if (route.name === 'Practice') iconName = focused ? 'fitness' : 'fitness-outline'
              return <Ionicons name={iconName} size={22} color={color} />
            },
            tabBarActiveTintColor: Colors.blue,
            tabBarInactiveTintColor: Colors.gray,
            tabBarStyle: {
              backgroundColor: 'rgba(255,255,255,0.72)',
              borderTopColor: Colors.border,
              position: 'absolute',
              elevation: 0,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen name="People">
            {() => (
              <PeopleStack
                people={data.people}
                groups={data.groups}
                addPerson={addPerson}
                updatePerson={updatePerson}
                deletePerson={deletePerson}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Groups">
            {() => (
              <GroupsStack
                groups={data.groups}
                people={data.people}
                addGroup={addGroup}
                updateGroup={updateGroup}
                deleteGroup={deleteGroup}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Practice">
            {() => <PracticeScreen people={data.people} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  )
}
