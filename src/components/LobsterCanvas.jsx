import { useEffect, useRef } from 'react'

// 龙虾轮廓关键点（归一化到 -1~1，之后缩放到画布）
const LOBSTER_POINTS = (() => {
  const pts = []
  const push = (x, y, w = 1) => { for (let i = 0; i < Math.ceil(w * 8); i++) pts.push([x, y]) }

  // 头部椭圆
  for (let a = 0; a < Math.PI * 2; a += 0.18) {
    push(Math.cos(a) * 0.18, Math.sin(a) * 0.13 - 0.12, 1.2)
  }
  // 身体三节
  for (let a = 0; a < Math.PI * 2; a += 0.2) {
    push(Math.cos(a) * 0.26, Math.sin(a) * 0.19 + 0.14, 1.5)
    push(Math.cos(a) * 0.21, Math.sin(a) * 0.14 + 0.38, 1)
    push(Math.cos(a) * 0.15, Math.sin(a) * 0.09 + 0.56, 0.7)
  }
  // 左钳臂
  for (let t = 0; t <= 1; t += 0.06) {
    const x = -0.24 - t * 0.42
    const y = 0.05 - t * 0.22
    push(x, y, 1.2)
  }
  // 左钳
  for (let a = -0.6; a < 0.6; a += 0.15) push(-0.72, -0.2 + Math.sin(a) * 0.12, 1)
  for (let a = -0.4; a < 0.4; a += 0.15) push(-0.68, -0.1 + Math.sin(a) * 0.08, 0.8)
  // 右钳臂
  for (let t = 0; t <= 1; t += 0.06) {
    const x = 0.24 + t * 0.42
    const y = 0.05 - t * 0.22
    push(x, y, 1.2)
  }
  // 右钳
  for (let a = -0.6; a < 0.6; a += 0.15) push(0.72, -0.2 + Math.sin(a) * 0.12, 1)
  for (let a = -0.4; a < 0.4; a += 0.15) push(0.68, -0.1 + Math.sin(a) * 0.08, 0.8)
  // 触角
  for (let t = 0; t <= 1; t += 0.08) {
    push(-0.1 - t * 0.18, -0.22 - t * 0.52, 0.6)
    push( 0.1 + t * 0.18, -0.22 - t * 0.52, 0.6)
  }
  // 腿（左右各3条）
  for (let i = 0; i < 3; i++) {
    for (let t = 0; t <= 1; t += 0.2) {
      push(-0.26 - t * 0.2, 0.1 + i * 0.15 + t * 0.15, 0.5)
      push( 0.26 + t * 0.2, 0.1 + i * 0.15 + t * 0.15, 0.5)
    }
  }
  // 尾扇
  const tailAngles = [-0.5, -0.25, 0, 0.25, 0.5]
  tailAngles.forEach(a => {
    for (let t = 0; t <= 1; t += 0.1) {
      push(Math.sin(a) * t * 0.28, 0.6 + t * 0.38, 0.7)
    }
  })

  return pts
})()

export default function LobsterCanvas({ className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W, H, particles, raf

    const ACCENT = [239, 93, 78]
    const WHITE  = [255, 255, 255]

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      init()
    }

    function init() {
      particles = LOBSTER_POINTS.map(([nx, ny]) => {
        // 龙虾居中偏右下，缩放到画布
        const scale = Math.min(W, H) * 0.72
        const cx = W * 0.5
        const cy = H * 0.52
        const bx = cx + nx * scale
        const by = cy + ny * scale

        const isAccent = Math.random() < 0.65
        const color = isAccent ? ACCENT : WHITE
        const alpha = 0.35 + Math.random() * 0.55

        return {
          // 基准位置
          bx, by,
          // 当前位置（加随机偏移）
          x: bx + (Math.random() - 0.5) * 18,
          y: by + (Math.random() - 0.5) * 18,
          // 漂移速度
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          // 漂移范围
          range: 10 + Math.random() * 14,
          // 大小
          r: 0.8 + Math.random() * 1.4,
          color,
          alpha,
          // 闪烁相位
          phase: Math.random() * Math.PI * 2,
          speed: 0.008 + Math.random() * 0.016,
        }
      })
    }

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t += 1

      for (const p of particles) {
        // 漂移：在基准点附近做 sin/cos 游走
        p.x = p.bx + Math.sin(t * p.speed + p.phase) * p.range
        p.y = p.by + Math.cos(t * p.speed * 0.7 + p.phase) * p.range * 0.6

        // 闪烁
        const flicker = 0.5 + 0.5 * Math.sin(t * p.speed * 2.5 + p.phase)
        const a = p.alpha * (0.5 + 0.5 * flicker)

        const [r, g, b] = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.fill()

        // 亮点加光晕
        if (p.r > 1.6 && flicker > 0.7) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
          grad.addColorStop(0, `rgba(${r},${g},${b},${a * 0.4})`)
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}
