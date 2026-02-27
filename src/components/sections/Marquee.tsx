import { techStack } from '@/content/config'

const doubled = [...techStack, ...techStack]

export function Marquee() {

  return (
    <div className="border-y border-[rgb(var(--border)/0.15)] py-4 overflow-hidden bg-amber/5">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((tech, i) => (
          <span key={i} className="font-mono text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity mx-8">
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
