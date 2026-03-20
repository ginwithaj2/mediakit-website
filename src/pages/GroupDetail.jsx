import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Header from '../components/Header'
import Avatar from '../components/Avatar'

export default function GroupDetail({ group, people, onBack, onUpdate, onDelete, onPersonTap }) {
  const [showDelete, setShowDelete] = useState(false)

  if (!group) {
    onBack()
    return null
  }

  const members = people.filter(
    (p) => group.memberIds?.includes(p.id) || p.groupIds?.includes(group.id)
  )

  return (
    <div className="animate-slide-up min-h-screen bg-apple-light">
      <Header
        title={group.name}
        onBack={onBack}
        right={
          <button
            onClick={() => setShowDelete(true)}
            className="text-apple-red spring-bounce"
          >
            <Trash2 size={20} />
          </button>
        }
      />

      <div className="px-4 pt-6">
        {/* Group header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-apple-blue/10 flex items-center justify-center text-4xl mb-3">
            {group.emoji || '👥'}
          </div>
          <h2 className="text-[28px] font-bold text-[#1d1d1f]">{group.name}</h2>
          <p className="text-[15px] text-apple-gray">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </p>
        </div>

        {/* Members list */}
        {members.length > 0 ? (
          <div className="bg-white rounded-2xl card-shadow overflow-hidden">
            {members.map((person, i) => (
              <button
                key={person.id}
                onClick={() => onPersonTap(person.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left spring-bounce hover:bg-black/[0.02] transition-colors ${
                  i > 0 ? 'border-t border-apple-border' : ''
                }`}
              >
                <Avatar name={person.name} photo={person.photo} size={44} />
                <div className="flex-1 min-w-0">
                  <span className="text-[17px] font-medium text-[#1d1d1f] truncate block">
                    {person.name}
                  </span>
                  {person.context && (
                    <p className="text-[13px] text-apple-gray truncate">{person.context}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-12">
            <p className="text-[15px] text-apple-gray text-center">
              No members yet. Add people and assign them to this group.
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 animate-fade-in">
          <div className="w-full max-w-[430px] p-4 pb-8 animate-slide-up">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-4 text-center border-b border-apple-border">
                <p className="text-[17px] font-semibold text-[#1d1d1f]">
                  Delete "{group.name}"?
                </p>
                <p className="text-[13px] text-apple-gray mt-1">
                  Members will not be deleted.
                </p>
              </div>
              <button
                onClick={() => onDelete(group.id)}
                className="w-full h-12 text-apple-red text-[17px] font-semibold border-b border-apple-border"
              >
                Delete Group
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="w-full h-12 text-apple-blue text-[17px] font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
