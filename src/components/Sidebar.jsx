import { useState, useRef, useEffect } from 'react'
import './Sidebar.css'
import logoImg from '../assets/logo.png'

const p = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round',
  width: 17, height: 17,
}

const menuItems = [
  {
    label: '复刻',
    icon: (
      <svg {...p}>
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '混剪',
    icon: (
      <svg {...p}>
        <circle cx="6" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
      </svg>
    ),
    iconActive: (
      <svg {...p} strokeWidth="2">
        <circle cx="6" cy="6" r="3" fill="currentColor" stroke="none"/>
        <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none"/>
        <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
      </svg>
    ),
  },
  {
    label: '生成',
    icon: (
      <svg {...p}>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
      </svg>
    ),
  },
  {
    label: '资产',
    icon: (
      <svg {...p}>
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    label: '知识库',
    icon: (
      <svg {...p}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Sidebar({ activeMenu, onMenuChange, darkMode, onToggleDark }) {
  const [logoError, setLogoError] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })
  const avatarRef = useRef(null)

  useEffect(() => {
    if (!avatarOpen) return
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [avatarOpen])

  const handleAvatarClick = () => {
    if (!avatarOpen && avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect()
      setPopoverPos({ top: rect.top, left: rect.right + 8 })
    }
    setAvatarOpen(v => !v)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {!logoError ? (
          <img src={logoImg} alt="虾剪" className="logo-img" onError={() => setLogoError(true)} />
        ) : (
          <div className="logo-fallback">🦞</div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.label
          return (
            <button
              key={item.label}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onMenuChange(item.label)}
              title={item.label}
            >
              <span className="nav-icon">
                {isActive ? item.iconActive : item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-dark-toggle" onClick={onToggleDark} title={darkMode ? '切换亮色' : '切换暗色'}>
          {darkMode ? (
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          )}
        </button>
        <div className="user-avatar-wrap" ref={avatarRef}>
          <div className="user-avatar" onClick={handleAvatarClick} title="账户">
            U
          </div>
          {avatarOpen && (
            <div className="avatar-popover" style={{ position: 'fixed', top: popoverPos.top, left: popoverPos.left }}>
              <button className="avatar-popover-item logout" onClick={() => setAvatarOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
