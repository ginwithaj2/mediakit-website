import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Avatar from '../components/Avatar'
import Card from '../components/Card'
import { Colors } from '../utils/colors'
import { shuffle } from '../utils/store'

export default function PracticeScreen({ people }) {
  const [mode, setMode] = useState('menu')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const insets = useSafeAreaInsets()

  const generateQuiz = useCallback((type = 'name') => {
    const pool = type === 'context' ? people.filter((p) => p.context) : people
    if (pool.length < 2) return
    const shuffled = shuffle(pool).slice(0, Math.min(10, pool.length))
    const qs = shuffled.map((person) => {
      const wrong = shuffle(pool.filter((p) => p.id !== person.id)).slice(0, 3)
      const options = shuffle([person, ...wrong])
      return { person, options, type }
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
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

  // Not enough people
  if (people.length < 2) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.pageHeader}>
          <Text style={styles.title}>Practice</Text>
        </View>
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: 'rgba(52,199,89,0.1)' }]}>
            <Ionicons name="fitness" size={28} color={Colors.green} />
          </View>
          <Text style={styles.emptyTitle}>Add more people first</Text>
          <Text style={styles.emptyText}>
            You need at least 2 people to start practicing
          </Text>
        </View>
      </View>
    )
  }

  // Menu
  if (mode === 'menu') {
    const hasContext = people.filter((p) => p.context).length >= 2
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.pageHeader}>
          <Text style={styles.title}>Practice</Text>
          <Text style={styles.subtitle}>Test your memory with quizzes</Text>
        </View>

        <View style={styles.menuContent}>
          <TouchableOpacity
            style={styles.quizCard}
            activeOpacity={0.7}
            onPress={() => generateQuiz('name')}
          >
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
              <Ionicons name="fitness" size={24} color={Colors.blue} />
            </View>
            <Text style={styles.quizTitle}>Name Quiz</Text>
            <Text style={styles.quizDesc}>See a face or initials — pick the right name</Text>
          </TouchableOpacity>

          {hasContext && (
            <TouchableOpacity
              style={styles.quizCard}
              activeOpacity={0.7}
              onPress={() => generateQuiz('context')}
            >
              <View style={[styles.quizIcon, { backgroundColor: 'rgba(255,149,0,0.1)' }]}>
                <Ionicons name="sparkles" size={24} color={Colors.orange} />
              </View>
              <Text style={styles.quizTitle}>Context Quiz</Text>
              <Text style={styles.quizDesc}>Match people with how you met them</Text>
            </TouchableOpacity>
          )}

          {/* Stats */}
          <Card style={styles.statsCard}>
            <Text style={styles.statsLabel}>STATS</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: Colors.blue }]}>{people.length}</Text>
                <Text style={styles.statLabel}>People</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: Colors.green }]}>
                  {people.filter((p) => p.photo).length}
                </Text>
                <Text style={styles.statLabel}>With Photos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: Colors.purple }]}>
                  {people.filter((p) => p.context).length}
                </Text>
                <Text style={styles.statLabel}>With Context</Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    )
  }

  // Results
  if (mode === 'results') {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={[styles.resultIcon, { backgroundColor: pct >= 70 ? 'rgba(52,199,89,0.12)' : 'rgba(255,59,48,0.12)' }]}>
          <Ionicons
            name={pct >= 70 ? 'checkmark-circle' : 'close-circle'}
            size={48}
            color={pct >= 70 ? Colors.green : Colors.red}
          />
        </View>
        <Text style={styles.resultTitle}>
          {pct >= 90 ? 'Amazing!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Not bad!' : 'Keep practicing!'}
        </Text>
        <Text style={styles.resultScore}>{score}/{questions.length}</Text>
        <Text style={styles.resultPct}>{pct}% correct</Text>

        <View style={styles.resultActions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => generateQuiz()}
          >
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={styles.primaryBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.7}
            onPress={() => setMode('menu')}
          >
            <Text style={styles.secondaryBtnText}>Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Playing
  const q = questions[current]

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Progress */}
      <View style={styles.progress}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>
            Question {current + 1} of {questions.length}
          </Text>
          <Text style={styles.progressScore}>Score: {score}</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((current + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question */}
      <View style={styles.question}>
        <Avatar name={q.person.name} photo={q.person.photo} size={100} />
        <Text style={styles.questionText}>
          {q.type === 'context'
            ? `Who did you meet at "${q.person.context}"?`
            : 'Who is this person?'}
        </Text>

        <View style={styles.options}>
          {q.options.map((opt) => {
            const isCorrect = opt.id === q.person.id
            const isSelected = selected === opt.id
            let bg = '#FFF'
            let borderColor = 'transparent'
            if (selected) {
              if (isCorrect) {
                bg = 'rgba(52,199,89,0.1)'
                borderColor = Colors.green
              } else if (isSelected) {
                bg = 'rgba(255,59,48,0.1)'
                borderColor = Colors.red
              }
            }
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelect(opt)}
                disabled={!!selected}
                style={[
                  styles.optionBtn,
                  { backgroundColor: bg, borderColor, borderWidth: selected && (isCorrect || isSelected) ? 2 : 0 },
                  selected && !isCorrect && !isSelected && { opacity: 0.5 },
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{opt.name}</Text>
                {selected && isCorrect && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
                )}
                {selected && isSelected && !isCorrect && (
                  <Ionicons name="close-circle" size={18} color={Colors.red} />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuContent: {
    padding: 16,
    gap: 12,
  },
  quizCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  quizDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsCard: {
    padding: 16,
    marginTop: 8,
  },
  statsLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  // Results
  resultIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.text,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.blue,
    marginTop: 8,
  },
  resultPct: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
  },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
  // Playing
  progress: {
    padding: 16,
    paddingTop: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  progressScore: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.blue,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 2,
  },
  question: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  options: {
    width: '100%',
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
})
