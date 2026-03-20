import { useState } from 'react'
import { Star, MapPin, Clock, Pencil, Trash2 } from 'lucide-react'
import Header from '../components/Header'
import Avatar from '../components/Avatar'
import { timeAgo } from '../store'

export default function PersonDetail({ person, groups, onBack, onUpdate, onDelete }) {
  const [showDelete, setShowDelete] = useState(false)

  if (!person) {
    onBack()
    return null
  }

  const personGroups = groups.filter(
    (g) => g.memberIds?.includes(person.id) || person.groupIds?.includes(g.id)
  )

  return (
    <div className="animate-slide-up min-h-screen bg-apple-light">
      <Header
        title=""
        onBack={onBack}
        right={
          <button
            onClick={() =>
              onUpdate(person.id, { starred: !person.starred })
            }
            className="spring-bounce"
          >
            <Star
              size={22}
              className={
                person.starred
                  ? 'text-apple-orange fill-apple-orange'
                  : 'text-apple-gray'
              }
            />
          </button>
        }
      />

      <div className="px-4 pt-6">
        {/* Profile header */}
        <div className="flex flex-col items-center mb-6">
          <Avatar name={person.name} photo={person.photo} size={96} />
          <h2 className="text-[28px] font-bold text-[#1d1d1f] mt-3 text-center">
            {person.name}
          </h2>
          {person.context && (
            <p className="text-[15px] text-apple-gray mt-0.5 text-center">
              {person.context}
            </p>
          )}
          <div className="flex items-center gap-1 mt-1 text-[13px] text-apple-gray">
            <Clock size={12} />
            <span>Added {timeAgo(person.createdAt)}</span>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-3">
          {person.location && (
            <div className="bg-white rounded-2xl card-shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-apple-blue" />
                <span className="text-[13px] font-medium text-apple-gray uppercase tracking-wider">
                  Location
                </span>
              </div>
              <p className="text-[17px] text-[#1d1d1f]">{person.location}</p>
            </div>
          )}

          {person.notes && (
            <div className="bg-white rounded-2xl card-shadow p-4">
              <span className="text-[13px] font-medium text-apple-gray uppercase tracking-wider">
                Notes
              </span>
              <p className="text-[17px] text-[#1d1d1f] mt-1 whitespace-pre-wrap">
                {person.notes}
              </p>
            </div>
          )}

          {personGroups.length > 0 && (
            <div className="bg-white rounded-2xl card-shadow p-4">
              <span className="text-[13px] font-medium text-apple-gray uppercase tracking-wider">
                Groups
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {personGroups.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-[14px] font-medium"
                  >
                    {g.emoji} {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2 pb-10">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 h-12 bg-white rounded-2xl card-shadow text-apple-blue text-[17px] font-medium spring-bounce"
          >
            <Pencil size={18} />
            Edit Person
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="w-full flex items-center justify-center gap-2 h-12 bg-white rounded-2xl card-shadow text-apple-red text-[17px] font-medium spring-bounce"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 animate-fade-in">
          <div className="w-full max-w-[430px] p-4 pb-8 animate-slide-up">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-4 text-center border-b border-apple-border">
                <p className="text-[17px] font-semibold text-[#1d1d1f]">
                  Delete {person.name}?
                </p>
                <p className="text-[13px] text-apple-gray mt-1">
                  This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => onDelete(person.id)}
                className="w-full h-12 text-apple-red text-[17px] font-semibold border-b border-apple-border"
              >
                Delete
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
