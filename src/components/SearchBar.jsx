import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="relative mx-4 mb-3">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-9 rounded-xl bg-black/[0.04] text-[15px] placeholder:text-apple-gray outline-none focus:ring-2 focus:ring-apple-blue/30 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
