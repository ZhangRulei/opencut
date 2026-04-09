import { useState, useMemo } from 'react'
import logoImg from '../assets/logo.png'
import './LoginPage.css'

function VisionRings() {
  return (
    <div className="lp-rings-scene">
      <div className="lp-ring lp-ring-1" />
      <div className="lp-ring lp-ring-2" />
      <div className="lp-ring lp-ring-3" />
      <div className="lp-ring lp-ring-4" />
    </div>
  )
}

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('sms')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [logoError, setLogoError] = useState(false)
  const canSubmit = useMemo(() => phone.trim().length >= 8 && code.trim().length >= 4, [phone, code])

  return (
    <div className="lp-root">
      {/* Left brand panel */}
      <div className="lp-left">
        <VisionRings />
        <div className="lp-glow lp-glow-bottom" />
        <div className="lp-glow lp-glow-top" />

        <div className="lp-left-inner">
          <div className="lp-brand">
            <div className="lp-brand-logo">
              {!logoError
                ? <img src={logoImg} alt="logo" onError={() => setLogoError(true)} />
                : <span>🦞</span>}
            </div>
            <div className="lp-brand-info">
              <div className="lp-brand-name">虾剪</div>
              <div className="lp-brand-sub">AI智能创作平台</div>
            </div>
          </div>

          <div className="lp-main-copy">
            <div className="lp-badge">AI 驱动 · 爆款复刻 · 批量出片</div>
            <h1 className="lp-headline">
              一键<em>爆款</em>拆解<br />百条视频自动生成
            </h1>
            <p className="lp-desc">
              爆款视频智能拆解，脚本一键复刻，素材自动匹配，AI 批量混剪——让视频生产从手工作坊走向智能工厂。
            </p>
          </div>

          <div className="lp-tags">
            <span>爆款拆解复刻</span>
            <span>素材智能匹配</span>
            <span>批量混剪出片</span>
            <span>虚拟形象克隆</span>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="lp-right">
        <div className="lp-form-wrap">
          {mode === 'sms' && (
            <>
              <h2 className="lp-form-title">欢迎登录虾剪</h2>
              <p className="lp-form-sub">手机号验证码登录，开启 AI 智能混剪之旅。</p>

              <div className="lp-fields">
                <div className="lp-field">
                  <label>手机号</label>
                  <div className="lp-input-wrap">
                    <PhoneIcon />
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="请输入手机号"
                    />
                  </div>
                </div>

                <div className="lp-field">
                  <label>验证码</label>
                  <div className="lp-input-wrap lp-code-wrap">
                    <MsgIcon />
                    <input
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="请输入验证码"
                    />
                    <button className="lp-code-btn" type="button" onClick={() => setCode('1234')}>
                      获取验证码
                    </button>
                  </div>
                </div>

                <button
                  className={`lp-submit${canSubmit ? ' lp-submit-active' : ''}`}
                  disabled={!canSubmit}
                  onClick={() => canSubmit && onLogin({ phone })}
                >
                  登录
                </button>

                <div className="lp-divider"><span>其他登录方式</span></div>

                <button className="lp-dingtalk-btn" type="button" onClick={() => setMode('dingtalk')}>
                  <DingTalkIcon />
                  钉钉扫码登录
                </button>
              </div>
            </>
          )}

          {mode === 'dingtalk' && (
            <>
              <h2 className="lp-form-title">钉钉扫码登录</h2>
              <p className="lp-form-sub">使用钉钉 App 扫描下方二维码完成登录。</p>

              <div className="lp-qr-box">
                <div className="lp-qr-inner">
                  <DingTalkQrIcon />
                  <div className="lp-qr-loading">二维码加载中…</div>
                </div>
              </div>

              <button className="lp-back-btn" type="button" onClick={() => setMode('sms')}>
                ← 返回手机号登录
              </button>
            </>
          )}
        </div>

        <div className="lp-footer">上海黛莱皙生物科技有限公司© 2026</div>
      </div>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  )
}

function MsgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function DingTalkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 11-7 4 1.5-4-1.5-4 7 4z"/>
    </svg>
  )
}

function DingTalkQrIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" fill="#1677FF" fillOpacity="0.08"/>
      <path d="M32 14C22.059 14 14 22.059 14 32s8.059 18 18 18 18-8.059 18-18S41.941 14 32 14zm6 13.5-9 5 2-5-2-5 9 5z" fill="#1677FF" fillOpacity="0.7"/>
    </svg>
  )
}
