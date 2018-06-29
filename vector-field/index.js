const createFps = require('fps-indicator')
const Noise = require('noisejs').Noise
const helper = require('../helper')
const vec3 = require('gl-vec3')
const seedrandom = require('seedrandom')

class Particle {
  constructor(width, height, scale, cols) {
    this.scale = scale
    this.cols = cols
    this.pos = [rng() * width, rng() * height, rng() * width]
    // this.pos = [Math.random() * width, Math.random() * height, Math.random() * width]
    this.vel = [0, 0, 0]
    this.acc = [0, 0, 0]
    this.maxspeed = 4
    this.h = 0
    this.prevPos = this.pos.slice(0)
  }

  update() {
    const max = this.maxspeed
    this.vel = vec3.add([], this.vel, this.acc)
    this.vel = this.vel.map(v => Math.min(v, max))
    this.pos = vec3.add([], this.pos, this.vel)
    this.acc = vec3.scale([], this.acc, 0)
    console.log(this.acc)
  }

  follow(vectors) {
    const x = Math.floor(this.pos[0] / this.scale)
    const y = Math.floor(this.pos[1] / this.scale)
    const index = x + y * this.cols
    if (index >= 2400) console.log(index, this.scale, x, y, this.pos)
    const force = vectors[index]
    this.applyForce(force)
  }

  applyForce(force) {
    this.acc = vec3.add([], this.acc, force)
  }

  updatePrev() {
    this.prevPos[0] = this.pos[0]
    this.prevPos[1] = this.pos[1]
  }

  edges() {
    if (this.pos[0] > this.width) {
      this.pos[0] = 0
      this.updatePrev()
    }
    if (this.pos[0] < 0) {
      this.pos[0] = this.width
      this.updatePrev()
    }
    if (this.pos[1] > this.height) {
      this.pos[1] = 0
      this.updatePrev()
    }
    if (this.pos[1] < 0) {
      this.pos[1] = this.height
      this.updatePrev()
    }
  }

  show() {
    this.updatePrev()
  }
}

const width = 500
const height = 500
const particleCount = 300
const ctx = helper.ctx(width, height)
const rng = seedrandom('abc123')
const noise = new Noise('abc123')
const scale = 10
const rows = Math.floor(width / scale)
const cols = Math.floor(height / scale)
const increment = 0.1
const flowField = new Array(rows * cols)
const particles = []
for (let i = 0; i < particleCount; i++) {
  particles[i] = new Particle(width, height, scale, cols)
}

createFps({position: 'top-right'})

let zoff = 0
const tick = () => {
  ctx.clearRect(0, 0, width, height)

  let yoff = 0
  for (let y = 0; y < rows; y++) {
    let xoff = 0

    for (let x = 0; x < cols; x++) {
      const index = x + y * cols
      const angle = noise.perlin3(xoff, yoff, zoff) * (Math.PI * 2) * 4
      const vec = helper.vec3FromAngle(helper.radians(angle))
      flowField[index] = vec
      xoff += increment
    }

    yoff += increment
    zoff += 0.0003
  }

  console.log(particles.filter(p => p.pos.some(z => z >= 500)))

  for (const p of particles) {
    p.follow(flowField)
    p.update()
    p.edges()
    p.show()
    ctx.beginPath()
    ctx.arc(p.pos[0], p.pos[1], 2, 0, Math.PI * 2)
    ctx.fill()
  }

  requestAnimationFrame(tick)
}

console.log(flowField)

tick()
