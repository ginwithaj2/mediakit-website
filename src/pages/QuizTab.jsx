import { useState, useCallback, useMemo } from 'react'
import { Brain, RotateCcw, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import Avatar from '../components/Avatar'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Confetti() {
  const colors = ['#007AFF', '#FF9500', '#34C759', '#FF3B30', '#5856D6', '#FF2D55']
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: colors[i % colors.length],
    delay: Math.random() * 0.5,
    size: 6 + Math.random() * 6,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti absolute rounded-sm"
          style={{
            left: `${p.left}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function QuizTab({ people }) {
  const [mode, setMode] = useState('menu')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const generateQuiz = useCallback(() => {
    if (people.length < 2) return
    const shuffled = shuffle(people).slice(0, Math.min(10, people.length))
    const qs = shuffled.map((person) => {
      const wrong = shuffle(people.filter((p) => p.id !== person.id)).slice(0, 3)
      const options = shuffle([person, ...wrong])
      return { person, options, type: 'name' }
    })
    setQuestions(qs)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setMode('playing')
  }, [people])

  const generateContextQuiz = useCallback(() => {
    const withContext = people.filter((p) => p.context)
    if (withContext.length < 2) return
    const shuffled = shuffle(withContext).slice(0, Math.min(10, withContext.length))
    const qs = shuffled.map((person) => {
      const wrong = shuffle(withContext.filter((p) => p.id !== person.id)).slice(0, 3)
      const options = shuffle([person, ...wrong])
      return { person, options, type: 'context' }
    })
    setQuestions(qs)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setMode('playing')
  }, [people])

  const handleSelect = (option) => {
    if (selected) return
    setSelected(option.id)
    const correct = option.id === questions[current].person.id
    if (correct) {
      setScore((s) => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1)
        setSelected(null)
      } else {
        setMode('results')
      }
    }, 1200)
  }

  const pct = useMemo(() => {
    if (questions.length === 0) return 0
    return Math.round((score / questions.length) * 100)
  }, [score, questions.length])

  if (people.length < 2) {
    return (
      <div className="animate-fade-in">
        <div className="pt-14 pb-3 px-4">
          <h1 className="text-[34px] font-bold tracking-tight text-[#1d1d1f]">
            Practice
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 rounded-full bg-apple-green/10 flex items-center justify-center mb-4">
            <Brain size={28} className="text-apple-green" />
          </div>
          <p className="text-[17px] font-semibold text-[#1d1d1f] mb-1">
            Add more people first
          </p>
          <p className="text-[15px] text-apple-gray text-center">
            You need at least 2 people to start practicing
          </p>
        </div>
      </div>
    )
  }

  if (mode === 'menu') {
    const hasContext = people.filter((p) => p.context).length >= 2
    return (
      <div className="animate-fade-in">
        <div className="pt-14 pb-3 px-4">
          <h1 className="text-[34px] font-bold tracking-tight text-[#1d1d1f]">
            Practice
          </h1>
          <p className="text-[15px] text-apple-gray mt-0.5">
            Test your memory with quizzes
          </p>
        </div>

        <div className="px-4 space-y-3 mt-4">
          <button
            onClick={generateQuiz}
            className="w-full bg-white rounded-2xl card-shadow p-5 text-left spring-bounce hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-apple-blue/10 flex items-center justify-center mb-3">
              <Brain size={24} className="text-apple-blue" />
            </div>
            <p className="text-[20px] font-semibold text-[#1d1d1f]">
              Name Quiz
            </p>
            <p className="text-[15px] text-apple-gray mt-1">
              See a face or initials — pick the right name
            </p>
          </button>

          {hasContext && (
            <button
              onClick={generateContextQuiz}
              className="w-full bg-white rounded-2xl card-shadow p-5 text-left spring-bounce hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-apple-orange/10 flex items-center justify-center mb-3">
                <Sparkles size={24} className="text-apple-orange" />
              </div>
              <p className="text-[20px] font-semibold text-[#1d1d1f]">
                Context Quiz
              </p>
              <p className="text-[15px] text-apple-gray mt-1">
                Match people with how you met them
              </p>
            </button>
          )}

          <div className="bg-white rounded-2xl card-shadow p-4 mt-6">
            <p className="text-[13px] font-medium text-apple-gray uppercase tracking-wider mb-2">
              Stats
            </p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-[28px] font-bold text-apple-blue">{people.length}</p>
                <p className="text-[13px] text-apple-gray">People</p>
              </div>
              <div className="w-px bg-apple-border" />
              <div className="text-center">
                <p className="text-[28px] font-bold text-apple-green">
                  {people.filter((p) => p.photo).length}
                </p>
                <p className="text-[13px] text-apple-gray">With Photos</p>
              </div>
              <div className="w-px bg-apple-border" />
              <div className="text-center">
                <p className="text-[28px] font-bold text-apple-purple">
                  {people.filter((p) => p.context).length}
                </p>
                <p className="text-[13px] text-apple-gray">With Context</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'results') {
    return (
      <div className="animate-slide-up min-h-screen flex flex-col items-center justify-center px-6">
        {showConfetti && <Confetti />}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: pct >= 70 ? '#34C75920' : '#FF3B3020' }}
        >
          {pct >= 70 ? (
            <CheckCircle2 size={48} className="text-apple-green" />
          ) : (
            <XCircle size={48} className="text-apple-red" />
          )}
        </div>
        <h2 className="text-[34px] font-bold text-[#1d1d1f]">
          {pct >= 90 ? 'Amazing!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Not bad!' : 'Keep practicing!'}
        </h2>
        <p className="text-[48px] font-bold text-apple-blue mt-2">
          {score}/{questions.length}
        </p>
        <p className="text-[17px] text-apple-gray mt-1">{pct}% correct</p>

        <div className="flex gap-3 mt-8 w-full">
          <button
            onClick={generateQuiz}
            className="flex-1 h-12 bg-apple-blue text-white rounded-2xl text-[17px] font-semibold spring-bounce flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
          <button
            onClick={() => setMode('menu')}
            className="flex-1 h-12 bg-black/[0.04] text-[#1d1d1f] rounded-2xl text-[17px] font-medium spring-bounce"
          >
            Menu
          </button>
        </div>
      </div>
    )
  }

  // Playing mode
  const q = questions[current]
  const isContext = q.type === 'context'

  return (
    <div className="animate-fade-in min-h-screen flex flex-col">
      {showConfetti && <Confetti />}

      {/* Progress bar */}
      <div className="px-4 pt-14 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-apple-gray font-medium">
            Question {current + 1} of {questions.length}
          </span>
          <span className="text-[13px] font-semibold text-apple-blue">
            Score: {score}
          </span>
        </div>
        <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-apple-blue rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <Avatar name={q.person.name} photo={q.person.photo} size={100} />
        <p className="text-[20px] font-semibold text-[#1d1d1f] mt-5 text-center">
          {isContext
            ? `Who did you meet at "${q.person.context}"?`
            : 'Who is this person?'}
        </p>

        {/* Options */}
        <div className="w-full space-y-2.5 mt-8">
          {q.options.map((opt) => {
            const isCorrect = opt.id === q.person.id
            const isSelected = selected === opt.id
            let classes = 'bg-white card-shadow'
            if (selected) {
              if (isCorrect) classes = 'bg-apple-green/10 border-2 border-apple-green'
              else if (isSelected) classes = 'bg-apple-red/10 border-2 border-apple-red'
              else classes = 'bg-white opacity-50'
            }
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
                className={`w-full h-14 rounded-2xl text-[17px] font-medium text-[#1d1d1f] transition-all spring-bounce ${classes}`}
              >
                {isContext ? opt.name : opt.name}
                {selected && isCorrect && (
                  <CheckCircle2 size={18} className="inline ml-2 text-apple-green" />
                )}
                {selected && isSelected && !isCorrect && (
                  <XCircle size={18} className="inline ml-2 text-apple-red" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
