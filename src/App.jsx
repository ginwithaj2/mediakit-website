import { useState, useEffect, useCallback } from 'react'
import { loadData, saveData } from './store'
import TabBar from './components/TabBar'
import PeopleTab from './pages/PeopleTab'
import GroupsTab from './pages/GroupsTab'
import QuizTab from './pages/QuizTab'
import PersonDetail from './pages/PersonDetail'
import AddPerson from './pages/AddPerson'
import GroupDetail from './pages/GroupDetail'
import AddGroup from './pages/AddGroup'

export default function App() {
  const [data, setData] = useState(loadData)
  const [activeTab, setActiveTab] = useState('people')
  const [view, setView] = useState({ type: 'tab' })

  useEffect(() => {
    saveData(data)
  }, [data])

  const updateData = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return { ...prev, ...next }
    })
  }, [])

  const addPerson = useCallback((person) => {
    updateData((d) => ({ people: [...d.people, person] }))
    setView({ type: 'tab' })
  }, [updateData])

  const updatePerson = useCallback((id, updates) => {
    updateData((d) => ({
      people: d.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }, [updateData])

  const deletePerson = useCallback((id) => {
    updateData((d) => ({
      people: d.people.filter((p) => p.id !== id),
      groups: d.groups.map((g) => ({
        ...g,
        memberIds: g.memberIds.filter((mid) => mid !== id),
      })),
    }))
    setView({ type: 'tab' })
  }, [updateData])

  const addGroup = useCallback((group) => {
    updateData((d) => ({ groups: [...d.groups, group] }))
    setView({ type: 'tab' })
  }, [updateData])

  const updateGroup = useCallback((id, updates) => {
    updateData((d) => ({
      groups: d.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }))
  }, [updateData])

  const deleteGroup = useCallback((id) => {
    updateData((d) => ({ groups: d.groups.filter((g) => g.id !== id) }))
    setView({ type: 'tab' })
  }, [updateData])

  const navigate = useCallback((newView) => setView(newView), [])
  const goBack = useCallback(() => setView({ type: 'tab' }), [])

  const renderView = () => {
    switch (view.type) {
      case 'person-detail':
        return (
          <PersonDetail
            person={data.people.find((p) => p.id === view.id)}
            groups={data.groups}
            onBack={goBack}
            onUpdate={updatePerson}
            onDelete={deletePerson}
          />
        )
      case 'add-person':
        return (
          <AddPerson
            groups={data.groups}
            onSave={addPerson}
            onBack={goBack}
            editPerson={view.editPerson}
            onUpdate={updatePerson}
          />
        )
      case 'group-detail':
        return (
          <GroupDetail
            group={data.groups.find((g) => g.id === view.id)}
            people={data.people}
            onBack={goBack}
            onUpdate={updateGroup}
            onDelete={deleteGroup}
            onPersonTap={(id) => navigate({ type: 'person-detail', id })}
          />
        )
      case 'add-group':
        return (
          <AddGroup
            people={data.people}
            onSave={addGroup}
            onBack={goBack}
          />
        )
      default: {
        switch (activeTab) {
          case 'people':
            return (
              <PeopleTab
                people={data.people}
                onPersonTap={(id) => navigate({ type: 'person-detail', id })}
                onAdd={() => navigate({ type: 'add-person' })}
              />
            )
          case 'groups':
            return (
              <GroupsTab
                groups={data.groups}
                people={data.people}
                onGroupTap={(id) => navigate({ type: 'group-detail', id })}
                onAdd={() => navigate({ type: 'add-group' })}
              />
            )
          case 'quiz':
            return <QuizTab people={data.people} />
          default:
            return null
        }
      }
    }
  }

  const showTabBar = view.type === 'tab'

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-apple-light relative">
      <div className={showTabBar ? 'pb-20' : ''}>{renderView()}</div>
      {showTabBar && (
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}
