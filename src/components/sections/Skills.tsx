'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { skillCategories } from '@/content/config'

function SkillBar({ level, visible }: { level: number; visible: boolean }) {
  return (
    <div className="h-1.5 bg-[rgb(var(--border)/0.2)] rounded-full overflow-hidden">
      <div
        className="h-full bg-amber rounded-full transition-all duration-1000 ease-out"
        style={{ width: visible ? `${level}%` : '0%' }}
      />
    </div>
  )
}

export function Skills() {
  const t = useTranslations('skills')
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-amber mb-2">{t('label')}</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-12">{t('title')}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((cat) => (
            <div key={cat.key} className="space-y-5 p-6 border border-[rgb(var(--border)/0.15)] rounded-lg hover:border-amber/40 transition-colors">
              <h3 className="font-mono text-xs tracking-widest uppercase text-amber">
                {t(`categories.${cat.key}`)}
              </h3>
              {cat.skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="font-mono text-xs opacity-50">{skill.level}%</span>
                  </div>
                  <SkillBar level={skill.level} visible={visible} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
