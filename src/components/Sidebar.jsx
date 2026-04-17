import { useState, useRef, useEffect } from 'react'
import './Sidebar.css'
import logoImg from '../assets/logo.png'
import { Copy, Scissors, Star, Folder, BookOpen, Sun, Moon, LogOut, Users } from 'lucide-react'

const menuItems = [
  { label: '复刻', icon: <Copy size={17} strokeWidth={1.5}/>, iconActive: <Copy size={17} strokeWidth={2}/> },
  { label: '混剪', icon: <Scissors size={17} strokeWidth={1.5}/>, iconActive: <Scissors size={17} strokeWidth={2}/> },
  { label: '生成', icon: <Star size={17} strokeWidth={1.5}/>, iconActive: <Star size={17} strokeWidth={2} fill="currentColor"/> },
  { label: '资产', icon: <Folder size={17} strokeWidth={1.5}/>, iconActive: <Folder size={17} strokeWidth={2} fill="currentColor"/> },
  { label: '知识库', icon: <BookOpen size={17} strokeWidth={1.5}/>, iconActive: <BookOpen size={17} strokeWidth={2}/> },
  { label: '技能', icon: <Star size={17} strokeWidth={1.5}/>, iconActive: <Star size={17} strokeWidth={2}/> },
  {
    label: '团队',
    icon: <Users size={17} strokeWidth={1.5}/>,
    iconActive: <Users size={17} strokeWidth={2}/>,
    subMenu: [
      { label: '生成记录', value: 'records' },
      { label: '积分管理', value: 'credits' },
      { label: '成员管理', value: 'members' }
    ]
  },
]

export default function Sidebar({ activeMenu, onMenuChange, darkMode, onToggleDark, onLogout }) {
  const [logoError, setLogoError] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })
  const [showTeamMenu, setShowTeamMenu] = useState(false)
  const [teamMenuPos, setTeamMenuPos] = useState({ top: 0, left: 0 })
  const avatarRef = useRef(null)
  const teamRef = useRef(null)

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

  useEffect(() => {
    if (!showTeamMenu) return
    const handler = (e) => {
      if (teamRef.current && !teamRef.current.contains(e.target)) {
        setShowTeamMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showTeamMenu])

  const handleAvatarClick = () => {
    if (!avatarOpen && avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect()
      setPopoverPos({ top: rect.top, left: rect.right + 8 })
    }
    setAvatarOpen(v => !v)
  }

  const handleTeamHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTeamMenuPos({ top: rect.top, left: rect.right + 8 })
    setShowTeamMenu(true)
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
          const isActive = activeMenu === item.label || (item.subMenu && item.subMenu.some(sub => activeMenu === sub.value))
          return (
            <div key={item.label} ref={item.label === '团队' ? teamRef : null}>
              <button
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => !item.subMenu && onMenuChange(item.label)}
                onMouseEnter={item.subMenu ? handleTeamHover : undefined}
                onMouseLeave={item.subMenu ? () => setShowTeamMenu(false) : undefined}
                title={item.label}
              >
                <span className="nav-icon">
                  {isActive ? item.iconActive : item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
              {item.subMenu && showTeamMenu && (
                <div
                  className="sidebar-submenu"
                  style={{ position: 'fixed', top: teamMenuPos.top, left: teamMenuPos.left }}
                  onMouseEnter={() => setShowTeamMenu(true)}
                  onMouseLeave={() => setShowTeamMenu(false)}
                >
                  {item.subMenu.map(sub => (
                    <button
                      key={sub.value}
                      className="submenu-item"
                      onClick={() => { onMenuChange(sub.value); setShowTeamMenu(false) }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-dark-toggle" onClick={onToggleDark} title={darkMode ? '切换亮色' : '切换暗色'}>
          {darkMode ? <Sun size={15} strokeWidth={1.6}/> : <Moon size={15} strokeWidth={1.6}/>}
        </button>
        <div className="user-avatar-wrap" ref={avatarRef}>
          <div className="user-avatar" onClick={handleAvatarClick} title="账户">
            U
          </div>
          {avatarOpen && (
            <div className="avatar-popover" style={{ position: 'fixed', top: popoverPos.top, left: popoverPos.left }}>
              <button className="avatar-popover-item logout" onClick={() => { setAvatarOpen(false); onLogout?.() }}>
                <LogOut size={14} strokeWidth={1.6}/>
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
