'use client'
import ScrollReveal from '@/components/ui/ScrollReveal'
import CountUp from '@/components/ui/CountUp'
import { personalInfo, aboutContent } from '@/data/content'

export default function About() {
  return (
    <section id="about" className="py-32 px-8 lg:px-16 border-t border-border bg-black relative z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-16 lg:gap-8">
        
        {/* Left Side: Bio & Education (60%) */}
        <div className="lg:col-span-6 space-y-12">
          <ScrollReveal>
            <div className="inline-flex border border-border px-3 py-1.5 mb-6">
              <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">[ About Me ]</span>
            </div>
            <h2 className="font-display font-medium text-white text-3xl lg:text-4xl leading-snug">
              {aboutContent.bio}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="border border-border bg-card p-6 lg:p-8">
              <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">[ Education ]</p>
              <h3 className="font-display font-semibold text-white text-xl">{aboutContent.education.degree}</h3>
              <p className="font-body text-sm text-fg-dim mt-1">{aboutContent.education.major}</p>
              <div className="flex flex-wrap justify-between items-center mt-6 pt-4 border-t border-border font-mono text-xs text-muted">
                <span>{aboutContent.education.institution}</span>
                <span>{aboutContent.education.period}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side: MBTI & Stats (40%) */}
        <div className="lg:col-span-4 space-y-8 lg:pl-8">
          <ScrollReveal delay={0.15}>
            <div className="border border-border bg-surface p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-muted tracking-widest uppercase">[ Personality Type ]</span>
                <h3 className="font-display font-bold text-white text-3xl mt-4">
                  [ {personalInfo.mbti.type} ]
                </h3>
              </div>
              <p className="font-mono text-xs text-muted mt-4">
                {personalInfo.mbti.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {aboutContent.stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={0.2 + index * 0.05}>
                <div className="border border-border bg-card p-6 text-center hover:border-hover transition-all duration-300">
                  <div className="font-display font-bold text-white text-4xl lg:text-5xl mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="font-mono text-[10px] text-muted tracking-widest uppercase">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
