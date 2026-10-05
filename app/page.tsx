'use client'

import { useRef, useState } from 'react'
import { Link as LinkIcon, Mail, X } from 'lucide-react'

const navigation = [
  { label: 'about', image: '/images/about-icon.png', title: 'About', content: <><div className="about-placeholder" aria-hidden="true" /><div><h2>Name</h2><p>Third-year Cybersecurity Engineer Student<br />at Srinakarinwirot University</p></div></> },
  { label: 'work', image: '/images/work-icon.png', title: 'Work', content: <div className="window-list"><h2>Tools</h2><h2>Programming</h2><h2>Development</h2></div> },
  { label: 'experiences', image: '/images/experiences-icon.png', title: 'Experiences', content: <div className="window-list"><h2>Course</h2><h2>Certificate</h2></div> },
  { label: 'contact', image: '/images/contact-icon.png', title: 'Contact', content: <div className="window-list"><h2>You can contact me via Email!</h2><a className="email-link" href="mailto:hello@runa.example">hello@runa.example</a></div> },
  { label: 'support me', image: '/images/support-icon.png', title: 'Support Me', content: <div className="window-list"><h2>Sticker line!</h2><p className="editable-note">Add your support links here.</p></div> },
]

export default function Page() {
  const [darkMode, setDarkMode] = useState(false)
  const [windows, setWindows] = useState<Array<{ id: number; item: (typeof navigation)[number]; x: number; y: number }>>([])
  const nextId = useRef(1)
  const drags = useRef<Record<number, { active: boolean; startX: number; startY: number; originX: number; originY: number }>>({})

  function openWindow(item: (typeof navigation)[number]) {
    const id = nextId.current++
    const offset = (id - 1) * 24
    setWindows((current) => [...current, { id, item, x: offset, y: offset }])
  }

  function closeWindow(id: number) {
    setWindows((current) => current.filter((window) => window.id !== id))
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>, id: number) {
    if ((event.target as HTMLElement).closest('button')) return
    const window = windows.find((entry) => entry.id === id)
    if (!window) return
    drags.current[id] = { active: true, startX: event.clientX, startY: event.clientY, originX: window.x, originY: window.y }
    event.currentTarget.setPointerCapture(event.pointerId)
    setWindows((current) => [...current.filter((entry) => entry.id !== id), window])
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>, id: number) {
    const drag = drags.current[id]
    if (!drag?.active) return
    setWindows((current) => current.map((window) => window.id === id ? { ...window, x: drag.originX + event.clientX - drag.startX, y: drag.originY + event.clientY - drag.startY } : window))
  }

  function endDrag(id: number) { if (drags.current[id]) drags.current[id].active = false }

  return (
    <main className={`portfolio-shell ${darkMode ? 'dark-mode' : ''}`}>
      <button className="sun-doodle, theme-toggle" type="button" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
        <img src="/images/lightmode-icon.png" alt="Toggle light and dark mode" />
      </button>
      <div className="corner-doodle" aria-hidden="true">
        <span>
          <img src="/images/hamham.png" alt="mr.hamham"/>
        </span>
      </div>

      <section className="portfolio-window" aria-labelledby="page-title">
        <header className="window-bar"><span>Home</span><div className="window-dots" aria-hidden="true"><i /><i /><i /></div></header>
        <div className="window-content">
          <div className="intro-copy"><p className="eyebrow">welcome to my little corner of the internet</p><h1 id="page-title">Hi! I&apos;m <strong>Runa</strong></h1><p className="subtitle">cybersecurity engineer student, graphic designer, artist</p></div>
          <div className="profile-sticker" aria-hidden="true"><div className="sticker-face"><span className="ear left" /><span className="ear right" /><span className="eye left" /><span className="eye right" /><span className="blush left" /><span className="blush right" /><span className="mouth" /></div><div className="sticker-body" /><div className="sticker-laptop" /></div>
          <nav className="portfolio-nav" aria-label="Portfolio sections">{navigation.map((item) => <button className={`nav-item ${windows.some((window) => window.item.label === item.label) ? 'is-active' : ''}`} key={item.label} type="button" onClick={() => openWindow(item)}><span className="nav-icon"><img src={item.image} alt="" /></span><span className="nav-label">{item.label}</span></button>)}</nav>
        </div>
      </section>

      {windows.map((window) => <div className="modal-layer" key={window.id} role="presentation"><section className="content-window" style={{ transform: `translate(${window.x}px, ${window.y}px)` }} role="dialog" aria-modal="false" aria-labelledby={`content-title-${window.id}`}><header className="content-bar" onPointerDown={(event) => startDrag(event, window.id)} onPointerMove={(event) => moveDrag(event, window.id)} onPointerUp={() => endDrag(window.id)} onPointerCancel={() => endDrag(window.id)}><h2 id={`content-title-${window.id}`}>{window.item.title}</h2><button type="button" onClick={() => closeWindow(window.id)} aria-label={`Close ${window.item.title}`}><X size={39} /></button></header><div className="content-body">{window.item.content}</div></section></div>)}

      <footer className="site-footer">
        <div className="social-links">
          <a href="https://www.linkedin.com/in/liyaporn-penniwejsuk-ab1509326" aria-label="LinkedIn"><LinkIcon size={25} /></a>
          <a href="mailto:hello@runa.example" aria-label="Runa-Email!"><Mail size={25} /></a>
        </div>
        <p>2026 Portfolio Website</p>
      </footer>
    </main>
  )
}

// fix stackable same windows, prevent overlapping, add scroll bars inside windows
// also secure the email link to prevent spam bots, add more content to each window, and make the windows resizable
// also enforce security for my website
// add faq bubble text in mr.hamham, and add a contact form with validation and captcha to prevent spam