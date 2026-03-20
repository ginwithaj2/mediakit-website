import { ChevronLeft } from 'lucide-react'

export default function Header({ title, onBack, right }) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-apple-border safe-top">
      <div className="flex items-center justify-between h-11 px-4">
        <div className="w-20 flex justify-start">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-apple-blue text-[17px] font-normal -ml-1 spring-bounce"
            >
              <ChevronLeft size={22} />
              <span>Back</span>
            </button>
          )}
        </div>
        <h1 className="text-[17px] font-semibold text-[#1d1d1f] truncate">
          {title}
        </h1>
        <div className="w-20 flex justify-end">{right}</div>
      </div>
    </header>
  )
}
