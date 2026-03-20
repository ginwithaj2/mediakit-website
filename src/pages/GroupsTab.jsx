import { useState } from 'react'
import { Plus } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import Avatar from '../components/Avatar'

const GROUP_COLORS = ['#007AFF', '#FF9500', '#34C759', '#FF3B30', '#5856D6', '#AF52DE', '#5AC8FA', '#FF2D55']

export default function GroupsTab({ groups, people, onGroupTap, onAdd }) {
  const [search, setSearch] = useState('')

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  const getMemberCount = (group) => {
    const fromGroup = group.memberIds?.length || 0
    const fromPeople = people.filter((p) => p.groupIds?.includes(group.id)).length
    return fromGroup + fromPeople
  }

  return (
    <div className="animate-fade-in">
      <div className="pt-14 pb-3 px-4">
        <h1 className="text-[34px] font-bold tracking-tight text-[#1d1d1f]">
          Groups
        </h1>
        <p className="text-[15px] text-apple-gray mt-0.5">
          Organize people by how you know them
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search groups" />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          {groups.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-full bg-apple-purple/10 flex items-center justify-center mb-4">
                <Plus size={28} className="text-apple-purple" />
              </div>
              <p className="text-[17px] font-semibold text-[#1d1d1f] mb-1">
                No groups yet
              </p>
              <p className="text-[15px] text-apple-gray text-center">
                Create groups like "Work", "Gym", or "Neighborhood"
              </p>
            </>
          ) : (
            <p className="text-[15px] text-apple-gray">No results found</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {filtered.map((group, i) => {
            const color = GROUP_COLORS[i % GROUP_COLORS.length]
            const count = getMemberCount(group)
            const members = people.filter(
              (p) => group.memberIds?.includes(p.id) || p.groupIds?.includes(group.id)
            )
            return (
              <button
                key={group.id}
                onClick={() => onGroupTap(group.id)}
                className="bg-white rounded-2xl card-shadow p-4 text-left spring-bounce hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                  style={{ backgroundColor: color + '18' }}
                >
                  {group.emoji || '👥'}
                </div>
                <p className="text-[17px] font-semibold text-[#1d1d1f] truncate">
                  {group.name}
                </p>
                <p className="text-[13px] text-apple-gray mt-0.5">
                  {count} {count === 1 ? 'person' : 'people'}
                </p>
                {members.length > 0 && (
                  <div className="flex -space-x-2 mt-3">
                    {members.slice(0, 4).map((m) => (
                      <Avatar key={m.id} name={m.name} photo={m.photo} size={24} />
                    ))}
                    {members.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-black/[0.06] flex items-center justify-center text-[10px] font-medium text-apple-gray">
                        +{members.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      <button
        onClick={onAdd}
        className="fixed bottom-24 right-1/2 translate-x-[190px] w-14 h-14 bg-apple-purple rounded-full flex items-center justify-center shadow-lg shadow-apple-purple/30 spring-bounce z-40"
      >
        <Plus size={26} className="text-white" />
      </button>
    </div>
  )
}
