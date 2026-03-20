import { useState } from 'react'
import Header from '../components/Header'
import Avatar from '../components/Avatar'
import { generateId } from '../store'

const EMOJI_OPTIONS = ['👥', '💼', '🏋️', '🏠', '☕', '🎓', '🎉', '⛪', '🏀', '🎵', '✈️', '🍕']

export default function AddGroup({ people, onSave, onBack }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('👥')
  const [memberIds, setMemberIds] = useState([])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      id: generateId(),
      name: name.trim(),
      emoji,
      memberIds,
      createdAt: new Date().toISOString(),
    })
  }

  const toggleMember = (pid) => {
    setMemberIds((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    )
  }

  return (
    <div className="animate-slide-up min-h-screen bg-apple-light">
      <Header
        title="New Group"
        onBack={onBack}
        right={
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="text-apple-blue text-[17px] font-semibold disabled:opacity-30"
          >
            Create
          </button>
        }
      />

      <div className="px-4 pt-6 space-y-5">
        {/* Emoji picker */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-apple-blue/10 flex items-center justify-center text-4xl">
            {emoji}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all spring-bounce ${
                emoji === e ? 'bg-apple-blue/20 scale-110' : 'bg-black/[0.04]'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Name */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name *"
            autoFocus
            className="w-full px-4 py-3.5 text-[17px] outline-none placeholder:text-apple-gray/60"
          />
        </div>

        {/* Members */}
        {people.length > 0 && (
          <div>
            <p className="text-[13px] font-medium text-apple-gray uppercase tracking-wider px-1 mb-2">
              Add Members
            </p>
            <div className="bg-white rounded-2xl card-shadow overflow-hidden">
              {people.map((p, i) => {
                const selected = memberIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleMember(p.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i > 0 ? 'border-t border-apple-border' : ''
                    } ${selected ? 'bg-apple-blue/[0.04]' : ''}`}
                  >
                    <Avatar name={p.name} photo={p.photo} size={36} />
                    <span className="flex-1 text-[17px] text-[#1d1d1f]">{p.name}</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected
                          ? 'bg-apple-blue border-apple-blue'
                          : 'border-apple-gray/30'
                      }`}
                    >
                      {selected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
