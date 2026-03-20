import { Users, FolderOpen, Brain } from 'lucide-react'

const tabs = [
  { id: 'people', label: 'People', icon: Users },
  { id: 'groups', label: 'Groups', icon: FolderOpen },
  { id: 'quiz', label: 'Practice', icon: Brain },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] glass border-t border-apple-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-xl transition-all duration-200 spring-bounce ${
                active ? 'text-apple-blue' : 'text-apple-gray'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
              <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
