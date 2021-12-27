export default class Ball {
  constructor(
    x,
    y,
    radius,
    vx = Math.random() * 2 - 1,
    vy = Math.random() * 2 - 1,
    speed = Math.random() * 10,
  ) {
    this.x = x
    this.y = y
    this.radius = radius
    this.radius2 = radius * radius
    this.vx = vx
    this.vy = vy
    this.speed = speed
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.stroke()
  }
  update(timeStep, worldWidth, worldHeight) {
    this.x += this.vx * this.speed * timeStep
    this.y += this.vy * this.speed * timeStep

    if (this.x + this.radius > worldWidth) {
      this.x = worldWidth - this.radius
      this.vx *= -1
    }
    if (this.x - this.radius < 0) {
      this.x = this.radius
      this.vx *= -1
    }
    if (this.y + this.radius > worldHeight) {
      this.y = worldHeight - this.radius
      this.vy *= -1
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius
      this.vy *= -1
    }
  }
}