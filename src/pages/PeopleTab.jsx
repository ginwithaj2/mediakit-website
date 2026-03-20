import { useState } from 'react'
import { Plus, Star } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import Avatar from '../components/Avatar'
import { timeAgo } from '../store'

export default function PeopleTab({ people, onPersonTap, onAdd }) {
  const [search, setSearch] = useState('')

  const filtered = people
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.notes || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.starred && !b.starred) return -1
      if (!a.starred && b.starred) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div className="animate-fade-in">
      <div className="pt-14 pb-3 px-4">
        <h1 className="text-[34px] font-bold tracking-tight text-[#1d1d1f]">
          People
        </h1>
        <p className="text-[15px] text-apple-gray mt-0.5">
          {people.length} {people.length === 1 ? 'person' : 'people'} remembered
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search people" />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          {people.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-full bg-apple-blue/10 flex items-center justify-center mb-4">
                <Plus size={28} className="text-apple-blue" />
              </div>
              <p className="text-[17px] font-semibold text-[#1d1d1f] mb-1">
                No people yet
              </p>
              <p className="text-[15px] text-apple-gray text-center">
                Tap the button below to add someone you've met
              </p>
            </>
          ) : (
            <p className="text-[15px] text-apple-gray">No results found</p>
          )}
        </div>
      ) : (
        <div className="mx-4">
          <div className="bg-white rounded-2xl card-shadow overflow-hidden">
            {filtered.map((person, i) => (
              <button
                key={person.id}
                onClick={() => onPersonTap(person.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left spring-bounce hover:bg-black/[0.02] transition-colors ${
                  i > 0 ? 'border-t border-apple-border' : ''
                }`}
              >
                <Avatar name={person.name} photo={person.photo} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[17px] font-medium text-[#1d1d1f] truncate">
                      {person.name}
                    </span>
                    {person.starred && (
                      <Star size={12} className="text-apple-orange fill-apple-orange flex-shrink-0" />
                    )}
                  </div>
                  {person.context && (
                    <p className="text-[13px] text-apple-gray truncate">
                      {person.context}
                    </p>
                  )}
                </div>
                <span className="text-[12px] text-apple-gray flex-shrink-0">
                  {timeAgo(person.createdAt)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onAdd}
        className="fixed bottom-24 right-1/2 translate-x-[190px] w-14 h-14 bg-apple-blue rounded-full flex items-center justify-center shadow-lg shadow-apple-blue/30 spring-bounce z-40"
      >
        <Plus size={26} className="text-white" />
      </button>
    </div>
  )
}
