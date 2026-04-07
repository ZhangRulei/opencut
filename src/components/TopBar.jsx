import { useState, useRef, useEffect } from 'react'
import './TopBar.css'
import { ChevronDown, Plus, Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

const TIME_OPTIONS = ['全部', '今天', '最近7天', '最近30天']
const GEN_OPTIONS = ['全部', '文案写作', '图片生成', '视频生成', '语音合成', '数字人']

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="filter-dropdown-wrap" ref={ref}>
      <button className={`filter-btn ${open ? 'open' : ''}`} onClick={() => setOpen(v => !v)}>
        {value === '全部' ? label : value}
        <ChevronDown size={12} strokeWidth={2}/>
      </button>
      {open && (
        <div className="filter-panel">
          {options.map(opt => (
            <button
              key={opt}
              className={`filter-option ${value === opt ? 'active' : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TopBar({ currentSession, sessions, onSessionSelect, onNewSession, onRename, onDelete }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState(null) // { sessionId, x, y }
  const [renaming, setRenaming] = useState(null)
  const [timeFilter, setTimeFilter] = useState('全部')
  const [genFilter, setGenFilter] = useState('全部')
  const dropdownRef = useRef(null)
  const renameRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
        setContextMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (renaming && renameRef.current) renameRef.current.focus()
  }, [renaming])

  const handleRenameSubmit = (id) => {
    if (renaming?.value?.trim()) onRename(id, renaming.value.trim())
    setRenaming(null)
    setContextMenu(null)
    setDropdownOpen(false)
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="session-selector" ref={dropdownRef}>
          <button
            className={`session-btn ${dropdownOpen ? 'open' : ''}`}
            onClick={() => {
              setDropdownOpen(v => !v)
              setContextMenu(null)
            }}
          >
            <span className="session-name">{currentSession.name}</span>
            <ChevronDown size={12} strokeWidth={2}/>
          </button>

          {dropdownOpen && (
            <div className="session-dropdown">
              <button className="new-session-btn" onClick={() => { onNewSession(); setDropdownOpen(false) }}>
                <span className="plus-icon"><Plus size={12} strokeWidth={2}/></span>
                新建对话
              </button>
              <div className="session-divider"/>
              <div className="session-list">
                {sessions.map(session => (
                  <div key={session.id} className={`session-item ${currentSession.id === session.id ? 'active' : ''}`}>
                    {renaming?.sessionId === session.id ? (
                      <input
                        ref={renameRef}
                        className="rename-input"
                        value={renaming.value}
                        onChange={e => setRenaming(r => ({ ...r, value: e.target.value }))}
                        onBlur={() => handleRenameSubmit(session.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRenameSubmit(session.id)
                          if (e.key === 'Escape') {
                            setRenaming(null)
                            setContextMenu(null)
                          }
                        }}
                      />
                    ) : (
                      <>
                        <div className="session-item-main" onClick={() => { onSessionSelect(session); setDropdownOpen(false) }}>
                          <span className="session-item-name">{session.name}</span>
                          <span className="session-item-date">{session.date}</span>
                        </div>
                        {currentSession.id === session.id && (
                          <span className="check-icon"><Check size={12} strokeWidth={2}/></span>
                        )}
                        <button className={`more-btn ${contextMenu?.sessionId === session.id ? 'active' : ''}`} onClick={e => { e.stopPropagation(); if (contextMenu?.sessionId === session.id) { setContextMenu(null) } else { const r = e.currentTarget.getBoundingClientRect(); setContextMenu({ sessionId: session.id, x: r.right + 4, y: r.top }) } }}>
                          <MoreHorizontal size={12} strokeWidth={2}/>
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <div className="filter-box">
          <FilterDropdown label="时间" options={TIME_OPTIONS} value={timeFilter} onChange={setTimeFilter}/>
          <div className="filter-sep"/>
          <FilterDropdown label="生成类型" options={GEN_OPTIONS} value={genFilter} onChange={setGenFilter}/>
        </div>
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999 }}
        >
          {sessions.filter(s => s.id === contextMenu.sessionId).map(session => (
            <div key={session.id}>
              <button className="ctx-item" onClick={() => { setRenaming({ sessionId: session.id, value: session.name }); setContextMenu(null) }}>
                <Pencil size={11} strokeWidth={1.6}/>
                重命名
              </button>
              <button className="ctx-item danger" onClick={() => { onDelete(session.id); setContextMenu(null); setDropdownOpen(false) }}>
                <Trash2 size={11} strokeWidth={1.6}/>
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
