import { useState } from 'react'
import { GraduationCap, BookOpen, LayoutGrid, FileText, BarChart3, TrendingUp, ShieldCheck, Bot, Brain, Target, BookMarked, ChevronRight, ChevronDown, Clock, Layers, Star, Users, Zap, ArrowRight, MonitorPlay, AlertTriangle, Info, Lightbulb, CheckCircle, ListOrdered, Table2 } from 'lucide-react'
import { CHAPTERS, CHAPTER_CATEGORY_MAP } from './TradeAcademyData'

const COURSE = {
  title: 'Introduction to Deriv',
  subtitle2: 'A Comprehensive Guide from Beginner to Advanced Trading',
  description: 'Master Deriv trading with this in-depth, professional course. From basic concepts to advanced strategies, risk management to psychological mastery — this comprehensive guide will transform you into a confident, disciplined Deriv trader.',
  badge: '📘 Complete Free Course',
  cta: '📖 Start Learning Now',
  stats: [
    { value: '30', label: 'Chapters', icon: BookOpen },
    { value: '18', label: 'Major Parts', icon: Layers },
    { value: 'Beginner to Advanced', label: 'Skill Level', icon: BarChart3 },
    { value: '100%', label: 'Free', icon: Star },
  ],
}

const OVERVIEW = {
  welcome: "Welcome to the ultimate Introduction to Deriv course! Whether you're a complete beginner or an experienced trader looking to refine your knowledge, this course covers everything you need to know about trading on Deriv.",
}

const CATEGORIES = [
  { title: 'Getting Started', chapters: 3, icon: BookMarked, color: '#ff444f', description: 'Setting up your account and understanding the basics' },
  { title: 'Platforms', chapters: 1, icon: MonitorPlay, color: '#377cfc', description: 'Overview of Deriv trading platforms' },
  { title: 'Contract Types', chapters: 6, icon: LayoutGrid, color: '#4bb4b3', description: 'Understanding Rise/Fall, Touch/No Touch, and more' },
  { title: 'Analysis', chapters: 4, icon: TrendingUp, color: '#ffad3a', description: 'Technical and fundamental analysis techniques' },
  { title: 'Risk Management', chapters: 2, icon: ShieldCheck, color: '#ec3f3f', description: 'Managing risk and protecting your capital' },
  { title: 'Automation', chapters: 3, icon: Bot, color: '#7c5cfc', description: 'Automated trading with Deriv Bot' },
  { title: 'Psychology', chapters: 2, icon: Brain, color: '#ff6b9d', description: 'Trading psychology and emotional control' },
  { title: 'Practice', chapters: 4, icon: Target, color: '#17eabd', description: 'Hands-on practice and real-world scenarios' },
]

const QUICK_STEPS = [
  { step: 1, title: 'Create Account', description: 'Sign up for a free Deriv account to get started.', icon: Users },
  { step: 2, title: 'Explore Platform', description: 'Familiarize yourself with the trading interface and tools.', icon: MonitorPlay },
  { step: 3, title: 'Learn Basics', description: 'Go through beginner chapters to understand core trading concepts.', icon: BookOpen },
  { step: 4, title: 'Start Trading', description: 'Apply your knowledge with a demo account before going live.', icon: Zap },
]

const KEY_TOPICS = [
  { title: 'Probability in Trading', description: 'Understand how probability affects your trading decisions and how to use it to your advantage.', icon: BarChart3 },
  { title: 'Managing Drawdowns', description: 'Learn strategies to handle drawdowns and keep your trading account healthy.', icon: TrendingUp },
  { title: 'Avoiding Common Scams', description: 'Identify and avoid common trading scams and fraudulent schemes.', icon: ShieldCheck },
  { title: 'Creating a Trading Plan', description: 'Develop a comprehensive trading plan that suits your goals and risk tolerance.', icon: Target },
]

const COURSE_STATS = {
  totalStudents: '12,847+',
  totalLessons: '145',
  totalHours: '18+',
  rating: '4.8',
}

export default function TradeAcademy() {
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedChapters, setExpandedChapters] = useState([])

  const toggleChapter = (id) => {
    setExpandedChapters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const expandAll = () => {
    setExpandedChapters(CHAPTERS.map((c) => c.id))
  }

  const collapseAll = () => {
    setExpandedChapters([])
  }

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'chapters', label: 'All Chapters', icon: LayoutGrid },
    { id: 'resources', label: 'Resources', icon: FileText },
  ]

  const renderOverview = () => (
    <>
      <section className="ta__welcome">
        <div className="ta__welcome-content">
          <h2>Welcome to the Course</h2>
          <p>{OVERVIEW.welcome}</p>
          <p>This course is structured into <strong>8 major categories</strong> covering <strong>30 chapters</strong> that progressively build your knowledge from beginner fundamentals to advanced trading concepts.</p>
        </div>
      </section>

      <section className="ta__categories">
        <h2 className="ta__section-title">Course Categories</h2>
        <div className="ta__categories-grid">
          {CATEGORIES.map((cat) => (
            <div key={cat.title} className="ta__category-card">
              <div className="ta__category-header" style={{ borderLeftColor: cat.color }}>
                <div className="ta__category-icon" style={{ backgroundColor: cat.color + '18', color: cat.color }}>
                  <cat.icon size={22} />
                </div>
                <div className="ta__category-info">
                  <h3>{cat.title}</h3>
                  <span className="ta__category-chapters">{cat.chapters} Chapter{cat.chapters > 1 ? 's' : ''}</span>
                </div>
                <button
                  className="ta__category-toggle"
                  onClick={() => setExpandedCategory(expandedCategory === cat.title ? null : cat.title)}
                >
                  <ChevronRight size={18} className={expandedCategory === cat.title ? 'rotated' : ''} />
                </button>
              </div>
              <p className="ta__category-desc">{cat.description}</p>
              {expandedCategory === cat.title && (
                <div className="ta__category-chapters-list">
                  <div className="ta__chapter-item">
                    <BookOpen size={14} />
                    <span>Chapter 1: Introduction to {cat.title}</span>
                  </div>
                  <div className="ta__chapter-item">
                    <BookOpen size={14} />
                    <span>Chapter 2: {cat.title} Fundamentals</span>
                  </div>
                  {cat.chapters > 2 && (
                    <div className="ta__chapter-item">
                      <BookOpen size={14} />
                      <span>Chapter 3: Advanced {cat.title} Concepts</span>
                    </div>
                  )}
                  {cat.chapters > 3 && (
                    <div className="ta__chapter-item">
                      <BookOpen size={14} />
                      <span>Chapter 4: {cat.title} in Practice</span>
                    </div>
                  )}
                  {cat.chapters > 4 && (
                    <div className="ta__chapter-item">
                      <BookOpen size={14} />
                      <span>Chapter 5: {cat.title} Strategies</span>
                    </div>
                  )}
                  {cat.chapters > 5 && (
                    <div className="ta__chapter-item">
                      <BookOpen size={14} />
                      <span>Chapter 6: Mastering {cat.title}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="ta__quickstart">
        <h2 className="ta__section-title">Quick Start Guide</h2>
        <div className="ta__quickstart-grid">
          {QUICK_STEPS.map((step) => (
            <div key={step.step} className="ta__quickstart-card">
              <div className="ta__quickstart-number">{step.step}</div>
              <div className="ta__quickstart-icon">
                <step.icon size={24} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ta__highlights">
        <h2 className="ta__section-title">Key Topics</h2>
        <div className="ta__highlights-grid">
          {KEY_TOPICS.map((topic) => (
            <div key={topic.title} className="ta__highlight-card">
              <div className="ta__highlight-icon">
                <topic.icon size={28} />
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case "text":
        return <p key={idx} className="tac__text">{block.content}</p>
      case "callout": {
        const icons = { info: Info, warning: AlertTriangle, tip: Lightbulb, success: CheckCircle }
        const Icon = icons[block.variant] || Info
        return (
          <div key={idx} className={`tac__callout tac__callout--${block.variant}`}>
            <Icon size={20} className="tac__callout-icon" />
            <div>
              {block.title && <strong className="tac__callout-title">{block.title}</strong>}
              <p>{block.content}</p>
            </div>
          </div>
        )
      }
      case "bulletList":
        return (
          <ul key={idx} className="tac__bullet-list">
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        )
      case "table":
        return (
          <div key={idx} className="tac__table-wrap">
            <table className="tac__table">
              <thead>
                <tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        )
      case "comparison":
        return (
          <div key={idx} className="tac__comparison">
            <div className="tac__comparison-col">
              <h5 className="tac__comparison-title">{block.leftTitle}</h5>
              <ul>{block.leftItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
            <div className="tac__comparison-col">
              <h5 className="tac__comparison-title">{block.rightTitle}</h5>
              <ul>{block.rightItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          </div>
        )
      case "definition":
        return (
          <div key={idx} className="tac__definition">
            <strong className="tac__def-term">{block.term}</strong>
            <span className="tac__def-sep">—</span>
            <span className="tac__def-def">{block.definition}</span>
          </div>
        )
      case "keyTakeaway":
        return (
          <div key={idx} className="tac__takeaway">
            <CheckCircle size={18} className="tac__takeaway-icon" />
            <div>
              <strong className="tac__takeaway-title">Key Takeaways</strong>
              <ul>{block.items.map((item, i) => <li key={i}>{Array.isArray(item) ? item[0] : item}</li>)}</ul>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderChapterContent = (chapter) => (
    <div className="tac__sections">
      {chapter.sections.map((section, si) => (
        <div key={si} className="tac__section">
          <h4 className="tac__section-heading">{section.heading}</h4>
          <div className="tac__section-blocks">
            {section.blocks.map((block, bi) => renderBlock(block, bi))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderChapters = () => {
    const grouped = CATEGORIES.map((cat) => ({
      ...cat,
      chapters: (CHAPTER_CATEGORY_MAP[cat.title] || []).map((id) => CHAPTERS.find((c) => c.id === id)).filter(Boolean),
    }))
    const allIds = CHAPTERS.map((c) => c.id)
    const allExpanded = allIds.every((id) => expandedChapters.includes(id))
    return (
      <section className="ta__all-chapters">
        <div className="tac__toolbar">
          <div>
            <h2 className="ta__section-title">All Chapters</h2>
            <p className="ta__section-subtitle">Browse through all 30 chapters — click any chapter or use the buttons below to expand/collapse all.</p>
          </div>
          <div className="tac__toolbar-actions">
            <button className="tac__toolbar-btn tac__toolbar-btn--expand" onClick={expandAll} disabled={allExpanded}>
              <ChevronDown size={16} /> Expand All
            </button>
            <button className="tac__toolbar-btn tac__toolbar-btn--collapse" onClick={collapseAll} disabled={expandedChapters.length === 0}>
              <ChevronRight size={16} /> Collapse All
            </button>
          </div>
        </div>
        <div className="tac__a4-wrap">
          {grouped.map((cat) => (
            <div key={cat.title} className="tac__group">
              <div className="tac__group-header" style={{ borderLeftColor: cat.color }}>
                <cat.icon size={18} style={{ color: cat.color }} />
                <h3 className="tac__group-title">{cat.title}</h3>
                <span className="tac__group-count">{cat.chapters.length} chapter{cat.chapters.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="tac__group-list">
                {cat.chapters.map((ch) => {
                  const isOpen = expandedChapters.includes(ch.id)
                  return (
                    <div key={ch.id} className={`tac__chapter ${isOpen ? 'tac__chapter--open' : ''}`}>
                      <button className="tac__chapter-header" onClick={() => toggleChapter(ch.id)}>
                        <div className="tac__chapter-icon"><BookOpen size={16} /></div>
                        <div className="tac__chapter-info">
                          <span className="tac__chapter-title">Chapter {ch.id}: {ch.title}</span>
                          <span className="tac__chapter-desc">{ch.sections.length} sections</span>
                        </div>
                        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      {isOpen && (
                        <div className="tac__chapter-body">
                          {renderChapterContent(ch)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderResources = () => (
    <section className="ta__resources">
      <h2 className="ta__section-title">Learning Resources</h2>
      <div className="ta__resources-grid">
        <div className="ta__resource-card">
          <FileText size={32} />
          <h3>Course PDF</h3>
          <p>Download the complete course material in PDF format for offline study.</p>
          <button className="ta__resource-btn">Download <ArrowRight size={14} /></button>
        </div>
        <div className="ta__resource-card">
          <BarChart3 size={32} />
          <h3>Practice Sheets</h3>
          <p>Excel templates and practice sheets to reinforce your learning.</p>
          <button className="ta__resource-btn">Access <ArrowRight size={14} /></button>
        </div>
        <div className="ta__resource-card">
          <GraduationCap size={32} />
          <h3>Video Tutorials</h3>
          <p>Step-by-step video guides for each chapter and concept.</p>
          <button className="ta__resource-btn">Watch <ArrowRight size={14} /></button>
        </div>
        <div className="ta__resource-card">
          <Bot size={32} />
          <h3>Bot Scripts</h3>
          <p>Pre-built Deriv Bot scripts to practice automation concepts.</p>
          <button className="ta__resource-btn">Browse <ArrowRight size={14} /></button>
        </div>
      </div>
    </section>
  )

  return (
    <div className="trade-academy">
      <section className="ta__hero">
        <div className="ta__hero-content">
          <div className="ta__hero-badge">{COURSE.badge}</div>
          <h1 className="ta__hero-title">{COURSE.title}</h1>
          <h2 className="ta__hero-sub2">{COURSE.subtitle2}</h2>
          <p className="ta__hero-description">{COURSE.description}</p>
          <div className="ta__hero-cta-wrap">
            <button className="ta__hero-cta">{COURSE.cta}</button>
          </div>
        </div>
      </section>

      <section className="ta__stats-bar">
        {COURSE.stats.map((stat, i) => (
          <div key={i} className="ta__stat-item">
            <stat.icon size={20} />
            <div className="ta__stat-values">
              <span className="ta__stat-value">{stat.value}</span>
              <span className="ta__stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </section>

      <nav className="ta__sub-tabs">
        {subTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`ta__sub-tab ${activeSubTab === tab.id ? 'ta__sub-tab--active' : ''}`}
              onClick={() => setActiveSubTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="ta__sub-content">
        {activeSubTab === 'overview' && renderOverview()}
        {activeSubTab === 'chapters' && renderChapters()}
        {activeSubTab === 'resources' && renderResources()}
      </div>

      <section className="ta__course-stats">
        <div className="ta__course-stat">
          <Users size={24} />
          <span className="ta__course-stat-value">{COURSE_STATS.totalStudents}</span>
          <span className="ta__course-stat-label">Students Enrolled</span>
        </div>
        <div className="ta__course-stat">
          <BookOpen size={24} />
          <span className="ta__course-stat-value">{COURSE_STATS.totalLessons}</span>
          <span className="ta__course-stat-label">Total Lessons</span>
        </div>
        <div className="ta__course-stat">
          <Clock size={24} />
          <span className="ta__course-stat-value">{COURSE_STATS.totalHours}</span>
          <span className="ta__course-stat-label">Hours of Content</span>
        </div>
        <div className="ta__course-stat">
          <Star size={24} />
          <span className="ta__course-stat-value">{COURSE_STATS.rating}</span>
          <span className="ta__course-stat-label">Rating</span>
        </div>
      </section>

      <footer className="ta__footer">
        <p>© 2026 Deriv Course Platform. All rights reserved. This course is for educational purposes only and does not constitute financial advice.</p>
      </footer>
    </div>
  )
}
