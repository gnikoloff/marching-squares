import dat from 'dat.gui'
import Ball from './ball'

import './style.css'

const WIDTH = 512
const HEIGHT = 512
const BALLS_MAX_COUNT = 30
const OPTIONS = {
  ballsCount: 8,
  gridResolution: 8,
  simSpeed: 20,
  lineWidth: 1,
  lineColor: '#777',
  linearInterpolate: true,
  renderBalls: false,
  renderDebugLines: false,
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const balls = []
const gui = new dat.GUI()

let oldTime = 0

canvas.width = WIDTH
canvas.height = HEIGHT
document.body.appendChild(canvas)

for (let i = 0; i < BALLS_MAX_COUNT; i++) {
  const radius = 15 + Math.random() * 35
  balls.push(new Ball(Math.random() * WIDTH, Math.random() * HEIGHT, radius))
}

gui.add(OPTIONS, 'ballsCount').min(1).max(BALLS_MAX_COUNT).step(1)
gui.add(OPTIONS, 'gridResolution').min(2).max(50).step(1)
gui.add(OPTIONS, 'simSpeed').min(0.1).max(100).step(0.1)
gui.add(OPTIONS, 'lineWidth').min(1).max(20).step(0.1)
gui.addColor(OPTIONS, 'lineColor')
gui.add(OPTIONS, 'linearInterpolate')
gui.add(OPTIONS, 'renderBalls')
gui.add(OPTIONS, 'renderDebugLines')

requestAnimationFrame(drawFrame)

function drawFrame(ts) {
  requestAnimationFrame(drawFrame)

  ts /= 1000
  const dt = (ts - oldTime) * OPTIONS.simSpeed
  oldTime = ts

  const cols = 1 + WIDTH / OPTIONS.gridResolution
  const rows = 1 + HEIGHT / OPTIONS.gridResolution

  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  if (OPTIONS.renderDebugLines) {
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * OPTIONS.gridResolution
        const y = j * OPTIONS.gridResolution
        ctx.strokeRect(x, y, OPTIONS.gridResolution, OPTIONS.gridResolution)
      }
    }
  }

  const corners = []

  const samples = []
  for (let i = 0; i < cols; i++) {
    samples.push([])
    for (let j = 0; j < rows; j++) {
      const x = i * OPTIONS.gridResolution
      const y = j * OPTIONS.gridResolution
      let sum = 0
      for (let n = 0; n < OPTIONS.ballsCount; n++) {
        const ball = balls[n]
        const dx = ball.x - x
        const dy = ball.y - y
        const d2 = dx * dx + dy * dy
        sum += ball.radius2 / d2
      }
      samples[i].push(sum)
    }
  }

  for (let i = 0; i < cols; i++) {
    corners.push([])
    for (let j = 0; j < rows; j++) {
      corners[i].push(samples[i][j] > 1)
    }
  }

  ctx.strokeStyle = OPTIONS.lineColor
  ctx.lineWidth = OPTIONS.lineWidth
  // ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  for (let i = 0; i < corners.length - 1; i++) {
    for (let j = 0; j < corners.length - 1; j++) {
      const x = i * OPTIONS.gridResolution
      const y = j * OPTIONS.gridResolution

      let a
      let b
      let c
      let d

      if (OPTIONS.linearInterpolate) {
        const aVal = samples[i][j]
        const bVal = samples[i + 1][j]
        const cVal = samples[i + 1][j + 1]
        const dVal = samples[i][j + 1]

        let amt = (1 - aVal) / (bVal - aVal)
        a = [lerp(x, x + OPTIONS.gridResolution, amt), y]

        amt = (1 - bVal) / (cVal - bVal)
        b = [
          x + OPTIONS.gridResolution,
          lerp(y, y + OPTIONS.gridResolution, amt),
        ]

        amt = (1 - dVal) / (cVal - dVal)
        c = [
          lerp(x, x + OPTIONS.gridResolution, amt),
          y + OPTIONS.gridResolution,
        ]

        amt = (1 - aVal) / (dVal - aVal)
        d = [x, lerp(y, y + OPTIONS.gridResolution, amt)]
      } else {
        a = [x + OPTIONS.gridResolution / 2, y]
        b = [x + OPTIONS.gridResolution, y + OPTIONS.gridResolution / 2]
        c = [x + OPTIONS.gridResolution / 2, y + OPTIONS.gridResolution]
        d = [x, y + OPTIONS.gridResolution / 2]
      }

      const state = cornersBinaryToDecimal(
        corners[i][j],
        corners[i + 1][j],
        corners[i + 1][j + 1],
        corners[i][j + 1],
      )

      switch (state) {
        case 0:
          break
        case 1:
          line(d, c)
          break
        case 2:
          line(b, c)
          break
        case 3:
          line(d, b)
          break
        case 4:
          line(a, b)
          break
        case 5:
          line(a, d)
          line(b, c)
          break
        case 6:
          line(a, c)
          break
        case 7:
          line(a, d)
          break
        case 8:
          line(a, d)
          break
        case 9:
          line(a, c)
          break
        case 10:
          line(a, b)
          line(c, d)
          break
        case 11:
          line(a, b)
          break
        case 12:
          line(b, d)
          break
        case 13:
          line(b, c)
          break
        case 14:
          line(d, c)
          break
        case 15:
          break
      }
    }
  }

  ctx.strokeStyle = 'green'
  ctx.lineWidth = 1
  for (let i = 0; i < OPTIONS.ballsCount; i++) {
    const ball = balls[i]
    ball.update(dt, WIDTH, HEIGHT)
    if (OPTIONS.renderBalls) {
      ball.draw(ctx)
    }
  }
}

function line(p0, p1) {
  ctx.beginPath()
  ctx.moveTo(p0[0], p0[1])
  ctx.lineTo(p1[0], p1[1])
  ctx.stroke()
}

function cornersBinaryToDecimal(corner0, corner1, corner2, corner3) {
  return corner0 * 8 + corner1 * 4 + corner2 * 2 + corner3 * 1
}

function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount
  return value1 + (value2 - value1) * amount
}
