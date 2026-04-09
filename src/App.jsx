import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MainContent from './components/MainContent'
import InputBar from './components/InputBar'
import AssetPanel from './components/AssetPanel'
import TeamPanel from './components/TeamPanel'
import LoginPage from './components/LoginPage'
import './App.css'

const MOCK_TEXT = `# 《逆袭：从平凡到非凡》——猫七七创业故事短剧脚本

## 🎬 剧本信息
- **剧名**：逆袭：从平凡到非凡
- **主题**：女性创业·梦想坚持·品牌初心
- **时长**：15分钟短剧
- **核心人物**：猫七七（孙书梅）

---

## 🎬 第一幕：起点·微光
场景：简陋的出租屋/夜晚 时间：2018年初

【画面】
- 昏暗的灯光下，40+的孙书梅（猫七七）对着手机镜头略显生涩
- 桌上摆着几瓶自用护肤品
- 背景是简单的白墙，隐约可见生活痕迹

【台词】猫七七：（对着镜头，真诚而紧张）"大家好，我是猫七七...今天想和大家分享我用了十年的面霜，我不是专业主播，就是一个普通女人，但好东西想让大家知道..."
【画外音】*初的直播，观看人数：23人 但她眼中有光*

---

## 🎬 第二幕：破局·转机
场景：直播间/白天 时间：2019年

【画面】
- 更整洁的直播间，简单补光灯
- 猫七七神情更自信，与粉丝互动自然

【台词】猫七七："姐妹们，这款精华我自己用了三个月，你们看我的皮肤状态..."
【画外音】*粉丝突破10万，她开始思考：能不能做自己的品牌？*`

function App() {
  const [authed, setAuthed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ai-material.authed')) === true } catch { return false }
  })
  const [activeMenu, setActiveMenu] = useState('生成')
  const [darkMode, setDarkMode] = useState(false)
  const [currentSession, setCurrentSession] = useState({ id: 1, name: '未命名对话' })
  const [sessions, setSessions] = useState([
    { id: 1, name: '未命名对话', date: '2026-03-01修改' },
    { id: 2, name: '未命名对话', date: '2026-03-01修改' },
  ])
  const [generatedImages, setGeneratedImages] = useState([])
  const [reEditData, setReEditData] = useState(null)

  const handleLogin = ({ phone }) => {
    localStorage.setItem('ai-material.authed', 'true')
    setAuthed(true)
  }

  const handleLogout = () => {
    localStorage.setItem('ai-material.authed', 'false')
    setAuthed(false)
  }

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleNewSession = () => {
    const id = Date.now()
    const newSession = { id, name: '未命名对话', date: '刚刚' }
    setSessions(prev => [newSession, ...prev])
    setCurrentSession(newSession)
    setGeneratedImages([])
  }

  const handleRenameSession = (id, name) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, name } : s))
    if (currentSession.id === id) setCurrentSession(prev => ({ ...prev, name }))
  }

  const handleDeleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (currentSession.id === id && sessions.length > 1) {
      const remaining = sessions.filter(s => s.id !== id)
      setCurrentSession(remaining[0])
    }
  }

  const handleGenerate = (img) => {
    const id = Date.now()
    if (img.genType === '文案写作') {
      setGeneratedImages(prev => [{ ...img, id, textContent: MOCK_TEXT }, ...prev])
      return
    }
    setGeneratedImages(prev => [{ ...img, id, progress: 0 }, ...prev])
    let p = 0
    const timer = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 8
      if (p >= 100) {
        p = 100
        clearInterval(timer)
        setGeneratedImages(prev => prev.map(item => item.id === id ? { ...item, progress: 100 } : item))
      } else {
        setGeneratedImages(prev => prev.map(item => item.id === id ? { ...item, progress: p } : item))
      }
    }, 400)
  }

  if (!authed) return <LoginPage onLogin={handleLogin} />

  return (
    <div className="app-layout">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(v => !v)}
        onLogout={handleLogout}
      />
      <div className="main-area">
        {activeMenu === '资产' ? (
          <AssetPanel/>
        ) : activeMenu === '团队' ? (
          <TeamPanel/>
        ) : (
          <>
            <TopBar
              currentSession={currentSession}
              sessions={sessions}
              onSessionSelect={setCurrentSession}
              onNewSession={handleNewSession}
              onRename={handleRenameSession}
              onDelete={handleDeleteSession}
            />
            <MainContent
              images={generatedImages}
              onDelete={(id) => setGeneratedImages(prev => prev.filter(img => img.id !== id))}
              onReEdit={(img) => setReEditData(img)}
            />
            <InputBar
              reEditData={reEditData}
              onReEditDone={() => setReEditData(null)}
              onGenerate={handleGenerate}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
