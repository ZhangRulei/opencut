import { useState } from 'react'
import './VoicePanel.css'

const VOICE_TABS = ['品牌自有', '通用音色']

const VOICES = {
  '品牌自有': [
    { id: 1, name: '猫七七阿姨', tags: ['多情感'], emotions: ['中性', '沮丧', '开心', '愤怒'] },
    { id: 2, name: '叔叔', tags: ['多情感'], emotions: ['中性', '沮丧'] },
    { id: 3, name: '猫七七', tags: ['多情感'], emotions: ['中性', '开心'] },
    { id: 4, name: '尹若涵（妞妞）', tags: ['多情感'], emotions: ['中性', '沮丧', '开心'] },
  ],
  '通用音色': [
    { id: 5, name: '通用女声', tags: [], emotions: ['中性'] },
    { id: 6, name: '通用男声', tags: [], emotions: ['中性'] },
    { id: 7, name: '温柔女声', tags: ['多情感'], emotions: ['中性', '开心'] },
  ],
}

const IcoPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

const IcoExpand = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

function VoiceCard({ voice, selected, expanded, onSelect, onToggleExpand, speed, volume, emotion, onSpeedChange, onVolumeChange, onEmotionChange }) {
  return (
    <div className={`voice-card ${selected ? 'selected' : ''}`}>
      <div className="voice-card-main" onClick={onSelect}>
        <div className="voice-avatar">
          <IcoPlay/>
        </div>
        <span className="voice-name">{voice.name}</span>
        {voice.tags.map(t => <span key={t} className="voice-tag">{t}</span>)}
        {selected && (
          <button className="voice-expand-btn" onClick={e => { e.stopPropagation(); onToggleExpand() }}>
            <IcoExpand/>
          </button>
        )}
      </div>
      {selected && expanded && (
        <div className="voice-settings">
          <div className="voice-slider-row">
            <span className="voice-slider-label">语速</span>
            <input type="range" min="-10" max="10" value={speed} onChange={e => onSpeedChange(Number(e.target.value))} className="voice-slider"/>
            <span className="voice-slider-val">{speed}</span>
          </div>
          <div className="voice-slider-row">
            <span className="voice-slider-label">音量</span>
            <input type="range" min="-10" max="10" value={volume} onChange={e => onVolumeChange(Number(e.target.value))} className="voice-slider"/>
            <span className="voice-slider-val">{volume}</span>
          </div>
          <div className="voice-emotion-row">
            <span className="voice-slider-label">情感</span>
            <div className="voice-emotions">
              {voice.emotions.map(em => (
                <button key={em} className={`voice-emotion-btn ${emotion === em ? 'active' : ''}`} onClick={() => onEmotionChange(em)}>
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VoicePanel({ value, onChange }) {
  const [tab, setTab] = useState('品牌自有')
  const [selectedId, setSelectedId] = useState(value?.id || 1)
  const [expandedId, setExpandedId] = useState(1)
  const [speed, setSpeed] = useState(0)
  const [volume, setVolume] = useState(0)
  const [emotion, setEmotion] = useState('中性')

  const voices = VOICES[tab] || []

  const handleSelect = (voice) => {
    setSelectedId(voice.id)
    setExpandedId(voice.id)
    setEmotion(voice.emotions[0] || '中性')
    onChange?.({ ...voice, speed, volume, emotion })
  }

  return (
    <div className="voice-panel">
      <div className="voice-panel-tabs">
        {VOICE_TABS.map(t => (
          <button key={t} className={`voice-panel-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="voice-list">
        {voices.map(v => (
          <VoiceCard
            key={v.id}
            voice={v}
            selected={selectedId === v.id}
            expanded={expandedId === v.id}
            onSelect={() => handleSelect(v)}
            onToggleExpand={() => setExpandedId(expandedId === v.id ? null : v.id)}
            speed={speed}
            volume={volume}
            emotion={emotion}
            onSpeedChange={setSpeed}
            onVolumeChange={setVolume}
            onEmotionChange={setEmotion}
          />
        ))}
      </div>
    </div>
  )
}
