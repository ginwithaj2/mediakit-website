import { useState, useRef } from 'react'
import { Camera, MapPin, X } from 'lucide-react'
import Header from '../components/Header'
import Avatar from '../components/Avatar'
import { generateId } from '../store'

export default function AddPerson({ groups, onSave, onBack, editPerson, onUpdate }) {
  const isEdit = !!editPerson
  const [name, setName] = useState(editPerson?.name || '')
  const [context, setContext] = useState(editPerson?.context || '')
  const [notes, setNotes] = useState(editPerson?.notes || '')
  const [location, setLocation] = useState(editPerson?.location || '')
  const [photo, setPhoto] = useState(editPerson?.photo || '')
  const [groupIds, setGroupIds] = useState(editPerson?.groupIds || [])
  const fileRef = useRef()

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!name.trim()) return
    if (isEdit) {
      onUpdate(editPerson.id, { name: name.trim(), context, notes, location, photo, groupIds })
      onBack()
    } else {
      onSave({
        id: generateId(),
        name: name.trim(),
        context,
        notes,
        location,
        photo,
        groupIds,
        starred: false,
        createdAt: new Date().toISOString(),
      })
    }
  }

  const toggleGroup = (gid) => {
    setGroupIds((prev) =>
      prev.includes(gid) ? prev.filter((id) => id !== gid) : [...prev, gid]
    )
  }

  return (
    <div className="animate-slide-up min-h-screen bg-apple-light">
      <Header
        title={isEdit ? 'Edit Person' : 'New Person'}
        onBack={onBack}
        right={
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="text-apple-blue text-[17px] font-semibold disabled:opacity-30"
          >
            {isEdit ? 'Save' : 'Add'}
          </button>
        }
      />

      <div className="px-4 pt-6 space-y-5">
        {/* Photo */}
        <div className="flex justify-center">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative spring-bounce"
          >
            {photo ? (
              <div className="relative">
                <Avatar name={name || 'New'} photo={photo} size={96} />
                <button
                  onClick={(e) => { e.stopPropagation(); setPhoto('') }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-apple-gray rounded-full flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-black/[0.04] flex flex-col items-center justify-center gap-1">
                <Camera size={24} className="text-apple-gray" />
                <span className="text-[11px] text-apple-gray">Add Photo</span>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            className="hidden"
          />
        </div>

        {/* Name */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name *"
            autoFocus
            className="w-full px-4 py-3.5 text-[17px] outline-none placeholder:text-apple-gray/60"
          />
          <div className="border-t border-apple-border">
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="How did you meet? (e.g. Coffee shop, Work event)"
              className="w-full px-4 py-3.5 text-[17px] outline-none placeholder:text-apple-gray/60"
            />
          </div>
          <div className="border-t border-apple-border">
            <div className="flex items-center px-4">
              <MapPin size={16} className="text-apple-gray mr-2 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (optional)"
                className="w-full py-3.5 text-[17px] outline-none placeholder:text-apple-gray/60"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes — details to help you remember this person..."
            rows={4}
            className="w-full px-4 py-3.5 text-[17px] outline-none resize-none placeholder:text-apple-gray/60"
          />
        </div>

        {/* Groups */}
        {groups.length > 0 && (
          <div>
            <p className="text-[13px] font-medium text-apple-gray uppercase tracking-wider px-1 mb-2">
              Add to Groups
            </p>
            <div className="flex flex-wrap gap-2">
              {groups.map((g) => {
                const selected = groupIds.includes(g.id)
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGroup(g.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all spring-bounce ${
                      selected
                        ? 'bg-apple-blue text-white'
                        : 'bg-black/[0.04] text-[#1d1d1f]'
                    }`}
                  >
                    {g.emoji} {g.name}
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
