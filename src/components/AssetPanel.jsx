import { useMemo, useRef, useState } from 'react'
import './AssetPanel.css'
import {
  Check,
  ChevronRight,
  Copy,
  Download,
  FileAudio2,
  FileImage,
  FileVideo,
  Folder,
  FolderOpen,
  LayoutGrid,
  List,
  MoreHorizontal,
  Move,
  Pencil,
  Plus,
  Search,
  Share2,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

const ROOT_TREE = [
  {
    id: 'personal',
    name: '个人资产',
    children: [
      {
        id: 'personal-ai',
        name: 'AI生成',
        children: [
          { id: 'personal-ai-image', name: '图片', children: [] },
          { id: 'personal-ai-video', name: '视频', children: [] },
          { id: 'personal-ai-audio', name: '音频', children: [] },
        ],
      },
      {
        id: 'personal-upload',
        name: '我上传的',
        children: [
          { id: 'personal-upload-image', name: '图片', children: [] },
          { id: 'personal-upload-video', name: '视频', children: [] },
          { id: 'personal-upload-audio', name: '音频', children: [] },
        ],
      },
    ],
  },
  {
    id: 'public',
    name: '公共资产',
    children: [
      { id: 'public-image', name: '图片', children: [] },
      { id: 'public-video', name: '视频', children: [] },
      { id: 'public-audio', name: '音频', children: [] },
    ],
  },
]

const ASSETS = {
  'personal-ai-video': [
    {
      id: 'a-v-001',
      name: '虾剪口播_0415',
      fileType: 'video',
      sourceType: 'ai_generated',
      format: 'mp4',
      updatedAt: '今天更新',
      dateGroup: '今天',
      fileSize: '45 MB',
      duration: '00:32',
      resolution: '1920x1080',
      fps: 30,
      processStatus: 'completed',
      processStage: 'tag',
      segmentsCount: 8,
      asrText: '大家好今天给大家推荐一款神器，这个真的太好用了。',
      thumbnail: 'https://picsum.photos/seed/v001/640/360',
      prompt: '口播视频，年轻女性面对镜头推荐产品，自然光线，竖屏',
      aiModel: 'Video Gen v3 | 9:16 | 1080p',
    },
    {
      id: 'a-v-002',
      name: '春季活动预告',
      fileType: 'video',
      sourceType: 'ai_generated',
      format: 'mp4',
      updatedAt: '今天更新',
      dateGroup: '今天',
      fileSize: '68 MB',
      duration: '01:12',
      resolution: '1080x1920',
      fps: 30,
      processStatus: 'processing',
      processStage: 'segment',
      progress: 62,
      segmentsCount: 0,
      thumbnail: 'https://picsum.photos/seed/v002/640/360',
      prompt: '春季新品发布预告，产品特写切换，动感节奏，横屏',
      aiModel: 'Video Gen v3 | 16:9 | 1080p',
    },
    {
      id: 'a-v-003',
      name: '直播录屏_品牌讲解',
      fileType: 'video',
      sourceType: 'ai_generated',
      format: 'mp4',
      updatedAt: '昨天更新',
      dateGroup: '昨天',
      fileSize: '132 MB',
      duration: '03:18',
      resolution: '1920x1080',
      fps: 24,
      processStatus: 'failed',
      processStage: 'asr',
      errorMessage: '音轨异常，ASR任务中断',
      segmentsCount: 0,
      thumbnail: 'https://picsum.photos/seed/v003/640/360',
    },
  ],
  'personal-ai-image': [
    {
      id: 'a-i-001',
      name: '产品白底主图',
      fileType: 'image',
      sourceType: 'ai_generated',
      format: 'jpg',
      updatedAt: '今天更新',
      dateGroup: '今天',
      fileSize: '2.5 MB',
      resolution: '1920x1080',
      tags: ['产品', '白底'],
      thumbnail: 'https://picsum.photos/seed/i001/400/300',
      prompt: '真人写实电影风格，白底产品图，一瓶精华液放在大理石台面上，柔光打光，高级感，16:9',
      aiModel: 'Nano banana2 | 1:1 | 2K',
    },
    {
      id: 'a-i-002',
      name: '软帽口播_0415',
      fileType: 'image',
      sourceType: 'ai_generated',
      format: 'jpg',
      updatedAt: '今天更新',
      dateGroup: '今天',
      fileSize: '1.8 MB',
      resolution: '1080x1080',
      tags: ['口播', '人物'],
      thumbnail: 'https://picsum.photos/seed/i002/400/300',
      prompt: '年轻女性戴软帽，面对镜头微笑，暖色调，口播场景，浅景深',
      aiModel: 'Nano banana2 | 1:1 | 2K',
    },
    {
      id: 'a-i-003',
      name: '春假活动封面',
      fileType: 'image',
      sourceType: 'ai_generated',
      format: 'png',
      updatedAt: '昨天更新',
      dateGroup: '昨天',
      fileSize: '3.2 MB',
      resolution: '1920x1080',
      tags: ['活动', '封面'],
      thumbnail: 'https://picsum.photos/seed/i003/400/300',
      prompt: '春季促销活动封面，樱花元素，粉色渐变背景，文字留白区域，清新风格',
      aiModel: 'Nano banana2 | 16:9 | 2K',
    },
  ],
  'personal-upload-video': [
    {
      id: 'a-v-004',
      name: '手机拍摄_门店探访',
      fileType: 'video',
      sourceType: 'uploaded',
      format: 'mp4',
      updatedAt: '4月3日',
      dateGroup: '4月3日',
      fileSize: '88 MB',
      duration: '00:55',
      resolution: '1080x1920',
      fps: 30,
      processStatus: 'completed',
      processStage: 'tag',
      segmentsCount: 6,
      thumbnail: 'https://picsum.photos/seed/v004/640/360',
    },
  ],
  'personal-upload-image': [
    {
      id: 'a-i-004',
      name: '门店实拍_外景',
      fileType: 'image',
      sourceType: 'uploaded',
      format: 'jpg',
      updatedAt: '4月3日',
      dateGroup: '4月3日',
      fileSize: '4.1 MB',
      resolution: '4032x3024',
      tags: ['门店', '实拍'],
      thumbnail: 'https://picsum.photos/seed/i004/400/300',
    },
  ],
  'personal-upload-audio': [
    {
      id: 'a-a-001',
      name: '旁白配音_v2',
      fileType: 'audio',
      sourceType: 'uploaded',
      format: 'mp3',
      updatedAt: '昨天更新',
      dateGroup: '昨天',
      fileSize: '4.8 MB',
      duration: '01:08',
      tags: ['口播', '旁白'],
    },
    {
      id: 'a-a-002',
      name: '背景音乐_轻快',
      fileType: 'audio',
      sourceType: 'uploaded',
      format: 'mp3',
      updatedAt: '4月3日',
      dateGroup: '4月3日',
      fileSize: '6.2 MB',
      duration: '02:34',
      tags: ['BGM', '轻快'],
    },
  ],
  'public-video': [
    {
      id: 'p-v-001',
      name: '公共素材_上新通告',
      fileType: 'video',
      sourceType: 'shared',
      format: 'mp4',
      updatedAt: '今天更新',
      dateGroup: '今天',
      fileSize: '54 MB',
      duration: '00:42',
      resolution: '1920x1080',
      fps: 30,
      processStatus: 'completed',
      processStage: 'tag',
      segmentsCount: 5,
      thumbnail: 'https://picsum.photos/seed/pv001/640/360',
    },
  ],
  'public-image': [
    {
      id: 'p-i-001',
      name: '通用Banner_春季',
      fileType: 'image',
      sourceType: 'shared',
      format: 'jpg',
      updatedAt: '今天更新',
      dateGroup: '今天',
      fileSize: '1.2 MB',
      resolution: '1920x600',
      tags: ['Banner', '春季'],
      thumbnail: 'https://picsum.photos/seed/pi001/400/300',
    },
  ],
}

const FILE_TYPE_LABEL = { all: '全部', image: '图片', video: '视频', audio: '音频' }
const SOURCE_LABEL = { ai_generated: 'AI生成', uploaded: '我上传的', shared: '公共资产' }
const LOCKED_FOLDERS = new Set([
  'personal',
  'personal-ai',
  'personal-ai-image',
  'personal-ai-video',
  'personal-ai-audio',
  'personal-upload',
  'personal-upload-image',
  'personal-upload-video',
  'personal-upload-audio',
  'public',
  'public-image',
  'public-video',
  'public-audio',
])

const stageText = {
  asr: 'ASR转录中',
  segment: '智能分段中',
  tag: '自动打标中',
}

function fileIcon(type, size = 16) {
  if (type === 'video') return <FileVideo size={size} strokeWidth={1.7} />
  if (type === 'image') return <FileImage size={size} strokeWidth={1.7} />
  return <FileAudio2 size={size} strokeWidth={1.7} />
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children?.length) {
      const found = findNode(n.children, id)
      if (found) return found
    }
  }
  return null
}

function collectDescendantIds(node, ids = []) {
  ids.push(node.id)
  node.children?.forEach((c) => collectDescendantIds(c, ids))
  return ids
}

function updateNode(nodes, id, updater) {
  return nodes.map((n) => {
    if (n.id === id) return updater(n)
    if (n.children?.length) return { ...n, children: updateNode(n.children, id, updater) }
    return n
  })
}

function addChildNode(nodes, parentId, childNode) {
  return updateNode(nodes, parentId, (n) => ({ ...n, children: [...(n.children || []), childNode] }))
}

function removeNodeAndCollectIds(nodes, id) {
  let removed = null

  const walk = (arr) => {
    const next = []
    arr.forEach((n) => {
      if (n.id === id) {
        removed = n
        return
      }
      if (n.children?.length) next.push({ ...n, children: walk(n.children) })
      else next.push(n)
    })
    return next
  }

  const tree = walk(nodes)
  const removedIds = removed ? collectDescendantIds(removed, []) : []
  return { tree, removed, removedIds }
}

function insertNode(nodes, parentId, node) {
  return addChildNode(nodes, parentId, node)
}

function flattenFolders(nodes, depth = 0, result = []) {
  nodes.forEach((n) => {
    result.push({ id: n.id, name: n.name, depth })
    if (n.children?.length) flattenFolders(n.children, depth + 1, result)
  })
  return result
}

function getParentId(nodes, childId, parentId = null) {
  for (const n of nodes) {
    if (n.id === childId) return parentId
    if (n.children?.length) {
      const found = getParentId(n.children, childId, n.id)
      if (found) return found
    }
  }
  return null
}

function statusBadge(file) {
  if (file.fileType !== 'video') return null
  if (file.processStatus === 'completed') return { cls: 'done', text: `${file.segmentsCount || 0}片段` }
  if (file.processStatus === 'processing') return { cls: 'processing', text: stageText[file.processStage] || '处理中' }
  return { cls: 'failed', text: file.errorMessage || '处理失败' }
}

const MOCK_SEGMENTS = [
  { id: 1, time: '00:00 - 00:03', startSec: 0, dur: '2.3s', tags: ['特写', '有人声', '钩子'], text: '大家好', emotion: 'high', thumb: 'https://picsum.photos/seed/seg1/120/68', refs: 12 },
  { id: 2, time: '00:03 - 00:08', startSec: 3, dur: '4.8s', tags: ['中景', '有人声', '有产品'], text: '今天给大家推荐一款神器', emotion: 'medium', thumb: 'https://picsum.photos/seed/seg2/120/68', refs: 8 },
  { id: 3, time: '00:08 - 00:12', startSec: 8, dur: '3.5s', tags: ['全景', '无人声'], text: '', emotion: 'low', thumb: 'https://picsum.photos/seed/seg3/120/68', refs: 2 },
  { id: 4, time: '00:12 - 00:16', startSec: 12, dur: '4.1s', tags: ['特写', '有人声'], text: '这个真的太好用了', emotion: 'high', thumb: 'https://picsum.photos/seed/seg4/120/68', refs: 15 },
  { id: 5, time: '00:16 - 00:20', startSec: 16, dur: '3.8s', tags: ['中景', '有产品'], text: '你们看我的皮肤状态', emotion: 'medium', thumb: 'https://picsum.photos/seed/seg5/120/68', refs: 5 },
  { id: 6, time: '00:20 - 00:24', startSec: 20, dur: '4.2s', tags: ['特写', '有人声'], text: '用了三个月效果特别好', emotion: 'high', thumb: 'https://picsum.photos/seed/seg6/120/68', refs: 9 },
  { id: 7, time: '00:24 - 00:28', startSec: 24, dur: '3.6s', tags: ['全景'], text: '', emotion: 'low', thumb: 'https://picsum.photos/seed/seg7/120/68', refs: 0 },
  { id: 8, time: '00:28 - 00:32', startSec: 28, dur: '4.0s', tags: ['中景', '有人声'], text: '赶紧下单吧姐妹们', emotion: 'high', thumb: 'https://picsum.photos/seed/seg8/120/68', refs: 21 },
]

const PROCESS_STAGES = ['asr', 'segment', 'tag']

function DetailPage({ file, onClose, onUpdateTags, onRenameFile }) {
  const [activeSegment, setActiveSegment] = useState(null)
  const [segMoreId, setSegMoreId] = useState(null)
  const [segments, setSegments] = useState(MOCK_SEGMENTS)
  const [segTagInput, setSegTagInput] = useState({ id: null, value: '' })
  const [asrExpanded, setAsrExpanded] = useState(false)
  const [addingTag, setAddingTag] = useState(false)
  const [newTagValue, setNewTagValue] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [promptCopied, setPromptCopied] = useState(false)
  const tagInputRef = useRef(null)

  if (!file) return null

  const isVideo = file.fileType === 'video'
  const isImage = file.fileType === 'image'
  const isAudio = file.fileType === 'audio'
  const completed = file.processStatus === 'completed'
  const processing = file.processStatus === 'processing'
  const failed = file.processStatus === 'failed'
  const currentStageIdx = PROCESS_STAGES.indexOf(file.processStage)

  return (
    <div className="detail-page">
      <header className="detail-topbar">
        <button className="detail-back" onClick={onClose}>
          <ChevronRight size={16} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
          <span>返回列表</span>
        </button>
        <div className="detail-topbar-title">
          {editingName ? (
            <input
              className="name-edit-input"
              value={nameValue}
              autoFocus
              onChange={(e) => setNameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && nameValue.trim()) {
                  onRenameFile(file.id, nameValue.trim())
                  setEditingName(false)
                }
                if (e.key === 'Escape') setEditingName(false)
              }}
              onBlur={() => {
                if (nameValue.trim() && nameValue.trim() !== file.name) {
                  onRenameFile(file.id, nameValue.trim())
                }
                setEditingName(false)
              }}
            />
          ) : (
            <h3 className="name-editable" onClick={() => { setNameValue(file.name); setEditingName(true) }}>{file.name}</h3>
          )}
          <span className="detail-format">{file.format.toUpperCase()}</span>
          {isVideo && completed && <span className="status-pill done">{file.segmentsCount || 0}片段 · 引用{segments.reduce((s, seg) => s + seg.refs, 0)}次</span>}
          {isVideo && processing && <span className="status-pill processing">{stageText[file.processStage]}</span>}
          {isVideo && failed && <span className="status-pill failed">处理失败</span>}
        </div>
        <div className="detail-topbar-actions">
          {isVideo && failed && <button className="action-btn primary">重新处理</button>}
          {file.sourceType !== 'shared' && <button className="action-btn"><Share2 size={14} strokeWidth={1.8} />分享</button>}
          <button className="action-btn"><Download size={14} strokeWidth={1.8} />下载</button>
          <button className="action-btn danger"><Trash2 size={14} strokeWidth={1.8} />删除</button>
        </div>
      </header>

      <div className={`detail-content ${isVideo && completed ? '' : 'no-segments'}`}>
        {/* 左侧：预览 */}
        <div className="detail-left">
          {isVideo && (
            <div className="video-player" style={file.thumbnail ? { backgroundImage: `url(${file.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
              <div className="video-play-circle">
                <ChevronRight size={24} strokeWidth={2} />
              </div>
              <div className="video-timeline">
                <div className="timeline-bar" />
                <span className="timeline-time">0:00 / {file.duration || '0:32'}</span>
              </div>
            </div>
          )}
          {isImage && (
            <div className="image-preview-full" style={file.thumbnail ? { backgroundImage: `url(${file.thumbnail})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : undefined}>
              {!file.thumbnail && <>{fileIcon('image', 36)}<span>图片预览</span></>}
            </div>
          )}
          {isAudio && (
            <div className="audio-player">
              <button className="audio-play-btn">
                <ChevronRight size={20} strokeWidth={2} />
              </button>
              <div className="audio-wave" />
              <span className="audio-time">{file.duration || '00:00'}</span>
            </div>
          )}

          {/* 视频已完成：紧凑信息 + 转录 */}
          {isVideo && completed && (
            <>
              <div className="video-meta-bar">
                <span>{file.resolution}</span>
                <span className="meta-dot" />
                <span>{file.fps}fps</span>
                <span className="meta-dot" />
                <span>{file.duration}</span>
                <span className="meta-dot" />
                <span>{file.fileSize}</span>
                <span className="meta-dot" />
                <span>{SOURCE_LABEL[file.sourceType]}</span>
              </div>
              <div className="video-asr-bar">
                <span className="asr-label">转录</span>
                <span className="asr-preview">{file.asrText || '暂无转录内容'}</span>
                <button className="text-btn" onClick={() => setAsrExpanded(!asrExpanded)}>
                  {asrExpanded ? '收起' : '展开'}
                </button>
              </div>
              {asrExpanded && (
                <div className="asr-text expanded">{file.asrText || '暂无转录内容'}</div>
              )}
              {file.sourceType === 'ai_generated' && file.prompt && (
                <div className="video-prompt-bar">
                  <span className="asr-label">提示词</span>
                  <span className="asr-preview">{file.prompt}</span>
                  <button
                    className="prompt-copy-inline"
                    onClick={() => {
                      navigator.clipboard.writeText(file.prompt)
                      setPromptCopied(true)
                      setTimeout(() => setPromptCopied(false), 1500)
                    }}
                  >
                    {promptCopied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.8} />}
                  </button>
                  {file.aiModel && <span className="prompt-model-inline">{file.aiModel}</span>}
                </div>
              )}
            </>
          )}

          {/* 视频：处理进度 */}
          {isVideo && processing && (
            <div className="detail-card">
              <h5>处理进度</h5>
              <div className="process-steps">
                <div className="process-step done"><Check size={16} strokeWidth={2.5} /><span>基础信息提取</span></div>
                {PROCESS_STAGES.map((stage, i) => {
                  const isDone = i < currentStageIdx
                  const isActive = i === currentStageIdx
                  return (
                    <div key={stage} className={`process-step ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                      {isDone ? <Check size={16} strokeWidth={2.5} /> : isActive ? <div className="process-spinner" /> : <span className="process-dot" />}
                      <span>{stageText[stage]?.replace('中', '') || stage}</span>
                      {isActive && file.progress != null && <span className="process-pct">{file.progress}%</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 视频：失败 */}
          {isVideo && failed && (
            <div className="detail-card">
              <h5>处理状态</h5>
              <div className="process-error"><X size={16} strokeWidth={2} /><span>{file.errorMessage || '处理失败'}</span></div>
            </div>
          )}
        </div>

        {/* 右侧：信息面板 / 片段列表 */}
        <div className="detail-right">
          {/* 非视频 或 视频未完成：基础信息 */}
          {!(isVideo && completed) && (
            <div className="detail-info-light">
              <h5>基础信息</h5>
              <div className="info-list">
                <div className="info-item"><span>文件大小</span><span>{file.fileSize}</span></div>
                {file.resolution && <div className="info-item"><span>分辨率</span><span>{file.resolution}</span></div>}
                {file.duration && <div className="info-item"><span>时长</span><span>{file.duration}</span></div>}
                {file.fps && <div className="info-item"><span>帧率</span><span>{file.fps}fps</span></div>}
                <div className="info-item"><span>来源</span><span>{SOURCE_LABEL[file.sourceType]}</span></div>
                <div className="info-item"><span>更新时间</span><span>{file.updatedAt}</span></div>
              </div>
            </div>
          )}

          {/* 图片/音频：标签 */}
          {!isVideo && (
            <div className="detail-info-light">
              <h5>标签</h5>
              <div className="detail-tags">
                {(file.tags || []).map((tag, i) => (
                  <span key={i} className="detail-tag">
                    {tag}
                    <button className="tag-del" onClick={() => onUpdateTags(file.id, (file.tags || []).filter((_, idx) => idx !== i))}>
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
                {addingTag ? (
                  <input
                    ref={tagInputRef}
                    className="tag-input"
                    value={newTagValue}
                    placeholder="输入标签"
                    autoFocus
                    onChange={(e) => setNewTagValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTagValue.trim()) {
                        onUpdateTags(file.id, [...(file.tags || []), newTagValue.trim()])
                        setNewTagValue('')
                        setAddingTag(false)
                      }
                      if (e.key === 'Escape') { setAddingTag(false); setNewTagValue('') }
                    }}
                    onBlur={() => {
                      if (newTagValue.trim()) {
                        onUpdateTags(file.id, [...(file.tags || []), newTagValue.trim()])
                      }
                      setNewTagValue('')
                      setAddingTag(false)
                    }}
                  />
                ) : (
                  <button className="tag-add" onClick={() => setAddingTag(true)}>
                    <Plus size={12} strokeWidth={2} />添加
                  </button>
                )}
              </div>
            </div>
          )}

          {/* AI生成：提示词（非视频） */}
          {!isVideo && file.sourceType === 'ai_generated' && file.prompt && (
            <div className="detail-info-light">
              <h5>AI提示词</h5>
              <div className="prompt-block">
                <p className="prompt-text">{file.prompt}</p>
                <button
                  className="prompt-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(file.prompt)
                    setPromptCopied(true)
                    setTimeout(() => setPromptCopied(false), 1500)
                  }}
                >
                  {promptCopied ? <><Check size={12} strokeWidth={2} />已复制</> : <><Copy size={12} strokeWidth={1.8} />复制</>}
                </button>
              </div>
              {file.aiModel && <span className="prompt-model">{file.aiModel}</span>}
            </div>
          )}

          {/* 视频已完成：片段列表 */}
          {isVideo && completed && (
            <div className="segments-panel">
              <div className="segments-head">
                <h5>片段列表 ({file.segmentsCount || segments.length})</h5>
              </div>
                <div className="segments-scroll">
                  {segments.map((seg) => (
                    <div
                      key={seg.id}
                      className={`segment-item ${activeSegment === seg.id ? 'active' : ''}`}
                      onClick={() => setActiveSegment(seg.id === activeSegment ? null : seg.id)}
                    >
                      <div className="segment-top">
                        <div className="segment-thumb" style={{ backgroundImage: `url(${seg.thumb})` }}>
                          <span className="segment-thumb-dur">{seg.dur}</span>
                        </div>
                        <div className="segment-info">
                          <div className="segment-header">
                            <span className="segment-num">#{seg.id}</span>
                            <span className="segment-time">{seg.time}</span>
                            {seg.refs > 0 && <span className="segment-refs">引用{seg.refs}次</span>}
                            <div className="segment-more-wrap">
                              <button
                                className="segment-more-btn"
                                onClick={(e) => { e.stopPropagation(); setSegMoreId(segMoreId === seg.id ? null : seg.id) }}
                              >
                                <MoreHorizontal size={14} strokeWidth={1.8} />
                              </button>
                              {segMoreId === seg.id && (
                                <div className="segment-more-menu" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => setSegMoreId(null)}><Download size={12} strokeWidth={1.8} />下载片段</button>
                                  {file.sourceType !== 'shared' && <button onClick={() => setSegMoreId(null)}><Share2 size={12} strokeWidth={1.8} />分享片段</button>}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="segment-tags" onClick={(e) => e.stopPropagation()}>
                            {seg.tags.map((tag, ti) => (
                              <span key={ti} className={`segment-tag ${tag === '钩子' ? 'hook' : ''}`}>
                                {tag === '钩子' ? '🔥 ' + tag : tag}
                                <button className="seg-tag-del" onClick={() => setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, tags: s.tags.filter((_, idx) => idx !== ti) } : s))}>
                                  <X size={8} strokeWidth={2.5} />
                                </button>
                              </span>
                            ))}
                            {segTagInput.id === seg.id ? (
                              <input
                                className="seg-tag-input"
                                value={segTagInput.value}
                                autoFocus
                                placeholder="标签"
                                onChange={(e) => setSegTagInput({ id: seg.id, value: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && segTagInput.value.trim()) {
                                    setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, tags: [...s.tags, segTagInput.value.trim()] } : s))
                                    setSegTagInput({ id: null, value: '' })
                                  }
                                  if (e.key === 'Escape') setSegTagInput({ id: null, value: '' })
                                }}
                                onBlur={() => {
                                  if (segTagInput.value.trim()) {
                                    setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, tags: [...s.tags, segTagInput.value.trim()] } : s))
                                  }
                                  setSegTagInput({ id: null, value: '' })
                                }}
                              />
                            ) : (
                              <button className="seg-tag-add" onClick={() => setSegTagInput({ id: seg.id, value: '' })}>+</button>
                            )}
                          </div>
                          {seg.text && <div className="segment-text">"{seg.text}"</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ContextMenu({ items }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`ctx-wrap ${open ? 'open' : ''}`}>
      <button className="ctx-trigger" onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}>
        <MoreHorizontal size={14} strokeWidth={1.8} />
      </button>
      {open ? (
        <div className="ctx-menu" onClick={(e) => e.stopPropagation()}>
          {items.map((it) => (
            <button
              key={it.key}
              className={`ctx-item ${it.danger ? 'danger' : ''}`}
              onClick={() => {
                setOpen(false)
                it.onClick()
              }}
            >
              {it.icon}
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function TreeNode({ node, depth, expandedIds, selectedId, onSelect, onToggle, onMenu }) {
  const hasChildren = node.children && node.children.length > 0
  const expanded = expandedIds.has(node.id)
  const isRoot = depth === 0

  return (
    <div className={isRoot ? 'tree-group' : ''}>
      <div className={`tree-row ${selectedId === node.id ? 'active' : ''}`} style={{ paddingLeft: 8 + depth * 16 }}>
        <button
          className="tree-main"
          onClick={() => {
            onSelect(node.id)
            if (hasChildren) onToggle(node.id)
          }}
        >
          {hasChildren ? (
            <span className="tree-arrow" onClick={(e) => { e.stopPropagation(); onToggle(node.id) }}>
              <ChevronRight size={14} strokeWidth={1.8} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </span>
          ) : <span className="tree-arrow" />}
          <Folder size={16} strokeWidth={1.5} className="tree-folder-svg" />
          <span className="tree-name">{node.name}</span>
        </button>
        <ContextMenu items={onMenu(node)} />
      </div>

      {expanded && hasChildren && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggle={onToggle}
              onMenu={onMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MoveDialog({ open, folders, title, onCancel, onConfirm, defaultTarget }) {
  const [target, setTarget] = useState(defaultTarget || '')

  if (!open) return null

  return (
    <div className="dialog-mask" onClick={onCancel}>
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h4>{title}</h4>
        <div className="dialog-list">
          {folders.map((f) => (
            <button
              key={f.id}
              className={`dialog-folder ${target === f.id ? 'active' : ''}`}
              onClick={() => setTarget(f.id)}
              style={{ paddingLeft: 12 + f.depth * 14 }}
            >
              <Folder size={13} strokeWidth={1.6} />
              <span>{f.name}</span>
              {target === f.id ? <Check size={12} strokeWidth={2.4} /> : null}
            </button>
          ))}
        </div>
        <div className="dialog-actions">
          <button onClick={onCancel}>取消</button>
          <button
            className="primary"
            onClick={() => {
              if (!target) return
              onConfirm(target)
            }}
          >
            确认移动
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AssetPanel() {
  const [tree, setTree] = useState(ROOT_TREE)
  const [assetsByFolder, setAssetsByFolder] = useState(ASSETS)
  const [selectedFolderId, setSelectedFolderId] = useState('personal')
  const [expandedIds, setExpandedIds] = useState(new Set(['personal', 'personal-ai', 'personal-upload', 'public']))
  const [activeType, setActiveType] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeTagFilters, setActiveTagFilters] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [selectedFileIds, setSelectedFileIds] = useState([])
  const [moveDialog, setMoveDialog] = useState({ open: false, mode: null, sourceId: null, fileIds: [] })
  const [detailFile, setDetailFile] = useState(null)

  const uploadRef = useRef(null)
  const searchRef = useRef(null)

  const selectedNode = useMemo(() => findNode(tree, selectedFolderId), [tree, selectedFolderId])
  const descendantIds = useMemo(() => (selectedNode ? collectDescendantIds(selectedNode, []) : []), [selectedNode])

  const childFolders = useMemo(() => {
    const children = selectedNode?.children || []
    const bySearch = children.filter((c) => !keyword || c.name.toLowerCase().includes(keyword.toLowerCase()))
    return bySearch
  }, [selectedNode, keyword])

  const files = useMemo(() => {
    const merged = descendantIds.flatMap((id) => assetsByFolder[id] || [])
    return merged.filter((f) => {
      if (activeType !== 'all' && f.fileType !== activeType) return false
      const kw = keyword.toLowerCase()
      if (kw) {
        const nameMatch = f.name.toLowerCase().includes(kw)
        const tagMatch = (f.tags || []).some(t => t.toLowerCase().includes(kw))
        const promptMatch = (f.prompt || '').toLowerCase().includes(kw)
        if (!nameMatch && !tagMatch && !promptMatch) return false
      }
      if (activeTagFilters.length > 0) {
        const fileTags = (f.tags || []).map(t => t.toLowerCase())
        if (!activeTagFilters.every(tf => fileTags.includes(tf.toLowerCase()))) return false
      }
      return true
    })
  }, [descendantIds, assetsByFolder, activeType, keyword, activeTagFilters])

  const allTags = useMemo(() => {
    const merged = descendantIds.flatMap((id) => assetsByFolder[id] || [])
    const tagSet = new Set()
    merged.forEach(f => (f.tags || []).forEach(t => tagSet.add(t)))
    return [...tagSet]
  }, [descendantIds, assetsByFolder])

  const suggestedTags = useMemo(() => {
    if (!keyword) return []
    const kw = keyword.toLowerCase()
    return allTags.filter(t => t.toLowerCase().includes(kw) && !activeTagFilters.includes(t))
  }, [keyword, allTags, activeTagFilters])

  const groupedFiles = useMemo(() => files.reduce((acc, f) => {
    const key = f.dateGroup || '更早'
    if (!acc[key]) acc[key] = []
    acc[key].push(f)
    return acc
  }, {}), [files])

  const allFolders = useMemo(() => flattenFolders(tree), [tree])

  const allSelected = files.length > 0 && selectedFileIds.length === files.length

  const toggleFolder = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectFolder = (id) => {
    setSelectedFolderId(id)
    setSelectedFileIds([])
    setDetailFile(null)
  }

  const ensureFolderBucket = (folderId) => {
    setAssetsByFolder((prev) => {
      if (prev[folderId]) return prev
      return { ...prev, [folderId]: [] }
    })
  }

  const createFolder = (parentId) => {
    const raw = window.prompt('请输入文件夹名称', '新建文件夹')
    if (!raw) return
    const name = raw.trim()
    if (!name) return

    const id = generateId('fd')
    setTree((prev) => addChildNode(prev, parentId, { id, name, children: [] }))
    setExpandedIds((prev) => new Set(prev).add(parentId))
    ensureFolderBucket(id)
    setSelectedFolderId(id)
  }

  const renameFolder = (folderId) => {
    const node = findNode(tree, folderId)
    if (!node) return
    const raw = window.prompt('重命名文件夹', node.name)
    if (!raw) return
    const name = raw.trim()
    if (!name || name === node.name) return
    setTree((prev) => updateNode(prev, folderId, (n) => ({ ...n, name })))
  }

  const deleteFolder = (folderId) => {
    if (LOCKED_FOLDERS.has(folderId)) {
      window.alert('该系统目录不支持删除，可在其下创建自定义目录。')
      return
    }
    if (!window.confirm('删除文件夹会同时删除其子目录与文件，确认继续？')) return

    setTree((prev) => {
      const { tree: nextTree, removedIds } = removeNodeAndCollectIds(prev, folderId)
      setAssetsByFolder((filesPrev) => {
        const next = { ...filesPrev }
        removedIds.forEach((id) => { delete next[id] })
        return next
      })
      if (selectedFolderId === folderId) setSelectedFolderId('personal')
      return nextTree
    })
  }

  const moveFolder = (folderId, targetId) => {
    if (folderId === targetId) return
    const node = findNode(tree, folderId)
    const targetNode = findNode(tree, targetId)
    if (!node || !targetNode) return

    const subIds = collectDescendantIds(node, [])
    if (subIds.includes(targetId)) {
      window.alert('不能移动到自己的子目录中。')
      return
    }

    setTree((prev) => {
      const { tree: stripped, removed } = removeNodeAndCollectIds(prev, folderId)
      if (!removed) return prev
      return insertNode(stripped, targetId, removed)
    })
    setExpandedIds((prev) => new Set(prev).add(targetId))
  }

  const renameFileById = (fileId, name) => {
    setAssetsByFolder((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        next[k] = next[k].map((f) => f.id === fileId ? { ...f, name } : f)
      })
      return next
    })
  }

  const renameFile = (fileId) => {
    const found = Object.entries(assetsByFolder).find(([, arr]) => arr.some((x) => x.id === fileId))
    if (!found) return
    const [folderId, arr] = found
    const file = arr.find((x) => x.id === fileId)
    const raw = window.prompt('重命名文件', file.name)
    if (!raw) return
    const name = raw.trim()
    if (!name || name === file.name) return

    setAssetsByFolder((prev) => ({
      ...prev,
      [folderId]: prev[folderId].map((f) => (f.id === fileId ? { ...f, name } : f)),
    }))
  }

  const deleteFile = (fileId) => {
    setAssetsByFolder((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        next[k] = next[k].filter((f) => f.id !== fileId)
      })
      return next
    })
    setSelectedFileIds((prev) => prev.filter((id) => id !== fileId))
    setDetailFile((prev) => (prev?.id === fileId ? null : prev))
  }

  const moveFiles = (fileIds, targetId) => {
    if (!fileIds.length) return

    setAssetsByFolder((prev) => {
      const next = { ...prev }
      const moved = []

      Object.keys(next).forEach((k) => {
        const keep = []
        next[k].forEach((f) => {
          if (fileIds.includes(f.id)) moved.push(f)
          else keep.push(f)
        })
        next[k] = keep
      })

      if (!next[targetId]) next[targetId] = []
      next[targetId] = [...next[targetId], ...moved]
      return next
    })

    setSelectedFileIds([])
  }

  const onUpload = (evt) => {
    const list = Array.from(evt.target.files || [])
    if (!list.length) return

    const now = new Date()
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
    const byType = { image: [], video: [], audio: [] }

    list.forEach((f) => {
      const ext = (f.name.split('.').pop() || '').toLowerCase()
      let fileType = 'image'
      if (f.type.startsWith('video/') || ['mp4', 'mov', 'mkv'].includes(ext)) fileType = 'video'
      else if (f.type.startsWith('audio/') || ['mp3', 'wav', 'm4a'].includes(ext)) fileType = 'audio'

      const base = f.name.replace(/\.[^/.]+$/, '')
      byType[fileType].push({
        id: generateId('file'),
        name: base,
        fileType,
        sourceType: 'uploaded',
        format: ext || (fileType === 'video' ? 'mp4' : fileType === 'audio' ? 'mp3' : 'jpg'),
        updatedAt: '刚刚',
        dateGroup: dateStr,
        fileSize: `${Math.max(1, Math.round(f.size / 1024 / 1024))} MB`,
        duration: fileType === 'video' || fileType === 'audio' ? '00:00' : '',
        processStatus: fileType === 'video' ? 'processing' : undefined,
        processStage: fileType === 'video' ? 'asr' : undefined,
        progress: fileType === 'video' ? 8 : undefined,
      })
    })

    setAssetsByFolder((prev) => {
      const next = { ...prev }
      if (!next[selectedFolderId]) next[selectedFolderId] = []
      next[selectedFolderId] = [...next[selectedFolderId], ...byType.image, ...byType.video, ...byType.audio]
      return next
    })

    evt.target.value = ''
  }

  const treeMenuItems = (node) => {
    const base = [
      {
        key: 'new',
        label: '新建子文件夹',
        icon: <Plus size={12} strokeWidth={2} />,
        onClick: () => createFolder(node.id),
      },
      {
        key: 'rename',
        label: '重命名',
        icon: <Pencil size={12} strokeWidth={1.8} />,
        onClick: () => renameFolder(node.id),
      },
      {
        key: 'move',
        label: '移动',
        icon: <Move size={12} strokeWidth={1.8} />,
        onClick: () => setMoveDialog({ open: true, mode: 'folder', sourceId: node.id, fileIds: [] }),
      },
      {
        key: 'delete',
        label: '删除',
        icon: <Trash2 size={12} strokeWidth={1.7} />,
        danger: true,
        onClick: () => deleteFolder(node.id),
      },
    ]

    if (LOCKED_FOLDERS.has(node.id)) {
      return base.filter((x) => x.key !== 'delete')
    }

    return base
  }

  const onMoveConfirm = (targetId) => {
    if (moveDialog.mode === 'folder') {
      moveFolder(moveDialog.sourceId, targetId)
    }

    if (moveDialog.mode === 'file') {
      moveFiles(moveDialog.fileIds, targetId)
    }

    if (moveDialog.mode === 'batch') {
      moveFiles(moveDialog.fileIds, targetId)
    }

    setMoveDialog({ open: false, mode: null, sourceId: null, fileIds: [] })
  }

  const updateFileTags = (fileId, newTags) => {
    setAssetsByFolder((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        next[k] = next[k].map((f) => f.id === fileId ? { ...f, tags: newTags } : f)
      })
      return next
    })
    setDetailFile((prev) => prev?.id === fileId ? { ...prev, tags: newTags } : prev)
  }

  if (detailFile) {
    return <DetailPage file={detailFile} onClose={() => setDetailFile(null)} onUpdateTags={updateFileTags} onRenameFile={(id, name) => { renameFileById(id, name); setDetailFile(prev => prev?.id === id ? { ...prev, name } : prev) }} />
  }

  return (
    <div className="asset-shell">
      <input ref={uploadRef} type="file" multiple hidden onChange={onUpload} />

      <aside className="asset-tree-panel">
        <div className="tree-header">
          <h2>资产管理</h2>
        </div>

        <div className="tree-list">
          {tree.map((n) => (
            <TreeNode
              key={n.id}
              node={n}
              depth={0}
              expandedIds={expandedIds}
              selectedId={selectedFolderId}
              onSelect={selectFolder}
              onToggle={toggleFolder}
              onMenu={treeMenuItems}
            />
          ))}
        </div>
      </aside>

      <section className="asset-main-panel">
        <header className="asset-toolbar">
          <div className="toolbar-title">
            <h3>{selectedNode?.name || '资产'}</h3>
            <p>{files.length} 个文件</p>
          </div>

          <div className="toolbar-actions">
            <div className="type-tabs">
              {Object.entries(FILE_TYPE_LABEL).map(([k, label]) => (
                <button key={k} className={activeType === k ? 'active' : ''} onClick={() => setActiveType(k)}>{label}</button>
              ))}
            </div>

            <div className={`search-wrap ${searchFocused ? 'focused' : ''}`}>
              <div className="search-box">
                <Search size={13} strokeWidth={2} />
                {activeTagFilters.map((tag, i) => (
                  <span key={i} className="search-tag-chip">
                    {tag}
                    <button onClick={() => setActiveTagFilters(prev => prev.filter((_, idx) => idx !== i))}><X size={8} strokeWidth={2.5} /></button>
                  </span>
                ))}
                <input
                  ref={searchRef}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  placeholder={activeTagFilters.length ? '继续搜索...' : '搜索名称、标签或提示词'}
                />
                {(keyword || activeTagFilters.length > 0) && (
                  <button className="search-clear" onClick={() => { setKeyword(''); setActiveTagFilters([]) }}>
                    <X size={12} strokeWidth={2} />
                  </button>
                )}
              </div>
              {searchFocused && suggestedTags.length > 0 && (
                <div className="search-dropdown">
                  <span className="search-dropdown-label">标签匹配</span>
                  {suggestedTags.slice(0, 6).map(tag => (
                    <button key={tag} className="search-dropdown-item" onMouseDown={(e) => {
                      e.preventDefault()
                      setActiveTagFilters(prev => [...prev, tag])
                      setKeyword('')
                      searchRef.current?.focus()
                    }}>
                      <span className="search-dropdown-tag">{tag}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchFocused && !keyword && allTags.filter(t => !activeTagFilters.includes(t)).length > 0 && (
                <div className="search-dropdown">
                  <span className="search-dropdown-label">常用标签</span>
                  {allTags.filter(t => !activeTagFilters.includes(t)).slice(0, 8).map(tag => (
                    <button key={tag} className="search-dropdown-item" onMouseDown={(e) => {
                      e.preventDefault()
                      setActiveTagFilters(prev => [...prev, tag])
                      searchRef.current?.focus()
                    }}>
                      <span className="search-dropdown-tag">{tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="upload-btn" onClick={() => uploadRef.current?.click()}>
              <Upload size={13} strokeWidth={1.8} />上传文件
            </button>

            <button className="new-folder-btn" onClick={() => createFolder(selectedFolderId)}>
              <Plus size={13} strokeWidth={2} />新建文件夹
            </button>

            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><LayoutGrid size={13} /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={13} /></button>
            </div>
          </div>
        </header>

        {selectedFileIds.length > 0 ? (
          <div className="batch-bar">
            <span>已选 {selectedFileIds.length} 项</span>
            <button onClick={() => setSelectedFileIds(allSelected ? [] : files.map((f) => f.id))}>{allSelected ? '取消全选' : '全选'}</button>
            <button onClick={() => setMoveDialog({ open: true, mode: 'batch', sourceId: selectedFolderId, fileIds: selectedFileIds })}>批量上传</button>
            <button className="danger" onClick={() => selectedFileIds.forEach((id) => deleteFile(id))}>批量删除</button>
            <button className="close" onClick={() => setSelectedFileIds([])}><X size={13} /></button>
          </div>
        ) : null}

        <div className="asset-content">
          {childFolders.length > 0 ? (
            <section className="folder-section">
              <div className="section-head">我的文件夹</div>
              <div className="folder-grid">
                {childFolders.map((fd) => (
                  <article key={fd.id} className="folder-card" onClick={() => selectFolder(fd.id)}>
                    <div className="folder-card-main">
                      <FolderOpen size={20} strokeWidth={1.6} />
                      <span>{fd.name}</span>
                    </div>
                    <ContextMenu
                      items={[
                        { key: 'new', label: '新建子文件夹', icon: <Plus size={12} />, onClick: () => createFolder(fd.id) },
                        { key: 'move', label: '移动', icon: <Move size={12} />, onClick: () => setMoveDialog({ open: true, mode: 'folder', sourceId: fd.id, fileIds: [] }) },
                        { key: 'rename', label: '重命名', icon: <Pencil size={12} />, onClick: () => renameFolder(fd.id) },
                        { key: 'delete', label: '删除', icon: <Trash2 size={12} />, danger: true, onClick: () => deleteFolder(fd.id) },
                      ]}
                    />
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {files.length === 0 ? (
            <div className="empty-files">
              <div className="empty-illus">
                <span className="empty-halo" />
                <div className="empty-core">
                  <FolderOpen size={22} strokeWidth={1.8} />
                </div>
                <span className="empty-chip chip-image">图片</span>
                <span className="empty-chip chip-video">视频</span>
                <span className="empty-chip chip-audio">音频</span>
              </div>
              <h4>这个文件夹还没有内容</h4>
              <p>点击右上角“上传文件”，或拖拽素材到页面开始管理资产</p>
            </div>
          ) : viewMode === 'grid' ? (
            Object.entries(groupedFiles).map(([group, list]) => (
              <section key={group} className="file-group">
                <div className="section-head">{group}</div>
                <div className="file-grid">
                  {list.map((f) => {
                    const status = statusBadge(f)
                    const checked = selectedFileIds.includes(f.id)
                    return (
                      <article key={f.id} className={`file-card ${checked ? 'checked' : ''}`} onClick={() => setDetailFile(f)}>
                        <button className={`file-preview ${f.thumbnail ? 'has-thumb' : ''}`} onClick={() => setDetailFile(f)} style={f.thumbnail ? { backgroundImage: `url(${f.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                          <label className="card-select" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => setSelectedFileIds((prev) => prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id])}
                            />
                          </label>
                          {!f.thumbnail && <span className={`preview-icon ${f.fileType}`}>{fileIcon(f.fileType, 17)}</span>}
                          {f.duration ? <em>{f.duration}</em> : null}
                        </button>

                        <div className="file-meta">
                          <div className="file-row-top">
                            <strong title={f.name}>{f.name}</strong>
                            <ContextMenu
                              items={[
                                { key: 'move', label: '移动', icon: <Move size={12} />, onClick: () => setMoveDialog({ open: true, mode: 'file', sourceId: selectedFolderId, fileIds: [f.id] }) },
                                { key: 'rename', label: '重命名', icon: <Pencil size={12} />, onClick: () => renameFile(f.id) },
                                { key: 'delete', label: '删除', icon: <Trash2 size={12} />, danger: true, onClick: () => deleteFile(f.id) },
                              ]}
                            />
                          </div>
                          <p>{f.format.toUpperCase()} · {SOURCE_LABEL[f.sourceType] || '未知来源'}</p>
                          <div className="file-row-bottom">
                            <span>{f.updatedAt}</span>
                            {status ? <span className={`status-pill ${status.cls}`}>{status.text}</span> : null}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="file-table">
              <div className="table-head">
                <span className="c1"><input type="checkbox" checked={allSelected} onChange={() => setSelectedFileIds(allSelected ? [] : files.map((f) => f.id))} /></span>
                <span className="c2">名称</span>
                <span className="c3">类型</span>
                <span className="c4">更新时间</span>
                <span className="c5">状态</span>
                <span className="c6" />
              </div>
              {files.map((f) => {
                const checked = selectedFileIds.includes(f.id)
                const status = statusBadge(f)
                return (
                  <div key={f.id} className="table-row" onClick={() => setDetailFile(f)}>
                    <span className="c1"><input type="checkbox" checked={checked} onChange={() => setSelectedFileIds((prev) => prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id])} /></span>
                    <span className="c2"><i className={`mini-icon ${f.fileType}`}>{fileIcon(f.fileType, 13)}</i>{f.name}</span>
                    <span className="c3">{FILE_TYPE_LABEL[f.fileType]}</span>
                    <span className="c4">{f.updatedAt}</span>
                    <span className="c5">{status ? <span className={`status-pill ${status.cls}`}>{status.text}</span> : '--'}</span>
                    <span className="c6">
                      <ContextMenu
                        items={[
                          { key: 'move', label: '移动', icon: <Move size={12} />, onClick: () => setMoveDialog({ open: true, mode: 'file', sourceId: selectedFolderId, fileIds: [f.id] }) },
                          { key: 'rename', label: '重命名', icon: <Pencil size={12} />, onClick: () => renameFile(f.id) },
                          { key: 'delete', label: '删除', icon: <Trash2 size={12} />, danger: true, onClick: () => deleteFile(f.id) },
                        ]}
                      />
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <MoveDialog
        open={moveDialog.open}
        title={moveDialog.mode === 'folder' ? '选择目标文件夹（移动目录）' : '选择目标文件夹（移动文件）'}
        folders={allFolders.filter((f) => {
          if (moveDialog.mode !== 'folder') return true
          const node = findNode(tree, moveDialog.sourceId)
          if (!node) return true
          const forbidden = new Set(collectDescendantIds(node, []))
          return !forbidden.has(f.id)
        })}
        defaultTarget={selectedFolderId}
        onCancel={() => setMoveDialog({ open: false, mode: null, sourceId: null, fileIds: [] })}
        onConfirm={onMoveConfirm}
      />
    </div>
  )
}
